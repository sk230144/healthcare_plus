"use server";

import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";


import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  messaging,
  PATIENT_COLLECTION_ID,
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "./appwrite.types";

//  CREATE APPOINTMENT
export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );

    revalidatePath("/admin");
    return parseStringify(newAppointment);
  } catch (error) {
    console.error("An error occurred while creating a new appointment:", error);
  }
};


// export const getRecentAppointmentList = async () => {
//   try {
//     const appointments = await databases.listDocuments(
//       DATABASE_ID!,
//       APPOINTMENT_COLLECTION_ID!,
//       [Query.orderDesc("$createdAt")]
//     );
  
//     const initialCounts = {
//       scheduledCount: 0,
//       pendingCount: 0,
//       cancelledCount: 0,
//     };

//     const counts = (appointments.documents as Appointment[]).reduce(
//       (acc, appointment) => {
//         switch (appointment.status) {
//           case "scheduled":
//             acc.scheduledCount++;
//             break;
//           case "pending":
//             acc.pendingCount++;
//             break;
//           case "cancelled":
//             acc.cancelledCount++;
//             break;
//         }
//         return acc;
//       },
//       initialCounts
//     );

//     const data = {
//       totalCount: appointments.total,
//       ...counts,
//       documents: appointments.documents,
//     };

//     return parseStringify(data);
//   } catch (error) {
//     console.error(
//       "An error occurred while retrieving the recent appointments:",
//       error
//     );
//   }
// };



export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const currentDate = new Date();
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

    const filteredAppointments = (appointments.documents as Appointment[]).filter(
      (appointment) => {
        const appointmentDate = new Date(appointment.schedule!);
        const isExpired = currentDate.getTime() - appointmentDate.getTime() > oneDayInMilliseconds;

        if (appointment.status === "pending") {
          // Keep pending appointments regardless of expiration
          return true;
        }

        // Filter out expired appointments for other statuses
        return !isExpired;
      }
    );

    const counts = filteredAppointments.reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case "scheduled":
            acc.scheduledCount++;
            break;
          case "pending":
            acc.pendingCount++;
            break;
          case "cancelled":
            acc.cancelledCount++;
            break;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: filteredAppointments?.length || 0,
      ...counts,
      documents: filteredAppointments || [],
    };

    // Delete expired appointments from the database (excluding pending appointments)
    const expiredAppointments = (appointments.documents as Appointment[]).filter(
      (appointment) => {
        const appointmentDate = new Date(appointment.schedule!);
        const isExpired = currentDate.getTime() - appointmentDate.getTime() > oneDayInMilliseconds;

        return appointment.status !== "pending" && isExpired;
      }
    );

    for (const appointment of expiredAppointments) {
      try {
        await databases.deleteDocument(
          DATABASE_ID!,
          APPOINTMENT_COLLECTION_ID!,
          appointment.$id
        );
      } catch (error) {
        console.error(`Error deleting appointment with ID ${appointment.$id}:`, error);
      }
    }

    return parseStringify(data);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the recent appointments:",
      error
    );
    throw error;
  }
};




export const getPatientstList1 = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")],
    );
  
    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case "scheduled":
            acc.scheduledCount++;
            break;
          case "pending":
            acc.pendingCount++;
            break;
          case "cancelled":
            acc.cancelledCount++;
            break;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the recent appointments:",
      error
    );
  }
};


export const getPatientstList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const currentDate = new Date();
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

    const filteredAppointments = (appointments.documents as Appointment[]).filter(
      (appointment) => {
        const appointmentDate = new Date(appointment.schedule!);
        const isExpired = currentDate.getTime() - appointmentDate.getTime() > oneDayInMilliseconds;

        if (appointment.status === "pending") {
          // Keep pending appointments regardless of expiration
          return true;
        }

        // Filter out expired appointments for other statuses
        return !isExpired;
      }
    );

    const counts = filteredAppointments.reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case "scheduled":
            acc.scheduledCount++;
            break;
          case "pending":
            acc.pendingCount++;
            break;
          case "cancelled":
            acc.cancelledCount++;
            break;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: filteredAppointments?.length || 0,
      ...counts,
      documents: filteredAppointments || [],
    };

    // Delete expired appointments from the database (excluding pending appointments)
    const expiredAppointments = (appointments.documents as Appointment[]).filter(
      (appointment) => {
        const appointmentDate = new Date(appointment.schedule!);
        const isExpired = currentDate.getTime() - appointmentDate.getTime() > oneDayInMilliseconds;

        return appointment.status !== "pending" && isExpired;
      }
    );

    for (const appointment of expiredAppointments) {
      try {
        await databases.deleteDocument(
          DATABASE_ID!,
          APPOINTMENT_COLLECTION_ID!,
          appointment.$id
        );
      } catch (error) {
        console.error(`Error deleting appointment with ID ${appointment.$id}:`, error);
      }
    }

    return parseStringify(data);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the recent appointments:",
      error
    );
    throw error;
  }
};



export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    // https://appwrite.io/docs/references/1.5.x/server-nodejs/messaging#createSms
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId]
    );
    return parseStringify(message);
  } catch (error) {
    console.error("An error occurred while sending sms:", error);
  }
};

//  UPDATE APPOINTMENT
export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) throw Error;

    const smsMessage = `Greetings from CarePulse. ${type === "schedule" ? `Your appointment is confirmed for ${formatDateTime(appointment.schedule!).dateTime} with Dr. ${appointment.primaryPhysician}` : `We regret to inform that your appointment for ${formatDateTime(appointment.schedule!).dateTime} is cancelled. Reason:  ${appointment.cancellationReason}`}.`;
    await sendSMSNotification(userId, smsMessage);


    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("An error occurred while scheduling an appointment:", error);
  }
};

// GET APPOINTMENT
export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );

    return parseStringify(appointment);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the existing patient:",
      error
    );
  }
};