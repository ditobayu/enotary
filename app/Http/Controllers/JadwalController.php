<?php

namespace App\Http\Controllers;

use App\Models\Jadwal;
use App\Models\Layanan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JadwalController extends Controller
{
    /**
     * Display a listing of appointments for current user
     */
    public function index()
    {
        $user = Auth::user();
        
        if ($user->hasAnyRole(['admin', 'superadmin'])) {
            // Admin/superadmin bisa melihat semua jadwal
            $jadwals = Jadwal::with(['layanan', 'user'])
                            ->orderBy('tanggal_janji', 'desc')
                            ->paginate(10);
        } else {
            // Client hanya bisa melihat jadwal mereka sendiri
            $jadwals = Jadwal::with(['layanan', 'user'])
                            ->where('id_user', $user->id)
                            ->orderBy('tanggal_janji', 'desc')
                            ->paginate(10);
        }

        return Inertia::render('Jadwal/Index', [
            'jadwals' => $jadwals
        ]);
    }

    /**
     * Show the form for creating a new appointment
     */
    public function create($id_layanan)
    {
        $layanan = Layanan::findOrFail($id_layanan);
        
        // Pastikan hanya client yang bisa membuat janji temu
        if (!Auth::user()->hasRole('client')) {
            return redirect()->back()->with('error', 'Hanya client yang dapat membuat janji temu');
        }

        return Inertia::render('Jadwal/Create', [
            'layanan' => $layanan
        ]);
    }

    /**
     * Store a newly created appointment
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_layanan' => 'required|exists:layanan,id_layanan',
            'tanggal_janji' => 'required|date|after:today',
            'jam_janji' => 'required|date_format:H:i'
        ]);

        // Pastikan hanya client yang bisa membuat janji temu
        if (!Auth::user()->hasRole('client')) {
            return redirect()->back()->with('error', 'Hanya client yang dapat membuat janji temu');
        }

        Jadwal::create([
            'id_user' => Auth::id(),
            'id_layanan' => $request->id_layanan,
            'tanggal_janji' => $request->tanggal_janji,
            'jam_janji' => $request->jam_janji,
            'status_jadwal' => 'Pending'
        ]);

        return redirect()->route('jadwal.index')->with('success', 'Janji temu berhasil diajukan dan menunggu persetujuan');
    }

    /**
     * Display the specified appointment
     */
    public function show(Jadwal $jadwal)
    {
        $jadwal->load(['layanan', 'user']);
        
        // Pastikan user hanya bisa melihat jadwal mereka sendiri (kecuali admin/superadmin)
        if (!Auth::user()->hasAnyRole(['admin', 'superadmin']) && $jadwal->id_user !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Jadwal/Show', [
            'jadwal' => $jadwal
        ]);
    }

    /**
     * Update appointment status (admin only)
     */
    public function updateStatus(Request $request, Jadwal $jadwal)
    {
        \Log::info('updateStatus called', [
            'jadwal_id' => $jadwal->id_jadwal,
            'request_data' => $request->all(),
            'user_id' => Auth::id(),
            'user_roles' => Auth::user()->roles->pluck('name')
        ]);

        // Pastikan hanya admin/superadmin yang bisa mengupdate status
        if (!Auth::user()->hasAnyRole(['admin', 'superadmin'])) {
            return redirect()->back()->with('error', 'Tidak memiliki akses untuk mengupdate status');
        }

        $request->validate([
            'status_jadwal' => 'required|in:Pending,Disetujui,Ditolak,Selesai,Cancel'
        ]);

        $jadwal->update([
            'status_jadwal' => $request->status_jadwal
        ]);

        return redirect()->back()->with('success', 'Status jadwal berhasil diupdate');
    }

    /**
     * Cancel appointment (client can cancel their own pending appointments)
     */
    public function cancel(Jadwal $jadwal)
    {
        // Pastikan user hanya bisa cancel jadwal mereka sendiri
        if ($jadwal->id_user !== Auth::id()) {
            abort(403);
        }

        // Hanya bisa cancel jika status masih pending atau disetujui
        if (!in_array($jadwal->status_jadwal, ['Pending', 'Disetujui'])) {
            return redirect()->back()->with('error', 'Jadwal tidak dapat dibatalkan');
        }

        $jadwal->update([
            'status_jadwal' => 'Cancel'
        ]);

        return redirect()->back()->with('success', 'Jadwal berhasil dibatalkan');
    }

    /**
     * Get pending appointments for admin dashboard
     */
    public function pending()
    {
        // Pastikan hanya admin/superadmin yang bisa mengakses
        if (!Auth::user()->hasAnyRole(['admin', 'superadmin'])) {
            abort(403);
        }

        $jadwals = Jadwal::with(['layanan', 'user'])
                        ->where('status_jadwal', 'Pending')
                        ->orderBy('tanggal_janji', 'asc')
                        ->paginate(10);

        return Inertia::render('Jadwal/Pending', [
            'jadwals' => $jadwals
        ]);
    }
}
