<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Question extends Model
{
    use HasUuids, SoftDeletes;
    protected $guarded = ['created_at', 'updated_at', 'deleted_at'];

    public function questionInquiry()
    {
        return $this->hasMany(QuestionInquiry::class, 'question_id', 'id');
    }
    public function teacher()
{
    return $this->belongsTo(User::class, 'teacherId');
}

public function subject()
{
    return $this->belongsTo(Subject::class, 'subjectId');
}

public function questionInquiries()
{
    return $this->hasMany(QuestionInquiry::class, 'questionId');
}
public function ulanganJawaban()
{
    return $this->hasMany(UlanganJawaban::class, 'questionId');
}
public function user()
{
    return $this->belongsTo(User::class);
}

public function ulanganSettings()
{
    return $this->hasMany(UlanganSetting::class, 'question_id', 'id');
}


}
