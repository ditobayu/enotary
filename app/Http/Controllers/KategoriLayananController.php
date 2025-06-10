<?php

namespace App\Http\Controllers;

use App\Models\KategoriLayanan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class KategoriLayananController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $kategoriLayanan = KategoriLayanan::withCount('layanan')
            ->orderBy('nama_kategori')
            ->get();

        return Inertia::render('KategoriLayanan/Index', [
            'kategoriLayanan' => $kategoriLayanan
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('KategoriLayanan/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:255|unique:kategori_layanan,nama_kategori'
        ]);

        KategoriLayanan::create($validated);

        return redirect()->route('kategori-layanan.index')
            ->with('success', 'Kategori layanan berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(KategoriLayanan $kategoriLayanan): Response
    {
        $kategoriLayanan->load(['layanan' => function($query) {
            $query->with('user');
        }]);

        return Inertia::render('KategoriLayanan/Show', [
            'kategoriLayanan' => $kategoriLayanan
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(KategoriLayanan $kategoriLayanan): Response
    {
        return Inertia::render('KategoriLayanan/Edit', [
            'kategoriLayanan' => $kategoriLayanan
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, KategoriLayanan $kategoriLayanan): RedirectResponse
    {
        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:255|unique:kategori_layanan,nama_kategori,' . $kategoriLayanan->id_kategori . ',id_kategori'
        ]);

        $kategoriLayanan->update($validated);

        return redirect()->route('kategori-layanan.index')
            ->with('success', 'Kategori layanan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(KategoriLayanan $kategoriLayanan): RedirectResponse
    {
        // Check if kategori has layanan
        if ($kategoriLayanan->layanan()->count() > 0) {
            return redirect()->route('kategori-layanan.index')
                ->with('error', 'Kategori layanan tidak dapat dihapus karena masih memiliki layanan terkait.');
        }

        $kategoriLayanan->delete();

        return redirect()->route('kategori-layanan.index')
            ->with('success', 'Kategori layanan berhasil dihapus.');
    }
}
