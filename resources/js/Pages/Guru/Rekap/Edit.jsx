import React, { useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { router, useForm, usePage } from '@inertiajs/react';
import SweetAlert from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Edit = () => {
  const { setting, all_permissions } = usePage().props;
  const { data, setData, put, errors } = useForm({
    question_id: setting.question_id,
    start_time: setting.start_time,
    end_time: setting.end_time,
    permissions: [], // kosongkan dulu
  });

  // Gunakan useEffect untuk set permissions
  useEffect(() => {
    if (setting.permissions) {
      setData('permissions', setting.permissions.map(p => p.permission_id));
    }
  }, [setting.permissions]);

  const handlePermissionChange = (e) => {
    const id = parseInt(e.target.value);
    if (e.target.checked) {
      setData('permissions', [...data.permissions, id]);
    } else {
      setData('permissions', data.permissions.filter((permId) => permId !== id));
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    put(route("guru.ulangan-setting.update", setting.id), {
      preserveScroll: true,
      onSuccess: () => {
        withReactContent(SweetAlert).fire({
          title: "Berhasil!",
          text: "Pengaturan ulangan diperbarui.",
          icon: "success",
        });
      },
      onError: () => {
        withReactContent(SweetAlert).fire({
          title: "Gagal!",
          text: "Ada kesalahan saat menyimpan.",
          icon: "error",
        });
      },
    });
  };

  return (
    <DefaultLayout>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Waktu Mulai */}
        <div>
          <label className="block text-sm font-medium">Waktu Mulai</label>
          <input
            type="datetime-local"
            value={data.start_time}
            onChange={(e) => setData('start_time', e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.start_time && <p className="text-red-500 text-sm">{errors.start_time}</p>}
        </div>

        {/* Waktu Selesai */}
        <div>
          <label className="block text-sm font-medium">Waktu Selesai</label>
          <input
            type="datetime-local"
            value={data.end_time}
            onChange={(e) => setData('end_time', e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.end_time && <p className="text-red-500 text-sm">{errors.end_time}</p>}
        </div>

        {/* Permissions */}
        <div>
          <label className="block text-sm font-medium">Izin Kelas</label>
          <div className="space-y-1">
            {all_permissions.map((permission) => (
              <label key={permission.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={permission.id}
                  checked={data.permissions.includes(permission.id)}
                  onChange={handlePermissionChange}
                />
                <span>{permission.name}</span>
              </label>
            ))}
          </div>
          {errors.permissions && <p className="text-red-500 text-sm">{errors.permissions}</p>}
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded shadow"
        >
          Simpan Perubahan
        </button>

      </form>
    </DefaultLayout>

  );
};

export default Edit;
