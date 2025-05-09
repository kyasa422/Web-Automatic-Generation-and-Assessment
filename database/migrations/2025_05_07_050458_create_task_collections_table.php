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
        Schema::create('task_collections', function (Blueprint $table) {
            $table->id();

            // Relasi ke tabel assessments
            $table->unsignedBigInteger('assessment_id');
            $table->foreign('assessment_id')->references('id')->on('assessments')->onDelete('cascade');

            // Relasi ke question_inquiries
            $table->uuid('question_inquiry_id');
            $table->foreign('question_inquiry_id')->references('id')->on('question_inquiries')->onDelete('cascade');
            

            // Relasi ke ulangan_jawabans
            $table->uuid('question_id'); // dari ulangan_jawabans
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('ulangan_setting_id');

            $table->foreign(['question_id'])->references('id')->on('questions')->onDelete('cascade');
            $table->foreign(['user_id'])->references('id')->on('users')->onDelete('cascade');
            $table->foreign(['ulangan_setting_id'])->references('id')->on('ulangan_settings')->onDelete('cascade');

            // Informasi tambahan
            $table->text('catatan')->nullable();
            $table->float('skor')->default(0);
            $table->boolean('is_correct')->default(false);

            $table->timestamps();

            // Optional: pastikan satu task unik per kombinasi assessment + question
            $table->unique(['assessment_id', 'question_inquiry_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_collections');
    }
};
