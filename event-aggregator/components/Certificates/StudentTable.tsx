type Registration = {
  id: number;
  fullName: string;
  email: string;
  college: string;
  eventTitle: string;
};

type Props = {
  registrations: Registration[];
};

export default function StudentTable({
  registrations,
}: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

      <div className="p-8 border-b">

        <h2 className="text-3xl font-bold text-blue-700">
          Registered Students
        </h2>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-blue-700 text-white">

            <tr>

              <th className="p-4 text-left">
                Student
              </th>

              <th className="p-4 text-left">
                Email
              </th>

              <th className="p-4 text-left">
                College
              </th>

              <th className="p-4 text-left">
                Event
              </th>

              <th className="p-4 text-center">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {registrations.map((student) => (

              <tr
                key={student.id}
                className="border-b hover:bg-slate-50"
              >

                <td className="p-4 font-semibold">
                  {student.fullName}
                </td>

                <td className="p-4">
                  {student.email}
                </td>

                <td className="p-4">
                  {student.college}
                </td>

                <td className="p-4">
                  {student.eventTitle}
                </td>

                <td className="p-4">

                  <div className="flex justify-center gap-3">

                    <button className="bg-blue-700 text-white px-4 py-2 rounded-xl">
                      Preview
                    </button>

                    <button className="bg-green-600 text-white px-4 py-2 rounded-xl">
                      Generate
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}