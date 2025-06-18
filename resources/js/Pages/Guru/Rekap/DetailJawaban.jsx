import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { GoogleGenAI } from "@google/genai";
import { FaCheck, FaPencilAlt } from "react-icons/fa";
import moment from "moment";
import { CheckCircle, XCircle } from "lucide-react"; // lucide-react icon, ringan dan modern
import { Stars, TrendingUp } from "lucide-react"; // pakai icon Stars, mirip Gemini, modern
import Swal from "sweetalert2";
import { RiAiGenerate2 } from "react-icons/ri";

const DetailJawaban = () => {
    const { ulanganSettings, env: { MODEL_API_URL } } = usePage().props;
    const [isLoading, setIsLoading] = useState(null);
    const [edit, setEdit] = useState(null);
    const [score, setScore] = useState(null);
    const { data, setData, errors, processing, post } = useForm({
        nilai: null,
        ulangan_setting_id: ulanganSettings.id,
        user_id: ulanganSettings.ulangan_jawaban_has_one.user.id, // asumsi dari props
        detail: ulanganSettings.ulangan_jawaban_many.map((e) => ({
            questionId: e.question_inquiry_id,
            question: e.question_inquiry.question,
            answer: e.question_inquiry.answer,
            studentAnswer: e.answer,
            bobot: e.question_inquiry.bobot, // <-- Tambahkan ini
            multipleChoice: e.question_inquiry.multiple_choice,
            isCorrect: null,
            note: null,
            score: null,
            label: e.question_inquiry.label,
        })),
    });

    console.log(ulanganSettings);

    const totalScore = data.detail.reduce(
        (sum, item) =>
            sum + (item.score !== null ? item.score * item.bobot : 0),
        0
    );

    const maxScore = data.detail.reduce(
        (sum, item) => sum + (item.bobot ?? 1),
        0
    );

    // console.log(ulanganSettings)

    const scoreWithCosine = async (index) => {
        const item = data.detail[index];
        setIsLoading(`COSINE_${index}`);
        try {
            const response = await fetch(`${MODEL_API_URL}/score`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    answer_student: item.studentAnswer,
                    answer_key: item.answer,
                }),
            });

            if (!response.ok) throw new Error("Gagal menilai");

            const result = await response.json();

            const threshold = 0.3;
            const cosine = result.filtered_cosine_similarity ?? 0;
            const finalScore = cosine >= threshold ? cosine : 0;

            const noteFromGemini = await getNoteFromGemini({
                studentAnswer: item.studentAnswer,
                answerKey: item.answer,
                cosine: cosine,
            });

            const temp = [...data.detail];
            const bobot = temp[index].bobot ?? 1;

            temp[index].score = finalScore;
            temp[index].finalScore = finalScore * bobot;
            temp[index].isCorrect = finalScore > 0.5;
            temp[index].note = noteFromGemini; // <- pakai note dari Gemini

            const totalScore = temp.reduce(
                (sum, item) => sum + (item.finalScore ?? 0),
                0
            );

            setData((prev) => ({
                ...prev,
                detail: temp,
                nilai: totalScore?.toFixed(2),
            }));
        } catch (error) {
            console.error("Error scoring:", error);
            alert("Gagal menilai jawaban");
        }
        setIsLoading(null);
    };

    const getNoteFromGemini = async ({ studentAnswer, answerKey, cosine }) => {
        const model = new GoogleGenAI({
            apiKey: "AIzaSyBfeeUiCYcPR_xkHGCPshe2GnN7c_Exd7Y", // ganti jika perlu
            
   
        });

        const schema = {
            type: "object",
            properties: {
                note: {
                    type: "string",
                    description:
                        "Berikan masukan atau saran terhadap jawaban siswa dalam bahasa Indonesia",
                },
            },
            required: ["note"],
        };
        const prompt = {
            studentAnswer,
            answerKey,
            cosine,
        };
        const response = await model.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `Buatlah saran atau catatan untuk jawaban siswa berikut:\n\n
                            Jawaban Siswa: "${studentAnswer}"\nKunci Jawaban: 
                            "${answerKey}"\nSkor Cosine Similarity: ${cosine?.toFixed(  4)}\n\n
                            Berikan catatan singkat dalam bahasa Indonesia.`,
                        },
                    ],
                },
            ],
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const parsed = JSON.parse(response.text);
        return parsed.note || "Tidak ada catatan.";
    };

    const correctWithGemini = async () => {
        setIsLoading("CORRECT_GEMINI");
        try {
            const model = new GoogleGenAI({
                apiKey: "AIzaSyBfeeUiCYcPR_xkHGCPshe2GnN7c_Exd7Y",
                        
                generationConfig: {
                        temperature: 0.0,
                        topP: 0.95,
                        topK: 1,
                        maxOutputTokens: 8192,
                        responseMimeType: "application/json",
                    },
            });
            const contents = data.detail.map((e) => ({
                questionId: e.questionId,
                question: e.question,
                correctAnswer: e.answer,
                studentAnswer: e.studentAnswer,
            }));

            const schema = {
                type: "object",
                properties: {
                    response: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                question_id: {
                                    type: "string",
                                },
                                isCorrect: {
                                    type: "boolean",
                                    description:
                                        "Mark the correct answer if the score is more than 0.5",
                                },
                                score: {
                                    type: "number",
                                    description: "score range from 0.0 to 1.0",
                                },
                                note: {
                                    type: "string",
                                    description:
                                        "Give advice on students' answers in Indonesian",
                                },
                            },
                            required: [
                                "question_id",
                                "isCorrect",
                                "score",
                                "note",
                            ],
                        },
                    },
                },
            };

            const response = await model.models.generateContent({
                model: "gemini-2.0-flash",
                // model: "gemini-2.5-pro-exp-03-25",

                contents: JSON.stringify(contents),
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                },
            });

            const jsonParse = JSON.parse(response.text);
            const temp = [...data.detail];
            jsonParse.response.map((e) => {
                const index = temp.findIndex(
                    (a) => a.questionId === e.question_id
                );
                if (index > -1) {
                    const bobot = temp[index].bobot ?? 1; // default ke 1 jika tidak ada
                    temp[index].isCorrect = e.isCorrect;
                    temp[index].score = e.score;
                    temp[index].note = e.note;
                    temp[index].finalScore = e.score * bobot; // <-- HITUNG FINAL SCORE DI SINI
                }
            });

            // Hitung ulang total score setelah update semua
            const totalScore = temp.reduce(
                (sum, item) => sum + (item.finalScore ?? 0),
                0
            );

            setData((prev) => ({
                ...prev,
                detail: temp,
                nilai: totalScore?.toFixed(2), // atau parseFloat kalau ingin float asli
            }));
            console.log("berhasil", jsonParse.response);
        } catch (e) {
            console.error(e);
            alert("Ada kesalahan pada server!");
        }
        setIsLoading(null);
    };

    const changeCorrect = (index, correct) => {
        const temp = [...data.detail];
        temp[index].isCorrect = correct;
        setData((prev) => ({ ...prev, detail: temp }));
    };

    const changeNote = (index, note) => {
        const temp = [...data.detail];
        temp[index].note = note;
        setData((prev) => ({ ...prev, detail: temp }));
    };

    const changeScore = (index, newScore) => {
        const temp = [...data.detail];
        const bobot = temp[index].bobot ?? 1;
        const scoreVal = parseFloat(newScore);

        temp[index].score = scoreVal;
        temp[index].finalScore = scoreVal * bobot;
        temp[index].isCorrect = scoreVal > 0.5;

        // Hitung ulang total score
        const totalScore = temp.reduce(
            (sum, item) => sum + (item.finalScore ?? 0),
            0
        );

        setData((prev) => ({
            ...prev,
            detail: temp,
            nilai: totalScore?.toFixed(2),
        }));
    };

    const submitAssessment = () => {
        setIsLoading("SUBMIT");

        const timeout = setTimeout(() => {
            setIsLoading(null);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Gagal menyimpan penilaian! Waktu habis (10 detik). Silakan coba lagi.",
            });
        }, 10000);

        post(route("assessments.store"), {
            onSuccess: () => {
                clearTimeout(timeout);
                setIsLoading(null);
                Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text: "Penilaian berhasil disimpan!",
                });
            },
            onError: (errors) => {
                clearTimeout(timeout);
                setIsLoading(null);
                console.error(errors);
                Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    text: "Gagal menyimpan penilaian!",
                });
            },
        });
    };

    return (
        <DefaultLayout>
            <div className="p-6 max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-6">
                    Detail Jawaban Siswa
                </h1>
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
                        <div>
                            <p>
                                <span className="font-semibold">
                                    Nama Siswa:
                                </span>{" "}
                                {
                                    ulanganSettings.ulangan_jawaban_has_one.user
                                        .name
                                }
                            </p>
                            <p>
                                <span className="font-semibold">
                                    Mata Pelajaran:
                                </span>{" "}
                                {ulanganSettings.question.subject.name}
                            </p>
                            <p>
                                <span className="font-semibold">
                                    Tanggal Dikerjakan :{" "}
                                </span>
                                {moment(
                                    ulanganSettings.ulangan_jawaban_has_one
                                        .created_at
                                ).format("DD MMMM YYYY HH:mm")}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div></div>
                            <div>
                                <p className="font-semibold mb-1">
                                    Nilai Otomatis:
                                </p>
                                <div className="mt-2 flex flex-col gap-2">
                                    <button
                                        className="btn btn-sm btn-outline"
                                        style={{
                                            borderColor: "#5C6BC0",
                                            color: "#5C6BC0",
                                        }} // warna biru-ungu Gemini
                                        disabled={isLoading != null}
                                        onClick={correctWithGemini}
                                    >
                                        {isLoading === "CORRECT_GEMINI" ? (
                                            <span className="loading loading-spinner loading-xs mr-2"></span>
                                        ) : (
                                            <Stars className="w-4 h-4 mr-2" />
                                        )}
                                        <span>
                                            Koreksi semua soal menggunakan Ai
                                        </span>
                                    </button>
                                    {/* Tombol Cosine Similarity */}
                                    {/* <button
                                        className="btn btn-sm btn-outline"
                                        style={{
                                            borderColor: "#00ACC1",
                                            color: "#00ACC1",
                                        }}
                                    >
                                        <TrendingUp className="w-4 h-4 mr-2" />

                                        <span>
                                            Koreksi soal menggunakan cosine
                                            similarity
                                        </span>
                                    </button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {data.detail.length > 0 ? (
                    data.detail.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 mb-6 space-y-4"
                        >
                            {/* Header */}
                            <div className="flex justify-between flex-wrap gap-4 items-center bg-sky-100 text-sky-800 px-5 py-3 rounded-xl">
                                <div>
                                    <h2 className="font-semibold text-lg">
                                        Soal {index + 1}
                                    </h2>
                                    <p className="text-sm">
                                        Bobot:{" "}
                                        <span className="font-semibold">
                                            {item.bobot}
                                        </span>
                                    </p>
                                </div>
                                <div className="text-left">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span>Skor :</span>
                                        {score === index ? (
                                            <input
                                                type="number"
                                                step="0.01"
                                                min={0}
                                                max={1}
                                                className="input input-sm border rounded w-20 text-right"
                                                defaultValue={item.score ?? 0}
                                                onBlur={(e) => {
                                                    const value = parseFloat(
                                                        e.target.value
                                                    );
                                                    if (
                                                        isNaN(value) ||
                                                        value < 0 ||
                                                        value > 1
                                                    ) {
                                                        Swal.fire({
                                                            icon: "error",
                                                            title: "Skor tidak valid",
                                                            text: "Masukkan nilai antara 0 dan 1.",
                                                        });
                                                        e.target.value =
                                                            item.score ?? 0;
                                                        return;
                                                    }
                                                    changeScore(index, value);
                                                    setScore(null);
                                                }}
                                            />
                                        ) : (
                                            <span className="font-semibold">
                                                {item.score !== null
                                                    ? item.score?.toFixed(2)
                                                    : "Belum ada"}
                                            </span>
                                        )}

                                        <button
                                            className="btn btn-sm btn-ghost hover:bg-gray-100 rounded-full"
                                            onClick={() =>
                                                setScore(
                                                    score === index
                                                        ? null
                                                        : index
                                                )
                                            }
                                        >
                                            {score === index ? (
                                                <FaCheck />
                                            ) : (
                                                <FaPencilAlt />
                                            )}
                                        </button>
                                    </div>

                                    <p className="text-sm mt-1">
                                        Nilai:
                                        <span className="font-semibold ml-1">
                                            {item.score !== null
                                                ? (
                                                    item.bobot * item.score
                                                )?.toFixed(2)
                                                : "Belum ada"}
                                        </span>
                                    </p>
                                </div>

                                {/* Penilaian Manual */}
                                <div className="flex items-center gap-4">
                                    {item.multipleChoice.length === 0 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                scoreWithCosine(index)
                                            }
                                            disabled={
                                                isLoading === `COSINE_${index}`
                                            }
                                            className="btn btn-sm flex items-center gap-2 border border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 transition rounded-full px-4 py-1 disabled:opacity-50"
                                        >
                                            {isLoading === `COSINE_${index}` ? (
                                                <>
                                                    <svg
                                                        className="animate-spin h-4 w-4 text-sky-600"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8v8H4z"
                                                        />
                                                    </svg>
                                                    <span>Loading...</span>
                                                </>
                                            ) : (
                                                <>
                                                    {/* {
                                                        item.label

                                                    } */}

                                                    <RiAiGenerate2 className="text-lg" />
                                                    <span>
                                                        Koreksi soal i  ni dengan Ai
                                                    </span>
                                                </>
                                            )}
                                        </button>
                                    )}

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`multiple-${index}`}
                                            className="hidden"
                                            checked={item.isCorrect === true}
                                            onChange={() =>
                                                changeCorrect(index, true)
                                            }
                                        />
                                        <div
                                            className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm transition ${item.isCorrect === true
                                                ? "bg-green-100 border-green-500 text-green-700"
                                                : "border-gray-300 text-gray-500"
                                                }`}
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Benar
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`multiple-${index}`}
                                            className="hidden"
                                            checked={item.isCorrect === false}
                                            onChange={() =>
                                                changeCorrect(index, false)
                                            }
                                        />
                                        <div
                                            className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm transition ${item.isCorrect === false
                                                ? "bg-red-100 border-red-500 text-red-700"
                                                : "border-gray-300 text-gray-500"
                                                }`}
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Salah
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Pertanyaan */}
                            <div>
                                <p className="text-gray-800">
                                    <strong>Pertanyaan:</strong>
                                </p>
                                <p className="text-gray-700">{item.question}</p>
                            </div>

                            {/* Jawaban Siswa */}
                            <div>
                                <p className="text-gray-800">
                                    <strong>Jawaban Siswa:</strong>
                                </p>
                                <p className="text-gray-700">
                                    {item.studentAnswer}
                                </p>
                            </div>

                            {/* Kunci Jawaban */}
                            <div>
                                <p className="text-gray-800 font-semibold">
                                    {item.multipleChoice.length === 0
                                        ? "Kunci Jawaban Essay:"
                                        : "Kunci Jawaban PG:"}
                                </p>
                                <ul className="list-disc pl-5 text-gray-700">
                                    {item.answer &&
                                        typeof item.answer === "string" && (
                                            <li>{item.answer}</li>
                                        )}
                                    {item.multipleChoice.map((choice, i) => (
                                        <li
                                            key={i}
                                            className={
                                                choice.isCorrect
                                                    ? "text-green-600 font-semibold"
                                                    : ""
                                            }
                                        >
                                            {choice.text}{" "}
                                            {choice.isCorrect ? "(Benar)" : ""}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Catatan */}
                            {item.note && item.multipleChoice.length === 0 && (
                                <div className="mt-2 flex justify-between items-start gap-4">
                                    {edit === index ? (
                                        <textarea
                                            className="textarea textarea-bordered w-full rounded-md border border-gray-300 p-2 text-gray-700"
                                            defaultValue={item.note}
                                            onChange={(e) =>
                                                changeNote(
                                                    index,
                                                    e.currentTarget.value
                                                )
                                            }
                                        />
                                    ) : (
                                        <div>
                                            <strong className="text-gray-800">
                                                Catatan:
                                            </strong>
                                            <p className="text-gray-700">
                                                {item.note}
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        className="btn btn-sm btn-ghost hover:bg-gray-100 rounded-full"
                                        onClick={() =>
                                            setEdit(
                                                edit === index ? null : index
                                            )
                                        }
                                    >
                                        {edit === index ? (
                                            <FaCheck />
                                        ) : (
                                            <FaPencilAlt />
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-red-500 text-center">
                        Tidak ada data jawaban ditemukan.
                    </p>
                )}

                {data.detail.length > 0 && (
                    <div className=" p-6 bg-slate-50 border border-blue-200 rounded-lg shadow-inner text-green-800 text-lg font-semibold text-center">
                        Total Nilai Akhir: {totalScore ?  parseFloat(totalScore).toFixed(2) : 0} dari{" "}
                        {maxScore ? parseFloat(maxScore).toFixed(2) : 0}
                        <button
                            className="btn btn-md btn-ghost bg-blue-500 text-white ml-5 gap-2"
                            onClick={submitAssessment}
                            disabled={isLoading !== null}
                        >
                            {isLoading === "SUBMIT" ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8H4z"
                                        ></path>
                                    </svg>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    Simpan Penilaian
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
};

export default DetailJawaban;

{
    /* <div className="flex justify-end mt-6">
        <button
          className="btn btn-primary"
          onClick={() => window.history.back()}
        >
          Kembali
        </button>
      </div> */
}
