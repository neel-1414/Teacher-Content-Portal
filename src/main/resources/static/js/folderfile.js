let folderId = null;

document.addEventListener("DOMContentLoaded", init);

function init() {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "../pages/login.html";
        return;
    }

    const params = new URLSearchParams(window.location.search);
    folderId = params.get("id");

    console.log("Folder ID:", folderId);

    if (!folderId) {
        window.location.href = "../pages/teacherdashboard.html";
        return;
    }

    loadFiles();
}

/* ---------------- Back ---------------- */
function goBack() {
    window.location.href = "../pages/teacherdashboard.html";
}

/* ---------------- Load Files ---------------- */
async function loadFiles() {

    const res = await fetch("/folders/files/" + folderId, {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    });

    if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "../pages/login.html";
        return;
    }

    const files = await res.json();
    renderFiles(files);
}

/* ---------------- Render Files ---------------- */
function renderFiles(files) {

    const list = document.getElementById("fileList");

    if (!files || files.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <h3>No files found</h3>
                <p>Upload your first file in this folder.</p>
            </div>
        `;
        return;
    }

    list.innerHTML = files.map(file => `
        <div class="file-row">
            <div>${file.title}</div>

            <div class="file-actions">
                <a href="${file.fileUrl}" target="_blank">View</a>

                <button onclick="deleteFile(${file.id})">
                    Delete
                </button>
            </div>
        </div>
    `).join("");
}

/* ---------------- Upload Modal ---------------- */
function openUploadModal() {
    document.getElementById("uploadModal").style.display = "flex";
}

function closeUploadModal() {
    document.getElementById("uploadModal").style.display = "none";
}

/* ---------------- Upload File ---------------- */
async function uploadFile() {

    const title = document.getElementById("fileName").value.trim();
    const file = document.getElementById("fileInput").files[0];

    if (!title) {
        alert("Enter file name");
        return;
    }

    if (!file) {
        alert("Choose file");
        return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    formData.append("folderId", folderId);

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

        loadFiles();

    } else {
        alert("Upload failed");
    }
}

/* ---------------- Delete File ---------------- */
async function deleteFile(id) {

    const ok = confirm("Delete this file?");
    if (!ok) return;

    const res = await fetch("/content/delete/" + id, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    });

    if (res.ok) {
        loadFiles();
    } else {
        alert("Delete failed");
    }
}

/* ---------------- Close Modal ---------------- */
window.onclick = function(e) {

    const modal = document.getElementById("uploadModal");

    if (e.target === modal) {
        closeUploadModal();
    }
};