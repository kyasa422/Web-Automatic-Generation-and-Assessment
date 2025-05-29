import { usePage } from "@inertiajs/react"
import { useStore } from "../store/store"

const FormConfigure = () => {
    const props = usePage().props
    const requestStore = useStore(state => state.request)
    const setRequestStore = useStore(state => state.setRequest)
    const responseStore = useStore(state => state.response)

    const handleChange = e => setRequestStore(e.target)
    return <div className="p-6.5">
        <div className="mb-4.5">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Kelas</label>
            <select className="select select-bordered w-full" name="class" onChange={handleChange} value={requestStore.class} disabled={responseStore.length > 0}>
                <option value="" disabled selected>Pilih Kelas</option>
                <option value="10">X (Sepuluh)</option>
                <option value="11">XI (Sebelas)</option>
                <option value="12">XII (Duabelas)</option>
            </select>
        </div>

        <div className="mb-4.5">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Mata Pelajaran</label>
            <select className="select select-bordered w-full" name="subject" onChange={handleChange} value={requestStore.subject} disabled={responseStore.length > 0}>
                <option value="" disabled selected>Pilih Mata Pelajaran</option>
                {
                    props.subject.map((e, index) => <option key={index} value={e.id}>{e.name}</option>)
                }
            </select>
        </div>

        <div className="mb-4.5">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Tingkat Ujian</label>
            <select className="select select-bordered w-full" name="type" onChange={handleChange} value={requestStore.type} disabled={responseStore.length > 0}>
                <option value="" disabled selected>Pilih Tingkatan</option>
                <option value={0}>Ulangan Tengah Semester</option>
                <option value={1}>Ulangan Akhir Semester</option>
            </select>
        </div>
    </div>
}

export default FormConfigure