<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Guru;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\LapPemasukanCabang;
use App\Models\LapPengeluaranCabang;
use Inertia\Response;
use Spatie\Permission\Models\Permission;




class SiswaController extends Controller
{
    public function index(Request $request): Response
    {
  



        return Inertia::render('Siswa/Index', [

            'permissions' => Auth::user()->getPermissionNames(), // Kirim permission ke React


        ]);
    }
}
