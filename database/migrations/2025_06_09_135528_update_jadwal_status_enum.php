<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('jadwal', function (Blueprint $table) {
            $table->enum('status_jadwal', ['Pending', 'Disetujui', 'Ditolak', 'Selesai', 'Cancel'])
                  ->default('Pending')
                  ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jadwal', function (Blueprint $table) {
            $table->enum('status_jadwal', ['Aktif', 'Cancel', 'Selesai'])
                  ->default('Aktif')
                  ->change();
        });
    }
};
