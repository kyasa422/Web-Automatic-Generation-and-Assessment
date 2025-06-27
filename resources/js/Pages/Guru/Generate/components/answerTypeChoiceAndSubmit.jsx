import { usePage } from "@inertiajs/react"
import { useStore } from "../store/store"
import { GoogleGenAI } from "@google/genai"
import { capitalize } from "lodash"
import { Description } from "@headlessui/react"

const AnswerTypeChoiceAndSubmit = () => {
  const { env: { GEMINI_API_KEY }, subject } = usePage().props
  const requestStore = useStore(state => state.request)
  const setRequestStore = useStore(state => state.setRequest)
  const responseStore = useStore(state => state.response)
  const updateResponseStore = useStore(state => state.updateResponse)
  const isLoadingStore = useStore(state => state.isLoading)
  const setIsLoadingStore = useStore(state => state.setIsLoading)

  const handleChange = e => setRequestStore(e.target)
  const handleOnClickSubmit = async () => {
    try {
      setIsLoadingStore(responseStore.length > 0 ? "ADD" : "ALL")
      const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY })
      const subjectName = subject.find(e => e.id == requestStore.subject).name
      const subjectType = requestStore.type == 0 ? "UTS" : "UAS"

      const schema = requestStore.answerType == "ESSAY" ? {
        type: "array",
        items: {
          type: "object",
          properties: {
            question: { type: "string" },
            answer: {
              type: "string",
              description: "Berikan jawaban dalam bentuk poin-poin rangkuman atau sebuah paragraf sangat singkat yang hanya berisi ide-ide utamanya."
            }, answerType: { type: "string", enum: ["ESSAY"] },
            capaian: {
              type: "string",
              description: "Berdasarkan pertanyaan yang dibuat, klasifikasikan jenis pengetahuan yang paling dominan diuji. Pilih HANYA SATU dari opsi yang tersedia.",
              enum: ["Faktual", "Konseptual", "Prosedural", "Metakognitif"]
            },
          },
          required: ["question", "answer", "answerType", "capaian"],
        },
        minItems: 5,
        maxItems: 5
      } : {
        type: "array",
        items: {
          type: "object",
          properties: {
            question: { type: "string" },
            answerType: { type: "string", enum: ["MULTIPLE_CHOICE"] },
            multipleChoice: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  text: { type: "string" },
                  isCorrect: { type: "boolean" }
                },
                required: ["text", "isCorrect"]
              },
              minItems: 4,
              maxItems: 4
            }
          },
          required: ["question", "answerType", "multipleChoice"]
        },
        minItems: 5,
        maxItems: 5
      }

      const prompt = `Buatkan 5 soal berdasarkan parameter berikut:
  - class: ${requestStore.class} 
  - subject: ${subjectName}
  - type: ${subjectType}
  - answerType: ${requestStore.answerType}

  ${requestStore.answerType === "ESSAY"

        }


  Soal harus sesuai capaian umum sebagai berikut:
  ${subject.find(e => e.id == requestStore.subject).context}

  Buat soal yang berkualitas dan sesuai dengan tingkat kesulitan ${requestStore.class}.

  ---
  **PENTING:** Untuk setiap soal yang dihasilkan, kolom "answer" harus berisi **kunci jawaban berupa esai jawaban yang ideal dan faktual ** Jangan menuliskan kriteria atau pedoman cara menjawab. Posisikan diri Anda sebagai seorang ahli yang memberikan contoh jawaban sempurna atas pertanyaan tersebut.
  ---`

      const result = await genAI.models.generateContent({
        contents: prompt,
        model: "gemini-2.5-flash",
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: .7
        }
      })

      const response = result.text
      console.log("Response:", response)
      updateResponseStore(JSON.parse(response))
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoadingStore(null)
    }

  }

  return <div className="mt-5 flex justify-center items-center gap-4">
    <select className="select select-bordered w-fit" onChange={handleChange} name="answerType" value={requestStore.answerType}>
      <option>Pilih Tipe Soal</option>
      <option value="ESSAY">Essay</option>
      <option value="MULTIPLE_CHOICE">Pilihan Ganda</option>
    </select>

    <button className="btn btn-primary" onClick={handleOnClickSubmit} disabled={isLoadingStore != null}>
      {isLoadingStore === "ALL" ? <div className="loading"></div> : null}
      <span>{responseStore.length > 0 ? "Tambah" : "Generate"} 5 Soal</span>
    </button>
  </div>
}

export default AnswerTypeChoiceAndSubmit