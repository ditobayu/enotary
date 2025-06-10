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
        Schema::create('jadwal', function (Blueprint $table) {
            $table->id('id_jadwal');
            $table->foreignId('id_user')->constrained('users', 'id')->onDelete('cascade');
            $table->foreignId('id_layanan')->constrained('layanan', 'id_layanan')->onDelete('cascade');
            $table->date('tanggal_janji');
            $table->time('jam_janji');
            $table->enum('status_jadwal', ['Aktif', 'Cancel', 'Selesai'])->default('Aktif');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jadwal');
    }
};
