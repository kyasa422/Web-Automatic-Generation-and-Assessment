import React from "react";
import { usePage, Link } from "@inertiajs/react";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { FaEdit, FaTrash } from 'react-icons/fa';

import SweetAlert from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { router } from "@inertiajs/react";
import axios from "axios";
import swal from "sweetalert2";

const handleDelete = (id) => {
  swal.fire({
    title: "Yakin ingin menghapus soal ini?",
    text: "Tindakan ini tidak dapat dibatalkan!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  }).then(async (result) => {
    if (result.isConfirmed) {
      router.delete(route("banksoal.delete", id), {
        onSuccess: () => {
          swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Soal berhasil dihapus",
            toast: true,
            timer: 2000,
            position: "top-end",
            showConfirmButton: false,
          });
        },
        onError: () => {
          swal.fire({
            icon: "error",
            title: "Akses Ditolak",
            text: "Anda tidak memiliki izin untuk menghapus soal ini. hanya user yang membuat soal yang dapat menghapus soal ini.",
          });
        }
      })
      // try {
        
      //   await axios.delete();


      //   // Refresh halaman (opsional)
      //   window.location.reload();
      // } catch (error) {
      //   console.log(error)
      //   if (error.response && error.response.status === 403) {
          
      //   } else {
      //     swal.fire({
      //       icon: "error",
      //       title: "Gagal",
      //       text: "Terjadi kesalahan saat menghapus soal.",
      //     });
      //   }
      // }
    }
  });
};




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
                      <span className="inline-flex items-center space-x-1 ">

                        <FaEdit className="text-yellow-500 hover:text-yellow-700 cursor-pointer mr-1" />

                        Siapkan Ujian
                      </span>
                    </Link>


                    <button
                      onClick={() => handleDelete(q.id)}
                      className="inline-block text-sm bg-slate-700 text-gray-100 px-3 py-1 rounded hover:bg-red-700 transition ml-3"
                    >
                      <span className="inline-flex items-center space-x-1">
                        <FaTrash className="text-red-500 hover:text-slate-100" />
                        <span>Delete</span>
                      </span>
                    </button>




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
