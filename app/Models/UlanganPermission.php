<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UlanganPermission extends Model
{
    use HasFactory;

    protected $fillable = [
        'ulangan_setting_id',
        'permission_id',
    ];

    public function setting()
    {
        return $this->belongsTo(UlanganSetting::class, 'ulangan_setting_id');
    }

    public function permission()
    {
        return $this->belongsTo(\Spatie\Permission\Models\Permission::class);
    }
}
