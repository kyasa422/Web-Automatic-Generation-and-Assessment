import React, { useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { router } from '@inertiajs/react';


const Generatesoal = () => {
    useEffect(() => {
        document.body.classList.add("overflow-hidden");
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, []);

    return (
        <DefaultLayout noPadding>
            <div
                className="relative min-h-screen bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1613896527026-f195d5c818ed?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                }}
            >
                {/* Overlay Efek Transparan */}
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                {/* Konten */}
                <div className="relative z-10 flex flex-col items-center justify-center h-screen text-center text-white px-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg">
                        Pembuatan Soal Otomatis
                    </h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl">
                        Gunakan AI untuk membuat soal secara otomatis dengan mudah dan cepat. Pilih kategori soal, dan tingkat kesulitan.
                    </p>

                    {/* Tombol Aksi */}
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <button className="btn glass text-white hover:bg-white hover:text-gray-900 transition-all">
                            Buat Soal Pilihan Ganda
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => router.get('/guru/generated-soal/create')}

                        >
                            Buat Soal Esai
                        </button>
                        <button className="btn btn-accent">
                            Buat Soal Pilihan Ganda & Esai
                        </button>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Generatesoal;
