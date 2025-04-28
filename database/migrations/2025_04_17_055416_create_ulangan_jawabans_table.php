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
        Schema::create('ulangan_jawabans', function (Blueprint $table) {
            $table->uuid('question_id');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreign('question_id')->references('id')->on('questions')->onDelete('cascade');
            $table->foreignId('ulangan_setting_id')->constrained()->onDelete('cascade');
            $table->text('answer');
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ulangan_jawabans');
    }
};
