import React from "react";
import { usePage } from "@inertiajs/react";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { router } from '@inertiajs/react';


const Laporan = () => {
    const { permissions, available_exams } = usePage().props;
    console.log(available_exams);
    console.log(permissions);

    return (
        <DefaultLayout>
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">Daftar Ujian yang Tersedia</h1>

                {available_exams.length > 0 ? (
                    available_exams.map((exam,  index) => (
                        <div
                            key={exam.id}
                            className="border border-gray-300 rounded-lg p-4 bg-white shadow-md"
                        >
                            <h2 className="text-xl font-semibold mb-2">
                                {exam.question.subject.name}
                            </h2>
                            <p><strong>Guru:</strong> {exam.question.teacher.name}</p>
                            <p><strong>Kelas:</strong> {permissions}</p>
                            <p>
                                <strong>Jenis Ujian:</strong>{" "}
                                {exam.question.examLevel ? "UAS" : "UTS"}
                            </p>
                            <p>
                                <strong>Waktu Aktif:</strong><br />
                                {new Date(exam.start_time).toLocaleString()} -{" "}
                                {new Date(exam.end_time).toLocaleString()}
                            </p>
                            <button
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                             onClick={() => router.get('/siswa/ujian/' + exam.id)}
                            >
                                Kerjakan Ujian

                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-600">Belum ada ujian aktif untuk kelas Anda saat ini.</div>
                )}
            </div>
        </DefaultLayout>
    );
};

export default Laporan;
