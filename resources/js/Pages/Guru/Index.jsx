import React from "react";
import { usePage, Link } from "@inertiajs/react";
import DefaultLayout from "@/Layouts/DefaultLayout";

const BankSoal = () => {
  const { questions } = usePage().props;

  return (
    <DefaultLayout noPadding>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Daftar Soal
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 rounded-xl shadow-md">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Mata Pelajaran</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Guru</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Kelas</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Tingkat Ujian</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {questions.map((q, index) => (
                <tr key={q.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 text-sm text-gray-800">{index + 1}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{q.subject?.name || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{q.teacher?.name || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{q.classLevel || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {q.examLevel ? "Ulangan Akhir Semester" : "Ulangan Tengah Semester"}
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      href={route("banksoal.show", q.id)}
                      className="inline-block text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default BankSoal;
