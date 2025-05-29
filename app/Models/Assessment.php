<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'ulangan_setting_id',
        'user_id',
        'nilai',
    ];

    // Relasi ke ulangan_setting
    public function ulanganSetting()
    {
    return $this->belongsTo(UlanganSetting::class, 'ulangan_setting_id');
    }

    // Relasi ke user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke task collections (anak)
    public function taskCollections()
    {
        return $this->hasMany(Task_collections::class);
    }

    // Relasi ke setting
    public function setting()
    {
        return $this->belongsTo(UlanganSetting::class, 'ulangan_setting_id');
    }




}
