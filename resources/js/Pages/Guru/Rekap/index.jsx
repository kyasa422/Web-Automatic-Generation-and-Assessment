import React from "react";
import { usePage, Link } from "@inertiajs/react";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { router } from '@inertiajs/react'
import Swal from 'sweetalert2';





const Rekap = () => {
  const { questions, examSettings } = usePage().props;
  console.log(examSettings);

  const getStatusUlangan = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime.replace(' ', 'T'));
    const end = new Date(endTime.replace(' ', 'T'));

    if (now < start) return "Belum Dimulai";
    if (now >= start && now <= end) return "Sedang Berlangsung";
    return "Selesai";
  };


  function handleDelete(id) {
      router.delete(route('guru.ulangan-setting.destroy', id))
    
  }




  return (
    <DefaultLayout noPadding>

      <div
        className="relative min-h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1613896527026-f195d5c818ed?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        {/* Overlay Efek Transparan */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Konten */}

        <div className="p-6 relative z-10">
          <h1 className="text-3xl font-bold text-gray-100 mb-6 text-center">
            Informasi Ujian
          </h1>





          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {examSettings != null ? examSettings.map((item, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="mb-2">
                  <h2 className="text-xl font-semibold text-blue-800">
                    {item.question.subject.name ?? ""}
                    <span className="text-gray-500 text-sm">( {item.created_at.toString().slice(0, 10)}
                      )
                    </span>


                  </h2>
                  <p>
                    <span className="font-medium">Status Ujian:</span>{" "}
                    <span className={
                      getStatusUlangan(item.start_time, item.end_time) === "Belum Dimulai" ? "text-yellow-500" :
                        getStatusUlangan(item.start_time, item.end_time) === "Sedang Berlangsung" ? "text-green-600" :
                          "text-red-500"
                    }>
                      {getStatusUlangan(item.start_time, item.end_time)}

                    </span>
                  </p>

                  <p>waktu mulai: <span> {item.start_time ? item.start_time.substring(11, 16) : "Tidak ada waktu mulai"}</span> -  waktu selesai: <span>{item.end_time ? item.end_time.substring(11, 16) : "Tidak ada waktu selesai"}
                  </span></p>


                </div>

                <div className="space-y-1 text-gray-700 text-sm">

                  <p>
                    <span className="font-medium">Kelas :</span> {item.question.classLevel}
                  </p>

                  <p>
                    <span className="font-medium">Jenis Ujian:</span>{" "}
                    {item.question.examLevel
                      ? "Ulangan Akhir Semester"
                      : "Ulangan Tengah Semester"}
                  </p>
                  <p>
                    <span className="font-medium">Jumlah Siswa:</span>{" "}
                    {item.ulangan_jawaban_many_count}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.permissions.map((perm, idx) => (
                    <span key={idx} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                      {perm.permission?.name ?? '-'}
                    </span>
                  ))}
                </div>


                <div className="mt-4 flex gap-3">
                  <Link
                    href={route("guru.rekap.showsiswa", item.id)}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-md shadow-md transition duration-300 ease-in-out"
                  >
                    Detail
                  </Link>



                  <Link
                    href={route("guru.ulangan-setting.edit", item.id)}
                    className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-5 py-2 rounded-md shadow-md transition duration-300 ease-in-out"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => {
                      Swal.fire({
                        title: 'Yakin ingin menghapus?',
                        text: 'Data ini tidak bisa dikembalikan!',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#e3342f',
                        cancelButtonColor: '#6c757d',
                        confirmButtonText: 'Ya, hapus!',
                        cancelButtonText: 'Batal'
                      }).then((result) => {
                        if (result.isConfirmed) {
                          handleDelete(item.id); // Panggil fungsi delete kamu di sini
                          Swal.fire(
                            'Terhapus!',
                            'Data berhasil dihapus.',
                            'success'
                          );
                        }
                      });
                    }}
                    className="ml-2 bg-red-600 hover:bg-red-700 text-white text-sm px-5 py-2 rounded-md shadow-md transition duration-300 ease-in-out"
                  >
                    Hapus
                  </button>
                </div>



              </div>
            )) : <p> belum ada data  </p>}
          </div>
        </div>

      </div>

    </DefaultLayout>
  );
};

export default Rekap;
