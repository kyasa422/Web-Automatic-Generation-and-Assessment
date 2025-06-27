import{q as k,j as s}from"./app-CAzukakE.js";import{u as n}from"./store-DBvX16_L.js";import{G as S}from"./index-COzIZR3u.js";import"./lodash-MCpPY_UA.js";const f=()=>{const{env:{GEMINI_API_KEY:u},subject:i}=k().props,a=n(e=>e.request),c=n(e=>e.setRequest),r=n(e=>e.response),m=n(e=>e.updateResponse),o=n(e=>e.isLoading),p=n(e=>e.setIsLoading),d=e=>c(e.target),y=async()=>{try{p(r.length>0?"ADD":"ALL");const e=new S({apiKey:u}),g=i.find(t=>t.id==a.subject).name,b=a.type==0?"UTS":"UAS",h=a.answerType=="ESSAY"?{type:"array",items:{type:"object",properties:{question:{type:"string"},answer:{type:"string",description:"Berikan jawaban dalam bentuk poin-poin rangkuman atau sebuah paragraf sangat singkat yang hanya berisi ide-ide utamanya."},answerType:{type:"string",enum:["ESSAY"]},capaian:{type:"string",description:"Berdasarkan pertanyaan yang dibuat, klasifikasikan jenis pengetahuan yang paling dominan diuji. Pilih HANYA SATU dari opsi yang tersedia.",enum:["Faktual","Konseptual","Prosedural","Metakognitif"]}},required:["question","answer","answerType","capaian"]},minItems:5,maxItems:5}:{type:"array",items:{type:"object",properties:{question:{type:"string"},answerType:{type:"string",enum:["MULTIPLE_CHOICE"]},multipleChoice:{type:"array",items:{type:"object",properties:{text:{type:"string"},isCorrect:{type:"boolean"}},required:["text","isCorrect"]},minItems:4,maxItems:4}},required:["question","answerType","multipleChoice"]},minItems:5,maxItems:5},j=`Buatkan 5 soal berdasarkan parameter berikut:
  - class: ${a.class} 
  - subject: ${g}
  - type: ${b}
  - answerType: ${a.answerType}

  ${a.answerType==="ESSAY"}


  Soal harus sesuai capaian umum sebagai berikut:
  ${i.find(t=>t.id==a.subject).context}

  Buat soal yang berkualitas dan sesuai dengan tingkat kesulitan ${a.class}.

  ---
  **PENTING:** Untuk setiap soal yang dihasilkan, kolom "answer" harus berisi **kunci jawaban berupa esai jawaban yang ideal dan faktual ** Jangan menuliskan kriteria atau pedoman cara menjawab. Posisikan diri Anda sebagai seorang ahli yang memberikan contoh jawaban sempurna atas pertanyaan tersebut.
  ---`,l=(await e.models.generateContent({contents:j,model:"gemini-2.5-flash",config:{responseMimeType:"application/json",responseSchema:h,temperature:.7}})).text;console.log("Response:",l),m(JSON.parse(l))}catch(e){console.error(e)}finally{p(null)}};return s.jsxs("div",{className:"mt-5 flex justify-center items-center gap-4",children:[s.jsxs("select",{className:"select select-bordered w-fit",onChange:d,name:"answerType",value:a.answerType,children:[s.jsx("option",{children:"Pilih Tipe Soal"}),s.jsx("option",{value:"ESSAY",children:"Essay"}),s.jsx("option",{value:"MULTIPLE_CHOICE",children:"Pilihan Ganda"})]}),s.jsxs("button",{className:"btn btn-primary",onClick:y,disabled:o!=null,children:[o==="ALL"?s.jsx("div",{className:"loading"}):null,s.jsxs("span",{children:[r.length>0?"Tambah":"Generate"," 5 Soal"]})]})]})};export{f as default};
