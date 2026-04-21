async function loadFolders() {

    const token = localStorage.getItem("token");

    const res = await fetch("/student/folders", {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    if (!res.ok) {
        alert("Failed to load folders");
        return;
    }

    const data = await res.json();

    let html = "";

    data.forEach(folder => {

        html += `
            <div class="card">
                <h3>${folder.folderName}</h3>
                <p>${folder.year} Year</p>
                <p>${folder.branch}</p>

                <button class="openBtn"
                    onclick="loadFiles(${folder.id})">
                    Open Folder
                </button>
            </div>
        `;
    });

    document.getElementById("folders").innerHTML = html;
}



async function loadFiles(folderId) {

    const token = localStorage.getItem("token");

    const res = await fetch("/student/folders/" + folderId, {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    if (!res.ok) {
        alert("Access denied or no files");
        return;
    }

    const data = await res.json();

    let html = "";

    if(data.length === 0){
        html = "<p>No files in this folder.</p>";
    }

    data.forEach(file => {

        html += `
            <div class="file">
                <h4>${file.title}</h4>
                <a href="${file.fileUrl}" target="_blank">
                    View File
                </a>
            </div>
        `;
    });

    document.getElementById("files").innerHTML = html;
}



function logout() {
    localStorage.clear();
    location.href = "login.html";
}


loadFolders();