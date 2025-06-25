
import React, { useState } from 'react';
import { router } from '@inertiajs/react';

const ModalEditSubject = ({ subject, onClose }) => {
    const [name, setName] = useState(subject.name || '');
    const [context, setContext] = useState(subject.context || '');
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        router.post(`/admin/subject/${subject.id}/update`, { name, context }, {
            onSuccess: () => {
                onClose();
            },
            onError: (err) => {
                setErrors(err);
            },
            preserveScroll: true,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-[400px]">
                <h2 className="text-xl font-semibold mb-4">Edit Mata Pelajaran</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            className="mt-1 block w-full border rounded-md px-3 py-2"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="context" className='label'>Konteks</label>
                        <textarea name="context" id="context" className="textarea textarea-bordered w-full" rows={7} value={context} onChange={e => setContext(e.target.value)}></textarea>
                        {errors.context && <p className="text-red-500 text-sm mt-1">{errors.context}</p>}
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                            onClick={onClose}
                        >
                            Batal
                        </button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalEditSubject;
