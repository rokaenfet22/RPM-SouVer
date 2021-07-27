//update the text display on result.html
window.addEventListener("load",async function(event){
    try{
        let res = await fetch("/load_result_txt_box")
        if (res.ok){
            let body = await res.text()
            let result_txt_box = document.getElementById("result_txt_box")
            result_txt_box.innerHTML = body
        }else{
            alert(404)
        }
    }catch(e){
        alert(e)
    }
})

//going back to signin pg
let result_to_signin_pg_btn = document.getElementById("result_to_signin_pg")
result_to_signin_pg_btn.addEventListener("click",async function(event){
    try{
        let res = await fetch("/load_signin_pg")
        if (res.ok){
            window.location.href = res["url"]
        }else{
            alert(404)
        }
    }catch(e){
        alert(e)
    }
})

