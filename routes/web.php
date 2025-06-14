<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CabangController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MitraController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\GuruController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\PermissionController;


use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\PrivateController;
use Inertia\Inertia;

// Route::get('/login', function () {
//     return Inertia::render('Auth/Login', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// })->middleware('guest');

Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login');


Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth', 'web');
//permision
Route::middleware(['auth', 'role:Admin'])->group(function () {
    Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions.index');
    Route::post('/permissions', [PermissionController::class, 'store'])->name('permissions.store');
    Route::put('/permissions/{permission}', [PermissionController::class, 'update'])->name('permissions.update');
    Route::delete('/permissions/{permission}', [PermissionController::class, 'destroy'])->name('permissions.destroy');
});


// Admin Controll users Admin
Route::get('/admin/usersadmin', [UserController::class, 'indexadmin'])
    ->middleware(['auth', 'role:Admin'])
    ->name('admin.users');

Route::get('/admin/usersadmin/create', [UserController::class, 'createadmin'])
    ->middleware(['auth', 'role:Admin'])
    ->name('admin.usersadmin.create');

Route::post('/admin/usersadmin', [UserController::class, 'storeadmin'])
    ->middleware(['auth', 'role:Admin'])
    ->name('admin.usersadmin.store');

// Admin Controll Users Guru
Route::get('/admin/usersguru', [UserController::class, 'index'])
    ->middleware(['auth', 'role:Admin'])
    ->name('admin.usersguru');

Route::get('/admin/usersguru/create', [UserController::class, 'create'])
    ->middleware(['auth', 'role:Admin'])
    ->name('admin.users.create');

Route::post('/admin/users', [UserController::class, 'store'])
    ->middleware(['auth', 'role:Admin'])
    ->name('admin.users.store');

Route::get('/admin/users/{id}', [UserController::class, 'show'])
    ->middleware(['auth', 'role:Admin'])
    ->name('admin.users.show');

Route::get('/admin/users/{id}/edit', [UserController::class, 'edit'])
    ->middleware(['auth', 'role:Admin'])
    ->name('admin.users.edit');

Route::put('/admin/users/{id}', [UserController::class, 'update'])
    ->middleware(['auth', 'role:Admin|Guru|Private|Mitra'])
    ->name('admin.users.update');

Route::delete('/admin/users/{id}', [UserController::class, 'destroy'])
    ->middleware(['auth', 'role:Admin'])
    ->name('admin.users.destroy');

// Admin Controll Users Siswa
Route::get('/admin/userssiswa', [UserController::class, 'indexsiswa'])
    ->middleware(['auth', 'role:Admin'])
    ->name('admin.userssiswa');

Route::get('/admin/userssiswa/create', [UserController::class, 'createsiswa'])
    ->middleware(['auth', 'role:Admin'])
    ->name('admin.userssiswa.create');

Route::post('/admin/userssiswa', [UserController::class, 'storesiswa'])
    ->middleware(['auth', 'role:Admin'])
    ->name('admin.userssiswa.store');

Route::get('/admin/userssiswa/{id}', [UserController::class, 'showsiswa'])
    ->middleware(['auth', 'role:Admin'])
    ->name('admin.userssiswa.show');

Route::get('/admin/userssiswa/{id}/edit', [UserController::class, 'editsiswa'])
    ->middleware(['auth', 'role:Admin'])
    ->name('admin.userssiswa.edit');

Route::put('/admin/userssiswa/{id}', [UserController::class, 'updatesiswa'])
    ->middleware(['auth', 'role:Admin'])
    ->name('admin.userssiswa.update');

Route::delete('/admin/userssiswa/{id}', [UserController::class, 'destroysiswa'])
    ->middleware(['auth', 'role:Admin'])
    ->name('admin.userssiswa.destroy');








// Admin Controll Cabanggit
// Route::get('/admin/cabangs', [CabangController::class, 'index'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.cabangs');
// Route::get('/admin/cabang/create', [CabangController::class, 'create'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.cabangs.create');

// Route::post('/admin/cabang', [CabangController::class, 'store'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.cabangs.store');

// Route::get('/admin/cabang/{id}/edit', [CabangController::class, 'edit'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.cabangs.edit');
// Route::put('/admin/cabang/{id}', [CabangController::class, 'update'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.cabangs.update');
// Route::delete('/admin/cabang/{id}', [CabangController::class, 'destroy'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.cabangs.destroy');



Route::get('/admin/guru', [AdminController::class, 'guru'])
    ->middleware(['auth', 'role:Admin'])
    ->name('admin.guru');



/* -----------------------------------------
                            Settings 
            -------------------------------------------- */
