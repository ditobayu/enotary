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
        Schema::create('notifikasi', function (Blueprint $table) {
            $table->id('id_notifikasi');
            $table->foreignId('id_user')->constrained('users', 'id')->onDelete('cascade');
            $table->text('isi_pesan');
            $table->timestamp('tanggal_kirim');
            $table->boolean('status_baca')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifikasi');
    }
};
