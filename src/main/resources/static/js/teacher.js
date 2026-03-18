// ── SESSION ──
// Replace this with a real fetch to your auth endpoint, e.g.:
// const session = await fetch('/api/me').then(r => r.json());
const session = {
  id: 'teacher_001',
  name: 'Ms. Sharma', // auto-populated from backend on login
};

// ── STATE ──
const folders = [
  { id: 1, name: 'Mathematics', files: 0 },
  { id: 2, name: 'Science',     files: 0 },
  { id: 3, name: 'History',     files: 0 },
];
const files = [
  { id: 1, name: 'Intro to Algebra',          desc: 'Variables, expressions and basic equation solving — 24 slides', type: 'Slideshow', author: 'Ms. Sharma' },
  { id: 2, name: 'Ancient Egypt — Worksheet',  desc: 'Comprehension + map activity on pharaohs and the Nile — 4 pages', type: 'Worksheet', author: 'Ms. Gupta' },
  { id: 3, name: 'The Outsiders — Quiz',       desc: '20 MCQ questions covering chapters 1–5, instant auto-grade',       type: 'Quiz',      author: 'Mr. Khan'   },
  { id: 4, name: 'Climate Zones of the World', desc: 'Maps, biome comparisons and climate graph interpretation — 18 slides', type: 'Slideshow', author: 'Ms. Rao'    },
  { id: 5, name: 'Periodic Table Practice',    desc: 'Element identification, valency and group-period positioning — 3 pages', type: 'Worksheet', author: 'Ms. Iyer'   },
  { id: 6, name: 'World War II — Causes',      desc: 'Timeline, key battles, treaties and post-war impact — 32 slides',  type: 'Slideshow', author: 'Mr. Mehta'  },
];
let nextFolderId = 10;
let nextFileId   = 10;
let activeType   = 'all';

// ── TYPE CONFIG ──
const typeConf = {
  Slideshow: {
    bg: 'var(--tag-slide)', color: 'var(--tag-slide-t)', iconClass: 'ico-slide',
    icon: '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 16 16"><rect x="1" y="2" width="14" height="9" rx="1.5"/><path d="M5 14L8 11L11 14"/></svg>',
  },
  Worksheet: {
    bg: 'var(--tag-ws)', color: 'var(--tag-ws-t)', iconClass: 'ico-ws',
    icon: '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 16 16"><path d="M3 2H10L13 5V14H3Z"/><path d="M10 2V5H13"/><path d="M5 8H11M5 10.5H9"/></svg>',
  },
  Quiz: {
    bg: 'var(--tag-quiz)', color: 'var(--tag-quiz-t)', iconClass: 'ico-quiz',
    icon: '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7"/><path d="M5 8L7 10L11 6"/></svg>',
  },
};

// ── UTILS ──
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── RENDER ──
function render() {
  renderFolders();
  renderFiles();
  updateCounts();
}

function folderHTML(f) {
  return `<div class="folder" data-folder-id="${f.id}" data-name="${esc(f.name)}" onclick="openFolder('${esc(f.name)}')">
    <div class="folder-del" onclick="deleteFolder(event,${f.id})" title="Remove folder">
      <svg width="10" height="10" fill="none" stroke="#999" stroke-width="1.8" viewBox="0 0 12 12"><path d="M2 2L10 10M10 2L2 10"/></svg>
    </div>
    <div class="folder-icon">
      <svg width="28" height="24" viewBox="0 0 28 24" fill="none">
        <path d="M0 5.5A2 2 0 0 1 2 3.5H10L13 7H26A2 2 0 0 1 28 9V22A2 2 0 0 1 26 24H2A2 2 0 0 1 0 22Z" fill="#ffe066" stroke="#c8a800" stroke-width="1"/>
      </svg>
    </div>
    <div class="folder-name">${esc(f.name)}</div>
    <div class="folder-meta">${f.files} files</div>
  </div>`;
}

function renderFolders() {
  const grid    = document.getElementById('folderGrid');
  const addCard = document.getElementById('addFolderCard');
  grid.querySelectorAll('.folder').forEach(el => el.remove());
  const frag = document.createDocumentFragment();
  folders.forEach(f => {
    const tmp = document.createElement('div');
    tmp.innerHTML = folderHTML(f);
    frag.appendChild(tmp.firstElementChild);
  });
  grid.insertBefore(frag, addCard);
  document.getElementById('folderHeadLabel').textContent = `Folders — ${folders.length}`;
}

