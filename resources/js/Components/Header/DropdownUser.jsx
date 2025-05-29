import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import ClickOutside from "@/components/ClickOutside";
import { Inertia } from '@inertiajs/inertia';


const DropdownUser = () => {
    const user = usePage().props.auth.user;
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => setDropdownOpen((prev) => !prev);

    const closeDropdown = () => {
        setDropdownOpen(false);
    };
    return (
        <ClickOutside onClick={closeDropdown} className="relative">
            <button
                onClick={toggleDropdown}
                className="flex items-center gap-4"
            >
               <span className="text-right lg:block">
                <span className="block text-sm font-medium text-black dark:text-white">
                    {user.name}
                </span>

                <div className="flex flex-wrap items-center gap-2 mt-1">
                    {user?.roles?.map((role) => (
                        <div key={role.id} className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                {role.name}
                            </span>

                            {/* Jika role-nya Siswa, tampilkan permissions secara horizontal */}
                            {role.name === "Siswa" && user?.permissions?.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                                    {user.permissions.map((perm) => (
                                        <span
                                            key={perm.id}
                                            className=" px-2 py-0.5 rounded"
                                        >
                                            {perm.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </span>

                <svg
                    className=" fill-current sm:block"
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
                        fill=""
                    />
                </svg>
            </button>

            {dropdownOpen && (
                <div
                    className="absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
                >
                    <ul className="flex flex-col  border-b border-stroke px-2 py-3 dark:border-strokedark ">
              
                        <li className="text-md font-medium text-red-500 dark:text-white">
                            

                            <Link href={route('logout')}
                            method="post"
                            as="button">
                            Log Out

                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </ClickOutside>
    );
};

export default DropdownUser;
