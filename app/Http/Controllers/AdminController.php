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







class AdminController extends Controller
{
    public function index(Request $request)
{
    $userData = User::with('roles')
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

    // ✅ Hitung total
    $totalUsers = User::count();

    $totalGurus = User::whereHas('roles', function ($query) {
        $query->where('name', 'Guru');
    })->count();

    $totalStudents = User::whereHas('roles', function ($query) {
        $query->where('name', 'Siswa');
    })->count();

    $totalSubjects = Subject::count();

    return Inertia::render('Admin/Dashboard', [
        'userData' => $userData,
        'guruData' => $guruData,

        // ✅ Tambahkan ke frontend
        'totalUsers' => $totalUsers,
        'totalGurus' => $totalGurus,
        'totalStudents' => $totalStudents,
        'totalSubjects' => $totalSubjects,
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
        } else if ($request->user()->hasRole('Siswa')) {
            return Redirect::route('siswa.settings')->with('success', 'Profil berhasil diperbarui.');
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
