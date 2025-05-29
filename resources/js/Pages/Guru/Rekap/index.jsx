import React from "react";
import { usePage, Link } from "@inertiajs/react";
import DefaultLayout from "@/Layouts/DefaultLayout";


const Rekap = () => {
  const { questions, examSettings } = usePage().props;
  console.log(examSettings);

  const getStatusUlangan = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
  
    if (now < start) return "Belum Dimulai";
    if (now >= start && now <= end) return "Sedang Berlangsung";
    return "Selesai";
  };
  

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
                  {examSettings!=null? examSettings.map((item, i) => (
                      <div
                        key={i}
                        className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
                      >
                        <div className="mb-2">
                          <h2 className="text-xl font-semibold text-blue-800">
                            {item.question.subject.name?? ""} 
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

                        <div className="mt-4">
                          <Link
                            href={route("guru.rekap.showsiswa", item.id)}
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md shadow-md transition-colors"
                          >
                            Detail
                          </Link>
                        </div>
                      </div>
                        )): <p> belum ada data  </p>}
                      </div>
                    </div>
             
                </div>
    
    </DefaultLayout>
  );
};

export default Rekap;
