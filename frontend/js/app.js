// ── Table renderer with search + clickable names ─────────────────────────────
function renderTable(cfg, rows){
  const el=document.getElementById('sec-'+cfg.id);
  const wrap=el.querySelector('.table-wrap');
  const searchId=`search-${cfg.id}`, countId=`count-${cfg.id}`;
  wrap.innerHTML=`
    <div class="search-bar">
      <label for="${searchId}">🔍 Search:</label>
      <input id="${searchId}" type="text" placeholder="Type to filter rows..."/>
      <span class="row-count" id="${countId}">Showing ${rows.length} of ${rows.length}</span>
    </div><div id="tbl-${cfg.id}"></div>`;

  function buildTbody(filtered){
    const thead=cfg.cols.map(c=>`<th>${c.label}</th>`).join('')+'<th>Actions</th>';
    const tbody=filtered.length ? filtered.map(row=>{
      const tds=cfg.cols.map(c=>{
        let val=row[c.key]??'';
        if(c.key==='attendance_percentage'){
          const cls=parseFloat(val)<75?'att-low':'att-ok';
          return `<td class="${cls}">${val}%</td>`;
        }
        // clickable name links
        if(c.link){
          return `<td><a class="name-link" href="${c.link}${row[cfg.pk[0]]}">${val}</a></td>`;
        }
        return `<td>${val}</td>`;
      }).join('');
      const pk=cfg.pk.map(k=>row[k]);
      return `<tr>${tds}<td>
        <button class="btn-edit" onclick="editRow('${cfg.id}',${JSON.stringify(pk)})">Edit</button>
        <button class="btn-del" onclick="delRow('${cfg.id}',${JSON.stringify(pk)})">Delete</button>
      </td></tr>`;
    }).join('') : `<tr><td colspan="${cfg.cols.length+1}" class="no-data">No records match.</td></tr>`;
    document.getElementById(`tbl-${cfg.id}`).innerHTML=`<table><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table>`;
    document.getElementById(countId).textContent=`Showing ${filtered.length} of ${rows.length}`;
  }
  buildTbody(rows);
  document.getElementById(searchId).addEventListener('input',e=>{
    const q=e.target.value.toLowerCase();
    buildTbody(rows.filter(row=>cfg.cols.some(c=>String(row[c.key]??'').toLowerCase().includes(q))));
  });
}

async function loadSection(cfg){
  for(const f of cfg.fields||[])
    if(f.type==='select'&&f.cache&&!cache[f.cache])
      await api('/'+f.cache).then(d=>cache[f.cache]=d).catch(()=>{});
  renderTable(cfg, await api(cfg.api));
}

// ── Row actions ──────────────────────────────────────────────────────────────
async function editRow(id,pk){
  const cfg=TABLES[id];
  const rows=await api(cfg.api);
  const row=rows.find(r=>cfg.pk.every((k,i)=>String(r[k])===String(pk[i])));
  if(!row) return;
  if(!cfg.upd){ toast('Edit not supported.'); return; }
  for(const f of cfg.fields) if(f.type==='select'&&f.cache&&!cache[f.cache]) await api('/'+f.cache).then(d=>cache[f.cache]=d).catch(()=>{});
  openModal('Edit '+cfg.label, cfg.fields, row, async()=>{
    try{ await cfg.upd(pk,getFormData(cfg.fields)); closeModal(); toast('Updated.'); await loadSection(cfg); }
    catch(e){ toast('Error: '+e.message); }
  });
}
async function delRow(id,pk){
  if(!confirm('Delete this record?')) return;
  const cfg=TABLES[id];
  try{ await cfg.del(pk); toast('Deleted.'); await loadSection(cfg); }
  catch(e){ toast('Error: '+e.message); }
}

// ── Build sections + tab switching ───────────────────────────────────────────
function buildSections(){
  const main=document.getElementById('main-content');
  let html=`<section id="sec-dashboard" class="section"></section>`;
  html+=Object.values(TABLES).map(cfg=>`
    <section id="sec-${cfg.id}" class="section">
      <div class="section-header">
        <h2>${cfg.label} Management</h2>
        <button class="btn-add" id="add-${cfg.id}">+ Add ${cfg.label}</button>
      </div>
      <div class="table-wrap"><p class="no-data">Loading...</p></div>
    </section>`).join('');
  main.innerHTML=html;

  Object.values(TABLES).forEach(cfg=>{
    document.getElementById('add-'+cfg.id).onclick=async()=>{
      for(const f of cfg.fields) if(f.type==='select'&&f.cache&&!cache[f.cache]) await api('/'+f.cache).then(d=>cache[f.cache]=d).catch(()=>{});
      openModal('Add '+cfg.label, cfg.fields, {}, async()=>{
        try{ await cfg.add(getFormData(cfg.fields)); closeModal(); toast('Added.'); await loadSection(cfg); }
        catch(e){ toast('Error: '+e.message); }
      });
    };
  });
}

// Modal wiring
document.getElementById('modal-cancel').onclick=closeModal;
document.getElementById('modal-submit').onclick=async()=>{ if(modalCb) await modalCb(); };

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click', async()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
    btn.classList.add('active');
    const id=btn.dataset.tab;
    document.getElementById('sec-'+id).classList.add('active');
    if(id==='dashboard') await loadDashboard();
    else await loadSection(TABLES[id]);
  });
});

// Init
buildSections();
document.getElementById('sec-dashboard').classList.add('active');
loadDashboard();
