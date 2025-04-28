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
        Schema::create('ulangan_settings', function (Blueprint $table) {
            $table->id();
            $table->uuid('question_id');
            $table->foreign('question_id')->references('id')->on('questions')->onDelete('cascade');
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->timestamps();
        });
    }
    


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ulangan_settings');
    }
};
