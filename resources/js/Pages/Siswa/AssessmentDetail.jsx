import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import DefaultLayout from "@/Layouts/DefaultLayout";
import { FaPencilAlt, FaCheck } from "react-icons/fa";
import { CheckCircle, XCircle } from "lucide-react";
import moment from "moment";


const AssessmentDetail = () => {
  const { assessment } = usePage().props;
  const [edit, setEdit] = useState(null);
  console.log(assessment);
  return (
    <DefaultLayout noPadding>
      <div className="p-6 max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold text-slate-900 mb-6">
          Detail Hasil Ujian
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">

          <p><strong>Nama:</strong> {assessment.user.name}</p>
          <p><strong>Mata Pelajaran:</strong> {assessment.setting.question.subject.name}</p>
          <p><strong>Tanggal Ujian:</strong>    {moment((assessment.created_at)
          ).format("DD MMMM YYYY HH:mm")}</p>
          <p><strong>Nilai:</strong> {assessment.nilai}</p>


        </div>
        {assessment.task_collections.length > 0 ? (
          assessment.task_collections.map((task, index) => {
            const inquiry = task.question_inquiry;
            const answerList = inquiry?.ulangan_jawaban ?? [];
            return (
              <div
                key={task.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 mb-6 space-y-4"
              >

                {/* Header */}
                <div className="flex justify-between flex-wrap gap-4 items-center bg-sky-100 text-sky-800 px-5 py-3 rounded-xl">
                  <div>
                    <h2 className="font-semibold text-lg">Soal {index + 1}</h2>
                    <p className="text-sm">Bobot: <span className="font-semibold">{inquiry?.bobot ?? 0}</span></p>
                  </div>
                  <div className="text-left text-sm">
                    <p>Skor: <span className="font-semibold">{task.skor ?? 'Belum ada'}</span></p>
                    <p className="mt-1">Nilai: <span className="font-semibold">{(inquiry?.bobot * task.skor || 0).toFixed(2)}</span></p>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        className="hidden"
                        checked={task.is_correct == true}
                        readOnly
                      />
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm ${task.is_correct == true ? "bg-green-100 border-green-500 text-green-700" : "border-gray-300 text-gray-500"}`}>
                        <CheckCircle className="w-4 h-4" />
                        Benar
                      </div>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        className="hidden"
                        checked={task.is_correct == false}
                        readOnly
                      />
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm ${task.is_correct == false ? "bg-red-100 border-red-500 text-red-700" : "border-gray-300 text-gray-500"}`}>
                        <XCircle className="w-4 h-4" />
                        Salah
                      </div>
                    </label>
                  </div>
                </div>

                {/* Pertanyaan */}
                <div>
                  <p className="text-gray-800"><strong>Pertanyaan:</strong></p>
                  <p className="text-gray-700">{inquiry?.question ?? '—'}</p>
                </div>

                {/* Jawaban Siswa */}
                <div>
                  <p className="text-gray-800"><strong>Jawaban Siswa:</strong></p>
                  <ul className="list-disc pl-5 text-gray-700">
                    {answerList.length > 0 ? (
                      answerList.map((ans, i) => (
                        <li key={i}>{ans.answer}</li>
                      ))
                    ) : (
                      <li>Tidak ada jawaban</li>
                    )}
                  </ul>
                </div>

                {/* Kunci Jawaban */}
                <div>
                  <p className="text-gray-800 font-semibold">
                    {inquiry?.multiple_choice?.length ? "Kunci Jawaban PG:" : "Kunci Jawaban Essay:"}
                  </p>
                  <ul className="list-disc pl-5 text-gray-700">
                    {/* Jika essay */}
                    {inquiry?.answer && (
                      <li>{inquiry.answer}</li>
                    )}

                    {/* Jika pilihan ganda */}
                    {inquiry?.multiple_choice?.map((choice, i) => (
                      <li
                        key={i}
                        className={choice.isCorrect == 1 ? "text-green-600 font-semibold" : ""}
                      >
                        {choice.text} {choice.isCorrect == 1 ? "(Benar)" : ""}
                      </li>
                    ))}
                  </ul>
                </div>


                {/* Catatan */}
                {task.catatan && (
                  <div className="mt-2 flex justify-between items-start gap-4">
                    {edit === index ? (
                      <textarea
                        className="textarea textarea-bordered w-full rounded-md border border-gray-300 p-2 text-gray-700"
                        defaultValue={task.catatan}
                      />
                    ) : (
                      <div>
                        <strong className="text-gray-800">Catatan:</strong>
                        <p className="text-gray-700">{task.catatan}</p>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-red-500 text-center mt-4">Tidak ada data jawaban ditemukan.</p>
        )}
      </div>
    </DefaultLayout>
  );
};

export default AssessmentDetail;
