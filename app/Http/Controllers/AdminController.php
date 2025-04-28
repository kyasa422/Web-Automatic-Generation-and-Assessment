<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Contracts\View\View;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Auth;
use App\Models\Subject;
use App\Models\Cabangalbri;
use App\Models\LapPemasukanCabang;
use App\Models\LapPengeluaranCabang;
use App\Models\LapPemasukanMitra;
use App\Models\LapPengeluaranMitra;
use App\Models\LapPemasukanPrivate;
use App\Models\LapPengeluaranPrivate;






class AdminController extends Controller
{
    public function index(Request $request)
    {
        $mitraData = User::whereHas('roles', function ($query) {
            $query->where('name', 'Mitra');
        })
            ->latest()
            ->paginate(5, ['*'], 'mitraPage'); // pagination untuk mitra

        $userData = User::with('roles') // Mengambil data roles juga
            ->latest()
            ->paginate(5, ['*'], 'userPage');

        $guruData = User::whereHas('roles', function ($query) {
            $query->where('name', 'Guru');
        })
            ->with(['roles' => function ($query) {
                $query->where('name', 'Guru');
            }])
            ->latest()
            ->paginate(5, ['*'], 'guruPage');

        $cabangs = Cabangalbri::all();



        $bulan = $request->input('bulan', date('m'));
        $tahun = $request->input('tahun', date('Y'));

        // Filter data berdasarkan bulan dan tahun
        $laporanCabang = LapPemasukanCabang::with('cabang')
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->orderBy('tanggal', 'desc')
            ->paginate(10, ['*'], 'laporanCabangPage'); // Sesuaikan jumlah per halaman

            $laporanPengeluaranCabang = LapPengeluaranCabang::with('cabang', 'user')
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->orderBy('tanggal', 'desc')
            ->paginate(10, ['*'], 'laporanCabangPage');

            $laporanMitra = LapPemasukanMitra::whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->orderBy('tanggal', 'desc')
            ->paginate(10, ['*'], 'laporanMitraPage'); // Sesuaikan jumlah per halaman
        $laporanPengeluaranMitra = LapPengeluaranMitra::with('user')
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->orderBy('tanggal', 'desc')
            ->paginate(10, ['*'], 'laporanMitraPage');
            $laporanPrivate = LapPemasukanPrivate::whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->orderBy('tanggal', 'desc')
            ->paginate(10, ['*'], 'laporanPrivatePage'); // Sesuaikan jumlah per halaman
            $laporanPengeluaranPrivate = LapPengeluaranPrivate::with('user')
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->orderBy('tanggal', 'desc')
            ->paginate(10, ['*'], 'laporanPrivatePage');

        return Inertia::render('Admin/Dashboard', [
            'mitraData' => $mitraData,
            'userData' => $userData,
            'guruData' => $guruData,
            'cabangs' => $cabangs,

            'laporanCabang' => $laporanCabang,
            'laporanPengeluaranCabang' => $laporanPengeluaranCabang,
            'laporanMitra' => $laporanMitra,
            'laporanPengeluaranMitra' => $laporanPengeluaranMitra,

            'laporanPrivate' => $laporanPrivate,
            'laporanPengeluaranPrivate' => $laporanPengeluaranPrivate,


        ]);
    }

    public function guru()
    {
        $privateData = User::whereHas('roles', function ($query) {
            $query->where('name', 'Guru');
        })->with(['roles' => function ($query) {
            $query->where('name', 'Guru');
        }])
            ->latest()
            ->paginate(5, ['*'], 'privatePage'); // pagination untuk private
        return Inertia::render('Admin/Guru', [
            'privateData' => $privateData,
        ]);
    }


    public function settings(Request $request): Response
    {
        return Inertia::render('Admin/settings', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        if ($request->user()->hasRole('Private')) {
            return Redirect::route('private.settings')->with('success', 'Profil berhasil diperbarui.');
        } else if ($request->user()->hasRole('Admin')) {
            return Redirect::route('admin.settings')->with('success', 'Profil berhasil diperbarui.');
        } else if ($request->user()->hasRole('Guru')) {
            return Redirect::route('guru.settings')->with('success', 'Profil berhasil diperbarui.');
        } else if ($request->user()->hasRole('Mitra')) {
            return Redirect::route('mitra.settings')->with('success', 'Profil berhasil diperbarui.');
        }

        return Redirect::route('admin.settings');
    }

    public function subject()
    {
        $subjects = Subject::with('questions')->latest()->paginate(5, ['*'], 'subjectPage');
        return Inertia::render('Admin/Matapelajaran/index', [
            'subjects' => $subjects,
        ]);
    
    }

    public function createSubject(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
    
        Subject::create([
            'name' => $request->name,
        ]);
    
        return redirect()->back()->with('success', 'Subject created successfully.');
    }


    public function updateSubject(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $subject = Subject::findOrFail($id);
        $subject->update([
            'name' => $request->name,
            // 'updated_by' => Auth::user()->id,
        ]);

        return redirect()->route('admin.subject')->with('success', 'Subject updated successfully.');
    }
    public function deleteSubject($id)
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();

        return redirect()->back()->with('success', 'Subject deleted successfully.');
    }




 







}
