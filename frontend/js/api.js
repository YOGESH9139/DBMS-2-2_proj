const API = '/api';

async function api(path, method='GET', body){
  const opts = {method, headers:{'Content-Type':'application/json'}};
  if(body) opts.body = JSON.stringify(body);
  const r = await fetch(API+path, opts);
  if(!r.ok) throw new Error(await r.text());
  return r.json();
}

function toast(msg){
  const t=document.getElementById('toast');
  if(!t) return;
  t.textContent=msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2500);
}

const cache={};

// Modal helpers
let modalCb=null;
function openModal(title,fields,data,cb){
  document.getElementById('modal-title').textContent=title;
  const form=document.getElementById('modal-form');
  form.innerHTML=fields.map(f=>{
    const val=data?.[f.key]??'';
    if(f.type==='select'){
      const opts=(cache[f.cache]||[]).map(o=>`<option value="${o[f.vk]}" ${o[f.vk]==val?'selected':''}>${o[f.lk]}</option>`).join('');
      return `<label>${f.label}</label><select id="f_${f.key}"><option value="">--Select--</option>${opts}</select>`;
    }
    return `<label>${f.label}</label><input id="f_${f.key}" type="${f.type||'text'}" value="${val}" placeholder="${f.label}"/>`;
  }).join('');
  modalCb=cb;
  document.getElementById('modal-overlay').classList.remove('hidden');
}
function closeModal(){ document.getElementById('modal-overlay').classList.add('hidden'); modalCb=null; }
function getFormData(fields){
  const d={};
  fields.forEach(f=>{ d[f.key]=document.getElementById('f_'+f.key)?.value??''; });
  return d;
}
