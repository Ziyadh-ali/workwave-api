import { Server as IOServer, Socket } from 'socket.io';
import { inject, injectable } from 'tsyringe';
import { IMessage } from '../../entities/models/IMessage.enities';
import { IMessageRepository } from '../../entities/repositoryInterfaces/IMessage.respository';
import { IEmployeeRepository } from '../../entities/repositoryInterfaces/employee/EmployeeRepository';
import { IGroupRepository } from '../../entities/repositoryInterfaces/IGroup.repository';
import { INotificationRepository } from '../../entities/repositoryInterfaces/INotification.repository';
import { INotification } from '../../entities/models/INotification';
import { CustomError } from '../../shared/errors/CustomError';
import { HTTP_STATUS_CODES } from '../../shared/constants';
import { IGroup } from '../../entities/models/IGroup.entities';

interface UserSocketMap {
    [userId: string]: string;
}

interface RoomUsersMap {
    [roomId: string]: Set<string>;
}

@injectable()
export class SocketManager {
    private io: IOServer | null = null;
    private userSocketMap: UserSocketMap = {};
    private roomUsersMap: RoomUsersMap = {};

    constructor(
        @inject('IMessageRepository') private messageRepository: IMessageRepository,
        @inject('IEmployeeRepository') private employeeRepository: IEmployeeRepository,
        @inject('IGroupRepository') private groupRepository: IGroupRepository,
        @inject('INotificationRepository') private notificationRepository: INotificationRepository,
    ) { }

    public initialize(io: IOServer): void {
        this.io = io;
        this.setupSocketEvents();
    }

