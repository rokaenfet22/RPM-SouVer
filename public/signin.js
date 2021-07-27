let signup_btn = document.getElementById("signup_btn")
let login_btn = document.getElementById("login_btn")

//signing up
signup_btn.addEventListener("click",async function(event){
    try{
        event.preventDefault()
        let parameters = {
            username:document.getElementById("signup_username").value,
            password:document.getElementById("signup_password").value,
        }
        let res = await fetch("/validate_and_upload_signup",{
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify(parameters)
        })
        if (res.ok){
            let validity = await res.json()
            console.log(body)
        }else{
            alert(404)
        }
    }catch(e){
        alert(e)
    }
})

login_btn.addEventListener("click",async function(event){
    try{
        let res = await fetch("/load_submit_pg")
        if (res.ok){
            pass
        }else{
            alert(404)
        }
    }catch(e){
        alert(e)
    }
})