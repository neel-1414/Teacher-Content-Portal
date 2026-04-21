async function loadFiles(){

    const res = await fetch('/student/content',{
        headers:{
            Authorization:'Bearer '+localStorage.getItem("token")
        }
    });

    const data = await res.json();

    let html="";

    data.forEach(file=>{
        html += `
<div style="border:1px solid #ccc;padding:10px;margin:10px">
<h3>${file.title}</h3>
<p>${file.subject}</p>
<a href="${file.fileUrl}" target="_blank">View File</a>
</div>
`;
    });

    document.getElementById("files").innerHTML = html;
}

function logout(){
    localStorage.clear();
    location.href="login.html";
}

loadFiles();