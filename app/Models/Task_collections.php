<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task_collections extends Model
{
    use HasFactory;

    protected $fillable = [
        'assessment_id',
        'question_inquiry_id',
        'question_id',
        'user_id',
        'ulangan_setting_id',
        'catatan',
        'skor',
        'is_correct',
    ];

    // Relasi ke Assessment
    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }

    // Relasi ke QuestionInquiry
    public function questionInquiry()
    {
        return $this->belongsTo(QuestionInquiry::class);
    }

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke UlanganSetting
    public function ulanganSetting()
    {
        return $this->belongsTo(UlanganSetting::class);
    }

    // Relasi ke Question
    public function question()
    {
        return $this->belongsTo(Question::class, 'question_id', 'id');
    }
}
