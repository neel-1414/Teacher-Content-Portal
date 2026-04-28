async function loadFolders() {

    const token = localStorage.getItem("token");

    if (!token) {
        location.href = "../pages/login.html";
        return;
    }

    try {
        const res = await fetch("/student/folders", {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        if (res.status === 401 || res.status === 403) {
            localStorage.clear();
            location.href = "login.html";
            return;
        }

        if (!res.ok) {
            return;
        }

        const data = await res.json();

        let html = "";

        if (data.length === 0) {
            html = `<div class="empty">Nothing Present</div>`;
        } else {
            data.forEach(folder => {
                html += `
                    <div class="card">
                        <h3>${folder.name}</h3>
                        <p>${folder.year} Year</p>
                        <p>${folder.branch}</p>

                        <button class="openBtn"
                            onclick="loadFiles(${folder.id})">
                            Open Folder
                        </button>
                    </div>
                `;
            });
        }

        document.getElementById("folders").innerHTML = html;

    } catch (error) {
        console.log(error);
    }
}



async function loadFiles(folderId) {

    const token = localStorage.getItem("token");

    const res = await fetch("/student/folders/" + folderId, {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    const data = await res.json();
    const cards = document.querySelectorAll("#folders .card");
    cards.forEach(card => card.classList.remove("active"));

    const activeButton = document.querySelector(`button.openBtn[onclick="loadFiles(${folderId})"]`);
    if (activeButton) {
        activeButton.closest(".card").classList.add("active");
    }

    let html = "";

    if (data.length === 0) {
        html = `<div class="empty">Nothing Present</div>`;
    } else {
        data.forEach(file => {
            html += `
                <div class="file">
                    <a href="${file.fileUrl}" target="_blank">
                        ${file.title}
                    </a>
                </div>
            `;
        });
    }

    document.getElementById("files").innerHTML = html;
    document.getElementById("files").scrollIntoView({ behavior: "smooth", block: "start" });
}



function logout(){
    localStorage.clear();
    location.href = "../pages/login.html";
}

loadFolders();