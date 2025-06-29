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
        Schema::create('assessments', function (Blueprint $table) {
            $table->id();
            
            $table->unsignedBigInteger('ulangan_setting_id');
            $table->unsignedBigInteger('user_id');
            
            $table->float('nilai')->nullable();

            $table->timestamps();

            // Foreign key constraints
            $table->foreign('ulangan_setting_id')
                  ->references('id')
                  ->on('ulangan_settings')
                  ->onDelete('cascade');

            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');

            // Optional: Ensure unique assessment per user per setting
            $table->unique(['ulangan_setting_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessments');
    }
};
