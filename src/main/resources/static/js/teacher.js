let files = [];

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../pages/login.html";
}

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

  if (!files || files.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <h3>No files uploaded yet</h3>
        <p>Upload your first file using the button above.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = files.map(f => `
    <div class="file-row">
      <div>${f.title}</div>
      <a href="${f.fileUrl}" target="_blank">View</a>
      <button class="delete" onclick="deleteFile(${f.id})">Delete</button>
    </div>
  `).join('');
}

async function deleteFile(id) {
  if (!confirm("Delete file?")) return;

  const res = await fetch('/content/delete/' + id, {
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

async function uploadFile() {
  const file = document.getElementById('fileInput').files[0];
  const title = document.getElementById('fileName').value.trim();

  if (!title) {
    alert("Enter file name");
    return;
  }

  if (!file) {
    alert("Select a file");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
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
    document.getElementById('fileName').value = "";
    document.getElementById('fileInput').value = "";
    loadFiles();
  } else {
    alert("Upload failed");
  }
}

function openModal() {
  document.getElementById('uploadModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('uploadModal').style.display = 'none';
}

function init() {
  if (!localStorage.getItem("token")) {
    window.location.href = "../pages/login.html";
    return;
  }

  loadFiles();
}

document.getElementById("uploadModal").addEventListener("click", function (e) {
  if (e.target === this) closeModal();
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeModal();
});

init();