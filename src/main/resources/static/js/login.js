document.getElementById("loginForm").addEventListener("submit", async function(e){
     e.preventDefault();
    const userId = document.getElementById("userId").value.trim();
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
        const token = data.token;
        localStorage.setItem("token", token);
        const payload = parseJwt(token);
        const role = payload.role;
        if(role == "TEACHER"){
        window.location.href = "../pages/teacherdashboard.html"
        }
        else {
        window.location.href = "../pages/studentdashboard.html"
        }

    }
    catch(error)
    {
        errormessage.textContent = error.message;
    }

});
function parseJwt(token)
{
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
}