
//Load in existing entities and corresponding elements
window.addEventListener("load",async function(event){
    try{
        let res = await fetch("/content")
        if (res.ok){
            let body = await res.text()
            let b = JSON.parse(body)
            render_all(b)
        }else{
            alert(404)
        }
    } catch(e){
        alert(e)
    }
})

//Starting func to render day cards. Clears inner html of target_id, then loops through content
function render_cards(content,target_id,col_num){
    let container=document.getElementById(target_id)
    container.innerHTML=""
    for(let n of content){
        rc(n[0],n[1],n[2],target_id,col_num,content.indexOf(n))
    }
}
//Ending func to render day cards. For each element of content of starting func, create the cards given 3 parameters.
function rc(t_txt,c_txt,time_txt,target_id,col_num,index){
    let outer_div = document.createElement("div")
    outer_div.className = col_num
    outer_div.setAttribute("data-bs-toggle","modal")
    outer_div.setAttribute("data-bs-target","#"+"modal"+index.toString()) //Unique ID relating card and comments. e.g. 0modal, 1modal, 2modal...

    let inner_div = document.createElement("div")
    inner_div.className = "card border-info"
    inner_div.style = ""

    let card_body_div = document.createElement("div")
    card_body_div.className="card-body"

    let title=document.createElement("h5")
    let title_txt=document.createTextNode(t_txt)
    let content_txt=document.createTextNode(c_txt)

    let date=document.createElement("u1")
    date.className="list-group list-group-flush"
    let date_inner=document.createElement("li")
    date_inner.className="list-group-item"
    let date_txt=document.createTextNode(time_txt)

    date_inner.appendChild(date_txt)
    date.appendChild(date_inner)

    title.appendChild(title_txt)

    card_body_div.appendChild(title)
    card_body_div.appendChild(content_txt)

    inner_div.appendChild(card_body_div)
    inner_div.appendChild(date)

    outer_div.appendChild(inner_div)

    let element=document.getElementById(target_id)
    element.appendChild(outer_div)
}

//Valid Upload, then active upload button
function activate_upload_btn(){
    let upload = document.getElementById("upload")
    let upload_check = document.getElementById("upload_check")
    if (upload_check.checked){
        upload.disabled=false
    }else{
        upload.disabled=true
    }
    return upload_check.checked
}
//Activated by same event as above, show what the day-card would look like when uploaded (preview)
let upload_check = document.getElementById("upload_check")
upload_check.addEventListener("click", async function(event){
    try{
        if (activate_upload_btn()){
            let parameters = {
                title:document.getElementById("title").value,
                content:document.getElementById("content").value,
                date:document.getElementById("date").value
            }
            res = await fetch("/preview",{
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify(parameters)
            })
            if (res.ok){
                let body = await res.json()
                render_cards(body,"preview","col")
            }else{
                alert(404)
            }
        }
    }catch(e){
        alert(e)
    }
})

//When daycard uploaded, POST req to create new day card entity.
let upload = document.getElementById("upload")
upload.addEventListener("click",async function(event){
    try{
        event.preventDefault()
        let parameters = {
            title:document.getElementById("title").value,
            content:document.getElementById("content").value,
            date:document.getElementById("date").value
        }
        res = await fetch("/new",{
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify(parameters)
            })
        if (res.ok){
            let body = await res.json()
            let cards = body
            //Js object to array of values
            let card_content = []
            for(let n in cards){
                card_content.push(Object.values(cards[n]))
            }

            render_cards(card_content,"upload_content","col-4")
            render_modals_and_comments([],card_content.length) //Since we are adding a new card, we won't have any comments
        }else{
            alert(404)
        }
    }catch(e){
        alert(e)
    }
})

//Sample day card's. Prevents default action of form submittion.
let sample_body = document.getElementById("example_comment_submit")
sample_body.addEventListener("click",async function(event){
    try{
        event.preventDefault()
    }catch(e){
        alert(e)
    }
})

//add the comments in comments to corresponding modal's comment content area, with id index+comment_content
function add_comments(comments,index){
    let str_index = index.toString()
    let destination = document.getElementById("comment_content"+str_index)
    destination.innerHTML = ""
    for(let n of comments){
        destination.appendChild(document.createTextNode(n))
        destination.appendChild(document.createElement("hr"))
    }
}

