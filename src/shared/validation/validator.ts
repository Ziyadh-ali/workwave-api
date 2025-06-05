import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});


export const faqValidationSchema = z.object({
  topic: z
    .string()
    .min(3, "Topic must be at least 3 characters"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters"),
  questions: z.array(
    z.object({
      question: z.string().min(5, "Question must be at least 5 characters"),
      answer: z.string().min(5, "Answer must be at least 5 characters"),
    })
  ).min(1, "At least one question is required")
});


const today = new Date();
today.setHours(0, 0, 0, 0);

const meetingSchema = z.object({
  title: z.string().min(3, { message: 'Title is required and should be at least 3 characters long.' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters' }),
  startTime: z.string().nonempty({ message: 'Start time is required' }),
  duration: z.number().positive({ message: 'Duration must be a positive number' }),
});

const filterSchema = z.object({
  role: z.string().optional(),
  department: z.string().optional(),
});

export const createMeetingSchema = z.object({
  meeting: meetingSchema,
  filter: filterSchema,
});

export const leaveRequestSchema = z
  .object({
    leaveTypeId: z.string().nonempty("Leave type is required"),

    startDate: z.string().nonempty("Start date is required"),

    endDate: z.string().nonempty("End date is required"),

    reason: z
      .string()
      .min(5, "Reason must be at least 5 characters")
      .nonempty("Reason is required"),
  })
  .superRefine((data, ctx) => {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (startDate < today) {
      ctx.addIssue({
        path: ["startDate"],
        message: "Start date cannot be in the past",
        code: z.ZodIssueCode.custom,
      });
    }

    if (endDate < startDate) {
      ctx.addIssue({
        path: ["endDate"],
        message: "End date cannot be before start date",
        code: z.ZodIssueCode.custom,
      });
    }
  });



//   import dayjs from 'dayjs';

// const dateNotInPast = (dateStr: string, startTime: string) => {
//   if (!dateStr || !startTime) return false;
  
//   const dateTime = dayjs(`${dateStr}T${startTime}`);
//   return dateTime.isAfter(dayjs());
// };

// export const meetingScheduleSchema = z.object({
//   title: z.string()
//     .min(3, { message: 'Title must be at least 3 characters' })
//     .nonempty({ message: 'Title is required' }),

//   duration: z.number()
//     .positive({ message: 'Duration must be a positive number' })
//     .int({ message: 'Duration must be an integer' })
//     .nonnegative({ message: 'Duration must be a number' }),

//   startTime: z.string().nonempty({ message: 'Start time is required' }),

//   date: z.string()
//     .nonempty({ message: 'Date is required' }),

//   role: z.string().nullable(),

//   department: z.string().nullable(),

//   description: z.string()
//     .min(5, { message: 'Description must be at least 5 characters' })
//     .nonempty({ message: 'Description is required' }),

// }).superRefine((data, ctx) => {
//   const { date, startTime, role, department } = data;

//   if (!dateNotInPast(date, startTime)) {
//     ctx.addIssue({
//       path: ['date'],
//       message: 'Date and time must not be in the past',
//       code: z.ZodIssueCode.custom,
//     });
//   }

//   if (!role && !department) {
//     ctx.addIssue({
//       path: ['role'],
//       message: 'Either role or department is required',
//       code: z.ZodIssueCode.custom,
//     });
//   }

//   if (role && department) {
//     ctx.addIssue({
//       path: ['role'],
//       message: 'Select either role or department, not both',
//       code: z.ZodIssueCode.custom,
//     });
//   }
// });