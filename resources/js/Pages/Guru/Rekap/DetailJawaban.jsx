import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { GoogleGenAI } from "@google/genai";
import { FaCheck, FaPencilAlt } from "react-icons/fa";
import moment from "moment";
import { CheckCircle, XCircle } from 'lucide-react'; // lucide-react icon, ringan dan modern
import { Stars, TrendingUp } from 'lucide-react'; // pakai icon Stars, mirip Gemini, modern



const DetailJawaban = () => {
  const {  ulanganSettings } = usePage().props;
  const [isLoading, setIsLoading] = useState(null)
  const [edit, setEdit] = useState(null)
  const { data, setData, errors, processing } = useForm({
    detail: ulanganSettings.ulangan_jawaban_many.map(e => ({
      questionId: e.question_inquiry_id,
      question: e.question_inquiry.question,
      answer: e.question_inquiry.answer,
      studentAnswer: e.answer,
      multipleChoice: e.question_inquiry.multiple_choice,
      isCorrect: null,
      note: null,
      score: null
    }))
  })

  const correctWithGemini = async () => {
    setIsLoading("CORRECT_GEMINI")
    try{
      const model = new GoogleGenAI({ apiKey: "AIzaSyBfeeUiCYcPR_xkHGCPshe2GnN7c_Exd7Y" })
      const contents = data.detail.map(e => ({
        questionId: e.questionId,
        question: e.question,
        correctAnswer: e.answer,
        studentAnswer: e.studentAnswer
      }))

      const schema = {
        "type": "object",
        "properties": {
          "response": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "question_id": {
                  "type": "string"
                },
                "isCorrect": {
                  "type": "boolean",
                  "description": "Mark the correct answer if the score is more than 0.5"
                },
                "score": {
                  "type": "number",
                  "description": "score range from 0.0 to 1.0"
                },
                "note": {
                  "type": "string",
                  "description": "Give advice on students' answers in Indonesian"
                }
              },
              "required": [
                "question_id",
                "isCorrect",
                "score",
                "note"
              ]
            }
          }
        }
      }

      const response = await model.models.generateContent({
        model: "gemini-2.0-flash",
        contents: JSON.stringify(contents),
        config: {
          responseMimeType: "application/json",
          responseSchema: schema
        }
      })

      const jsonParse = JSON.parse(response.text)
      const temp = [...data.detail]
      jsonParse.response.map(e => {
        const index = temp.findIndex(a => a.questionId === e.question_id)
        if(index > -1){
          temp[index].isCorrect = e.isCorrect
        temp[index].score = e.score
        temp[index].note = e.note
        }

      })

      setData({ detail: temp })
    }catch(e){
      console.error(e)
      alert('Ada kesalahan pada server!')
      
    }
    setIsLoading(null)
  }

  const changeCorrect = (index, correct) => {
    const temp = [...data.detail]
    temp[index].isCorrect = correct
    setData({ detail: temp })
  }

  const changeNote = (index, note) => {
    const temp = [...data.detail]
    temp[index].note = note
    setData({ detail: temp })
  }

  return (
    <DefaultLayout>
      <div className="p-6 max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold text-slate-900 mb-6">Detail Jawaban Siswa</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
            <div>
              <p><span className="font-semibold">Nama Siswa:</span> {ulanganSettings.ulangan_jawaban_has_one.user.name}</p>
              <p><span className="font-semibold">Mata Pelajaran:</span> {ulanganSettings.question.subject.name}</p>
              <p><span className="font-semibold">Tanggal Dikerjakan : </span>
              {moment(ulanganSettings.ulangan_jawaban_has_one.created_at).format("DD MMMM YYYY HH:mm")}</p>
            </div>
            <div className="space-y-4">
            <div>

            </div>
            <div>
              <p className="font-semibold mb-1">Nilai Otomatis:</p>
              <div className="mt-2 flex flex-col gap-2">
              <button
    className="btn btn-sm btn-outline"
    style={{ borderColor: "#5C6BC0", color: "#5C6BC0" }} // warna biru-ungu Gemini
    disabled={isLoading != null}
    onClick={correctWithGemini}
  >
    {isLoading === "CORRECT_GEMINI" ? (
      <span className="loading loading-spinner loading-xs mr-2"></span>
    ) : (
      <Stars className="w-4 h-4 mr-2" />
    )}
    <span>Koreksi soal menggunakan Gemini</span>
  </button>
 {/* Tombol Cosine Similarity */}
 <button
    className="btn btn-sm btn-outline"
    style={{ borderColor: "#00ACC1", color: "#00ACC1" }} 

    >
          <TrendingUp className="w-4 h-4 mr-2" />

    

    

    <span>Koreksi soal menggunakan cosine similarity</span>
  </button>
                </div>
            </div>
          </div>

         
          </div>
        </div>

        {data.detail.length > 0 ? (
          data.detail.map((item, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-5">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold mb-2 ">Soal {index + 1} : { item.isCorrect }</h2>
              <div className="flex items-center gap-2">
              <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`multiple-${index}`}
                  className="hidden"
                  checked={item.isCorrect === true}
                  onChange={() => changeCorrect(index, true)}
                />
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full border ${item.isCorrect === true ? 'bg-green-100 border-green-500 text-green-700' : 'border-gray-300 text-gray-500'}`}>
                  <CheckCircle className="w-5 h-5" />
                </div>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`multiple-${index}`}
                  className="hidden"
                  checked={item.isCorrect === false}
                  onChange={() => changeCorrect(index, false)}
                />
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full border ${item.isCorrect === false ? 'bg-red-100 border-red-500 text-red-700' : 'border-gray-300 text-gray-500'}`}>
                  <XCircle className="w-5 h-5" />
                </div>
              </label>
            </div>
              </div>
            </div>

              <div className="mb-2">
                <p className="text-gray-700">  <strong> 
                Pertanyaan:</strong> <br></br> {item.question}</p>
              </div>
              <div className="mb-2">
                <strong>Jawaban Siswa:</strong> <br></br> {item.studentAnswer}
              </div>
              <div>
                <strong>{ item.multipleChoice.length === 0 ? "Kunci Jawaban Essay:" : "Kunci Jawaban pg:" }</strong>
                <ul className="list-disc pl-5">
                {item.answer}

                  {item.multipleChoice.map((choice, i) => (
                    <li key={i} className={choice.isCorrect ? "text-green-600 font-semibold" : ""}>
                      {choice.text} {choice.isCorrect ? "(Benar)" : ""}
                    </li>
                  ))}
                </ul>
              </div>
              {
                item.note && item.multipleChoice.length === 0 ? <div className="mt-4 flex justify-between items-center">
                  {
                    edit === index ? <textarea className="textarea textarea-bordered w-full" defaultValue={item.note} onChange={e => changeNote(index, e.currentTarget.value)} /> : <section>
                  <strong>Catatan:</strong>
                  <p className="text-gray-700">{item.note}</p>
                  </section>
                  }
                  <button className="btn btn-circle btn-sm btn-ghost" onClick={() => setEdit(edit === index ? null : index)}>
                  {
                    edit === index ? <FaCheck /> : <FaPencilAlt />
                  }
                  </button>
                </div> : null
              }
            </div>
          ))
        ) : (
            <p className="text-red-500 text-center">Tidak ada data jawaban ditemukan.</p>
        )}
      </div>
      
    </DefaultLayout>
  );
};

export default DetailJawaban;