Route::get('/admin/settings', [AdminController::class, 'settings'])
    ->middleware(['auth', 'role:Admin'])
    ->name('admin.settings');
Route::get('/guru/settings', [AdminController::class, 'settings'])
    ->middleware(['auth', 'role:Guru'])
    ->name('guru.settings');

Route::patch('/admin/settings', [AdminController::class, 'update'])
    ->middleware(['auth', 'role:Admin|Guru|Siswa'])
    ->name('admin.settings.update');

Route::get('/siswa/settings', [AdminController::class, 'settings'])
    ->middleware(['auth', 'role:Siswa'])
    ->name('siswa.settings');
    

/* -----------------------------------------
                            dashboard role 
            -------------------------------------------- */


Route::get('guru/dashboard', [GuruController::class, 'index'])
    ->middleware(['auth', 'role:Guru'])
    ->name('guru.dashboard');

// Route untuk Siswa
Route::get('/siswa/dashboard', [SiswaController::class, 'index'])
    ->middleware(['auth', 'role:Siswa'])
    ->name('siswa.dashboard');


Route::get('/admin/dashboard', function () {
    return Inertia::render('Admin/Dashboard');
})->middleware(['auth', 'role:Admin'])->name('admin.dashboard');

Route::get('/admin/dashboard', [AdminController::class, 'index'])
    ->middleware(['auth', 'role:Admin'])
    ->name('admin.dashboard');





Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


// Admin mata pelajaran
Route::get('/admin/subject', [AdminController::class, 'subject'])->name('admin.subject')
    ->middleware(['auth', 'role:Admin']);
Route::post('/admin/subject/store', [AdminController::class, 'createSubject'])->name('admin.subject.store')
    ->middleware(['auth', 'role:Admin']);

Route::post('/admin/subject/{id}/update', [AdminController::class, 'updateSubject'])
    ->middleware(['auth', 'role:Admin'])
    ->name('admin.subject.update');
Route::delete('/admin/subject/{id}', [AdminController::class, 'deleteSubject'])
    ->middleware(['auth', 'role:Admin'])
    ->name('admin.subject.destroy');
route::get('/admin/subject/create', [AdminController::class, 'createSubject'])->name('admin.subject.create')
    ->middleware(['auth', 'role:Admin']);

// Guru 
// Generate Soal Guru
Route::get('/guru/generated-soal', [GuruController::class, 'generatesoal'])
    ->middleware(['auth', 'role:Guru'])
    ->name('guru.generatesoal');

Route::get('/guru/generated-soal/create', [GuruController::class, 'soalesai'])
    ->middleware(['auth', 'role:Guru'])
    ->name('guru.generated-soal.create');
// Route::get('/guru/generetesoalpdf', [GuruController::class, 'soalesaipdf'])
//     ->middleware(['auth', 'role:Guru'])
//     ->name('guru.generated-soal.pdf');


Route::post('/guru/generated-soal', [GuruController::class, 'store'])->middleware(['auth', 'role:Guru'])->name('guru.generated-soal.store');
Route::post('/guru/generated-soalpdf', [GuruController::class, 'storepdf'])->middleware(['auth', 'role:Guru'])->name('guru.generated-soal.storepdf');




Route::get('/banksoal/{id}', [GuruController::class, 'show'])->name('banksoal.show')
->middleware(['auth','role:Guru']);

Route::delete('/banksoal/{id}', [GuruController::class, 'delete'])->name('banksoal.delete')
->middleware(['auth','role:Guru']);

Route::post('/guru/set-ulangan', [GuruController::class, 'setUlangan'])
->middleware(['auth','role:Guru']);

Route::get('/guru/set-ulangan/{ulanganSetting}', [GuruController::class, 'editUlanganSetting'])
->middleware(['auth','role:Guru'])
->name('guru.ulangan-setting.edit');


Route::put('/guru/set-ulangan/{ulanganSetting}', [GuruController::class, 'updateUlanganSetting'])
->middleware(['auth','role:Guru'])
->name('guru.ulangan-setting.update');

Route::delete('/guru/set-ulangan/{ulanganSetting}', [GuruController::class, 'destroyUlanganSetting'])
->middleware(['auth','role:Guru'])
->name('guru.ulangan-setting.destroy');


Route::get('/guru/rekapsoal', [GuruController::class, 'rekapsoal'])->name('guru.rekapsoal')
->middleware(['auth','role:Guru']);

Route::get('/guru/rekap/{question}', [GuruController::class, 'showsiswa'])->name('guru.rekap.showsiswa')
->middleware(['auth','role:Guru']);
Route::get('/guru/rekapsoal/{ulanganSettings}/{userId}', [GuruController::class, 'detailJawaban'])->name('guru.rekapsoal.show')
->middleware(['auth','role:Guru']);

