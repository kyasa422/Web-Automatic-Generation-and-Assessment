import React from 'react';
import DefaultLayout from '@/Layouts/DefaultLayout';
import { usePage, Link } from "@inertiajs/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import ModalEditSubject from './ModalEditSubject';
import ModalCreateSubject from './ModalCreateSubject'; // import komponen baru
import { useState } from 'react';




const Subject = () => {
  const { subjects } = usePage().props;
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);




  

  return (
    <DefaultLayout>

<div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex justify-between px-7.5 mb-6">
                    <h4 className="text-xl font-semibold text-black dark:text-white">
                        Mata Pelajaran
                    </h4>
                    <div>
                        <button
                            className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
                            onClick={() => setShowCreateModal(true)}
                        >
                            Tambah Mata Pelajaran
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 dark:bg-meta-4">
                                <th className="py-4 px-4 text-left text-sm font-medium text-black dark:text-white pl-10">No</th>
                                <th className="py-4 px-4 text-left text-sm font-medium text-black dark:text-white">Name</th>
                                <th className="py-4 px-4 text-center text-sm font-medium text-black dark:text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.data.map((item, index) => (
                                <tr key={item.id} className="border-b border-stroke dark:border-strokedark">
                                    <td className="py-4 px-4 pl-10 text-sm text-black dark:text-white">
                                        { index + 1}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-black dark:text-white">
                                        {item.name}
                                    </td>
                             
                                  
                                    <td className="py-4 px-4 text-center">
                                        <div className="flex justify-center gap-3">
                                        <button
                                                onClick={() => setSelectedSubject(item)}
                                            >
                                                <FaEdit className="text-yellow-500 hover:text-yellow-700 cursor-pointer" />
                                            </button>

                                              
                                            <Link
                                                href={`/admin/subject/${item.id}`}
                                                method="delete"
                                                as="button"
                                                data={{ id: item.id }}
                                                onClick={(e) => {
                                                    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            >
                                                <FaTrash className="text-red-500 hover:text-red-700 cursor-pointer" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {selectedSubject && (
                    <ModalEditSubject
                        subject={selectedSubject}
                        onClose={() => setSelectedSubject(null)}
                    />
                )}

                 {/* Modal untuk Create */}
                 {showCreateModal && (
                    <ModalCreateSubject
                        onClose={() => setShowCreateModal(false)}
                    />
                )}
                   {/* Pagination Controls */}
                {/* <div className="flex justify-center gap-3 mt-4">
                    {userData.prev_page_url && (
                        <Link href={userData.prev_page_url} className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                            Sebelumnya
                        </Link>
                    )}
                   
                    {userData.next_page_url && (
                        <Link href={userData.next_page_url} className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                            Selanjutnya
                        </Link>
                    )}
                </div> */}
            </div>
    </DefaultLayout>
  );
};

export default Subject;
