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
        Schema::create('layanan', function (Blueprint $table) {
            $table->id('id_layanan');
            $table->foreignId('id_user')->constrained('users', 'id')->onDelete('cascade');
            $table->foreignId('id_kategori')->constrained('kategori_layanan', 'id_kategori')->onDelete('cascade');
            $table->date('tanggal_pengajuan');
            $table->foreignId('id_status')->constrained('status_layanan', 'id_status')->onDelete('cascade');
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('layanan');
    }
};
