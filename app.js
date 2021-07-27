//Extract Modules
const express = require("express")
const body_parser = require("body-parser")
const fs = require("fs")

//Immediate use of modules
const app = express()
app.use(express.static("./public")) //serving static files in public
app.use(express.json()) //Parsing json-encoded bodies

//success pg txt
var success_pg_txt = ""

//redirecting pages
app.get("/load_submit_pg",function(req,res){
    res.redirect("submit.html")
})

app.get("/load_search_pg",function(req,res){
    res.redirect("search.html")
})

app.get("/load_signin_pg",function(req,res){
    res.redirect("signin.html")
})

app.post("/validate_and_upload_signup",function(req,res){
    const username = req.body.username
    const password = req.body.password
    let URL = req.protocol+"://"+req.get("host")
    let body = {
        url: URL,
        valid: true
    }
    if (validate_signup(username,password)==true){
        const account_obj = {username: username, password: password}
        const d = JSON.parse(fs.readFileSync("accounts.json"))
        d.push(account_obj)
        fs.writeFileSync("accounts.json",JSON.stringify(d,null,2))
        success_pg_txt = "ACCOUNT CREATION SUCCESSFUL"
        res.json(body)
    }else{
        success_pg_txt = "ACCOUNT CREATION UNSUCCESSFUL"
        body["valid"]=false
        res.json(body)
    }
})

//validation of username and password upon signup
validate_signup = function(user,pass){
    if (user.length>0 && pass.length>0){
        return true
    }else{
        return false
    }
}

app.get("/load_result_txt_box",function(req,res){
    res.send(success_pg_txt)
})

module.exports = app