function renderFiles() {
  const list = document.getElementById('fileList');
  const q    = document.getElementById('searchInput').value.trim().toLowerCase();
  let visible = 0;

  list.innerHTML = files.map(f => {
    const matchSearch = !q ||
      f.name.toLowerCase().includes(q) ||
      f.desc.toLowerCase().includes(q) ||
      f.type.toLowerCase().includes(q);
    const matchType = activeType === 'all' || f.type === activeType;
    const show = matchSearch && matchType;
    if (show) visible++;
    const t = typeConf[f.type];
    return `<div class="file-row${show ? '' : ' hidden'}" data-file-id="${f.id}" data-name="${esc(f.name)}" data-type="${f.type}">
      <div class="file-icon ${t.iconClass}">${t.icon}</div>
      <div class="file-name">${esc(f.name)}</div>
      <div class="file-desc">${esc(f.desc)}</div>
      <div class="file-meta-right">
        <span class="tag" style="background:${t.bg};color:${t.color}">${f.type}</span>
        <span class="file-author">${esc(f.author)}</span>
        <div class="file-del" onclick="deleteFile(event,${f.id})" title="Remove file">
          <svg width="10" height="10" fill="none" stroke="#999" stroke-width="1.8" viewBox="0 0 12 12"><path d="M2 2L10 10M10 2L2 10"/></svg>
        </div>
      </div>
    </div>`;
  }).join('');

  document.getElementById('fileHeadLabel').textContent = `Files — ${visible}`;
  document.getElementById('noResults').classList.toggle('show', visible === 0 && files.length > 0);
}

function updateCounts() {
  document.getElementById('cnt-all').textContent   = files.length;
  document.getElementById('cnt-slide').textContent = files.filter(f => f.type === 'Slideshow').length;
  document.getElementById('cnt-ws').textContent    = files.filter(f => f.type === 'Worksheet').length;
  document.getElementById('cnt-quiz').textContent  = files.filter(f => f.type === 'Quiz').length;
  document.getElementById('toolbarInfo').textContent =
    `${folders.length} folder${folders.length !== 1 ? 's' : ''} · ${files.length} file${files.length !== 1 ? 's' : ''}`;
}

// ── SEARCH ──
function handleSearch() {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  document.querySelectorAll('#folderGrid .folder').forEach(el => {
    el.classList.toggle('hidden', q !== '' && !el.dataset.name.toLowerCase().includes(q));
  });
  renderFiles();
}

// ── FILTER BY TYPE ──
function filterType(type, el) {
  activeType = type;
  document.querySelectorAll('.s-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  renderFiles();
}

// ── FOLDER ACTIONS ──
function openFolder(name) {
  document.getElementById('breadcrumb').innerHTML =
    `<a href="#" onclick="goHome(); return false;">Home</a><span class="sep"> / </span><span>${esc(name)}</span>`;
}
function goHome() {
  document.getElementById('breadcrumb').innerHTML =
    `<a href="#" onclick="goHome(); return false;">Home</a><span class="sep"> / </span><span>All Resources</span>`;
}
function deleteFolder(e, id) {
  e.stopPropagation();
  const idx = folders.findIndex(f => f.id === id);
  if (idx === -1) return;
  if (!confirm(`Remove folder "${folders[idx].name}"?`)) return;
  folders.splice(idx, 1);
  render();
}

// ── FILE ACTIONS ──
function deleteFile(e, id) {
  e.stopPropagation();
  const idx = files.findIndex(f => f.id === id);
  if (idx === -1) return;
  if (!confirm(`Remove file "${files[idx].name}"?`)) return;
  files.splice(idx, 1);
  renderFiles();
  updateCounts();
}

// ── MODALS ──
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function openFolderModal() {
  document.getElementById('folderNameInput').value = '';
  openModal('folderModal');
  setTimeout(() => document.getElementById('folderNameInput').focus(), 60);
}
function openFileModal() {
  document.getElementById('fileNameInput').value = '';
  document.getElementById('fileDescInput').value = '';
  document.getElementById('fileTypeInput').selectedIndex = 0;
  openModal('fileModal');
  setTimeout(() => document.getElementById('fileNameInput').focus(), 60);
}

function confirmAddFolder() {
  const name = document.getElementById('folderNameInput').value.trim();
  if (!name) { document.getElementById('folderNameInput').focus(); return; }
  folders.push({ id: nextFolderId++, name, files: 0 });
  render();
  closeModal('folderModal');
}
function confirmAddFile() {
  const name = document.getElementById('fileNameInput').value.trim();
  const desc = document.getElementById('fileDescInput').value.trim();
  const type = document.getElementById('fileTypeInput').value;
  if (!name) { document.getElementById('fileNameInput').focus(); return; }
  files.push({ id: nextFileId++, name, desc, type, author: session.name });
  renderFiles();
  updateCounts();
  closeModal('fileModal');
}

// ── KEYBOARD & OVERLAY ──
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal('folderModal');
    closeModal('fileModal');
  }
});
document.getElementById('folderNameInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') confirmAddFolder();
});
['folderModal', 'fileModal'].forEach(id => {
  document.getElementById(id).addEventListener('click', function (e) {
    if (e.target === this) closeModal(id);
  });
});

// ── INIT ──
render();