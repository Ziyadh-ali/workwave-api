import { Attendance } from "../models/Attendance.entities";

export interface IAttendanceRepository {
    createAttendance (employeeId : string , date : Date) : Promise<Attendance>;
    markCheckIn (employeeId: string, time: Date,startOfDay : Date, endOfDay : Date) : Promise<Attendance>;
    markCheckOut (
        employeeId: string, 
        time: Date,
        startOfDay : Date, 
        endOfDay : Date ,
    ) : Promise<Attendance>;
    getAttendanceByMonth (employeeId : string , year : number , month : number) : Promise<Attendance[] | []>;
    updateStatus (id : string , status : "Present" | "Absent" | "Weekend" | "Holiday"| "Pending") : Promise<Attendance | null>;
    getAttendanceByDate(employeeId: string, date: Date): Promise<Attendance | null>;
    getAllAttendanceByDate(date: Date | null, page: number, pageSize: number) : Promise<{ data: Attendance[]|[] , total: number }>;
    requestRegularization(
        attendanceId: string,
        requestedBy: string,
        reason: string,
      ): Promise<Attendance | null>;
    
      respondToRegularizationRequest(
        attendanceId: string,
        action: "Approved" | "Rejected",
        adminRemarks?: string
      ): Promise<Attendance | null>;
    
      getAllPendingRegularizationRequests(): Promise<Attendance[]>;
}