Route::post('/assessments/store', [GuruController::class, 'storenilaisiswa'])->name('assessments.store')
->middleware(['auth','role:Guru']);


//Siswa
Route::middleware(['auth', 'role:Siswa'])->group(function () {
    Route::get('/siswa/ujian/{ulanganSetting}', [SiswaController::class, 'showUjian'])->name('siswa.ujian');
    Route::post('/siswa/ujian/{ulanganSetting}', [SiswaController::class, 'submitUjian'])->name('siswa.ujian.submit');
    Route::get('/siswa/hasilulangan', [SiswaController::class, 'showUjianResult'])->name('siswa.mapel');
Route::get('/siswa/hasil-ujian/{assessment}', [SiswaController::class, 'showAssessmentDetail'])
    ->name('siswa.hasilujian.detail');

});
// Route::get('/siswa/ujian/{ulanganSetting}/result', [SiswaController::class, 'showResult'])->name('siswa.ujian.result'); 

Route::redirect('/', '/login');
// Route::get('/', function () {
//     return Inertia::render('Albri');
// });

// Route::get('/users', function () {

// Route::group(['middleware' => ['auth']], function () {
//     Route::resource('roles', RoleController::class)->middleware('role:Admin');

//     // Route for displaying the list of users
//     Route::get('users', [App\Http\Controllers\UserController::class, 'index'])
//         ->name('users.index')
//         ->middleware('auth', 'verified',);

//     // Route for displaying the form to create a new user
//     Route::get('users/create', [App\Http\Controllers\UserController::class, 'create'])
//         ->name('users.create')
//         ->middleware('auth', 'verified', 'role:Admin');

//     // Route for storing a newly created user
//     Route::post('users', [App\Http\Controllers\UserController::class, 'store'])
//         ->name('users.store')
//         ->middleware('auth', 'verified', 'role:Admin');

//     // Route for displaying a specific user
//     Route::get('users/{id}', [App\Http\Controllers\UserController::class, 'show'])
//         ->name('users.show')
//         ->middleware('auth', 'verified', 'role:Admin');

//     // Route for displaying the form to edit an existing user
//     Route::get('users/{id}/edit', [App\Http\Controllers\UserController::class, 'edit'])
//         ->name('users.edit')
//         ->middleware('auth', 'verified', 'role:Admin');

//     // Route for updating an existing user
//     Route::put('users/{id}', [App\Http\Controllers\UserController::class, 'update'])
//         ->name('users.update')
//         ->middleware('auth', 'verified', 'role:Admin');

//     // Route for deleting a user
//     Route::delete('users/{id}', [App\Http\Controllers\UserController::class, 'destroy'])
//         ->name('users.destroy')
//         ->middleware('auth', 'verified', 'role:Admin');
// });
// Route::get('/laporan', function () {
//     return Inertia::render('Laporan.La');
// });




// Laporan Pemasukan Private Admin

// Route::get('/admin/laporan/private', [AdminController::class, 'privatelaporan'])
//     ->middleware(['auth', 'role:Admin|Private'])
//     ->name('admin.laporan.private');
// Route::get('/admin/laporan/private/create', [AdminController::class, 'createprivate'])
//     ->middleware(['auth', 'role:Admin|Private'])
//     ->name('admin.laporan.create');
// Route::post('/admin/laporan/private/store', [AdminController::class, 'storelaporanprivate'])
//     ->middleware(['auth', 'role:Admin|Private'])
//     ->name('admin.laporan.private.store');
// Route::get('/admin/laporan/private/{id}/edit', [AdminController::class, 'editlaporanprivate'])
//     ->middleware(['auth', 'role:Admin|Private'])
//     ->name('admin.laporan.show');
// Route::put('/admin/laporan/private/{id}', [AdminController::class, 'updatelaporanprivate'])
//     ->middleware(['auth', 'role:Admin|Private'])
//     ->name('admin.laporan.update');
// Route::delete('/admin/laporan/private/{id}', [AdminController::class, 'destroylaporanprivate'])
//     ->middleware(['auth', 'role:Admin|Private'])
//     ->name('admin.laporan.destroy');

