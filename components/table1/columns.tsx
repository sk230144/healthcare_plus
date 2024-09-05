"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { StatusBadge } from "../StatusBadge";
import { Appointment } from "@/lib/actions/appwrite.types";
import { AppointmentModal } from "../AppointmentModal";

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      const appointment = row.original;
      return <p className="text-14-medium ">{appointment.patient?.name}</p>;
    },
  },
  {
    accessorKey: "email",
    header: "Email ID",
    cell: ({ row }) => {
      const appointment = row.original;
      const email = appointment.patient?.email;
      
      if (email) {
        const [username, domain] = email.split('@');
        let maskedUsername;
        
        if (username.length <= 6) {
          maskedUsername = username;
        } else {
          maskedUsername = username.slice(0, 3) + '*'.repeat(username.length - 6) + username.slice(-3);
        }
        
        const maskedEmail = `${maskedUsername}@${domain}`;
        
        return <p className="text-14-medium">{maskedEmail}</p>;
      }
      
      return null;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={appointment.status} />
        </div>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <p className="text-14-regular min-w-[100px]">
          {formatDateTime(appointment.schedule).dateTime}
        </p>
      );
    },
  },
  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({ row }) => {
      const appointment = row.original;

      const doctor = Doctors.find(
        (doctor) => doctor.name === appointment.primaryPhysician
      );

      return (
        <div className="flex items-center gap-3">
          <Image
            src={doctor?.image!}
            alt="doctor"
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
        </div>
      );
    },
  },
 
];