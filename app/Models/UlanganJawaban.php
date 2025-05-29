<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UlanganJawaban extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'ulangan_setting_id',
        'question_inquiry_id',
        'question_id',
        'answer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function setting()
    {
        return $this->belongsTo(UlanganSetting::class, 'ulangan_setting_id');
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
    public function questionInquiry()
    {
    return $this->belongsTo(QuestionInquiry::class);
    }
    public function ulanganpermission()
    {
        return $this->hasMany(UlanganPermission::class);
    }

    // UlanganJawaban.php
public function assessment()
{
    return $this->hasOne(Assessment::class, 'user_id', 'user_id')
        ->whereColumn('ulangan_setting_id', 'ulangan_setting_id');
}

}
