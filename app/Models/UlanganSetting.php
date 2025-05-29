<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UlanganSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'question_id',
        'start_time',
        'end_time',
        'created_by',
    ];

    public function question()
    {
        return $this->belongsTo(Question::class, 'question_id', 'id');
    }

// App\Models\UlanganSetting.php

public function permissions()
{
    return $this->hasMany(\App\Models\UlanganPermission::class);
}

public function ulanganJawabanMany(){
    return $this->hasMany(UlanganJawaban::class, "ulangan_setting_id", "id"); 
}

public function ulanganJawabanHasOne(){
    return $this->hasOne(UlanganJawaban::class, "ulangan_setting_id", "id"); 
}

public function assessment()
{
    return $this->hasMany(Assessment::class, 'ulangan_setting_id', 'id');
}



}