// // Laporan Pengeluaran Private Admin
// Route::get('/admin/laporan/pengeluaranprivate/create', [AdminController::class, 'createpengeluaranprivatelaporan'])
//     ->middleware(['auth', 'role:Admin|Private'])
//     ->name('admin.laporan.pengeluaran.create');
// Route::post('/admin/laporan/pengeluaranprivate/store', [AdminController::class, 'storelaporanpengeluaranprivate'])
//     ->middleware(['auth', 'role:Admin|Private'])
//     ->name('admin.laporan.pengeluaran.store');
// Route::get('admin/laporan/pengeluaranprivate/{id}/edit', [AdminController::class, 'editpengeluaranprivate'])
//     ->middleware(['auth', 'role:Admin|Private'])
//     ->name('admin.laporan.pengeluaran.edit');
// Route::put('/admin/laporan/pengeluaranprivate/{id}', [AdminController::class, 'updatepengeluaranprivate'])
//     ->middleware(['auth', 'role:Admin|Private'])
//     ->name('admin.laporan.pengeluaran.update');
// Route::delete('/admin/laporan/pengeluaranprivate/{id}', [AdminController::class, 'destroypengeluaranprivate'])
//     ->middleware(['auth', 'role:Admin|Private'])
//     ->name('admin.laporan.pengeluaran.destroy');


// // Laporan Cabang Admin
// Route::get('/admin/laporan/cabang', [AdminController::class, 'cabanglaporan'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.laporan.cabang');
// Route::get('/admin/laporan/cabang/create', [AdminController::class, 'createcabanglaporan'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.laporan.create');
// Route::post('/admin/laporan/cabang/store', [AdminController::class, 'storelaporancabang'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.laporan.store');
// Route::get('/admin/laporan/cabang/{id}/edit', [AdminController::class, 'editlaporancabang'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.laporan.show');
// Route::put('/admin/laporan/cabang/{id}', [AdminController::class, 'updatelaporancabang'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.laporan.update');
// Route::delete('/admin/laporan/cabang/{id}', [AdminController::class, 'destroylaporancabang'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.laporan.destroy');

// // Laporan Pengeluaran Cabang Admin
// Route::get('/admin/laporan/pengeluaran/create', [AdminController::class, 'createcabanpengeluaranlaporan'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.laporan.pengeluaran.create');
// Route::post('/admin/laporan/pengeluaran/store', [AdminController::class, 'storelaporanpengeluaran'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.laporan.pengeluaran.store');
// Route::get('/admin/laporan/pengeluaran/{id}/edit', [AdminController::class, 'editpengeluarancabang'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.laporan.pengeluaran.show');
// Route::put('/admin/laporan/pengeluaran/{id}', [AdminController::class, 'updatepengeluarancabang'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.laporan.pengeluaran.update');
// Route::delete('/admin/laporan/pengeluaran/{id}', [AdminController::class, 'destroypengeluarancabang'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.laporan.pengeluaran.destroy');



// // Laporan Pemasukan Mitra Admin
// Route::get('/admin/laporan/mitra', [AdminController::class, 'mitralaporan'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.laporan.mitra');
// Route::get('/admin/laporan/mitra/create', [AdminController::class, 'createmitralaporan'])
//     ->middleware(['auth', 'role:Admin|Mitra'])
//     ->name('admin.laporan.create');
// Route::post('/admin/laporan/mitra/store', [AdminController::class, 'storelaporanmitra'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.laporan.mitra.store');
// Route::get('/admin/laporan/mitra/{id}/edit', [AdminController::class, 'editlaporanmitra'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.laporan.show');
// Route::put('/admin/laporan/mitra/{id}', [AdminController::class, 'updatelaporanmitra'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.laporan.update');
// Route::delete('/admin/laporan/mitra/{id}', [AdminController::class, 'destroylaporanmitra'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.laporan.destroy');

// // Laporan Pengeluaran Mitra Admin
// Route::get('/admin/laporan/pengeluaranmitra/create', [AdminController::class, 'createpengeluaranmitralaporan'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.laporan.pengeluaran.create');
// Route::post('/admin/laporan/pengeluaranmitra/store', [AdminController::class, 'storelaporanpengeluaranmitra'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.laporan.pengeluaran.store');
// Route::get('/admin/laporan/pengeluaranmitra/{id}/edit', [AdminController::class, 'editpengeluaranmitra'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.laporan.pengeluaran.show');
// Route::put('/admin/laporan/pengeluaranmitra/{id}', [AdminController::class, 'updatepengeluaranmitra'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.laporan.pengeluaran.update');
// Route::delete('/admin/laporan/pengeluaranmitra/{id}', [AdminController::class, 'destroypengeluaranmitra'])
//     ->middleware(['auth', 'role:Admin'])
//     ->name('admin.laporan.pengeluaran.destroy');

// Route::middleware(['auth', 'role:admin'])->group(function () {
//     Route::get('/admin/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
//     Route::resource('users', UserController::class);
// });



// Route::resource('cabangs', CabangController::class);


require __DIR__ . '/auth.php';
