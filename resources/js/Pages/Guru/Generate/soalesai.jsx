import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import DefaultLayout from "@/Layouts/DefaultLayout";
import mammoth from "mammoth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";
import { FaCheck, FaPencilAlt } from "react-icons/fa";
import { RiAiGenerate2 } from "react-icons/ri";
import SweetAlert from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Esai = () => {
    const { subject } = usePage().props;
    const swal = withReactContent(SweetAlert);
    const geminiApiKey = "AIzaSyDJIobzcimNXBDpamTebwuicdLUm8Sl6Bo";
    const [data, setData] = useState({
        kelas: "",
        mapel: "",
        tingkat: "",
        jumlahSoalEsai: "",
        jumlahSoalPG: "",
        bahasa: "indonesia",
        tingkatPendidikan: "vocational high school",
        kesulitan: "MEDIUM",
    });

    const [response, setResponse] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [fileContent, setFileContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [loadingRegenerate, setLoadingRegenerate] = useState(null);
    const [editQuestion, setEditQuestion] = useState(null);
    const {
        data: question,
        setData: setQuestion,
        post,
        processing,
    } = useForm({
        response: [],
        classLevel: "",
        subjectId: "",
        examLevel: false,
    });
    const [editBobot, setEditBobot] = useState(null);
    const [totalBobot, setTotalBobot] = useState(0);
    React.useEffect(() => {
        const total = question.response.reduce((sum, q) => {
            return sum + parseFloat(q.bobot || 0);
        }, 0);
        setTotalBobot(total);
    }, [question.response]);
    



    function handleChange(e) {
        const { name, value } = e.target;
        if (name === "tingkat") {
            if (value === "ulangan tengah semester") {
                setQuestion("examLevel", false);
            } else {
                setQuestion("examLevel", true);
            }
        }

        if (name === "mapel") {
            const selectedSubject = subject.find((e) => e.id === value);
            if (selectedSubject) {
                setQuestion("subjectId", selectedSubject.id);
            }
        }

        if (name === "kelas") {
            setQuestion("classLevel", parseInt(value) - 9);
        }

        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadedFile(file);

        // Handle different file types
        if (file.type === "application/pdf") {
            // Placeholder for PDF parsing
            setFileContent("PDF parsing not implemented in this example");
        } else if (
            file.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            file.type === "application/msword"
        ) {
            // For Word documents
            const reader = new FileReader();
            reader.onload = async (e) => {
                const arrayBuffer = e.target.result;
                try {
                    const result = await mammoth.extractRawText({
                        arrayBuffer: arrayBuffer,
                    });
                    setFileContent(result.value);
                } catch (error) {
                    console.error("Error parsing document:", error);
                    setFileContent("Error parsing document");
                }
            };
            reader.readAsArrayBuffer(file);
        } else if (file.type === "text/plain") {
            // For text files
            const reader = new FileReader();
            reader.onload = (e) => {
                setFileContent(e.target.result);
            };
            reader.readAsText(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            try {
                const genAI = new GoogleGenerativeAI(geminiApiKey);
                const model = genAI.getGenerativeModel({
                    model: "gemini-2.0-flash",
                    generationConfig: {
                        temperature: 1,
                        topP: 0.95,
                        topK: 40,
                        maxOutputTokens: 8192,
                        responseMimeType: "application/json",
                    },
                });

                let prompt = `{
                    "subject": "${
                        subject.find((e) => e.id === data.mapel).name
                    }",
                    "classLevel": ${data.kelas},
                    "educationLevel": "vocational high school",
                    "numberOfQuestion": ${data.jumlahSoalEsai || 0},
                    "multipleChoiceCount": ${data.jumlahSoalPG || 0},
                    "language": "indonesia",
                    "questionDifficultyLevel": "${data.kesulitan}",
                    "type": ["ESSAY", "MULTIPLE_CHOICE"],
                    "level": "${data.tingkat}"
                }`;

                if (fileContent) {
                    prompt += `\n\nMateri: ${fileContent.substring(0, 1000)}`;
                }

                prompt += `\n\nUntuk setiap pertanyaan pilihan ganda, berikan empat pilihan jawaban, dengan tepat satu jawaban yang benar dan tiga jawaban yang salah.
                Generate untuk soal esai dulu baru soal multiplechoice.
                Jumlah soal esai adalah ${data.jumlahSoalEsai} dan 
                Jumlah soal pilihan ganda ${data.jumlahSoalPG}.
                Pastikan total bobot seluruh (essay dan multiple_choice) berjumlah harus 100 tidak kurang dan tidak lebih, dan setiap soal harus memiliki bobot lebih dari 0.
                Format JSON sesuai dengan schema berikut:
                {
                  "response": [
                    {
                      "type": "ESSAY",
                      "question": "pertanyaan esai...",
                      "answer": "jawaban esai...",
                        "bobot": ""
                    },
                    {
                      "type": "MULTIPLE_CHOICE",
                      "question": "pertanyaan pilihan ganda...",
                        "multipleChoice": [
                        {
                          "text": "pilihan A",
                          "isCorrect": true
                        },
                        {
                          "text": "pilihan B",
                          "isCorrect": false
                        },
                        {
                          "text": "pilihan C",
                          "isCorrect": false
                        },
                        {
                          "text": "pilihan D",
                          "isCorrect": false
                        }
                      ],
                        "bobot": ""
                     
                    },
                    
                  ]
                }`;

                const result = await model.generateContent(prompt);
                const responseText = result.response.text();
                const jsonResponse = JSON.parse(responseText);
                setQuestion("response", jsonResponse.response);
                console.log("Generated response:", jsonResponse);

            } catch (error) {
                console.error("Error parsing JSON response:", error);
                setResponse({
                    error: "Failed to parse response",
                    raw: responseText,
                });
            }
        } catch (error) {
            console.error("Generation error:", error);
            setResponse({ error: "Failed to generate content" });
        } finally {
            setIsLoading(false);
        }
    };

    const reGenerate = async (index) => {
        setLoadingRegenerate(index);
        try {
            let contents = {
                subject: subject.find((e) => e.id === data.mapel).name,
                classLevel: data.kelas,
                educationLevel: "vocational high school",
                language: "indonesia",
                questionDifficultyLevel: data.kesulitan,
            };

            let responseSchema;
            if (question.response[index].type === "ESSAY") {
                responseSchema = {
                    type: "object",
                    properties: {
                        question: {
                            type: "string",
                        },
                        answer: {
                            type: "string",
                        },
                    },
                    required: ["question", "answer"],
                };
            } else {
                contents = {
                    ...contents,
                    totalNumberOfMultipleChoice: 4,
                };
                responseSchema = {
                    type: "object",
                    properties: {
                        question: {
                            type: "string",
                        },
                        multipleChoice: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    isCorrect: {
                                        type: "boolean",
                                    },
                                    text: {
                                        type: "string",
                                    },
                                },
                                required: ["isCorrect", "text"],
                            },
                        },
                    },
                    required: ["question", "multipleChoice"],
                };
            }
            const model = new GoogleGenAI({ apiKey: geminiApiKey });
            const response = await model.models.generateContent({
                model: "gemini-2.0-flash",
                contents: JSON.stringify(contents),
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                },
            });

            const responseText = JSON.parse(response.text);
            const temp = { ...question };
            temp.response[index] = {
                type: question.response[index].type,
                ...responseText,
            };
            setQuestion(temp);
        } catch (e) {
            console.error(e);
            alert("Gagal generate ulang");
        }
        setLoadingRegenerate(null);
    };

    const handleChangeQuestion = (value, index, type) => {
        const temp = { ...question };
    
        if (type === "QUESTION") {
            temp.response[index].question = value;
        } else if (type === "ANSWER") {
            temp.response[index].answer = value;
        } else if (type === "BOBOT") {
            const newBobot = parseFloat(value || 0);
    
            // Hitung total tanpa bobot lama di index ini
            const currentTotal = temp.response.reduce((sum, q, i) => {
                if (i === index) return sum;
                return sum + parseFloat(q.bobot || 0);
            }, 0);
    
            if (currentTotal + newBobot > 100) {
                swal.fire({
                    icon: "error",
                    title: "Total bobot melebihi 100",
                    text: `Bobot saat ini: ${currentTotal}, bobot baru akan menjadi: ${currentTotal + newBobot}`,
                });
                return;
            }
    
            temp.response[index].bobot = newBobot;
        }
    
        // Hitung ulang total bobot
        const newTotal = temp.response.reduce((sum, q) => sum + parseFloat(q.bobot || 0), 0);
        setTotalBobot(newTotal);
    
        setQuestion(temp);
    };
    

    const handleChangeMultipleChoice = (value, index, indexChoice) => {
        const temp = { ...question };
        temp.response[index].multipleChoice[indexChoice].text = value;
        setQuestion(temp);
    };

    const handleOnSaveQuestion = () => {
        const totalBobot = question.response.reduce((sum, q) => {
            return sum + parseFloat(q.bobot || 0);
        }, 0);
    
        if (totalBobot !== 100) {
            swal.fire({
                icon: "error",
                title: "Total bobot harus tepat 100!",
                text: `Saat ini total bobot adalah ${totalBobot}. Mohon sesuaikan.`,
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 4000,
            });
            return; // Jangan submit
        }
    
        post(route("guru.generated-soal.store"), {
            onSuccess: () => {
                swal.fire({
                    icon: "success",
                    title: "Berhasil menambahkan soal",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                });
            },
        });
    };
    

    return (
        <DefaultLayout>
            <div className="flex flex-col gap-9">
                {/* Exam Generator Form */}
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Generate Soal Ujian
                        </h3>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="p-6.5">
                            {/* Number of Essay Questions */}
                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Jumlah Soal Esai
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={data.jumlahSoalEsai}
                                    onChange={handleChange}
                                    name="jumlahSoalEsai"
                                >
                                    <option value="" disabled selected>
                                        Pilih jumlah soal esai
                                    </option>
                                    <option value="0">0</option>
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                </select>
                            </div>

                            {/* Number of Multiple Choice Questions */}
                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Jumlah Soal Pilihan Ganda
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={data.jumlahSoalPG}
                                    onChange={handleChange}
                                    name="jumlahSoalPG"
                                >
                                    <option value="" disabled selected>
                                        Pilih jumlah soal pilihan ganda
                                    </option>
                                    <option value="0">0</option>
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                </select>
                            </div>

                            {/* Material Upload */}
                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Upload Materi (PDF/Docx/Txt)
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.docx,.doc,.txt"
                                    onChange={handleFileUpload}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                {uploadedFile && (
                                    <p className="mt-2 text-sm text-gray-500">
                                        File terunggah: {uploadedFile.name}
                                    </p>
                                )}
                            </div>

                            {/* Class Selection */}
                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Kelas
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={data.kelas}
                                    onChange={handleChange}
                                    name="kelas"
                                >
                                    <option value="" disabled selected>
                                        Pilih Kelas
                                    </option>
                                    <option value="10">X (Sepuluh)</option>
                                    <option value="11">XI (Sebelas)</option>
                                    <option value="12">XII (Duabelas)</option>
                                </select>
                            </div>

                            {/* Subject Selection */}
                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Mata Pelajaran
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={data.mapel}
                                    onChange={handleChange}
                                    name="mapel"
                                >
                                    <option value="" disabled selected>
                                        Pilih Mata Pelajaran
                                    </option>
                                    {subject.map((e, index) => (
                                        <option key={index} value={e.id}>
                                            {e.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Test Level Selection */}
                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Tingkat Ujian
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={data.tingkat}
                                    onChange={handleChange}
                                    name="tingkat"
                                >
                                    <option value="" disabled selected>
                                        Pilih Tingkatan
                                    </option>
                                    <option value="ulangan tengah semester">
                                        Ulangan Tengah Semester
                                    </option>
                                    <option value="ulangan akhir semester">
                                        Ulangan Akhir Semester
                                    </option>
                                </select>
                            </div>

                            {/* Difficulty Level */}
                            {/* <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Tingkat Kesulitan
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={data.kesulitan}
                                    onChange={handleChange}
                                    name="kesulitan"
                                >
                                    <option value="EASY">Mudah</option>
                                    <option value="MEDIUM" selected>
                                        Sedang
                                    </option>
                                    <option value="HARD">Sulit</option>
                                </select>
                            </div> */}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:bg-opacity-50"
                            >
                                {isLoading ? "Generating..." : "Generate Soal"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results Section */}
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Hasil Generate Soal 
                            <div className="mb-4 text-right">
                            <strong>Total Bobot: </strong>
                            <span
                                style={{
                                    color: totalBobot > 100 ? 'red' : totalBobot === 100 ? 'green' : 'orange',
                                }}
                            >
                                {totalBobot}
                            </span>
                            / 100
                          </div>


                        </h3>
                    </div>
                    <div className="p-6.5">
                        {isLoading ? (
                            <div className="text-center py-8">
                                <div className="spinner" />
                                <p className="mt-4">Generating questions...</p>
                            </div>
                        ) : question.response.length > 0 ? (
                            <>
                                <div className="space-y-6">
                                    {question.response.map((item, index) => (
                                        <div
                                            key={index}
                                            className="border p-4 rounded-lg"
                                        >
                                        
                    

                                            <h3 className="font-bold mb-2">
                                                <div className="flex justify-between items-center">
                                                    <span>
                                                        Soal {index + 1} (
                                                        {item.type === "ESSAY"
                                                            ? "Esai"
                                                            : "Pilihan Ganda"}
                                                        )
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            className="btn btn-circle btn-sm btn-ghost"
                                                            onClick={() =>
                                                                setEditQuestion(
                                                                    (prev) =>
                                                                        prev ===
                                                                        index
                                                                            ? null
                                                                            : index
                                                                )
                                                            }
                                                        >
                                                            {editQuestion !=
                                                            index ? (
                                                                <FaPencilAlt />
                                                            ) : (
                                                                <FaCheck />
                                                            )}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-circle btn-sm btn-ghost"
                                                            onClick={() =>
                                                                reGenerate(
                                                                    index
                                                                )
                                                            }
                                                            disabled={
                                                                loadingRegenerate !=
                                                                null
                                                            }
                                                        >
                                                            {loadingRegenerate !=
                                                            null ? (
                                                                loadingRegenerate ===
                                                                index ? (
                                                                    <div className="loading"></div>
                                                                ) : (
                                                                    <RiAiGenerate2 />
                                                                )
                                                            ) : (
                                                                <RiAiGenerate2 />
                                                            )}
                                                        </button>
                                                        <div className="mb-2 flex items-center justify-between">
    <span className="font-medium">Bobot:</span>
    <div className="flex gap-2 items-center">
        {editBobot !== index ? (
            <span>{item.bobot ?? 1}</span>
        ) : (
            <input
                type="number"
                min="1"
                className="input input-sm input-bordered w-24"
                onChange={(e) =>
                    handleChangeQuestion(e.currentTarget.value, index, "BOBOT")
                }
                defaultValue={item.bobot ?? 1}
            />
        )}

        <button
            type="button"
            className="btn btn-circle btn-sm btn-ghost"
            onClick={() =>
                setEditBobot((prev) => (prev === index ? null : index))
            }
        >
            {editBobot !== index ? <FaPencilAlt /> : <FaCheck />}
        </button>
    </div>
</div>


                                                    </div>
                                                </div>
                                            </h3>
                                            <p className="mb-2">
                                                <span className="font-medium">
                                                    Pertanyaan:
                                                </span>{" "}
                                                {editQuestion != index ? (
                                                    <span>{item.question}</span>
                                                ) : (
                                                    <input
                                                        className="input input-sm input-bordered w-full"
                                                        onChange={(e) =>
                                                            handleChangeQuestion(
                                                                e.currentTarget
                                                                    .value,
                                                                index,
                                                                "QUESTION"
                                                            )
                                                        }
                                                        defaultValue={
                                                            item.question
                                                        }
                                                    />
                                                )}
                                            </p>

                                            {item.type ===
                                                "MULTIPLE_CHOICE" && (
                                                <div className="mb-2">
                                                    <div className="font-medium mb-1">
                                                        Pilihan:
                                                    </div>
                                                    <ul className="list-disc ml-6">
                                                        {item.multipleChoice?.map(
                                                            (
                                                                choice,
                                                                choiceIndex
                                                            ) => (
                                                                <li
                                                                    key={
                                                                        choiceIndex
                                                                    }
                                                                    className={
                                                                        choice.isCorrect
                                                                            ? "text-green-600 font-medium"
                                                                            : ""
                                                                    }
                                                                >
                                                                    {editQuestion !=
                                                                    index ? (
                                                                        choice.text
                                                                    ) : (
                                                                        <input
                                                                            className="input input-sm input-bordered w-full"
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleChangeMultipleChoice(
                                                                                    e
                                                                                        .currentTarget
                                                                                        .value,
                                                                                    index,
                                                                                    choiceIndex
                                                                                )
                                                                            }
                                                                            defaultValue={
                                                                                choice.text
                                                                            }
                                                                        />
                                                                    )}{" "}
                                                                    {choice.isCorrect &&
                                                                        "(Jawaban Benar)"}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            )}

                                            {item.type === "ESSAY" ? (
                                                <div>
                                                    <span className="font-medium">
                                                        Jawaban:
                                                    </span>{" "}
                                                    {editQuestion != index ? (
                                                        <span>
                                                            {item.answer}
                                                        </span>
                                                    ) : (
                                                        <input
                                                            className="input input-sm input-bordered w-full"
                                                            onChange={(e) =>
                                                                handleChangeQuestion(
                                                                    e
                                                                        .currentTarget
                                                                        .value,
                                                                    index,
                                                                    "ANSWER"
                                                                )
                                                            }
                                                            defaultValue={
                                                                item.answer
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            ) : null}
                                        </div>
                                    ))}

                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handleOnSaveQuestion}
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <div className="loading"></div>
                                            ) : null}
                                            <span>Simpan</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h4 className="font-medium mb-2">
                                        Raw JSON Response:
                                    </h4>
                                    <pre className="bg-gray-100 p-4 rounded overflow-auto  dark:bg-gray-800 dark:text-gray-200">
                                        {JSON.stringify(response, null, 2)}
                                    </pre>
                                </div>
                            </>
                        ) : (
                            <p className="text-center py-8 text-gray-500">
                                Hasil generate soal akan ditampilkan di sini
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Esai;
