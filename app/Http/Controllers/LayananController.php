<?php

namespace App\Http\Controllers;

use App\Models\Layanan;
use App\Models\KategoriLayanan;
use App\Models\StatusLayanan;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class LayananController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $statusFilter = $request->input('status');
        
        // Build query based on user role
        if ($user->hasAnyRole(['admin', 'superadmin'])) {
            $query = Layanan::with(['kategori', 'status', 'user']);
        } else {
            $query = Layanan::with(['kategori', 'status'])
                ->where('id_user', $user->id);
        }
        
        // Apply status filter if provided
        if ($statusFilter) {
            $query->whereHas('status', function ($q) use ($statusFilter) {
                $q->where('nama_status', $statusFilter);
            });
        }
        
        $layanan = $query->orderBy('tanggal_pengajuan', 'desc')->get();
        
        // Get all status layanan for admin and superadmin users
        $statusLayanan = $user->hasAnyRole(['admin', 'superadmin']) ? StatusLayanan::orderBy('nama_status')->get() : [];

        return Inertia::render('Layanan/Index', [
            'layanan' => $layanan,
            'statusFilter' => $statusFilter,
            'statusLayanan' => $statusLayanan
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $kategoriLayanan = KategoriLayanan::orderBy('nama_kategori')->get();
        
        return Inertia::render('Layanan/Create', [
            'kategoriLayanan' => $kategoriLayanan
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id_kategori' => 'required|exists:kategori_layanan,id_kategori',
            'keterangan' => 'required|string|min:10|max:1000',
            'dokumen' => 'nullable|array|max:10', // Allow up to 10 files
            'dokumen.*' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png,xls,xlsx|max:10240' // 10MB max per file
        ]);

        // Get status "Pengajuan" (default for new requests)
        $statusPengajuan = StatusLayanan::where('nama_status', 'Pengajuan')->first();
        
        if (!$statusPengajuan) {
            return redirect()->back()
                ->withErrors(['error' => 'Status pengajuan tidak ditemukan. Hubungi administrator.']);
        }

        $layanan = Layanan::create([
            'id_user' => Auth::id(),
            'id_kategori' => $validated['id_kategori'],
            'tanggal_pengajuan' => now()->toDateString(),
            'id_status' => $statusPengajuan->id_status,
            'keterangan' => $validated['keterangan']
        ]);

        $uploadedFiles = [];
        $uploadedCount = 0;

        // Handle document uploads
        if ($request->hasFile('dokumen')) {
            foreach ($request->file('dokumen') as $file) {
                try {
                    $dokumen = $this->storeDocument($file, $layanan->id_layanan);
                    $uploadedFiles[] = $dokumen->nama_dokumen;
                    $uploadedCount++;
                } catch (\Exception $e) {
                    // Log error but continue with other files
                    Log::error('Failed to upload document during layanan creation: ' . $e->getMessage());
                }
            }
        }

        // Log aktivitas
        $aktivitasText = 'Mengajukan layanan: ' . $layanan->kategori->nama_kategori;
        if ($uploadedCount > 0) {
            $aktivitasText .= ' dengan ' . $uploadedCount . ' dokumen (' . implode(', ', $uploadedFiles) . ')';
        }

        LogAktivitas::create([
            'id_user' => Auth::id(),
            'aktivitas' => $aktivitasText,
            'tanggal_waktu' => now()
        ]);

        $successMessage = 'Permohonan layanan berhasil diajukan. Kami akan segera memproses permintaan Anda.';
        if ($uploadedCount > 0) {
            $successMessage .= ' Total ' . $uploadedCount . ' dokumen berhasil diupload.';
        }

        return redirect()->route('layanan.index')
            ->with('success', $successMessage);
    }

    /**
     * Display the specified resource.
     */
    public function show(Layanan $layanan): Response
    {
        $user = Auth::user();
        
        // Check authorization - clients can only view their own layanan
        if (!$user->hasAnyRole(['admin', 'superadmin']) && $layanan->id_user !== $user->id) {
            abort(403, 'Anda tidak memiliki akses ke layanan ini.');
        }

        $layanan->load(['kategori', 'status', 'user', 'dokumen', 'jadwal']);
        
        // Get all status layanan for admin/superadmin users
        $statusLayanan = $user->hasAnyRole(['admin', 'superadmin']) ? StatusLayanan::orderBy('nama_status')->get() : [];

        return Inertia::render('Layanan/Show', [
            'layanan' => $layanan,
            'statusLayanan' => $statusLayanan
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Layanan $layanan): Response
    {
        $user = Auth::user();
        
        // Check authorization - clients can only edit their own layanan and only if status is "Pengajuan"
        if (!$user->hasAnyRole(['admin', 'superadmin']) && ($layanan->id_user !== $user->id || $layanan->status->nama_status !== 'Pengajuan')) {
            abort(403, 'Anda tidak dapat mengedit layanan ini.');
        }

        $kategoriLayanan = KategoriLayanan::orderBy('nama_kategori')->get();
        $layanan->load(['kategori', 'status']);

        return Inertia::render('Layanan/Edit', [
            'layanan' => $layanan,
            'kategoriLayanan' => $kategoriLayanan
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Layanan $layanan): RedirectResponse
    {
        $user = Auth::user();
        
        // Check authorization
        if (!$user->hasAnyRole(['admin', 'superadmin']) && ($layanan->id_user !== $user->id || $layanan->status->nama_status !== 'Pengajuan')) {
            abort(403, 'Anda tidak dapat mengedit layanan ini.');
        }

        $validated = $request->validate([
            'id_kategori' => 'required|exists:kategori_layanan,id_kategori',
            'keterangan' => 'required|string|min:10|max:1000'
        ]);

        $layanan->update($validated);

        // Log aktivitas
        LogAktivitas::create([
            'id_user' => Auth::id(),
            'aktivitas' => 'Mengupdate layanan: ' . $layanan->kategori->nama_kategori,
            'tanggal_waktu' => now()
        ]);

        return redirect()->route('layanan.index')
            ->with('success', 'Layanan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Layanan $layanan): RedirectResponse
    {
        $user = Auth::user();
        
        // Check authorization - clients can only delete their own layanan and only if status is "Pengajuan"
        if (!$user->hasAnyRole(['admin', 'superadmin']) && ($layanan->id_user !== $user->id || $layanan->status->nama_status !== 'Pengajuan')) {
            abort(403, 'Anda tidak dapat menghapus layanan ini.');
        }

        // Log aktivitas before deletion
        LogAktivitas::create([
            'id_user' => Auth::id(),
            'aktivitas' => 'Menghapus layanan: ' . $layanan->kategori->nama_kategori,
            'tanggal_waktu' => now()
        ]);

        $layanan->delete();

        return redirect()->route('layanan.index')
            ->with('success', 'Layanan berhasil dihapus.');
    }

    /**
     * Update status layanan (admin and superadmin only)
     */
    public function updateStatus(Request $request, Layanan $layanan): RedirectResponse
    {
        // Check if user is admin or superadmin
        if (!Auth::user()->hasAnyRole(['admin', 'superadmin'])) {
            abort(403, 'Hanya admin atau superadmin yang dapat mengubah status layanan.');
        }

        $validated = $request->validate([
            'id_status' => 'required|exists:status_layanan,id_status',
            'keterangan_admin' => 'nullable|string|max:500'
        ]);

        $oldStatus = $layanan->status->nama_status;
        $layanan->update([
            'id_status' => $validated['id_status']
        ]);

        $newStatus = StatusLayanan::find($validated['id_status'])->nama_status;

        // Log aktivitas for admin
        LogAktivitas::create([
            'id_user' => Auth::id(),
            'aktivitas' => 'Mengubah status layanan dari "' . $oldStatus . '" menjadi "' . $newStatus . '" (ID Layanan: ' . $layanan->id_layanan . ')',
            'tanggal_waktu' => now()
        ]);

        // Log aktivitas for client
        LogAktivitas::create([
            'id_user' => $layanan->id_user,
            'aktivitas' => 'Status layanan Anda berubah dari "' . $oldStatus . '" menjadi "' . $newStatus . '"',
            'tanggal_waktu' => now()
        ]);

        // Create notification for client
        \App\Models\Notifikasi::create([
            'id_user' => $layanan->id_user,
            'isi_pesan' => 'Status layanan Anda (ID: ' . $layanan->id_layanan . ') telah diubah menjadi: ' . $newStatus . 
                          ($validated['keterangan_admin'] ? '. Keterangan: ' . $validated['keterangan_admin'] : ''),
            'tanggal_kirim' => now(),
            'status_baca' => 0
        ]);

        return redirect()->back()
            ->with('success', 'Status layanan berhasil diperbarui menjadi: ' . $newStatus);
    }

    /**
     * Download dokumen
     */
    public function downloadDokumen(\App\Models\Dokumen $dokumen)
    {
        $user = Auth::user();
        
        // Check authorization - clients can only download their own documents, admin/superadmin can download all
        if (!$user->hasAnyRole(['admin', 'superadmin']) && $dokumen->layanan->id_user !== $user->id) {
            abort(403, 'Anda tidak memiliki akses ke dokumen ini.');
        }

        $filePath = storage_path('app/public/' . $dokumen->file_path);
        
        if (!file_exists($filePath)) {
            abort(404, 'File tidak ditemukan.');
        }

        return response()->download($filePath, $dokumen->nama_dokumen);
    }

    /**
     * Upload additional dokumen (for existing layanan)
     */
    public function uploadDokumen(Request $request, Layanan $layanan)
    {
        $user = Auth::user();
        
        // Check authorization using helper method
        if (!$this->canClientModifyDocuments($layanan, $user)) {
            if ($layanan->id_user === $user->id) {
                return redirect()->back()
                    ->withErrors(['error' => 'Anda tidak dapat menambah dokumen pada layanan dengan status "' . $layanan->status->nama_status . '"']);
            } else {
                abort(403, 'Anda tidak memiliki akses ke layanan ini.');
            }
        }

        $request->validate([
            'dokumen' => 'required|array|min:1|max:10', // Allow 1-10 files at once
            'dokumen.*' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png,xls,xlsx|max:10240' // 10MB max per file
        ]);

        $uploadedCount = 0;
        $uploadedFiles = [];
        
        if ($request->hasFile('dokumen')) {
            foreach ($request->file('dokumen') as $file) {
                try {
                    $dokumen = $this->storeDocument($file, $layanan->id_layanan);
                    $uploadedFiles[] = $dokumen->nama_dokumen;
                    $uploadedCount++;
                } catch (\Exception $e) {
                    // Log error but continue with other files
                    Log::error('Failed to upload document: ' . $e->getMessage());
                }
            }
        }

        // Log aktivitas
        LogAktivitas::create([
            'id_user' => Auth::id(),
            'aktivitas' => 'Mengupload ' . $uploadedCount . ' dokumen untuk layanan ID: ' . $layanan->id_layanan . ' (' . implode(', ', $uploadedFiles) . ')',
            'tanggal_waktu' => now()
        ]);

        // If user is client and uploaded to their own layanan, create notification for admin
        if (!$user->hasAnyRole(['admin', 'superadmin']) && $adminUser = $this->getAdminUser()) {
            \App\Models\Notifikasi::create([
                'id_user' => $adminUser->id,
                'isi_pesan' => 'Client ' . $user->name . ' telah mengupload ' . $uploadedCount . ' dokumen baru untuk layanan ID: ' . $layanan->id_layanan,
                'tanggal_kirim' => now(),
                'status_baca' => 0
            ]);
        }

        return redirect()->back()
            ->with('success', $uploadedCount . ' dokumen berhasil diupload: ' . implode(', ', $uploadedFiles));
    }

    /**
     * Delete dokumen
     */
    public function deleteDokumen(\App\Models\Dokumen $dokumen)
    {
        $user = Auth::user();
        
        // Load layanan relationship to check status
        $dokumen->load('layanan.status');
        
        // Check authorization using helper method
        if (!$this->canClientModifyDocuments($dokumen->layanan, $user)) {
            if ($dokumen->layanan->id_user === $user->id) {
                return redirect()->back()
                    ->withErrors(['error' => 'Anda tidak dapat menghapus dokumen pada layanan dengan status "' . $dokumen->layanan->status->nama_status . '"']);
            } else {
                abort(403, 'Anda tidak dapat menghapus dokumen ini.');
            }
        }

        $dokumenName = $dokumen->nama_dokumen;
        $layananId = $dokumen->id_layanan;

        // Delete physical file
        $filePath = storage_path('app/public/' . $dokumen->file_path);
        if (file_exists($filePath)) {
            unlink($filePath);
        }

        // Log aktivitas before deletion
        LogAktivitas::create([
            'id_user' => Auth::id(),
            'aktivitas' => 'Menghapus dokumen: ' . $dokumenName . ' dari layanan ID: ' . $layananId,
            'tanggal_waktu' => now()
        ]);

        $dokumen->delete();

        // If user is client and deleted from their own layanan, create notification for admin
        if (!$user->hasAnyRole(['admin', 'superadmin']) && $adminUser = $this->getAdminUser()) {
            \App\Models\Notifikasi::create([
                'id_user' => $adminUser->id,
                'isi_pesan' => 'Client ' . $user->name . ' telah menghapus dokumen "' . $dokumenName . '" dari layanan ID: ' . $layananId,
                'tanggal_kirim' => now(),
                'status_baca' => 0
            ]);
        }

        return redirect()->back()
            ->with('success', 'Dokumen "' . $dokumenName . '" berhasil dihapus.');
    }

    /**
     * Get first admin user for notifications
     */
    private function getAdminUser()
    {
        return \App\Models\User::role('admin')->first();
    }

    /**
     * Generate unique filename for uploaded document
     */
    private function generateUniqueFileName($originalName, $layananId)
    {
        $fileInfo = pathinfo($originalName);
        $extension = isset($fileInfo['extension']) ? $fileInfo['extension'] : '';
        $baseName = isset($fileInfo['filename']) ? $fileInfo['filename'] : 'document';
        
        return time() . '_' . uniqid() . '_' . $layananId . '_' . $baseName . '.' . $extension;
    }

    /**
     * Store document file and create database record
     */
    private function storeDocument($file, $layananId)
    {
        $originalName = $file->getClientOriginalName();
        $fileName = $this->generateUniqueFileName($originalName, $layananId);
        $filePath = $file->storeAs('documents/layanan_' . $layananId, $fileName, 'public');
        
        return \App\Models\Dokumen::create([
            'id_layanan' => $layananId,
            'nama_dokumen' => $originalName,
            'file_path' => $filePath,
            'tanggal_upload' => now()
        ]);
    }

    /**
     * Check if client can modify documents for this layanan status
     */
    private function canClientModifyDocuments($layanan, $user)
    {
        if ($user->hasAnyRole(['admin', 'superadmin'])) {
            return true;
        }
        
        if ($layanan->id_user !== $user->id) {
            return false;
        }
        
        $allowedStatuses = ['Pengajuan', 'Dalam Proses', 'Butuh Dokumen Tambahan'];
        return in_array($layanan->status->nama_status, $allowedStatuses);
    }

    /**
     * Bulk upload dokumen untuk layanan tertentu
     */
    public function bulkUploadDokumen(Request $request, Layanan $layanan)
    {
        $user = Auth::user();
        
        // Check authorization using helper method
        if (!$this->canClientModifyDocuments($layanan, $user)) {
            if ($layanan->id_user === $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak dapat menambah dokumen pada layanan dengan status "' . $layanan->status->nama_status . '"'
                ], 403);
            } else {
                abort(403, 'Anda tidak memiliki akses ke layanan ini.');
            }
        }

        $request->validate([
            'dokumen' => 'required|array|min:1|max:15', // Allow 1-15 files at once
            'dokumen.*' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png,xls,xlsx|max:10240'
        ]);

        $uploadedFiles = [];
        $failedFiles = [];
        
        foreach ($request->file('dokumen') as $index => $file) {
            try {
                $dokumen = $this->storeDocument($file, $layanan->id_layanan);
                $uploadedFiles[] = $dokumen->nama_dokumen;
            } catch (\Exception $e) {
                $failedFiles[] = $file->getClientOriginalName();
            }
        }

        // Log aktivitas
        if (count($uploadedFiles) > 0) {
            LogAktivitas::create([
                'id_user' => Auth::id(),
                'aktivitas' => 'Bulk upload ' . count($uploadedFiles) . ' dokumen untuk layanan ID: ' . $layanan->id_layanan,
                'tanggal_waktu' => now()
            ]);

            // Notify admin if client uploaded
            if (!$user->hasAnyRole(['admin', 'superadmin']) && $adminUser = $this->getAdminUser()) {
                \App\Models\Notifikasi::create([
                    'id_user' => $adminUser->id,
                    'isi_pesan' => 'Client ' . $user->name . ' telah mengupload ' . count($uploadedFiles) . ' dokumen baru untuk layanan ID: ' . $layanan->id_layanan,
                    'tanggal_kirim' => now(),
                    'status_baca' => 0
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'uploaded_count' => count($uploadedFiles),
            'failed_count' => count($failedFiles),
            'uploaded_files' => $uploadedFiles,
            'failed_files' => $failedFiles,
            'message' => count($uploadedFiles) . ' dokumen berhasil diupload' . 
                        (count($failedFiles) > 0 ? ', ' . count($failedFiles) . ' dokumen gagal diupload' : '')
        ]);
    }

    /**
     * Get document statistics for a layanan
     */
    public function getDocumentStats(Layanan $layanan)
    {
        $user = Auth::user();
        
        // Check authorization
        if (!$user->hasAnyRole(['admin', 'superadmin']) && $layanan->id_user !== $user->id) {
            abort(403, 'Anda tidak memiliki akses ke layanan ini.');
        }

        $totalDocuments = $layanan->dokumen()->count();
        $totalFileSize = $layanan->dokumen()->sum('file_size') ?? 0; // Assuming you add file_size column
        
        $documentTypes = $layanan->dokumen()
            ->selectRaw('SUBSTRING_INDEX(nama_dokumen, ".", -1) as extension, COUNT(*) as count')
            ->groupBy('extension')
            ->get();

        return response()->json([
            'total_documents' => $totalDocuments,
            'total_file_size' => $totalFileSize,
            'document_types' => $documentTypes,
            'can_upload' => $this->canClientModifyDocuments($layanan, $user),
            'allowed_extensions' => ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'xls', 'xlsx'],
            'max_file_size' => 10240, // 10MB in KB
            'max_files_per_upload' => 10
        ]);
    }

    /**
     * Validate file before upload
     */
    public function validateFileUpload(Request $request)
    {
        $request->validate([
            'files' => 'required|array|max:10',
            'files.*' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png,xls,xlsx|max:10240'
        ]);

        $validFiles = [];
        $invalidFiles = [];

        foreach ($request->file('files') as $file) {
            $fileInfo = [
                'name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'extension' => $file->getClientOriginalExtension(),
                'mime_type' => $file->getMimeType()
            ];

            // Additional validation
            if ($file->getSize() > 10485760) { // 10MB
                $invalidFiles[] = array_merge($fileInfo, ['error' => 'File terlalu besar (maksimal 10MB)']);
            } elseif (!in_array(strtolower($file->getClientOriginalExtension()), ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'xls', 'xlsx'])) {
                $invalidFiles[] = array_merge($fileInfo, ['error' => 'Tipe file tidak didukung']);
            } else {
                $validFiles[] = $fileInfo;
            }
        }

        return response()->json([
            'valid_files' => $validFiles,
            'invalid_files' => $invalidFiles,
            'can_proceed' => count($invalidFiles) === 0
        ]);
    }
}
