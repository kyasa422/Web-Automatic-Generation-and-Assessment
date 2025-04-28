<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('ulangan_jawabans', function (Blueprint $table) {
            $table->uuid('question_inquiry_id')->nullable()->after('question_id');
    
            $table->foreign('question_inquiry_id')
                ->references('id')
                ->on('question_inquiries')
                ->onDelete('cascade');
        });
    }
    
    
    public function down()
    {
        Schema::table('ulangan_jawabans', function (Blueprint $table) {
            $table->dropForeign(['question_inquiry_id']);
            $table->dropColumn('question_inquiry_id');
            $table->foreignId('question_id')->constrained(); // optionally bring back
        });
    }
    
};
