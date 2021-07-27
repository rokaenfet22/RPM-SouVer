//changing html pg
let submit_pg_btn = document.getElementById("submit_pg")
submit_pg_btn.addEventListener("click",async function(event){
    try{
        let res = await fetch("/load_submit_pg")
        if (res.ok){
            window.location.href = res["url"]
        }else{
            alert(404)
        }
    }catch(e){
        alert(e)
    }
})

let search_pg_btn = document.getElementById("search_pg")
search_pg_btn.addEventListener("click",async function(event){
    try{
        let res = await fetch("/load_search_pg")
        if (res.ok){
            window.location.href = res["url"]
        }else{
            alert(404)
        }
    }catch(e){
        alert(e)
    }
})

let signin_pg_btn = document.getElementById("signin_pg")
signin_pg_btn.addEventListener("click",async function(event){
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
