const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit" , async(e)=>{
    e.preventDefault();// url mai password or username dikh jata h agr na lgae to
    
    // to fetch the data from login form
    const formData = new FormData(loginForm);// javascript function (FormData)
    console.log(formData);

    const response = await fetch("http://localhost:3000/login",{
        method :'POST',
        body:new URLSearchParams(formData)
    });

    const result = response.ok;
    // console.log(result);
    if(result){
        // alert('Login Successfull');
        window.location.href="/dashboard";
    }
    else {
        const errorBox = document.getElementById("error-message");
        errorBox.textContent = "Invalid Username or Password";
        setTimeout(() => {
            errorBox.textContent = "";
        }, 3000);
    }
});