import React from "react";
import { usePage } from "@inertiajs/react";
import DefaultLayout from "@/Layouts/DefaultLayout";

const Laporan = () => {
    const { permissions } = usePage().props; // Ambil permission dari server

    return (
        <DefaultLayout>
            {permissions.length > 0 ? (
                permissions.map((permission, index) => (
                    <h1 key={index} className="text-3xl font-bold text-gray-900">
                        Laporan {permission.toUpperCase()}
                    </h1>
                ))
            ) : (
                <h1 className="text-3xl font-bold text-gray-900">
                    Anda belum memiliki izin untuk melihat laporan.
                </h1>
            )}
        </DefaultLayout>
    );
};

export default Laporan;
