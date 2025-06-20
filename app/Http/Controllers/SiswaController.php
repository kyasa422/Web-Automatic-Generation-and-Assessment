<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Guru;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\UlanganJawaban;
use App\Models\UlanganSetting;
use App\Models\Question;
use App\Models\QuestionInquiry;
use App\Models\Subject;
use App\Models\Assessment;
use App\Models\MultipleChoice;

use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Log;




class SiswaController extends Controller
{
public function index()
{
    $user = auth()->user();
    $userPermissionIds = $user->permissions->pluck('id');
    $now = now()->setTimezone('Asia/Jakarta');

    $availableExams = UlanganSetting::with(['question.subject', 'question.teacher', 'permissions.permission'])
        ->whereHas('permissions', function ($query) use ($userPermissionIds) {
            $query->whereIn('permission_id', $userPermissionIds);
        })
        ->where('start_time', '<=', $now)
        ->where('end_time', '>=', $now)
        ->withCount([
            'ulanganJawabanMany' => function ($query) use ($user) {
                $query->where('user_id', "=", $user->id);
            }
        ])
        ->get();

        return Inertia::render('Siswa/Index', [
        'permissions' => $user->getPermissionNames(),
        'available_exams' => $availableExams,
    ]);
}


public function showUjian(\App\Models\UlanganSetting $ulanganSetting)
{
    $ulanganSetting->load([
        'question.subject',
        'question.teacher',
        'question.questionInquiries.multipleChoice'
    ]);

    return Inertia::render('Siswa/Ujian', [
        'ulangan' => $ulanganSetting,
    ]);
}


public function submitUjian(Request $request, \App\Models\UlanganSetting $ulanganSetting)
{


    logger()->info('User:', ['id' => auth()->id()]);
    logger()->info('Data:', $request->all());
 


    
    $ulanganSetting->load(['question.questionInquiries']);
    $ulanganSetting->load([
        'question.questionInquiries.multipleChoice'
    ]);
    
    
    $request->validate([
        'answers' => 'required|array',
        'answers.*.question_inquiry_id' => 'required|exists:question_inquiries,id',
        'answers.*.answer' => 'required|string',
    ]);

    foreach ($request->answers as $answer) {
        logger()->info('Jawaban diproses:', $answer);

            UlanganJawaban::create([
            'user_id' => auth()->id(),
            'ulangan_setting_id' => $ulanganSetting->id,
            'question_id' => $ulanganSetting->question_id, // 
            'question_inquiry_id' => $answer['question_inquiry_id'],
            'answer' => $answer['answer'],
        ]);
    }


    return redirect()->route('siswa.dashboard')->with('success', 'Ujian berhasil dikumpulkan!');
}

public function showUjianResult()
{
    $userId = auth()->id();

    $assessments = Assessment::where('user_id', $userId)
        ->with([
            'setting.question.subject',
            'user',
        ])
        ->get();

    return Inertia::render('Siswa/mapel', [
        'assessments' => $assessments,
    ]);
}

public function showAssessmentDetail(Assessment $assessment)
{
    $assessment->load([
        'user',
        'setting.question.subject',
        'taskCollections.question',
        'taskCollections.questionInquiry',
        'taskCollections.questionInquiry.multipleChoice',
        'taskCollections.questionInquiry.ulanganJawaban' => function ($query) use($assessment) {
            $query->where('user_id', '=', auth()->id());
            $query->whereHas("setting", function($query) use($assessment){
                $query->whereHas('assessment', function($query) use($assessment){
                    $query->where('id', '=', $assessment->id);
                });
            });
        },
    ]);

    return Inertia::render('Siswa/AssessmentDetail', [
        'assessment' => $assessment,
    ]);
}






    
    
    
}