    private setupSocketEvents(): void {
        if (!this.io) throw new CustomError('Socket.IO server not initialized' , HTTP_STATUS_CODES.BAD_REQUEST);

        this.io.on('connection', (socket: Socket) => {
            console.log(`User connected: ${socket.id}`);

            socket.on('register', (userId: string) => {
                this.userSocketMap[userId] = socket.id;
                console.log(`User ${userId} registered with socket ${socket.id}`);
                this.updateOnlineUsers();
                this.fetchAndEmitEmployees(socket);
            });

            socket.on('joinRoom', (roomId: string, userId: string) => {
                socket.join(roomId);
                if (!this.roomUsersMap[roomId]) {
                    this.roomUsersMap[roomId] = new Set();
                }
                this.roomUsersMap[roomId].add(userId);
                console.log(`User ${userId} joined room ${roomId}`);
            });

            // Leave a room
            socket.on('leaveRoom', (roomId: string, userId: string) => {
                socket.leave(roomId);
                if (this.roomUsersMap[roomId]) {
                    this.roomUsersMap[roomId].delete(userId);
                }
                console.log(`User ${userId} left room ${roomId}`);
            });

            // Private message
            socket.on('privateMessage', async (message: IMessage) => {
                try {
                    const savedMessage = await this.messageRepository.createMessage(message);

                    socket.emit('newPrivateMessage', savedMessage);
                    const sender = await this.employeeRepository.findById(savedMessage.sender.toString())

                    await this.sendNotification({
                        recipient: message.recipient as string,
                        sender: message.sender as string,
                        type: 'message',
                        content: `You have a new message from ${sender?.fullName}`,
                        metadata: {
                            messageId: savedMessage._id!.toString()
                        }
                    });

                    const recipientSocketId = this.userSocketMap[message.recipient as string];
                    if (recipientSocketId) {
                        this.io!.to(recipientSocketId).emit('newPrivateMessage', savedMessage);
                    }
                } catch (error) {
                    console.error('Error sending private message:', error);
                    socket.emit('error', 'Failed to send message');
                }
            });

            socket.on('roomMessage', async (message: IMessage) => {
                try {
                    if (!message.roomId) {
                        throw new Error('Room ID is required for room messages');
                    }
                    const savedMessage = await this.messageRepository.createMessage(message);

                    this.io!.to(message.roomId as string).emit('newRoomMessage', savedMessage);

                    const groupDetails = await this.groupRepository.getGroupDetails(message._id?.toString()!);

                    if (groupDetails) {
                        const recipients = groupDetails.members.filter(memberId =>
                            memberId !== (message.sender as unknown as string)
                        );

                        for (const recipient of recipients) {
                            await this.sendNotification({
                                recipient,
                                sender: message.sender as string,
                                type: 'message',
                                content: `New message in ${groupDetails.name}`,
                                metadata: {
                                    messageId: savedMessage._id!.toString(),
                                    roomId: message.roomId as string
                                }
                            });
                        }
                    }
                } catch (error) {
                    console.error('Error sending room message:', error);
                    socket.emit('error', 'Failed to send message');
                }
            });

            // Mark message as read
            socket.on('markAsRead', async (messageId: string, userId: string) => {
                try {
                    await this.messageRepository.markAsRead(messageId, userId);
                    socket.emit('messageRead', messageId);
                } catch (error) {
                    console.error('Error marking message as read:', error);
                }
            });

            socket.on('typingPrivate', (recipientId: string, senderId: string) => {
                const recipientSocketId = this.userSocketMap[recipientId];
                if (recipientSocketId) {
                    this.io!.to(recipientSocketId).emit('userTyping', senderId);
                }
            });

            socket.on('requestEmployees', () => {
                this.fetchAndEmitEmployees(socket);
            });

            // Typing indicator for room chat
            socket.on('typingRoom', (roomId: string, senderId: string) => {
                this.io!.to(roomId).emit('userTypingRoom', senderId, roomId);
            });

            socket.on('createGroup', async (groupData: { name: string; members: string[]; createdBy: string }, callback: (response: { success: boolean; group?: IGroup; error?: string }) => void) => {
                try {
                    const newGroup = await this.groupRepository.create(groupData);
                    const members = [...groupData.members, groupData.createdBy];
                    await this.groupRepository.addMembers(newGroup?._id!.toString(), members);

                    members.forEach(memberId => {
                        const memberSocketId = this.userSocketMap[memberId];
                        if (memberSocketId) {
                            console.log(newGroup)
                            this.io!.to(memberSocketId).emit('groupCreated', newGroup);
                        }
                    });

                    callback({ success: true, group: newGroup });
                } catch (error) {
                    console.error('Error creating group:', error);
                    callback({ success: false, error: 'Failed to create group' });
                }
            });

            socket.on('requestUserGroups', async (userId: string) => {
                try {
                    const groups = await this.groupRepository.getGroupsByUser(userId);
                    socket.emit('userGroups', groups);
                } catch (error) {
                    console.error('Error fetching user groups:', error);
                    socket.emit('groupError', 'Failed to fetch groups');
                }
            });

            socket.on('addGroupMembers', async (groupId: string, userIds: string[], callback: (response: { success: boolean; error?: string }) => void) => {
                try {
                    const success = await this.groupRepository.addMembers(groupId, userIds);
                    if (success) {
                        // Notify new members
                        userIds.forEach(userId => {
                            const memberSocketId = this.userSocketMap[userId];
                            if (memberSocketId) {
                                this.io!.to(memberSocketId).emit('addedToGroup', groupId);
                            }
                        });

                        // Get updated group details
                        const groupDetails = await this.groupRepository.getGroupDetails(groupId);
                        if (groupDetails) {
                            // Notify all group members about the update
                            groupDetails.members.forEach(memberId => {
                                const memberSocketId = this.userSocketMap[memberId];
                                if (memberSocketId) {
                                    this.io!.to(memberSocketId).emit('groupMembersUpdated', {
                                        groupId,
                                        newMembers: userIds
                                    });
                                }
                            });
                        }
                        callback({ success: true });
                    }
                } catch (error) {
                    console.error('Error adding group members:', error);
                    callback({ success: false, error: 'Failed to add members' });
                }
            });


            socket.on('removeGroupMember', async (groupId: string, memberId: string) => {
                try {
                    await this.groupRepository.removeMember(groupId, memberId);

                    const removedUserSocketId = this.userSocketMap[memberId];
                    if (removedUserSocketId) {
                        this.io!.to(removedUserSocketId).emit('removedFromGroup', groupId);
                    }

                    const groupDetails = await this.groupRepository.getGroupDetails(groupId);
                    if (groupDetails) {
                        groupDetails.members.forEach(userId => {
                            const memberSocketId = this.userSocketMap[userId];
                            if (memberSocketId) {
                                this.io!.to(memberSocketId).emit('groupMemberRemoved', {
                                    groupId,
                                    removedMemberId: memberId
                                });
                            }
                        });
                    }
                } catch (error) {
                    console.error('Error removing group member:', error);
                    socket.emit('groupError', 'Failed to remove member');
                }
            });

            socket.on('deleteGroup', async (groupId: string) => {
                try {
                    const groupDetails = await this.groupRepository.getGroupDetails(groupId);
                    if (!groupDetails) {
                        throw new Error('Group not found');
                    }

                    await this.groupRepository.deleteGroup(groupId);

                    // Notify all group members
                    groupDetails.members.forEach(memberId => {
                        const memberSocketId = this.userSocketMap[memberId];
                        if (memberSocketId) {
                            this.io!.to(memberSocketId).emit('groupDeleted', groupId);
                        }
                    });
                } catch (error) {
                    console.error('Error deleting group:', error);
                    socket.emit('groupError', 'Failed to delete group');
                }
            });

            socket.on('fetchPrivateMessages', async ({ user1, user2 }: { user1: string; user2: string }, callback: (messages: IMessage[]) => void) => {
                try {
                    const messages = await this.messageRepository.getPrivateMessages(user1, user2);
                    callback(messages);
                } catch (error) {
                    console.error('Error fetching private messages:', error);
                    callback([]);
                }
            });

            socket.on('fetchRoomMessages', async (roomId: string, callback: (messages: IMessage[]) => void) => {
                try {
                    const messages = await this.messageRepository.getMessagesByRoomId(roomId);
                    callback(messages);
                } catch (error) {
                    console.error('Error fetching room messages:', error);
                    callback([]);
                }
            });

            socket.on('sendNotification', async (notificationData: Omit<INotification, '_id' | 'createdAt' | 'updatedAt'>) => {
                await this.sendNotification(notificationData);
            });


            socket.on('markNotificationsAsRead', async (userId: string, notificationIds: string[]) => {
                await this.markNotificationsAsRead(userId, notificationIds);
            });

            socket.on('getUserNotifications', async (userId: string, callback: (notifications: INotification[]) => void) => {
                try {
                    const { notifications } = await this.notificationRepository.getUserNotifications(userId);
                    callback(notifications);
                } catch (error) {
                    console.error('Error getting user notifications:', error);
                    callback([]);
                }
            });

            socket.on('getUnreadNotifications', async (userId: string, callback: (notifications: INotification[]) => void) => {
                try {
                    const notifications = await this.notificationRepository.getUnreadNotifications(userId);
                    callback(notifications);
                } catch (error) {
                    console.error('Error getting unread notifications:', error);
                    callback([]);
                }
            });

            socket.on('leaveStatusUpdate', async (data: {
                employeeId: string;
                status: 'approved' | 'rejected';
                leaveId: string;
                managerId: string;
            }) => {
                const notificationType = data.status === 'approved' ? 'leave_approval' : 'leave_rejection';

                await this.sendNotification({
                    recipient: data.employeeId,
                    sender: data.managerId,
                    type: notificationType,
                    content: `Your leave request has been ${data.status}`,
                    metadata: {
                        leaveId: data.leaveId
                    }
                });
            });

            socket.on('leaveRequestApplied', async (data: {
                employeeName: string;
                employeeId: string;
                leaveId: string;
                managerId: string;
            }) => {

                await this.sendNotification({
                    recipient: data.managerId,
                    sender: data.employeeId,
                    type: 'leave_apply',
                    content: `${data.employeeName} has applied for a leave`,
                    metadata: {
                        leaveId: data.leaveId
                    }
                });
            });

            socket.on('meetingScheduled', async (data: {
                participants: string[];
                meetingId: string;
                scheduledBy: string;
                meetingTitle: string;
                time: Date;
            }) => {
                for (const participant of data.participants) {
                    if (participant !== data.scheduledBy) {
                        await this.sendNotification({
                            recipient: participant,
                            sender: data.scheduledBy,
                            type: 'meeting_scheduled',
                            content: `You have a new meeting: ${data.meetingTitle} at ${data.time.toLocaleString()}`,
                            metadata: {
                                meetingId: data.meetingId
                            }
                        });
                    }
                }
            });

            socket.on('meetingUpdated', async (data: {
                participants: string[];
                meetingId: string;
                updatedBy: string;
                meetingTitle: string;
                changes: string;
            }) => {
                for (const participant of data.participants) {
                    if (participant !== data.updatedBy) {
                        await this.sendNotification({
                            recipient: participant,
                            sender: data.updatedBy,
                            type: 'meeting_updated',
                            content: `Meeting ${data.meetingTitle} updated: ${data.changes}`,
                            metadata: {
                                meetingId: data.meetingId
                            }
                        });
                    }
                }
            });

            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.id}`);
                for (const [userId, socketId] of Object.entries(this.userSocketMap)) {
                    if (socketId === socket.id) {
                        delete this.userSocketMap[userId];
                        console.log(`Removed user ${userId} from socket map`);
                        this.updateOnlineUsers();
                        break;
                    }
                }
            });
        });
    }

    private async fetchAndEmitEmployees(socket: Socket) {
        try {
            const employees = await this.employeeRepository.getEmployeesForChat();
            socket.emit('employeeList', employees);
        } catch (error) {
            console.error('Error fetching employees:', error);
            socket.emit('error', 'Failed to fetch employee list');
        }
    }

    private updateOnlineUsers(): void {
        if (this.io) {
            this.io.emit('onlineUsers', Object.keys(this.userSocketMap));
        }
    }

    private async sendNotification(notificationData: Omit<INotification, '_id' | 'createdAt' | 'updatedAt'>): Promise<void> {
        try {
            const notification = await this.notificationRepository.createNotification({
                ...notificationData,
                read: false,
            });

            const recipientSocketId = this.userSocketMap[notification.recipient as string];
            if (recipientSocketId) {
                this.io!.to(recipientSocketId).emit('newNotification', notification);
            }
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    }

    private async markNotificationsAsRead(userId: string, notificationIds: string[]): Promise<void> {
        try {
            await this.notificationRepository.markAsRead(notificationIds);
            const socketId = this.userSocketMap[userId];
            if (socketId) {
                this.io!.to(socketId).emit('notificationsRead', notificationIds);
            }
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    }
}