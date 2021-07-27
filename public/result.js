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