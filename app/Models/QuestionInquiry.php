<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class QuestionInquiry extends Model
{
    use HasUuids;
    protected $guarded = ['created_at', 'updated_at'];

    public function multipleChoice()
{
    return $this->hasMany(MultipleChoice::class, 'questionInquiryId');
}

}
