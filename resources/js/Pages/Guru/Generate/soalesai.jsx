import React, { useState } from "react";
import { usePage, useForm } from "@inertiajs/react";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { Link } from "@inertiajs/react";
import { useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import mammoth from "mammoth";

import "flowbite/dist/flowbite.min.js";

const Esai = () => {
    const [data, setData] = useState({
        kelas: "",
        mapel: "",
        tingkat: "",
    });

    const [response, setResponse] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);
    const [fileContent, setFileContent] = useState("");

    function handleChange(e) {
      const { name, value } = e.target;
      setData(prevData => {
          const newData = {...prevData, [name]: value};
          console.log('Updated data:', newData);
          return newData;
      });
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadedFile(file);

        // Handle different file types
        if (file.type === 'application/pdf') {
            // Placeholder for PDF parsing
            setFileContent("PDF parsing not implemented in this example");
        } else if (
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
            file.type === 'application/msword'
        ) {
            // For Word documents
            const reader = new FileReader();
            reader.onload = async (e) => {
                const arrayBuffer = e.target.result;
                try {
                    const result = await mammoth.extractRawText({arrayBuffer: arrayBuffer});
                    setFileContent(result.value);
                } catch (error) {
                    console.error("Error parsing document:", error);
                    setFileContent("Error parsing document");
                }
            };
            reader.readAsArrayBuffer(file);
        } else if (file.type === 'text/plain') {
            // For text files
            const reader = new FileReader();
            reader.onload = (e) => {
                setFileContent(e.target.result);
            };
            reader.readAsText(file);
        }
    };

    const handlesubmit = async (e) => {
        e.preventDefault();
        const genAI = new GoogleGenerativeAI(
            "AIzaSyDJIobzcimNXBDpamTebwuicdLUm8Sl6Bo"
        );
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        // Construct prompt with additional context from uploaded file
        let prompt = `Buat soal esai untuk kelas ${data.kelas} mata pelajaran ${data.mapel} tingkat ${data.tingkat}`;
        
        // If file content is available, include it in the prompt
        if (fileContent) {
            prompt += ` dengan mengacu pada materi: ${fileContent.substring(0, 1000)}`; // Limit to first 1000 characters
        }

        console.log(" kelas " + data.kelas + " mapel " + data.mapel + " tingkat " + data.tingkat);
        const result = await model.generateContent(prompt);
        setResponse(result.response.text());
    };

    return (
        <DefaultLayout>
            <div className="flex flex-col gap-9">
                {/* Existing form */}
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Generate Soal Esai
                        </h3>
                    </div>
                    <form onSubmit={handlesubmit}>
                        <div className="p-6.5">

                          {/* New File Upload Section */}
                          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full">
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
                            </div>
                            
                            {/* Existing select fields */}
                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Kelas
                                    </label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={data.kelas}
                                        onChange={handleChange}
                                        name="kelas"  
                                    >
                                        <option disabled selected>
                                            Pilih Kelas
                                        </option>
                                        <option value="10">X Sepuluh</option>
                                        <option value="11">XI Sebelas</option>
                                        <option value="12">XII Duabelas</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Mata Pelajaran
                                    </label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={data.mapel}
                                        onChange={handleChange}
                                        name="mapel"
                                    >
                                        <option disabled selected>
                                            Pilih Mata Pelajaran
                                        </option>
                                        <option value="ilmu pengetahuan alam">Ilmu Pengetahuan Alam</option>
                                        <option value="bahasa indonesia">Bahasa Indonesia</option>
                                        <option value="bahasa inggris">Bahasa Inggris</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Tingkat UTS / UAS
                                    </label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={data.tingkat}
                                        onChange={handleChange}
                                        name="tingkat"
                                    >
                                        <option disabled selected>
                                            Pilih Tingkatan
                                        </option>
                                        <option value="ulangan tengah semester">Ulangan Tengah Semester</option>
                                        <option value="ulangan akhir semester">Ulangan Akhir Semester</option>
                                    </select>
                                </div>
                            </div>

                          

                            <button
                                type="submit"
                                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                            >
                                Generate
                            </button>
                        </div>
                    </form>
                </div>

                {/* Existing results section */}
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Hasil
                        </h3>
                    </div>
                    <div className="p-6.5">
                        <p>{response}</p>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Esai;