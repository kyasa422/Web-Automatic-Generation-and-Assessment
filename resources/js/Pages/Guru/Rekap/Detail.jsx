import React from "react";
import { usePage } from "@inertiajs/react";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { Link } from "@inertiajs/react";
import moment from "moment";


const Detail = () => {
  const { examAnswer } = usePage().props;
  console.log(examAnswer);

  return (
    <DefaultLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Detail Rekap Jawaban Siswa</h1>
        <table className="w-full text-left border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">No</th>
              <th className="p-2 border">Nama Siswa</th>
              <th className="p-2 border">Mata Pelajaran</th>
              <th className="p-2 border">Kelas</th>
              <th className="p-2 border">Jenis Ujian</th>
              <th className="p-2 border">Tanggal Dikerjakan</th>
              <th className="p-2 border">Skor / Status</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
          {examAnswer?.length > 0 ? (
            examAnswer.map((item, index) => (
                <tr key={index}>
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">{item.user.name}</td>
                  <td className="p-2 border">{item.setting.question.subject.name}</td>
                  <td className="p-2 border">{item.setting.question.classLevel}</td>
                  <td className="p-2 border">{item.examLevel ? "Ulangan Tengah Semester" : "Ulangan Akhir Semester"}</td>
                  <td className="p-2 border">{moment(item.created_at).format("DD MMMM YYYY HH:mm")}</td>
                  <td className="p-2 border">Belum dinilai</td>
                    <td className="p-2 border">
                      <Link
                                  href={route('guru.rekapsoal.show', {
                                    ulanganSettings: item.ulangan_setting_id,
                                    userId: item.user.id,
                                  })}
                                  className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                                  >
                                  Detail
                                  </Link>
                    </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-2 border text-center" colSpan="7">Belum ada siswa yang mengerjakan</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DefaultLayout>
  );
};

export default Detail;
