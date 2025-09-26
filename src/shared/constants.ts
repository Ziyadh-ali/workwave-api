// httpStatusCodes.ts

export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,

  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

export type HttpStatusCode = typeof HTTP_STATUS_CODES[keyof typeof HTTP_STATUS_CODES];

export const MESSAGES = {
  SUCCESS: {
    USER_CREATED: "User has been successfully created.",
    USER_UPDATED: "User details have been updated successfully.",
    USER_DELETED: "User deleted successfully",
    PASSWORD_CHANGED: "Your password has been updated successfully.",
    LOGIN_SUCCESS: "Login successful. Welcome back!",
    LOGOUT_SUCCESS: "You have been logged out successfully.",
    TOKEN_REFRESHED: "Access token refreshed successfully.",
    PROFILE_FETCHED: "User profile fetched successfully.",
    PROFILE_UPDATED: "User profile updated successfully.",
    LEAVE_REQUEST_SUBMITTED: "Leave request submitted successfully.",
    LEAVE_REQUEST_APPROVED: "Leave request has been approved.",
    LEAVE_REQUEST_REJECTED: "Leave request has been rejected.",
    RECORD_DELETED: "Record deleted successfully.",
    OPERATION_SUCCESSFUL: "Operation completed successfully.",
    LEAVE_TYPE_CREATED: "Leave type created successfully.",
    LEAVE_TYPE_UPDATED: "Leave type updated successfully.",
    LEAVE_TYPE_DELETED: "Leave type deleted successfully.",
    RESET_LINK_SENDED: "Reset link has shared please check your mail",
    CHECKED_IN: "Checked in successfully",
    CHECKED_OUT: "Checked out successfully",
    METING_SCHEDULED: "Meeting scheduled successfully",
    LINK_ADDED: "Meeting link has been added",
    FAILED_TO_SCHEDULE: "Failed to schedule meeting",
    MEETING_COMPLETED: "Meeting completed successfully",
    MEETING_DELETED: "Meeting deleted successfully",
    MEETING_UPDATED: "Meeting updated successfully",
    CREATE_SUCCESS: "FAQ created successfully.",
    FAQ_UPDATE_SUCCESS: "FAQ updated successfully.",
    DELETE_SUCCESS: "FAQ deleted successfully.",
    ATTENDANCDE_UPDATED: "Attendance updated successfully.",

  },

  ERROR: {
    GENERIC: "An unexpected error occurred. Please try again later.",
    AUTH: {
      INVALID_CREDENTIALS: "Invalid email or password.",
      UNAUTHORIZED: "Unauthorized access. Please log in.",
      FORBIDDEN: "Access denied. You do not have permission to perform this action.",
      TOKEN_EXPIRED: "Your session has expired. Please log in again.",
      INVALID_TOKEN: "Invalid or malformed token.",
      NO_REFRESH_TOKEN: "No refresh token provided. Please log in again.",
    },

    USER: {
      USER_NOT_FOUND: "User not found.",
      EMAIL_ALREADY_EXISTS: "This email is already in use.",
      USER_ALREADY_EXISTS: "This user is already in use.",
      INVALID_USER_ID: "Invalid user ID provided.",
      NO_USER_ID: "User ID not provided",
      USER_CREATION_FAILED: "An error occurred while creating the user.",
      USER_UPDATE_FAILED: "Failed to update user details.",
      PASSWORD_REQUIRED: "Current and new passwords are required.",
      INVALID_CURRENT_PASSWORD: "The current password you entered is incorrect.",
      INVALID_PASSWORD: "The password you entered is incorrect.",
      PASSWORD_UPDATE_FAILED: "An error occurred while updating the password. Please try again.",
    },

    LEAVE_TYPE: {
      NOT_FOUND: "Leave type not found.",
      UPDATE_FAILED: "Failed to update leave type.",
      DELETE_FAILED: "Failed to delete leave type.",
    },

    ROLE: {
      ROLE_NOT_FOUND: "The specified role does not exist.",
      ROLE_ALREADY_EXISTS: "A role with this name already exists.",
      ROLE_ASSIGNMENT_FAILED: "Failed to assign the role.",
      ROLE_UPDATE_FAILED: "An error occurred while updating the role.",
      ROLE_DELETION_FAILED: "Failed to delete the role.",
    },

    MEETING: {
      ROLE_REQUIRED: "At least one filter (role or department) must be provided.",
      EMPLOYEE_NOT_FOUND: "No employees found for the given filter.",
      ALREADY_HAVE_MEETING: "The host already has a meeting at this time.",
      PARTICIPANTS_HAVE_MEETING: "One or more participants have a conflicting meeting.",
      INVALID_STATUS: "Status is invalid",
      MISSING_FIELDS: "No field to edit",
    },

    FAQ: {
      CREATE_ERROR: "Failed to create FAQ.",
      GET_ERROR: "Failed to retrieve FAQs.",
      GET_BY_ID_ERROR: "Failed to retrieve FAQ by ID.",
      NOT_FOUND: "FAQ not found.",
      INVALID_ID: "Invalid FAQ ID.",
      UPDATE_ERROR: "Failed to update FAQ.",
      DELETE_ERROR: "Failed to delete FAQ.",
    },

    LEAVE: {
      LEAVE_REQUEST_NOT_FOUND: "Leave request not found.",
      LEAVE_REQUEST_FAILED: "Failed to submit the leave request.",
      LEAVE_APPROVAL_FAILED: "Failed to approve the leave request.",
      LEAVE_REJECTION_FAILED: "Failed to reject the leave request.",
      INVALID_LEAVE_DATES: "Invalid leave dates provided.",
      INVALID_STATUS: "Invalid status to change",
      UPDATE_FAILED: "Failed to update leave request",
      EDIT_FAILED: "Failed to edit leave request",
      CANCEL_FAILED: "Failed to cancel request",
      NO_LEAVE_BALANCE: "No leave balance",
      INSUFFICIENT_BALANCE: "Out of balance",
      NO_REJECTION: "Reason for rejection not provided",
    },

    ATTENDANCE: {
      CUT_OFF_TIME: "Cannot check in after 10 AM",
      NO_ATTENDANCE: "Attendance not found",
      CHECK_IN_FAILED: "Failed To check in",
      CHECK_OUT_FAILED: "Failed To check out",
      ERROR_IN_FETCHING: "Error in fetching attendace details",
      ON_WEEKEND: "Cannot check in on weekends.",
      ON_FULLDAY_LEAVE: "You are on a full-day leave.",
      ALREADY_CHECKED: "You have already checked in.",
    },

    SYSTEM: {
      INTERNAL_SERVER_ERROR: "An unexpected error occurred. Please try again later.",
      RESOURCE_NOT_FOUND: "The requested resource was not found.",
      INVALID_INPUT: "Invalid input provided.",
      OPERATION_FAILED: "The operation could not be completed.",
      DATABASE_CONNECTION_FAILED: "Failed to connect to the database.",
      VALIDATION_ERROR: "Validation failed for the provided data.",
    },
  },
} as const;

export type MessageKey = typeof MESSAGES[keyof typeof MESSAGES];