<?php

namespace App\Http\Controllers;

use App\Models\Notifikasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotifikasiController extends Controller
{
    /**
     * Display a listing of notifications for the authenticated user.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        // Only allow clients to access their own notifications
        if (!$user->roles->contains('name', 'client')) {
            abort(403, 'Unauthorized access');
        }

        $query = Notifikasi::where('id_user', $user->id)
            ->orderBy('tanggal_kirim', 'desc');

        // Filter by read status if specified
        if ($request->has('status') && $request->status !== '') {
            $query->where('status_baca', $request->status === 'read' ? 1 : 0);
        }

        $notifikasi = $query->paginate(10)->withQueryString();

        return Inertia::render('Notifikasi/Index', [
            'notifikasi' => $notifikasi,
            'filters' => [
                'status' => $request->status ?? ''
            ]
        ]);
    }

    /**
     * Display the specified notification.
     */
    public function show(Notifikasi $notifikasi)
    {
        $user = Auth::user();
        
        // Ensure user can only access their own notifications
        if ($notifikasi->id_user !== $user->id || !$user->roles->contains('name', 'client')) {
            abort(403, 'Unauthorized access');
        }

        // Mark as read if not already read
        if (!$notifikasi->status_baca) {
            $notifikasi->update(['status_baca' => true]);
        }

        return Inertia::render('Notifikasi/Show', [
            'notifikasi' => $notifikasi
        ]);
    }

    /**
     * Mark notification as read.
     */
    public function markAsRead(Notifikasi $notifikasi)
    {
        $user = Auth::user();
        
        // Ensure user can only modify their own notifications
        if ($notifikasi->id_user !== $user->id || !$user->roles->contains('name', 'client')) {
            abort(403, 'Unauthorized access');
        }

        $notifikasi->update(['status_baca' => true]);

        return response()->json(['success' => true]);
    }

    /**
     * Mark all notifications as read for the authenticated user.
     */
    public function markAllAsRead()
    {
        $user = Auth::user();
        
        if (!$user->roles->contains('name', 'client')) {
            abort(403, 'Unauthorized access');
        }

        Notifikasi::where('id_user', $user->id)
            ->where('status_baca', false)
            ->update(['status_baca' => true]);

        return response()->json(['success' => true]);
    }

    /**
     * Get unread notification count for the authenticated user.
     */
    public function getUnreadCount()
    {
        $user = Auth::user();
        
        if (!$user->roles->contains('name', 'client')) {
            return response()->json(['count' => 0]);
        }

        $count = Notifikasi::where('id_user', $user->id)
            ->where('status_baca', false)
            ->count();

        return response()->json(['count' => $count]);
    }
}
