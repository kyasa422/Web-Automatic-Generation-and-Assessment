<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subject extends Model
{
    use HasUuids, SoftDeletes;

    protected $guarded = ['created_at', 'updated_at', 'deleted_at'];
    protected $table = 'subjects';
    protected $fillable = [
        'name',
        'context',
        'created_by',
        'updated_by',
    ];
    public function questions()
    
{
    return $this->hasMany(Question::class, 'subjectId');
}

}

