import React from "react";
import { Head, Link } from '@inertiajs/react';
import { useState } from "react";
// import Header from "@/components/Header";
import Sidebar from "@/Components/Sidebar/Sidebar";
import Header from "@/Components/Header/Header";

const DefaultLayout = ({ children, noPadding = false   }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (

      
        <>
        {/* <!-- ===== Page Wrapper Start ===== --> */}
        <div className="flex">
          {/* <!-- ===== Sidebar Start ===== --> */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Sidebar End ===== --> */}
  
          {/* <!-- ===== Content Area Start ===== --> */}
          <div className="relative flex flex-1 flex-col lg:ml-72.5">
            {/* <!-- ===== Header Start ===== --> */}
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            {/* <!-- ===== Header End ===== --> */}
  
            {/* <!-- ===== Main Content Start ===== --> */}
              {/* Cek apakah noPadding true, jika ya hilangkan padding */}
              <main className={`bg-slate-100 ${noPadding ? "" : "max-w-screen-2xl p-4 md:p-6 2xl:p-10"}`}>
                        {children}
                    </main>
            {/* <!-- ===== Main Content End ===== --> */}
          </div>
          {/* <!-- ===== Content Area End ===== --> */}
        </div>
        {/* <!-- ===== Page Wrapper End ===== --> */}
      </>
      
    )
}

export default DefaultLayout;