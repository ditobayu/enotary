<?php

use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\ClientUserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\KategoriLayananController;
use App\Http\Controllers\LayananController;
use App\Http\Controllers\NotifikasiController;
use App\Http\Controllers\JadwalController;
use App\Http\Controllers\LogAktivitasController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Service request routes for all authenticated users
    Route::resource('layanan', LayananController::class);
    
    // Document management routes
    Route::get('dokumen/{dokumen}/download', [LayananController::class, 'downloadDokumen'])->name('dokumen.download');
    Route::post('layanan/{layanan}/upload-dokumen', [LayananController::class, 'uploadDokumen'])->name('layanan.upload-dokumen');
    Route::post('layanan/{layanan}/bulk-upload-dokumen', [LayananController::class, 'bulkUploadDokumen'])->name('layanan.bulk-upload-dokumen');
    Route::get('layanan/{layanan}/document-stats', [LayananController::class, 'getDocumentStats'])->name('layanan.document-stats');
    Route::post('validate-file-upload', [LayananController::class, 'validateFileUpload'])->name('validate.file.upload');
    Route::delete('dokumen/{dokumen}', [LayananController::class, 'deleteDokumen'])->name('dokumen.delete');
    
    // Admin-only layanan status update (admin and superadmin can access)
    Route::patch('layanan/{layanan}/status', [LayananController::class, 'updateStatus'])
         ->name('layanan.update-status')
         ->middleware('role:admin|superadmin');
    
    // Notification routes for clients
    Route::middleware('role:client')->group(function () {
        Route::get('notifikasi', [NotifikasiController::class, 'index'])->name('notifikasi.index');
        Route::get('notifikasi/{notifikasi}', [NotifikasiController::class, 'show'])->name('notifikasi.show');
        Route::patch('notifikasi/{notifikasi}/read', [NotifikasiController::class, 'markAsRead'])->name('notifikasi.mark-read');
        Route::post('notifikasi/mark-all-read', [NotifikasiController::class, 'markAllAsRead'])->name('notifikasi.mark-all-read');
        Route::get('api/notifikasi/unread-count', [NotifikasiController::class, 'getUnreadCount'])->name('notifikasi.unread-count');
    });
    
    // Jadwal routes
    Route::get('jadwal', [JadwalController::class, 'index'])->name('jadwal.index');
    Route::get('layanan/{id_layanan}/jadwal/create', [JadwalController::class, 'create'])->name('jadwal.create');
    Route::post('jadwal', [JadwalController::class, 'store'])->name('jadwal.store');
    Route::patch('jadwal/{jadwal}/cancel', [JadwalController::class, 'cancel'])->name('jadwal.cancel');
    
    // Admin jadwal routes (must be before {jadwal} route) - admin and superadmin can access
    Route::middleware('role:admin|superadmin')->group(function () {
        Route::get('jadwal/pending', [JadwalController::class, 'pending'])->name('jadwal.pending');
        Route::patch('jadwal/{jadwal}/status', [JadwalController::class, 'updateStatus'])->name('jadwal.update-status');
    });
    
    Route::get('jadwal/{jadwal}', [JadwalController::class, 'show'])->name('jadwal.show');
});

// Admin Routes - admin and superadmin can access
Route::middleware(['auth', 'role:admin|superadmin'])->group(function () {
    Route::resource('kategori-layanan', KategoriLayananController::class);
    
    // Client User Management Routes
    Route::get('client-users', [ClientUserController::class, 'index'])->name('client-users.index');
    Route::get('client-users/{clientUser}', [ClientUserController::class, 'show'])->name('client-users.show');
    Route::get('client-users/{clientUser}/layanan', [ClientUserController::class, 'layanan'])->name('client-users.layanan');
    Route::get('client-users/{clientUser}/jadwal', [ClientUserController::class, 'jadwal'])->name('client-users.jadwal');
    
    // Rekap Data Routes
    Route::get('rekap-data', [App\Http\Controllers\RekapDataController::class, 'index'])->name('rekap-data.index');
    Route::get('rekap-data/export', [App\Http\Controllers\RekapDataController::class, 'export'])->name('rekap-data.export');
});

// Superadmin Routes
Route::middleware(['auth', 'role:superadmin'])->group(function () {
    Route::resource('admin-users', AdminUserController::class);
    Route::patch('admin-users/{adminUser}/toggle-status', [AdminUserController::class, 'toggleStatus'])->name('admin-users.toggle-status');
    
    // Log Aktivitas Routes
    Route::get('log-aktivitas', [LogAktivitasController::class, 'index'])->name('log-aktivitas.index');
    Route::get('log-aktivitas/{logAktivitas}', [LogAktivitasController::class, 'show'])->name('log-aktivitas.show');
});

require __DIR__.'/auth.php';
