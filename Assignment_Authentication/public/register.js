const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", async(e)=>{
    e.preventDefault();
    const formData= new FormData(registerForm);
    // console.log(formData);

    const response = await fetch("http://localhost:3000/register",{
        method:"POST",
        body:new URLSearchParams(formData)
    });

    const result =response.ok;
    // console.log(result);

    if(result){
        // alert('Registration successful!');
        window.location.href="/login";
    }
    else{
        const errorBox = document.getElementById("error-box");

        errorBox.textContent = "User Already Exist";

        setTimeout(() => {
            errorBox.textContent = "";
        }, 3000);
    }

});