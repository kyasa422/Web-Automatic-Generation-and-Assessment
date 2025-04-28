import React, { useState } from 'react';
import { useForm, usePage } from "@inertiajs/react";
import DefaultLayout from "@/Layouts/DefaultLayout";
import lodash from "lodash"

const Ujian = () => {
    const { ulangan } = usePage().props;
    const shuffleAnswer = (data) => {
        const suffleData = lodash.shuffle(data)
        return suffleData
    }

    const { data, setData, post, processing } = useForm({
        answers: ulangan.question.question_inquiries.map(e => ({
            ...e,
            multiple_choice: shuffleAnswer(e.multiple_choice),
            question_inquiry_id: "",
            answer: "",
        })),
    });

    const handleChange = (inquiryId, value, index) => {
        const temp = [...data.answers]
        temp[index].question_inquiry_id = inquiryId
        temp[index].answer = value
    setData("answers", temp);
    };


    const handleSubmit = () => {
   
    
        if (data.answers.some(e => e.answer == "")) {
            alert("Silakan isi jawaban sebelum mengumpulkan.");
            return;
        }
        

    
        post(route('siswa.ujian.submit', ulangan.id), {
            onSuccess: (response) => {
                console.log("Berhasil kirim:", response);
                // Redirect or show success message here
            },
            onError: (errors) => {
                console.error("Ada error:", errors);
            },
            onFinish: () => {
                console.log("Selesai kirim");
            }
        });
    
    
    };

    return (
        <DefaultLayout>
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold mb-4">Ujian: {ulangan.question.subject.name}</h1>

                <div className="space-y-6">
                    {data.answers.map((inq, idx) => (
                        <div key={inq.id} className="border p-4 bg-white rounded">
                            <p className="font-semibold mb-2">{idx + 1}. {inq.question}</p>

                            {/* Soal dengan jawaban model dari guru → tampilkan textarea */}
                            {inq.multiple_choice.length === 0 ? (
                                <div className="mt-4">
                                    <textarea
                                        value={inq.answer}
                                        onChange={(e) => handleChange(inq.id, e.target.value, idx)}
                                        rows="4"
                                        className="w-full p-2 border rounded"
                                        placeholder="Tulis jawaban Anda di sini..."
                                    />
                                </div>
                            ) : (
                                // Kalau tidak ada jawaban default, berarti pilihan ganda
                                <div className="space-y-2 mt-2">
                                    {inq.multiple_choice.map(choice => (
                                        <label key={choice.id} className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                name={`answer-${idx}`}
                                                value={choice.text}
                                                checked={inq.answer === choice.text}
                                                onChange={() => handleChange(inq.id, choice.text, idx)}
                                            />
                                            <span>{choice.text}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={processing}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {processing ? "Mengirim..." : "Kumpulkan Jawaban"}
                </button>

            </div>
        </DefaultLayout>
    );
};

export default Ujian;
