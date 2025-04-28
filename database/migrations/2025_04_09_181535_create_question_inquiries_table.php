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
        Schema::create('question_inquiries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('questionId');
            $table->string('question');
            $table->string('answer');
            $table->timestamps();

            $table->foreign('questionId')->references('id')->on('questions')->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_inquiries');
    }
};
