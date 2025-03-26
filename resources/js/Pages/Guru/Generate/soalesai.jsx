import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import DefaultLayout from "@/Layouts/DefaultLayout";
import mammoth from "mammoth";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Esai = () => {
    const [data, setData] = useState({
        kelas: "",
        mapel: "",
        tingkat: "",
        jumlahSoalEsai: "",
        jumlahSoalPG: "",
        bahasa: "indonesia",
        tingkatPendidikan: "vocational high school",
        kesulitan: "MEDIUM"
    });

    const [response, setResponse] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [fileContent, setFileContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value
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
            // Use your API key
            const genAI = new GoogleGenerativeAI(
                "AIzaSyDJIobzcimNXBDpamTebwuicdLUm8Sl6Bo"
            );

            // Configure the generative model with JSON schema response format
            const model = genAI.getGenerativeModel({ 
                model: "gemini-2.0-flash",
                generationConfig: {
                    temperature: 1,
                    topP: 0.95,
                    topK: 40,
                    maxOutputTokens: 8192,
                    responseMimeType: "application/json"
                }
            });

            // Build the prompt with proper formatting
            let prompt = `{
                "subject": "${data.mapel}",
                "classLevel": ${data.kelas},
                "educationLevel": "vocational high school",
                "numberOfQuestion": ${data.jumlahSoalEsai || 0},
                "multipleChoiceCount": ${data.jumlahSoalPG || 0},
                "language": "indonesia",
                "questionDifficultyLevel": "${data.kesulitan}",
                "type": ["ESSAY", "MULTIPLE_CHOICE"],
                "level": "${data.tingkat}"
            }`;

            // Add material context if available
            if (fileContent) {
                prompt += `\n\nMateri: ${fileContent.substring(0, 1000)}`;
            }

            prompt += `\n\nUntuk setiap pertanyaan pilihan ganda, berikan empat pilihan jawaban, dengan tepat satu jawaban yang benar dan tiga jawaban yang salah.
            Generate untuk soal esai dulu baru soal multiplechoice.
            Jumlah soal esai adalah ${data.jumlahSoalEsai} dan 
            Jumlah soal pilihan ganda ${data.jumlahSoalPG}.
            Format JSON sesuai dengan schema berikut:
            {
              "response": [
                {
                  "type": "ESSAY",
                  "question": "pertanyaan esai...",
                  "answer": "jawaban esai..."
                },
                {
                  "type": "MULTIPLE_CHOICE",
                  "question": "pertanyaan pilihan ganda...",
                  "answer": "jawaban pilihan ganda...",
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
                 
                }
              ]
            }`;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            
            // Parse the JSON response
            try {
                const jsonResponse = JSON.parse(responseText);
                setResponse(jsonResponse);
                console.log("Generated response:", jsonResponse);
            } catch (error) {
                console.error("Error parsing JSON response:", error);
                setResponse({ error: "Failed to parse response", raw: responseText });
            }
        } catch (error) {
            console.error("Generation error:", error);
            setResponse({ error: "Failed to generate content" });
        } finally {
            setIsLoading(false);
        }
    };

    // Function to render the generated questions in a readable format
    const renderQuestions = () => {
        if (!response || !response.response) return <p>No questions generated yet.</p>;
        
        return (
            <div className="space-y-6">
                {response.response.map((item, index) => (
                    <div key={index} className="border p-4 rounded-lg">
                        <h3 className="font-bold mb-2">Soal {index + 1} ({item.type === "ESSAY" ? "Esai" : "Pilihan Ganda"})</h3>
                        <p className="mb-2"><span className="font-medium">Pertanyaan:</span> {item.question}</p>
                        
                        {item.type === "MULTIPLE_CHOICE" && (
                            <div className="mb-2">
                                <div className="font-medium mb-1">Pilihan:</div>
                                <ul className="list-disc ml-6">
                                    {item.multipleChoice?.map((choice, choiceIndex) => (
                                        <li key={choiceIndex} className={choice.isCorrect ? "text-green-600 font-medium" : ""}>
                                            {choice.text} {choice.isCorrect && "(Jawaban Benar)"}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        <div>
                            <span className="font-medium">Jawaban:</span> {item.answer}
                        </div>
                    </div>
                ))}
            </div>
        );
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
                                    <option value="ilmu pengetahuan alam">
                                        Ilmu Pengetahuan Alam
                                    </option>
                                    <option value="bahasa indonesia">
                                        Bahasa Indonesia
                                    </option>
                                    <option value="bahasa inggris">
                                        Bahasa Inggris
                                    </option>
                                    <option value="matematika">
                                        Matematika
                                    </option>
                                    <option value="pendidikan kewarganegaraan">
                                        Pendidikan Kewarganegaraan
                                    </option>
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
                            <div className="mb-4.5">
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
                                    <option value="MEDIUM" selected>Sedang</option>
                                    <option value="HARD">Sulit</option>
                                </select>
                            </div>

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
                        </h3>
                    </div>
                    <div className="p-6.5">
                        {isLoading ? (
                            <div className="text-center py-8">
                                <div className="spinner" />
                                <p className="mt-4">Generating questions...</p>
                            </div>
                        ) : response ? (
                            <>
                                {renderQuestions()}
                                <div className="mt-6">
                                    <h4 className="font-medium mb-2">Raw JSON Response:</h4>
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