//Function to create a blank modal comment section given index (used for unique id)
function render_modal(index){
    let destination = document.getElementById("modals") //final destination/container
    let str_index = index.toString()

    let input = document.createElement("input")
    input.className="form-control"
    input.setAttribute("type","text")
    input.setAttribute("id","comment"+str_index) //Unique id, comment, where user types their comment to add
    input.setAttribute("aria-describedby","comment_help"+str_index) //unique id, comment_help, the help label underneath the input textbox, linked to textbox

    let form_label_div = document.createElement("div")
    form_label_div.className="form-text"
    form_label_div.setAttribute("id","comment_help"+str_index)//linked to above
    let form_label_div_txt = document.createTextNode("Comment goes above here")
    form_label_div.appendChild(form_label_div_txt)

    let form_inside_div = document.createElement("div")
    form_inside_div.className = "mb-3"
    form_inside_div.appendChild(input)
    form_inside_div.appendChild(form_label_div)

    let form_submit_btn = document.createElement("button")
    form_submit_btn.className = "btn btn-primary some_random_class"
    form_submit_btn.setAttribute("type","submit")
    form_submit_btn.setAttribute("id","comment_submit"+str_index) //Unique id, comment_submit, where the user clicks button to submit comment in form
    form_submit_btn_txt = document.createTextNode("Add comment")
    form_submit_btn.appendChild(form_submit_btn_txt)

    let form = document.createElement("form")
    form.setAttribute("action","/")
    form.className = "row"
    form.appendChild(form_inside_div)
    form.appendChild(form_submit_btn)

    let modal_footer_div = document.createElement("div")
    modal_footer_div.className = "container modal-footer"
    modal_footer_div.appendChild(form)

    let modal_footer_close_btn = document.createElement("button")
    modal_footer_close_btn.className = "btn btn-secondary row"
    modal_footer_close_btn.setAttribute("data-bs-dismiss","modal")
    modal_footer_close_btn.setAttribute("type","button")
    modal_footer_close_btn.appendChild(document.createTextNode("Close"))
    modal_footer_div.appendChild(modal_footer_close_btn)

    let modal_body_div = document.createElement("div")
    modal_body_div.className="modal-body"
    modal_body_div.setAttribute("id","comment_content"+str_index) //Unique id, comment_content, where comments are added

    let modal_title_h5 = document.createElement("h5")
    modal_title_h5.className="modal-title"
    modal_title_h5.setAttribute("id","modal_label"+str_index) //Unique id, modal_label, connected to outermost div of modal, links the modal title and modal body
    let modal_title_h5_txt = document.createTextNode("Comments")
    modal_title_h5.appendChild(modal_title_h5_txt)

    let modal_header_btn = document.createElement("button")
    modal_header_btn.className = "btn-close"
    modal_header_btn.setAttribute("type","button")
    modal_header_btn.setAttribute("data-bs-dismiss","modal")
    modal_header_btn.setAttribute("aria-label","Close")

    let modal_header_div = document.createElement("div")
    modal_header_div.className = "modal-header"
    modal_header_div.appendChild(modal_title_h5)
    modal_header_div.appendChild(modal_header_btn)

    let modal_content_div = document.createElement("div")
    modal_content_div.className = "modal-content"
    modal_content_div.appendChild(modal_header_div)
    modal_content_div.appendChild(modal_body_div)
    modal_content_div.appendChild(modal_footer_div)

    let inner_modal_div = document.createElement("div")
    inner_modal_div.className = "modal-dialog modal-dialog-centered modal-dialog-scrollable"
    inner_modal_div.appendChild(modal_content_div)

    let outer_modal_div = document.createElement("div")
    outer_modal_div.className = "modal fade container"
    outer_modal_div.setAttribute("id","modal"+str_index) //Unique id, modal, links the day card's click action to its relative modal
    outer_modal_div.setAttribute("tabindex","-1")
    outer_modal_div.setAttribute("aria-labelledby","modal_label"+str_index) //Unique id, modal_label, links to header's title label
    outer_modal_div.setAttribute("aria-hidden","true")
    outer_modal_div.appendChild(inner_modal_div)
    
    destination.appendChild(outer_modal_div)
}

//function to run add_comment and render_modal
function render_modals_and_comments(comments,num_of_cards){
    let modals = document.getElementById("modals")
    modals.innerHTML = ""
    for(let i=0 ; i<num_of_cards ; i++){
        render_modal(i)
    }
    for(let n of comments){
        add_comments(n,comments.indexOf(n)) //render the comments inside the modal
    }
}

//Parent of all modal submit buttons
var parent = document.querySelector("#modals")
//Look for comment add events by bubbling and eventStopPropagation, and post new commentq
parent.addEventListener("click", async function(e){
    if (e.target !== e.currentTarget && e.target.className==="btn btn-primary some_random_class"){
        try{
            e.preventDefault()
            let index=e.target.id.replace(/\D/g,'')
            let data = document.getElementById("comment"+index).value
            //Empty input box after submittion
            let cont = document.getElementById("comment"+index)
            cont.value=""
            let parameter = {id:index,target_data:data}
            res = await fetch("/commented",{
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify(parameter)
            })
            if (res.ok){
                let body = await res.json()
                for(let n of body){
                    add_comments(n.comment,body.indexOf(n))
                }
                
            }else{
                alert(404)
            }
        }catch(e){
            alert(e)
        }
    }
    e.stopPropagation()
})

//Sorting day cards by date
let sort_btn = document.getElementById("sort_btn")
sort_btn.addEventListener("click",async function(event){
    try{
        res = await fetch("/sort")
        if (res.ok){
            let body = await res.text()
            let b = JSON.parse(body)
            render_all(b)
        }else{
            alert(404)
        }
    }catch(e){
        alert(e)
    }
})

//Sorting day cards by comment count
let sort_btn_freq = document.getElementById("sort_btn_freq")
sort_btn_freq.addEventListener("click",async function(event){
    try{
        res = await fetch("/sort_freq")
        if (res.ok){
            let body = await res.text()
            let b = JSON.parse(body)
            render_all(b)
        }else{
            alert(404)
        }
    }catch(e){
        alert(e)
    }
})

//js object of comment and cards, and render both from it
function render_all(b){
    let cards = b[0]
    let comments = b[1]
    let card_content = []
    let comment_content = []
    for(let n in cards){
        card_content.push(Object.values(cards[n]))
    }
    for(let n in comments){
        comment_content.push(comments[n].comment)
    }
    render_cards(card_content,"upload_content","col-4")
    render_modals_and_comments(comment_content,card_content.length)
}