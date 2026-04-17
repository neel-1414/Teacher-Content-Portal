
let files = [];

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../pages/login.html";
}

// LOAD FILES
async function loadFiles() {
  const res = await fetch('/content/my', {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  });

  if (res.status === 401) {
    logout();
    return;
  }

  files = await res.json();
  renderFiles();
}

function renderFiles() {
  const list = document.getElementById('fileList');

  list.innerHTML = files.map( f => `
    <div class="file-row">
      <div>${f.title}</div>
      <button class="delete" onclick="deleteFile(${f.id})">Delete</button>
    </div>
  `).join('');
}

// DELETE FILE
async function deleteFile(id) {
  if (!confirm("Delete file?")) return;

  const res = await fetch('/content/my/' + id, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  });

  if (res.ok) {
    loadFiles();
  } else {
    alert("Delete failed");
  }
}

// UPLOAD FILE
async function uploadFile() {
  const file = document.getElementById('fileInput').files[0];
  const title = document.getElementById('fileName').value;

  if (!file) {
    alert("Select a file");
    return;
  }

  const formData = new FormData();
  formData.append("title",title);
  formData.append("file", file);

  const res = await fetch('/content/upload', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    },
    body: formData
  });

  if (res.ok) {
    closeModal();
    loadFiles();
  } else {
    alert("Upload failed");
  }
}

// 📦 MODAL
function openModal() {
  document.getElementById('uploadModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('uploadModal').style.display = 'none';
}

// 🚀 INIT
function init() {
  if (!localStorage.getItem("token")) {
    window.location.href = "../pages/login.html";
    return;
  }

  loadFiles();
}

init();