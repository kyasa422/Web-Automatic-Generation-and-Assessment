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
        return $this->belongsTo(UlanganSetting::class);
    }

    // Relasi ke user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke task collections (anak)
    public function taskCollections()
    {
        return $this->hasMany(TaskCollection::class);
    }
}
