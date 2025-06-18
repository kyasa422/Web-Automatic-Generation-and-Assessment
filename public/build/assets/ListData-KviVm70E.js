import{q as L,r as B,j as e,y as F}from"./app-Bbl3dTYt.js";import{b as G,c as x,d as _,a as J}from"./index-DFXWS34a.js";import{R}from"./index-Dvknl7OL.js";import{u as l}from"./store-CAoVjH4P.js";import{G as $}from"./index-DiWJTiuy.js";import{l as j}from"./lodash-NqGsU8V4.js";import{w as q}from"./sweetalert2-react-content.es-Bj2PPsSl.js";import{S as O}from"./sweetalert2.esm.all-9Qm2jZ7z.js";const Q=()=>{const{env:{GEMINI_API_KEY:g,GEMINI_MODEL_NAME:f},subject:N}=L().props,[a,c]=B.useState(null),i=l(s=>s.response),p=l(s=>s.updateResponseByIndex),d=l(s=>s.request),w=l(s=>s.deleteResponse),o=l(s=>s.isLoading),m=l(s=>s.setIsLoading),C=l(s=>s.reset),h=q(O),u=s=>{const{name:t,value:n}=s.target,r=j.cloneDeep(a);j.set(r,t,n),c(r)},S=s=>{const t={...a},n=t.multipleChoice.findIndex(r=>r.isCorrect==!0);n!=-1&&(t.multipleChoice[n].isCorrect=!1),t.multipleChoice[s].isCorrect=!0,c(t)},b=s=>{a!=null&&a.index==s?(p(s,a),c(null)):c({index:s,...i[s]})},k=()=>{i.map(t=>parseFloat(t.weight)).reduce((t,n)=>t+n)!=100?h.fire({icon:"warning",title:"Bobot tidak sesuai",toast:!0,position:"top-end",showConfirmButton:!1,timer:3e3}):F.post(route("guru.generated-soal.store"),{...d,response:i},{onStart:()=>m("SUBMIT"),onSuccess:()=>{C(),h.fire({icon:"success",title:"Soal berhasil disimpan",toast:!0,position:"top-end",showConfirmButton:!1,timer:3e3})},onFinish:()=>m(null)})},y=async(s,t)=>{try{m(`SINGLE-${s}`);const r=new $(g).getGenerativeModel({model:f}),v=N.find(A=>A.id==d.subject).name,I=`
        Buatkan 1 soal berdasarkan parameter berikut:  
        - class: ${d.class} 
        - subject: ${v}
        - type: ${d.type===0?"Ulangan Tengah Semester":"Ulangan Akhir Semester"}
        - answerType: ${t} 
        
        Format respons yang HARUS digunakan:
        
        - Jika answerType adalah "ESSAY":
        {
        "question": "pertanyaan 1",
        "answer": "jawaban 1",
        "answerType": "ESSAY",
        "label": "uraian_terbatas"
        }
        
        - Jika answerType adalah "MULTIPLE_CHOICE":
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
        
        Penting:  
        - Jawaban harus dalam format JSON murni tanpa tambahan teks atau simbol apa pun di awal maupun akhir.  
        - Jumlah soal wajib 1 — tidak kurang dan tidak lebih.  
        - Jika answerType adalah "ESSAY", maka wajib menyertakan atribut "label" dengan nilai "uraian_terbatas" atau "uraian_bebas".
        `,E=await r.generateContent(I),T=JSON.parse(E.response.text());p(s,T)}catch(n){console.error(n)}finally{m(null)}};return e.jsx("div",{className:"rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark",children:o==="ALL"?e.jsx("h1",{className:"p-6 font-semibold text-center",children:"Soal sedang dimuat harap ditunggu..."}):i.length>0?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"border-b border-stroke px-6.5 py-4 dark:border-strokedark",children:[e.jsx("h3",{className:"font-medium text-black dark:text-white",children:"Hasil Generate Soal"}),e.jsxs("div",{className:"mt-2 text-right",children:[e.jsx("strong",{children:"Total Bobot: "}),e.jsxs("span",{className:"text-red-400",children:[i.map(s=>parseFloat(s.weight)).reduce((s,t)=>s+t,0).toFixed(2),"/100"]})]})]}),i.map((s,t)=>e.jsx("div",{className:"p-6 space-y-6",children:e.jsxs("div",{className:"border p-6 rounded-lg",children:[e.jsxs("div",{className:"flex justify-between items-center mb-4",children:[e.jsxs("h3",{className:"font-bold",children:["Soal ",t+1," ",s.label==="uraian_terbatas"?e.jsx(G,{}):null]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("button",{type:"button",className:"btn btn-circle btn-sm btn-ghost",onClick:()=>b(t),children:a==null||a.index!=t?e.jsx(x,{}):e.jsx(_,{})}),e.jsx("button",{type:"button",className:"btn btn-circle btn-sm btn-ghost",disabled:o!=null,onClick:()=>y(t,s.answerType),children:o==`SINGLE-${t}`?e.jsx("div",{className:"loading"}):e.jsx(R,{})}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("div",{className:"font-medium flex items-center gap-2",children:[e.jsxs("span",{children:["Bobot: ",s.weight?parseFloat(s.weight).toFixed(2):0]}),a&&a.index==t?e.jsx("input",{type:"number",className:"input input-bordered input-sm w-16",name:"weight",value:a.weight,onChange:u}):e.jsx("button",{className:"btn btn-sm btn-ghost btn-circle",onClick:()=>b(t),children:e.jsx(x,{size:10})})]}),e.jsx("button",{type:"button",className:"btn btn-circle btn-sm btn-error text-white",onClick:()=>w(t),children:e.jsx(J,{})})]})]})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("p",{className:"font-medium mb-1",children:[e.jsx("span",{children:"Pertanyaan:"}),a!=null&&a.index==t?e.jsx("input",{type:"text",className:"input input-bordered input-sm",value:a.question,name:"question",onChange:u}):e.jsx("span",{className:"font-normal",children:s.question})]}),s.answerType==="ESSAY"?a!=null&&a.index==t?e.jsx("input",{type:"text",className:"input input-bordered input-sm",name:"answer",onChange:u,value:a.answer}):e.jsxs("p",{className:"font-medium",children:["Jawaban: ",e.jsx("span",{className:"font-normal",children:s.answer})]}):e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"font-medium mb-1",children:"Pilihan:"}),e.jsx("ul",{className:"list-disc ml-6",children:s.multipleChoice.map((n,r)=>e.jsx("li",{className:`${n.isCorrect?"text-green-600":""}`,children:a!=null&&a.index===t?e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("input",{type:"text",className:"input input-bordered input-sm",name:`multipleChoice.${r}.text`,value:a.multipleChoice[r].text,onChange:u}),e.jsx("input",{type:"radio",name:"isCorrect",checked:a.multipleChoice[r].isCorrect,onChange:()=>S(r)})]}):e.jsxs("p",{children:[n.text," ",n.isCorrect?"(Jawaban Benar)":null]})},r))})]})]})]})},t)),o==="ADD"?e.jsx("div",{className:"flex justify-center",children:e.jsx("div",{className:"loading"})}):null,e.jsx("div",{className:"flex justify-end mt-5 p-6",children:e.jsxs("button",{className:"btn btn-primary",disabled:o!=null,onClick:k,children:[o=="SUBMIT"?e.jsx("div",{className:"loading"}):null,e.jsx("span",{children:"Simpan Soal"})]})})]}):e.jsx("h1",{className:"font-semibold text-xl text-center p-10",children:"Belum ada soal yang dimuat!"})})};export{Q as default};
