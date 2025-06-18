import{q as E,j as a}from"./app-DXmyKgma.js";import{u as t}from"./store-BjfOGylm.js";import{G as T}from"./index-DiWJTiuy.js";const j=()=>{const{env:{GEMINI_API_KEY:o,GEMINI_MODEL_NAME:l},subject:p}=E().props,s=t(e=>e.request),c=t(e=>e.setRequest),n=t(e=>e.response),u=t(e=>e.updateResponse),r=t(e=>e.isLoading),i=t(e=>e.setIsLoading),C=e=>c(e.target),b=async()=>{try{i(n.length>0?"ADD":"ALL");const d=new T(o).getGenerativeModel({model:l}),m=p.find(h=>h.id==s.subject).name,y=s.type==0?"UTS":"UAS",w=`
Buatkan 5 soal berdasarkan parameter berikut:  
- class: ${s.class} 
- subject: ${m}
- type: ${y}
- answerType: ${s.answerType} 

Format respons yang HARUS digunakan:

- Jika answerType adalah "ESSAY":
[
  {
    "question": "pertanyaan 1",
    "answer": "jawaban 1",
    "answerType": "ESSAY",
    "label": "uraian_terbatas"
  },
  {
    "question": "pertanyaan 2",
    "answer": "jawaban 2",
    "answerType": "ESSAY",
    "label": "uraian_bebas"
  },
  {
    "question": "pertanyaan 3",
    "answer": "jawaban 3",
    "answerType": "ESSAY",
    "label": "uraian_terbatas"
  },
  {
    "question": "pertanyaan 4",
    "answer": "jawaban 4",
    "answerType": "ESSAY",
    "label": "uraian_bebas"
  },
  {
    "question": "pertanyaan 5",
    "answer": "jawaban 5",
    "answerType": "ESSAY",
    "label": "uraian_terbatas"
  }
]

- Jika answerType adalah "MULTIPLE_CHOICE":
[
  {
    "question": "pertanyaan 1",
    "answerType": "MULTIPLE_CHOICE",
    "multipleChoice": [
      { "text": "opsi A", "isCorrect": false },
      { "text": "opsi B", "isCorrect": true },
      { "text": "opsi C", "isCorrect": false },
      { "text": "opsi D", "isCorrect": false }
    ]
  },
  {
    "question": "pertanyaan 2",
    "answerType": "MULTIPLE_CHOICE",
    "multipleChoice": [
      { "text": "opsi A", "isCorrect": false },
      { "text": "opsi B", "isCorrect": false },
      { "text": "opsi C", "isCorrect": true },
      { "text": "opsi D", "isCorrect": false }
    ]
  },
  {
    "question": "pertanyaan 3",
    "answerType": "MULTIPLE_CHOICE",
    "multipleChoice": [
      { "text": "opsi A", "isCorrect": true },
      { "text": "opsi B", "isCorrect": false },
      { "text": "opsi C", "isCorrect": false },
      { "text": "opsi D", "isCorrect": false }
    ]
  },
  {
    "question": "pertanyaan 4",
    "answerType": "MULTIPLE_CHOICE",
    "multipleChoice": [
      { "text": "opsi A", "isCorrect": false },
      { "text": "opsi B", "isCorrect": false },
      { "text": "opsi C", "isCorrect": false },
      { "text": "opsi D", "isCorrect": true }
    ]
  },
  {
    "question": "pertanyaan 5",
    "answerType": "MULTIPLE_CHOICE",
    "multipleChoice": [
      { "text": "opsi A", "isCorrect": false },
      { "text": "opsi B", "isCorrect": true },
      { "text": "opsi C", "isCorrect": false },
      { "text": "opsi D", "isCorrect": false }
    ]
  }
]

Penting:  
- Jawaban harus dalam format JSON murni tanpa tambahan teks atau simbol apa pun di awal maupun akhir.  
- Jumlah soal wajib 5 — tidak kurang dan tidak lebih.
- Jika answerType adalah "ESSAY", maka setiap soal wajib memiliki atribut "label" dengan nilai "uraian_terbatas" atau "uraian_bebas".
`,x=await d.generateContent(w),S=JSON.parse(x.response.text());u(S)}catch(e){console.error(e)}finally{i(null)}};return a.jsxs("div",{className:"mt-5 flex justify-center items-center gap-4",children:[a.jsxs("select",{className:"select select-bordered w-fit",onChange:C,name:"answerType",value:s.answerType,children:[a.jsx("option",{children:"Pilih Tipe Soal"}),a.jsx("option",{value:"ESSAY",children:"Essay"}),a.jsx("option",{value:"MULTIPLE_CHOICE",children:"Pilihan Ganda"})]}),a.jsxs("button",{className:"btn btn-primary",onClick:b,disabled:r!=null,children:[r==="ALL"?a.jsx("div",{className:"loading"}):null,a.jsxs("span",{children:[n.length>0?"Tambah":"Generate"," 5 Soal"]})]})]})};export{j as default};
