import { usePage } from "@inertiajs/react"
import { useStore } from "../store/store"
import { GoogleGenerativeAI } from "@google/generative-ai"

const AnswerTypeChoiceAndSubmit = () => {
    const { env: { GEMINI_API_KEY, GEMINI_MODEL_NAME }, subject } = usePage().props
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
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
            const model = genAI.getGenerativeModel({
                model: GEMINI_MODEL_NAME,
            })

            const subjectName = subject.find(e => e.id == requestStore.subject).name
            const subjectType = requestStore.type == 0 ? "UTS" : "UAS"
            const prompt = `
Buatkan 5 soal berdasarkan parameter berikut:  
- class: ${requestStore.class} 
- subject: ${subjectName}
- type: ${subjectType}
- answerType: ${requestStore.answerType} 

Format respons yang HARUS digunakan:

- Jika answerType adalah "ESSAY":
[
  {
    "question": "pertanyaan 1",
    "answer": "jawaban 1",
    "answerType": "ESSAY",
    "label": "uraian_terbatas"
  },
  {
    "question": "pertanyaan 2",
    "answer": "jawaban 2",
    "answerType": "ESSAY",
    "label": "uraian_bebas"
  },
  {
    "question": "pertanyaan 3",
    "answer": "jawaban 3",
    "answerType": "ESSAY",
    "label": "uraian_terbatas"
  },
  {
    "question": "pertanyaan 4",
    "answer": "jawaban 4",
    "answerType": "ESSAY",
    "label": "uraian_bebas"
  },
  {
    "question": "pertanyaan 5",
    "answer": "jawaban 5",
    "answerType": "ESSAY",
    "label": "uraian_terbatas"
  }
]

- Jika answerType adalah "MULTIPLE_CHOICE":
[
  {
    "question": "pertanyaan 1",
    "answerType": "MULTIPLE_CHOICE",
    "multipleChoice": [
      { "text": "opsi A", "isCorrect": false },
      { "text": "opsi B", "isCorrect": true },
      { "text": "opsi C", "isCorrect": false },
      { "text": "opsi D", "isCorrect": false }
    ]
  },
  {
    "question": "pertanyaan 2",
    "answerType": "MULTIPLE_CHOICE",
    "multipleChoice": [
      { "text": "opsi A", "isCorrect": false },
      { "text": "opsi B", "isCorrect": false },
      { "text": "opsi C", "isCorrect": true },
      { "text": "opsi D", "isCorrect": false }
    ]
  },
  {
    "question": "pertanyaan 3",
    "answerType": "MULTIPLE_CHOICE",
    "multipleChoice": [
      { "text": "opsi A", "isCorrect": true },
      { "text": "opsi B", "isCorrect": false },
      { "text": "opsi C", "isCorrect": false },
      { "text": "opsi D", "isCorrect": false }
    ]
  },
  {
    "question": "pertanyaan 4",
    "answerType": "MULTIPLE_CHOICE",
    "multipleChoice": [
      { "text": "opsi A", "isCorrect": false },
      { "text": "opsi B", "isCorrect": false },
      { "text": "opsi C", "isCorrect": false },
      { "text": "opsi D", "isCorrect": true }
    ]
  },
  {
    "question": "pertanyaan 5",
    "answerType": "MULTIPLE_CHOICE",
    "multipleChoice": [
      { "text": "opsi A", "isCorrect": false },
      { "text": "opsi B", "isCorrect": true },
      { "text": "opsi C", "isCorrect": false },
      { "text": "opsi D", "isCorrect": false }
    ]
  }
]

Penting:  
- Jawaban harus dalam format JSON murni tanpa tambahan teks atau simbol apa pun di awal maupun akhir.  
- Jumlah soal wajib 5 — tidak kurang dan tidak lebih.
- Jika answerType adalah "ESSAY", maka setiap soal wajib memiliki atribut "label" dengan nilai "uraian_terbatas" atau "uraian_bebas".
`;

            const result = await model.generateContent(prompt)
            const response = JSON.parse(result.response.text())
            updateResponseStore(response)
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