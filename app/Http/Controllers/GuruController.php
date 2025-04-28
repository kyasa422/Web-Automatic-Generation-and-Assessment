<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Guru;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

use App\Models\MultipleChoice;
use App\Models\Question;
use App\Models\QuestionInquiry;
use App\Models\Subject;
use Illuminate\Support\Facades\DB;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use App\Models\UlanganSetting;
use App\Models\UlanganPermission;
use App\Models\UlanganJawaban; 








class GuruController extends Controller
{
    public function index(Request $request): Response
    {
       
        $questions = Question::with(['subject:id,name', 'teacher:id,name']) // relasi subject & user
        ->select('id', 'teacherId', 'subjectId', 'classLevel', 'examLevel')
        ->get();

    return Inertia::render('Guru/Index', [
        'questions' => $questions,
    ]);
    }

    public function generatesoal(Request $request): Response
    {
        return Inertia::render('Guru/Generate/Index');
    }

    public function store(Request $request)
    {
        try {
            DB::transaction(function () use ($request) {
                $question = Question::create([
                    'teacherId' => auth()->user()->id,
                    'subjectId' => $request->subjectId,
                    'classLevel' => $request->classLevel,
                    'examLevel' => $request->examLevel
                ]);

                foreach ($request->response as $key => $row) {
                    $questionInquiry = QuestionInquiry::create([
                        'questionId' => $question->id,
                        'question' => $row['question'],
                        'answer' => $row['type'] === "ESSAY" ? $row['answer'] : null,
                    ]);

                    if ($row['type'] === 'MULTIPLE_CHOICE') {
                        foreach ($row['multipleChoice'] as $key => $row) {
                            MultipleChoice::create([
                                'questionInquiryId' => $questionInquiry->id,
                                'isCorrect' => $row['isCorrect'],
                                'text' => $row['text']
                            ]);
                        }
                    }
                }
            });

            return back()->with('success', "Berhasil membuat soal!");
        } catch (\Exception $e) {
            if (config('app.debug')) {
                dd($e);
            }

            return back()->with('error', "Terjadi kesalahan pada server!");
        }
    }

    public function soalesai(Request $request): Response
    {
        $subject = Subject::select("id", "name")
            ->orderBy("name", "asc")
            ->get();
        return Inertia::render('Guru/Generate/soalesai',  [
            'subject' => $subject,
        ]);
    }

    public function show($id): Response
{
    $question = Question::with([
        'subject:id,name',
        'teacher:id,name',
      'questionInquiries' => function ($query) {
    $query->select('id', 'questionId', 'question', 'answer')
          ->with('multipleChoice');
}

    ])->findOrFail($id);

    return Inertia::render('Guru/DetailBankSoal', [
        'question' => $question,
        'permissions' => Permission::all(['id', 'name']),
    ]);
}

public function setUlangan(Request $request)
{

    $request->validate([
        'question_id' => 'required|exists:questions,id',
        'start_time' => 'required|date',
        'end_time' => 'required|date|after:start_time',
        'permissions' => 'required|array',
    ]);


    // Simpan jadwal & akses ke DB (buat model baru jika perlu)
    $setting = UlanganSetting::create([
        'question_id' => $request->question_id,
        'start_time' => $request->start_time,
        'end_time' => $request->end_time,
        'created_by' => Auth::user()->id, // Assuming you are using Laravel's Auth
    ]);
    
    foreach ($request->permissions as $permissionId) {
        UlanganPermission::create([
            'ulangan_setting_id' => $setting->id,
            'permission_id' => $permissionId,
        ]);
    }
    

    return back()->with('success', 'Pengaturan ulangan berhasil disimpan.');
    }

    public function rekapsoal(Request $request): Response
    {
        $examSeetings = UlanganSetting::where('created_by', auth()->id())
        ->with(['question.subject:id,name', 'question.teacher:id,name'])
        ->withCount([
            'ulanganJawabanMany' => function($query){
               $query->select(DB::raw('count(distinct(user_id))'));
            }
        ])
        ->get();

    return Inertia::render('Guru/Rekap/index', [
        'examSettings' => $examSeetings,
    ]);
}

    


public function showsiswa($questionId): Response
{
    $examAnswer = UlanganJawaban::where('ulangan_setting_id', '=', $questionId)
    ->groupBy('user_id')
    ->with([
        'setting.question.subject',
        'user'
    ])
    ->get();
  

    return Inertia::render('Guru/Rekap/Detail', [
        'examAnswer' => $examAnswer,
    ]);
}



public function detailJawaban($ulanganSettings, $userId): \Inertia\Response
{
    $ulanganSettings = UlanganSetting::where('id', '=', $ulanganSettings)
    ->with([
        'ulanganJawabanHasOne.user',
        'question.subject',
        'ulanganJawabanMany' => function($query)use($userId) {
            $query->where('user_id', '=', $userId);
            $query->orderBy('created_at', 'desc');
            $query->with([
                'questionInquiry.multipleChoice'
            ]);
        }
    ])
    ->first();

      // Ambil semua jawaban siswa untuk soal tersebut
    // $jawabanSiswa = UlanganJawaban::with([
    //     'questionInquiry.multipleChoice',
    //     'question','user:id,name','question.subject:id,name'
    // ])
    // ->where('user_id', $userId)
    // ->where('question_id', $questionId)
    // ->orderBy('created_at', 'desc')
    // ->get();

    return Inertia::render('Guru/Rekap/DetailJawaban', [
        'ulanganSettings' => $ulanganSettings,
    ]);
}

}
