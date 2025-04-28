import React, { useState } from 'react';
import { router } from '@inertiajs/react';

const ModalCreateSubject = ({ onClose }) => {
    const [name, setName] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        router.post('/admin/subject/store', { name }, {
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
                <h2 className="text-xl font-semibold mb-4">Tambah Mata Pelajaran</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nama</label>
                        <input
                            type="text"
                            className="mt-1 block w-full border rounded-md px-3 py-2"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                            onClick={onClose}
                        >
                            Batal
                        </button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalCreateSubject;
