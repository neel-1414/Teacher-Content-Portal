document.getElementById("loginForm").addEventListener("submit", async function(e){
     e.preventDefault();
    const userId = document.getElementById("userid").value.trim();
    const password = document.getElementById("password").value.trim();
    const errormessage = document.getElementById("error-message");
    errormessage.textContent = "";
    try{
        const response = await fetch("/login",{
        method:"POST",
        headers:{
        "Content-type":"application/json"
        },
        body: JSON.stringify({
            userId: userId,
            password: password
        })
        });
        if(!response.ok)
        {
            throw new Error("Invalid User ID or password");
        }
        const data = await response.json();
        localStorage.setItem("token", data.token);
        const payload = parseJwt(data.token);
        const role = payload.role;
        if(role == "TEACHER"){
        window.location.href = "teacher-dashboard.html"
        }
        else {
        window.location.href = "student-dashboard.html"
        }
    }
    catch(error)
    {
        errormessage.textContent = error.message;
    }

});
function parseJwt()
{
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
}