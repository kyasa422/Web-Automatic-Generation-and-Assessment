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
use App\Models\Assessment;
use App\Models\Task_collections;


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
    public function delete($id)
    {
        
        try{
            $question = Question::find($id);
        if ($question->teacherId != auth()->user()->id) {
            return back()->with('success','Anda tidak memiliki akses!');
        }

        $question->delete();

            return back()->with('success','Berhasil dihapus!');
        }catch(\Exception $e){
            dd($e);
            return back()->with('error','Ada kesalahan pada server');
        }
    }



    public function generatesoal(Request $request): Response
    {
        $subject = Subject::select("id", "name")
            ->orderBy("name", "asc")
            ->get();
        return Inertia::render('Guru/Generate/soalesaipdf', [
            'subject' => $subject,
        ]);



    }

    public function store(Request $request)
    {
        // dd($request->all());
        $totalBobot = collect($request->response)->sum(function ($item) {
            return floatval($item['bobot'] ?? 0);
        });

        if ($totalBobot > 100) {
            return response()->json([
                'message' => 'Total bobot tidak boleh lebih dari 100.'
            ], 422);
        }

        try {
            DB::transaction(function () use ($request) {
                $question = Question::create([
                    'teacherId' => auth()->user()->id,
                    'subjectId' => $request->subject,
                    'classLevel' => $request->class,
                    'examLevel' => $request->type,
                ]);


                foreach ($request->response as $row) {
                    $questionInquiry = QuestionInquiry::create([
                        'questionId' => $question->id,
                        'question' => $row['question'],
                        'answer' => $row['answerType'] === "ESSAY" ? $row['answer'] : null,
                        'bobot' => $row['weight'],
                        'label' => $row['label'] ?? null,
                    ]);

                    if ($row['answerType'] === 'MULTIPLE_CHOICE') {
                        foreach ($row['multipleChoice'] as $choice) {
                            MultipleChoice::create([
                                'questionInquiryId' => $questionInquiry->id,
                                'isCorrect' => $choice['isCorrect'],
                                'text' => $choice['text'],
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

    public function storepdf(Request $request)
    {
        // Validasi total bobot
        $totalBobot = collect($request->response)->sum(function ($item) {
            return floatval($item['bobot'] ?? 0);
        });

        if ($totalBobot > 100) {
            return response()->json([
                'message' => 'Total bobot tidak boleh lebih dari 100.'
            ], 422);
        }

        try {
            DB::transaction(function () use ($request) {
                $question = Question::create([
                    'teacherId' => auth()->user()->id,
                    'subjectId' => $request->subjectId,
                    'classLevel' => $request->classLevel,
                    'examLevel' => $request->examLevel,
                ]);

                foreach ($request->response as $row) {
                    $questionInquiry = QuestionInquiry::create([
                        'questionId' => $question->id,
                        'question' => $row['question'],
                        'answer' => $row['type'] === "ESSAY" ? $row['answer'] : null,
                        'bobot' => $row['bobot'],
                    ]);

                    if ($row['type'] === 'MULTIPLE_CHOICE') {
                        foreach ($row['multipleChoice'] as $choice) {
                            MultipleChoice::create([
                                'questionInquiryId' => $questionInquiry->id,
                                'isCorrect' => $choice['isCorrect'],
                                'text' => $choice['text'],
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
        return Inertia::render('Guru/Generate/soalesai', [
            'subject' => $subject,
        ]);
    }

    public function show($id): Response
    {
        $question = Question::with([
            'subject:id,name',
            'teacher:id,name',
            'questionInquiries' => function ($query) {
                $query->select('id', 'questionId', 'question', 'answer', 'bobot')
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
            ->whereHas('question') // HANYA ambil data yang question-nya masih ada (tidak soft-deleted)
            ->with([
                'question' => function ($q) {
                    $q->with(['subject:id,name', 'teacher:id,name']);
                },
                'permissions.permission', // eager load permission di dalam permissions

            ])
            ->withCount([
                'ulanganJawabanMany' => function ($query) {
                    $query->select(DB::raw('count(distinct(user_id))'));
                }
            ])
            ->get();

        return Inertia::render('Guru/Rekap/index', [
            'examSettings' => $examSeetings,
        ]);
    }
    public function updateUlanganSetting(Request $request, $id)
    {
        $request->validate([
            'question_id' => 'required|exists:questions,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'permissions' => 'required|array',
        ]);

        DB::beginTransaction();

        try {
            $setting = UlanganSetting::where('id', $id)
                ->where('created_by', auth()->id())
                ->firstOrFail();

            // Update nilai utama
            $setting->update([
                'question_id' => $request->question_id,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
            ]);

            // Hapus permissions lama
            UlanganPermission::where('ulangan_setting_id', $setting->id)->delete();

            // Tambahkan permission baru
            foreach ($request->permissions as $permissionId) {
                UlanganPermission::create([
                    'ulangan_setting_id' => $setting->id,
                    'permission_id' => $permissionId,
                ]);
            }

            DB::commit();
return redirect()->route('guru.rekapsoal')->with('success', 'Pengaturan berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->with('error', 'Gagal memperbarui pengaturan ulangan: ' . $e->getMessage());
        }
    }


    public function editUlanganSetting($id)
    {
        $setting = UlanganSetting::with('permissions')->findOrFail($id);

        return Inertia::render('Guru/Rekap/Edit', [
            'setting' => $setting,
            'all_permissions' => Permission::all(['id', 'name']),
        ]);
    }


    public function destroyUlanganSetting($id)
    {
        $setting = UlanganSetting::where('id', $id)
            ->where('created_by', auth()->id())
            ->firstOrFail();

        $setting->delete();

        return back()->with('success', 'Ulangan berhasil dihapus.');
    }





    public function showsiswa($questionId): Response
    {
        $examAnswer = UlanganJawaban::where('ulangan_setting_id', $questionId)
            ->select('user_id', 'ulangan_setting_id')
            ->with([
                'setting.question.subject',
                'user',
            ])
            ->groupBy('user_id', 'ulangan_setting_id')
            ->get()
            ->map(function ($jawaban) {
                $nilai = Assessment::where('user_id', $jawaban->user_id)
                    ->where('ulangan_setting_id', $jawaban->ulangan_setting_id)
                    ->value('nilai');
                $jawaban->nilai = $nilai;
                return $jawaban;
            });

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
                'question.questionInquiries' => function ($query) {
                    $query->select('id', 'questionId', 'question', 'answer', 'bobot', 'label');
                    $query->with('multipleChoice');
                },
                'ulanganJawabanMany' => function ($query) use ($userId) {
                    $query->where('user_id', '=', $userId);
                    $query->orderBy('created_at', 'desc');
                    $query->with([
                        'questionInquiry.multipleChoice'
                    ]);
                }
            ])
            ->first();

        return Inertia::render('Guru/Rekap/DetailJawaban', [
            'ulanganSettings' => $ulanganSettings,
        ]);
    }


    public function storenilaisiswa(Request $request)
    {
        // Cek apakah siswa sudah dinilai sebelumnya
        $existingAssessment = Assessment::where('ulangan_setting_id', $request->ulangan_setting_id)
            ->where('user_id', $request->user_id)
            ->first();

        if ($existingAssessment) {
            return back()->with('error', 'Siswa sudah dinilai sebelumnya dan tidak bisa dinilai lagi.');
        }

        // Validasi data
        $request->validate([
            'ulangan_setting_id' => 'required|exists:ulangan_settings,id',
            'user_id' => 'required|exists:users,id',
            'nilai' => 'required|numeric',
            'detail' => 'required|array',
            'detail.*.questionId' => 'required|exists:question_inquiries,id',
            'detail.*.score' => 'required|numeric',
            'detail.*.note' => 'nullable|string',
            'detail.*.isCorrect' => 'required|boolean',
        ]);

        // Simpan assessment baru
        $assessment = Assessment::create([
            'ulangan_setting_id' => $request->ulangan_setting_id,
            'user_id' => $request->user_id,
            'nilai' => $request->nilai,
        ]);

        foreach ($request->detail as $item) {
            Task_collections::create([
                'assessment_id' => $assessment->id,
                'question_inquiry_id' => $item['questionId'],
                'skor' => $item['score'],
                'catatan' => $item['note'],
                'is_correct' => $item['isCorrect'],
                'user_id' => $request->user_id,
                'ulangan_setting_id' => $request->ulangan_setting_id,
                'question_id' => QuestionInquiry::where('id', $item['questionId'])->value('questionId'),
            ]);
        }

        return back()->with('success', 'Penilaian berhasil disimpan.');
    }


}
