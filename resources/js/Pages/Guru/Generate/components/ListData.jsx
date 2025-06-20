import { FaCheck, FaPencilAlt, FaStar, FaTrash } from "react-icons/fa";
import { RiAiGenerate2 } from "react-icons/ri";
import { useStore } from "../store/store";
import { router, useForm, usePage } from "@inertiajs/react";
import _, { set } from "lodash";
import { useState } from "react";
import withReactContent from "sweetalert2-react-content";
import SweetAlert from "sweetalert2";
import { GoogleGenAI } from "@google/genai";

const ListData = () => {
    const { env: { GEMINI_API_KEY, GEMINI_MODEL_NAME }, subject } = usePage().props
    const [edit, setEdit] = useState(null)
    const responseStore = useStore(state => state.response)
    const updateResponseByIndexStore = useStore(state => state.updateResponseByIndex)
    const requestStore = useStore(state => state.request)
    const deleteResponseStore = useStore(state => state.deleteResponse)
    const isLoadingStore = useStore(state => state.isLoading)
    const setIsLoadingStore = useStore(state => state.setIsLoading)
    const resetUseStore = useStore(state => state.reset)
    const Swal = withReactContent(SweetAlert)

    const handleChange = e => {
        const { name, value } = e.target
        const temp = _.cloneDeep(edit)
        _.set(temp, name, value)
        setEdit(temp)
    }

    const changeCorrectChoice = (index) => {
        const temp = { ...edit }
        const currentCorrect = temp.multipleChoice.findIndex(e => e.isCorrect == true)
        if (currentCorrect != -1) {
            temp.multipleChoice[currentCorrect].isCorrect = false
        }
        temp.multipleChoice[index].isCorrect = true
        setEdit(temp)
    }

    const handleOnClickQuestionEdit = (index) => {
        if (edit != null && edit.index == index) {
            updateResponseByIndexStore(index, edit)
            setEdit(null)
        } else {
            setEdit({ index, ...responseStore[index] })
        }
    }

    const handleOnClickSubmit = () => {
        const weightTotal = responseStore.map(e => parseFloat(e.weight)).reduce((a, b) => a + b)
        if (weightTotal.toFixed(2) != 100) {
            Swal.fire({
                icon: 'warning',
                title: 'Bobot tidak sesuai',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            })
        } else {
            router.post(route("guru.generated-soal.store"), { ...requestStore, response: responseStore }, {
                onStart: () => setIsLoadingStore("SUBMIT"),
                onSuccess: () => {
                    resetUseStore();
                    Swal.fire({
                        icon: 'success',
                        title: 'Soal berhasil disimpan',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                    });
                },
                onFinish: () => setIsLoadingStore(null),
            });
        }
    }

    const handleOnClickGenerate = async (index, answerType) => {
        try {
            setIsLoadingStore(`SINGLE-${index}`)
            const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY })
            const subjectName = subject.find(e => e.id == requestStore.subject).name
            const schema = answerType === "ESSAY"
                ? {
                    type: "object",
                    properties: {
                        question: { type: "string" },
                        answer: { type: "string" },
                        answerType: { type: "string", enum: ["ESSAY"] },
                        label: { type: "string", enum: ["uraian_terbatas", "uraian_bebas"] }
                    },
                    required: ["question", "answer", "answerType", "label"]
                }
                : {
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
                }

            const prompt = `Buatkan 1 soal berdasarkan parameter berikut:\n- class: ${requestStore.class}\n- subject: ${subjectName}\n- type: ${requestStore.type === 0 ? "Ulangan Tengah Semester" : "Ulangan Akhir Semester"}\n- answerType: ${answerType}\n\n${answerType === "ESSAY" ? "Untuk soal essay, wajib menyertakan atribut label dengan nilai 'uraian_terbatas' atau 'uraian_bebas'." : "Untuk soal pilihan ganda, wajib ada 4 opsi dan satu jawaban benar."}\nJawaban harus dalam format JSON murni, hanya 1 soal, tidak kurang tidak lebih.`

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
            updateResponseByIndexStore(index, JSON.parse(response))
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoadingStore(null)
        }
    }

    return <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {
            isLoadingStore === "ALL" ? <h1 className="p-6 font-semibold text-center">Soal sedang dimuat harap ditunggu...</h1> :
                responseStore.length > 0 ? <>
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">Hasil Generate Soal</h3>
                        <div className="mt-2 text-right">
                            <strong>Total Bobot: </strong>
                            <span className="text-red-400">
                                {(responseStore
                                    .map(e => parseFloat(e.weight))
                                    .reduce((a, b) => a + b, 0)
                                ).toFixed(2)}/100
                            </span>
                        </div>
                    </div>

                    {
                        responseStore.map((e, index) => <div className="p-6 space-y-6" key={index}>
                            <div className="border p-6 rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold">Soal {index + 1} {e.label === "uraian_terbatas" ? "" : null}</h3>
                                    <div className="flex items-center gap-3">
                                        <button type="button" className="btn btn-circle btn-sm btn-ghost" onClick={() => handleOnClickQuestionEdit(index)}>
                                            {edit == null || edit.index != index ? <FaPencilAlt /> : <FaCheck />}
                                        </button>
                                        <button type="button" className="btn btn-circle btn-sm btn-ghost" disabled={isLoadingStore != null} onClick={() => handleOnClickGenerate(index, e.answerType)}>
                                            {isLoadingStore == `SINGLE-${index}` ? <div className="loading"></div> : <RiAiGenerate2 />}
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <div className="font-medium flex items-center gap-2">
                                                <span>Bobot: {e.weight ? parseFloat(e.weight).toFixed(2) : 0}</span>
                                                {edit && edit.index == index ?
                                                    <input type="number" className="input input-bordered input-sm w-16" name="weight" value={edit.weight} onChange={handleChange} /> :
                                                    <button className="btn btn-sm btn-ghost btn-circle" onClick={() => handleOnClickQuestionEdit(index)}><FaPencilAlt size={10} /></button>}
                                            </div>
                                            <button type="button" className="btn btn-circle btn-sm btn-error text-white" onClick={() => deleteResponseStore(index)}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="font-medium mb-1">
                                        <span>Pertanyaan:</span>
                                        {
                                            edit != null && edit.index == index ?
                                                <input type="text" className="input input-bordered input-sm w-full" value={edit.question} name="question" onChange={handleChange} /> :
                                                <span className="font-normal">{e.question}</span>
                                        }
                                    </p>

                                    {
                                        e.answerType === "ESSAY" ? edit != null && edit.index == index ?
                                            <textarea type="text" className="textarea textarea-bordered textarea-sm w-full rounded-xl" name="answer" onChange={handleChange} value={edit.answer} /> :
                                            <p className="font-medium">Jawaban: <span className="font-normal">{e.answer}</span></p> : <>
                                            <p className="font-medium mb-1">Pilihan:</p>
                                            <ul className="list-disc ml-6">
                                                {
                                                    e.multipleChoice.map((item, indexMultipleChoice) =>
                                                        <li className={`${item.isCorrect ? 'text-green-600' : ''}`} key={indexMultipleChoice}>
                                                            {
                                                                edit != null && edit.index === index ?
                                                                    <div className="flex items-center gap-2">
                                                                        <input type="text" className="input input-bordered input-sm" name={`multipleChoice.${indexMultipleChoice}.text`} value={edit.multipleChoice[indexMultipleChoice].text} onChange={handleChange} />
                                                                        <input type="radio" name="isCorrect" checked={edit.multipleChoice[indexMultipleChoice].isCorrect} onChange={() => changeCorrectChoice(indexMultipleChoice)} />
                                                                    </div> : <p>{item.text} {item.isCorrect ? "(Jawaban Benar)" : null}</p>
                                                            }
                                                        </li>
                                                    )
                                                }
                                            </ul>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>)
                    }

                    {
                        isLoadingStore === "ADD" ? <div className="flex justify-center">
                            <div className="loading"></div>
                        </div> : null
                    }

                    <div className="flex justify-end mt-5 p-6">
                        <button className="btn btn-primary" disabled={isLoadingStore != null} onClick={handleOnClickSubmit}>
                            {isLoadingStore == "SUBMIT" ? <div className="loading"></div> : null}
                            <span>Simpan Soal</span>
                        </button>
                    </div>
                </> : <h1 className="font-semibold text-xl text-center p-10">Belum ada soal yang dimuat!</h1>
        }
    </div >
};

export default ListData