import React from "react";
import { usePage, useForm } from "@inertiajs/react";
import DefaultLayout from "@/Layouts/DefaultLayout";

const EditUsers = () => {
    const { user, roles, userRole, permissions, userPermissions } = usePage().props;
    
    const { data, setData, put, errors } = useForm({
        name: user.name,
        email: user.email,
        password: "",
        roles: userRole,
        permissions: userPermissions ? userPermissions.map(p => Number(p)) : [] // Pastikan semuanya berupa angka
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    const handleRoleChange = (e) => {
        const selectedRoles = Array.from(e.target.selectedOptions, option => option.value);
        setData("roles", selectedRoles);
    };

    const handlePermissionChange = (e) => {
        const permissionId = parseInt(e.target.value);
        setData("permissions", e.target.checked
            ? [...data.permissions, permissionId]
            : data.permissions.filter(id => id !== permissionId)
        );
    };
    console.log("User Permissions from props:", userPermissions);

    console.log("Updated permissions:", data.permissions);


    return (
        <DefaultLayout>
            <h1>Edit User</h1>
            <form onSubmit={handleSubmit}>
                <div className="p-6.5">
                    {/* Input untuk Nama */}
                    <div className="w-full xl:w-1/2 mb-4.5">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="Enter name"
                            className="w-full rounded border-[1.5px] px-5 py-3 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white focus:border-primary"
                        />
                        {errors.name && <div className="text-red-500">{errors.name}</div>}
                    </div>

                    {/* Input untuk Email */}
                    <div className="w-full xl:w-1/2 mb-4.5">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="Enter email"
                            className="w-full rounded border-[1.5px] px-5 py-3 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white focus:border-primary"
                        />
                        {errors.email && <div className="text-red-500">{errors.email}</div>}
                    </div>

                    {/* Input untuk Password */}
                    <div className="w-full xl:w-1/2 mb-4.5">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Password
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            placeholder="Enter Password"
                            className="w-full rounded border-[1.5px] px-5 py-3 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white focus:border-primary"
                        />
                        {errors.password && <div className="text-red-500">{errors.password}</div>}
                    </div>

                    {/* Input untuk Role */}
                    <div className="w-full xl:w-1/2 mb-4.5">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Role
                        </label>
                        <select
                            multiple
                            value={data.roles}
                            onChange={handleRoleChange}
                            className="w-full rounded border-[1.5px] px-5 py-3 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white focus:border-primary"
                        >
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.roles && <div className="text-red-500">{errors.roles}</div>}
                    </div>

                    {/* Input untuk Permissions */}
                    <div className="w-full xl:w-1/2 mb-4.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Permissions
                    </label>
                    <div>
                        {permissions.map((permission) => (
                            <label key={permission.id} className="block">
                                <input
                                    type="checkbox"
                                    value={permission.id}
                                    checked={data.permissions.includes(Number(permission.id))} // Pastikan tipe data cocok
                                    onChange={handlePermissionChange}
                                    className="mr-2"
                                />
                                {permission.name}
                            </label>
                        ))}
                    </div>
                    {errors.permissions && <div className="text-red-500">{errors.permissions}</div>}
                    </div>



                </div>
                <button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
                >
                    Update User
                </button>
            </form>
            
            
        </DefaultLayout>
    );
};

export default EditUsers;
