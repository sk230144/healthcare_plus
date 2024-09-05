import Image from "next/image";
import Link from "next/link";


import { getPatientstList } from "@/lib/actions/appointment.action";
import { DataTable } from "@/components/table1/DataTable";
import { columns } from "@/components/table1/columns";


const PatientStatus = async () => {
  const appointments = await getPatientstList();

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14 mb-6">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>

        <p className="text-16-semibold">Patients Appointment</p>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">
            Check Your Details
          </p>
        </section>


        <DataTable columns={columns} data={appointments.documents} />
      </main>
    </div>
  );
};

export default PatientStatus;