let folders = [];

function init() {

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "../pages/login.html";
    return;
  }

  loadFolders();
}

init();

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../pages/login.html";
}

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
                <strong>${folder.name}</strong><br>
                <small>${folder.year} Year - ${folder.branch}</small>
            </div>

            <div style="display:flex; gap:10px; justify-content:flex-end;">
        <button onclick="openFolder(${folder.id})">Open</button>
        <button class="delete" onclick="deleteFolderUI(${folder.id})">Delete</button>
      </div>
    </div>

    `).join("");
}

function openFolder(folderId) {
  window.location.href = "../pages/folderfiles.html?id=" + folderId;
}

function openFolderModal() {
  document.getElementById("folderModal").style.display = "flex";
}

function closeFolderModal() {
  document.getElementById("folderModal").style.display = "none";
}

async function createFolder() {

  const name = document.getElementById("folderName").value.trim();
  const year = document.getElementById("year").value.trim();
  const branch = document.getElementById("branch").value.trim();

  if (!name || !year || !branch) {
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
      name: name,
      year: year,
      branch: branch,
      enabled: true
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

window.onclick = function (e) {

  const modal = document.getElementById("folderModal");

  if (e.target === modal) {
    closeFolderModal();
  }
};


async function deleteFolderUI(folderId)
{
  const confirmDelete=confirm("Are you sure you want to delete this folder?\nAll files inside it will also be deleted.");
  if(!confirmDelete) return;

  const res=await fetch(`/folders/${folderId}`, {
    method:"DELETE",
    headers:{
      Authorization: "Bearer "+localStorage.getItem("token")
    }
  });

  if (res.status === 401) {
    alert("Session expired or not logged in");
    return;
  }

  if (res.status === 403) {
    alert("You are not allowed to delete this folder");
    return;
  }

  if (res.ok)
  {
    alert("Folder deleted successfully");
    loadFolders();
  }
  else
  {
    const msg = await res.text();
    alert(msg || "Folder deletion failed");
  }
}

async function toggleFolder(id){
  const res = await fetch('/folders/toggle/' + id,{
    method:'PUT',
    headers:{
      Authorization:'Bearer ' + localStorage.getItem("token")
    }
  });

  alert(await res.text());
  loadFolders();
}

async function toggleFolder(id){
  const res = await fetch('/folders/toggle/' + id,{
    method:'PUT',
    headers:{
      Authorization:'Bearer ' + localStorage.getItem("token")
    }
  });

  alert(await res.text());
  loadFolders();
}