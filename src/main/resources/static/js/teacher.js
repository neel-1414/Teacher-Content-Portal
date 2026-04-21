let folders = [];
let selectedFolderId = null;

/* Logout */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "../pages/login.html";
}

/* Load Folders */
async function loadFolders() {

  const res = await fetch("/folders", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  });

  if (res.status === 401 || res.status === 403) {
    logout();
    return;
  }

  folders = await res.json();
  renderFolders();
}

/* Render Folders */
function renderFolders() {

  const list = document.getElementById("folderList");

  if (!folders || folders.length === 0) {
    list.innerHTML = `
            <div class="empty-state">
                <h3>No folders created yet</h3>
                <p>Create your first folder using the button above.</p>
            </div>
        `;
    return;
  }

  list.innerHTML = folders.map(folder => `
        <div class="file-row">
            <div>
                <strong>${folder.folderName}</strong><br>
                <small>${folder.year} Year - ${folder.branch}</small>
            </div>

            <div style="display:flex; gap:10px;">
                <button onclick="openFolder(${folder.id}, '${folder.folderName}')">
                    Open
                </button>

                <button onclick="openUploadModal(${folder.id})">
                    Add File
                </button>
            </div>
        </div>
    `).join("");
}

/* Open Folder and Show Files */
async function openFolder(folderId, folderName) {

  const res = await fetch("/student/files/" + folderId, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  });

  const files = await res.json();

  const list = document.getElementById("fileList");

  if (!files || files.length === 0) {
    list.innerHTML = `
            <div class="empty-state">
                <h3>${folderName}</h3>
                <p>No files inside this folder.</p>
            </div>
        `;
    return;
  }

  list.innerHTML = `
        <h3 style="margin-bottom:15px;">${folderName}</h3>
        ${files.map(file => `
            <div class="file-row">
                <div>${file.title}</div>

                <div style="display:flex; gap:10px;">
                    <a href="${file.fileUrl}" target="_blank">View</a>

                    <button onclick="deleteFile(${file.id}, ${folderId}, '${folderName}')">
                        Delete
                    </button>
                </div>
            </div>
        `).join("")}
    `;
}

/* Delete File */
async function deleteFile(id, folderId, folderName) {

  const ok = confirm("Delete this file?");
  if (!ok) return;

  const res = await fetch("/content/delete/" + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  });

  if (res.ok) {
    openFolder(folderId, folderName);
  } else {
    alert("Delete failed");
  }
}

/* Create Folder */
async function createFolder() {

  const folderName = document.getElementById("folderName").value.trim();
  const year = document.getElementById("year").value.trim();
  const branch = document.getElementById("branch").value.trim();

  if (!folderName || !year || !branch) {
    alert("Fill all fields");
    return;
  }

  const res = await fetch("/folders/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({
      folderName,
      year,
      branch
    })
  });

  if (res.ok) {

    closeFolderModal();

    document.getElementById("folderName").value = "";
    document.getElementById("year").value = "";
    document.getElementById("branch").value = "";

    loadFolders();

  } else {
    alert("Folder creation failed");
  }
}

/* Upload File */
function openUploadModal(folderId) {
  selectedFolderId = folderId;
  document.getElementById("uploadModal").style.display = "flex";
}

function closeUploadModal() {
  document.getElementById("uploadModal").style.display = "none";
}

async function uploadFile() {

  const title = document.getElementById("fileName").value.trim();
  const file = document.getElementById("fileInput").files[0];

  if (!title || !file) {
    alert("Enter file name and select file");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("file", file);
  formData.append("folderId", selectedFolderId);

  const res = await fetch("/content/upload", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: formData
  });

  if (res.ok) {

    closeUploadModal();

    document.getElementById("fileName").value = "";
    document.getElementById("fileInput").value = "";

    alert("Upload successful");

  } else {
    alert("Upload failed");
  }
}

/* Folder Modal */
function openFolderModal() {
  document.getElementById("folderModal").style.display = "flex";
}

function closeFolderModal() {
  document.getElementById("folderModal").style.display = "none";
}

/* Init */
function init() {

  if (!localStorage.getItem("token")) {
    window.location.href = "../pages/login.html";
    return;
  }

  loadFolders();
}

init();