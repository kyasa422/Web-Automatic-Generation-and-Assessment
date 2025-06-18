import React, { useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { router, useForm, usePage } from '@inertiajs/react';
import SweetAlert from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const DetailBankSoal = () => {
  const { question, permissions } = usePage().props;
  const MySwal = withReactContent(SweetAlert);


  const { data, setData, post, errors, reset } = useForm({
    start_time: '',
    end_time: '',
    permissions: [],
    question_id: question.id,
  });

  const handlePermissionChange = (e) => {
    const permissionId = parseInt(e.target.value);
    setData("permissions", e.target.checked
      ? [...data.permissions, permissionId]
      : data.permissions.filter(id => id !== permissionId)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/guru/set-ulangan", {
      onSuccess: () => {
        MySwal.fire({
          title: "Berhasil!",
          text: "Pengaturan ulangan berhasil disimpan.",
          icon: "success",
          confirmButtonText: "OK",
        });
        reset(); // Reset form kalau perlu
      },
      onError: () => {
        MySwal.fire({
          title: "Gagal!",
          text: "Terjadi kesalahan saat menyimpan. Coba cek isian kamu.",
          icon: "error",
          confirmButtonText: "Tutup",
        });
      },
    });
  };
  

  return (
    <DefaultLayout>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Detail Soal</h1>
        <p><strong>Mata Pelajaran :</strong> {question.subject?.name}</p>
        <p><strong>Guru:</strong> {question.teacher?.name}</p>
        <p><strong>Kelas:</strong> {question.classLevel}</p>
        <p><strong>Jenis Ujian:</strong> {question.examLevel ? "Ulangan Akhir Semester" : "Ulangan Tengah Semester"}</p>

        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Daftar Pertanyaan:</h2>
          {question.question_inquiries.map((inq, idx) => (
            <div key={inq.id} className="mb-4 p-4 border rounded bg-gray-50">
              <p><strong>{idx + 1}. {inq.question}</strong></p>

              {inq.answer?.trim() && (
                <p className="mt-2 text-sm text-black-2">
                  Jawaban  :<br /> {inq.answer}
                </p>
              )}

              <p> bobot : {inq.bobot}  </p>

              <ul className="list-disc pl-6 mt-2">
                {inq.multiple_choice.map((mc) => (
                  <li
                    key={mc.id}
                    className={mc.isCorrect == 1 ? "text-green-600 font-semibold" : ""}
                  >
                    {mc.text} {mc.isCorrect == 1 ? "(Benar)" : ""}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FORM SETTING ULANGAN */}
        <div className="mt-6 border-t pt-6">
          <h2 className="text-lg font-bold mb-4">Atur Waktu dan Akses Ulangan</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Waktu Mulai */}
            <div>
              <label className="block text-sm font-medium">Waktu Mulai</label>
              <input
                type="datetime-local"
                value={data.start_time}
                onChange={(e) => setData('start_time', e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.start_time && <p className="text-red-500 text-sm">{errors.start_time}</p>}
            </div>

            {/* Waktu Selesai */}
            <div>
              <label className="block text-sm font-medium">Waktu Selesai</label>
              <input
                type="datetime-local"
                value={data.end_time}
                onChange={(e) => setData('end_time', e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.end_time && <p className="text-red-500 text-sm">{errors.end_time}</p>}
            </div>

            {/* Permissions (Kelas yang Diizinkan) */}
            <div>
              <label className="block text-sm font-medium">Izin Kelas</label>
              <div className="space-y-1">
                {permissions.map((permission) => (
                  <label key={permission.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={permission.id}
                      checked={data.permissions.includes(permission.id)}
                      onChange={handlePermissionChange}
                    />
                    <span>{permission.name}</span>
                  </label>
                ))}
              </div>
              {errors.permissions && <p className="text-red-500 text-sm">{errors.permissions}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Simpan Pengaturan Ulangan
            </button>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default DetailBankSoal;
