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
        Schema::create('questions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->bigInteger('teacherId')->unsigned();
            $table->uuid('subjectId');
            $table->integer('classLevel');
            $table->boolean('examLevel');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('teacherId')->references('id')->on('users')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('subjectId')->references('id')->on('subjects')->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
