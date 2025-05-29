import React from "react";
import { usePage } from "@inertiajs/react";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { Link } from "@inertiajs/react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const Mapel = () => {
  const { assessments } = usePage().props;
  const user = usePage().props.auth.user;

  const generatePDF = () => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = "/images/logotamsis.png"; // path publik

    img.onload = () => {
      // Logo
      doc.addImage(img, "PNG", 14, 7, 20, 20); // x, y, width, height

      // Header text
      doc.setFontSize(14);
      doc.text("SMK TAMANSISWA 2 JAKARTA", 105, 15, null, null, "center");
      doc.setFontSize(10);
      doc.text("Jl. Garuda No.44 Kemayoran, Jakarta Pusat", 105, 21, null, null, "center");

      // Garis bawah header
      doc.setLineWidth(0.5);
      doc.line(14, 32, 196, 32); // y=32 cukup di bawah logo

      // Data siswa
      const nama = user.name;
      const kelas = user.permissions.map((perm) => perm.name).join(", ");
      doc.setFontSize(12);
      doc.text(`Nama  : ${nama}`, 14, 40);
      doc.text(`Kelas : ${kelas}`, 14, 45);

      // Tabel data nilai
      const tableData = Object.values(grouped).map((item, index) => {
        const uts = item.uts !== null ? parseFloat(item.uts) : null;
        const uas = item.uas !== null ? parseFloat(item.uas) : null;
        let rataRataNilai = "Belum dinilai";

        if (uts !== null || uas !== null) {
          const nilaiUts = uts ?? 0;
          const nilaiUas = uas ?? 0;
          rataRataNilai = Math.round((nilaiUts + nilaiUas) / 2);
        }

        return [
          index + 1,
          item.subjectName,
          item.classLevel,
          uts !== null ? Math.round(uts) : "Belum dinilai",
          uas !== null ? Math.round(uas) : "Belum dinilai",
          rataRataNilai,
        ];
      });

      // Tambahkan baris rata-rata akhir jika ada
      if (rataRata !== null) {
        tableData.push([
          "", // Kolom no kosong
          { content: "Nilai Akhir", colSpan: 4, styles: { halign: 'right', fontStyle: 'bold', fillColor: [240, 240, 240] } },
          rataRata,
        ]);
      }

      autoTable(doc, {
        head: [["No", "Mata Pelajaran", "Kelas", "Nilai UTS", "Nilai UAS", "Rata-rata"]],
        body: tableData,
        startY: 49,
      });
      doc.save(`rapor_${nama.replace(/\s/g, "_")}.pdf`);
    };
  };



  // Kelompokkan berdasarkan subjectId + classLevel
  const grouped = {};

  assessments.forEach((item) => {
    const subjectId = item?.setting?.question?.subject?.id;
    const classLevel = item.setting?.question?.classLevel;
    const key = `${subjectId}-${classLevel}`;

    if (!grouped[key]) {
      grouped[key] = {
        subjectName: item?.setting?.question?.subject?.name,
        classLevel: classLevel,
        uts: null,
        uas: null,
        links: {},
      };
    }

    if (item.setting?.question?.examLevel === 0) {
      grouped[key].uts = item.nilai;
      grouped[key].links.uts = item.id;
    } else {
      grouped[key].uas = item.nilai;
      grouped[key].links.uas = item.id;
    }
  });

  // Hitung rata-rata
  // Hitung rata-rata per mapel dengan fleksibel
  const rataRataList = Object.values(grouped)
    .map(item => {
      const uts = item.uts !== null ? parseFloat(item.uts) : 0;
      const uas = item.uas !== null ? parseFloat(item.uas) : 0;

      const isValid = item.uts !== null || item.uas !== null;
      return isValid ? Math.round((uts + uas) / 2) : null;
    })
    .filter(n => n !== null);


  const totalNilai = rataRataList.reduce((sum, val) => sum + val, 0);
  const rataRata = rataRataList.length > 0
    ? Math.round(totalNilai / rataRataList.length)
    : null;





  return (
    <DefaultLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Report Nilai</h1>
        <h2 className="text-lg font-semibold mb-4">Nama :  {user.name} </h2>
        <h2 className="text-lg font-semibold mb-4">Kelas : {user.permissions.map((perm) => (
          <span
            key={perm.id}
            className=" px-2 py-0.5 rounded"
          >
            {perm.name}
          </span>
        ))} </h2>
        <button
          onClick={generatePDF}
          className="mb-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
        >
          Export PDF
        </button>

        <div className="overflow-x-auto">
          <table className="w-full text-left border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">No</th>
                <th className="p-2 border">Mata Pelajaran</th>
                <th className="p-2 border">Kelas</th>
                <th className="p-2 border">Nilai UTS</th>
                <th className="p-2 border">Nilai UAS</th>
                <th className="p-2 border">Rata-Rata Nilai</th>
                <th className="p-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {grouped && Object.keys(grouped).length > 0 ? (
                Object.values(grouped).map((item, index) => (
                  <tr key={index}>
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">{item.subjectName ?? "-"}</td>
                    <td className="p-2 border">{item.classLevel ?? "-"}</td>
                    <td className="p-2 border">{item.uts !== null ? Math.round(item.uts) : "Belum dinilai"}</td>
                    <td className="p-2 border">{item.uas !== null ? Math.round(item.uas) : "Belum dinilai"}</td>
                    <td className="p-2 border">
                      {(item.uts !== null || item.uas !== null)
                        ? Math.round(
                          ((item.uts !== null ? parseFloat(item.uts) : 0) +
                            (item.uas !== null ? parseFloat(item.uas) : 0)) / 2
                        )
                        : "Belum dinilai"}
                    </td>
                    <td className="p-2 border space-x-2">
                      {item?.links?.uts && (
                        <Link
                          href={route("siswa.hasilujian.detail", item.links.uts)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        >
                          UTS
                        </Link>
                      )}
                      {item?.links?.uas && (
                        <Link
                          href={route("siswa.hasilujian.detail", item.links.uas)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          UAS
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-gray-500">Belum ada data nilai</td>
                </tr>
              )}
            </tbody>

            {rataRata && (
              <tfoot>
                <tr className="bg-gray-100 font-semibold">
                  <td colSpan="3" className="p-2 border text-right">
                    Nilai Akhir
                  </td>
                  <td colSpan="2" className="p-2 border">
                    {rataRata}
                  </td>
                  <td className="p-2 border"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Mapel;
