//Extract Modules
const express = require("express")
const body_parser = require("body-parser")
const fs = require("fs")

//Immediate use of modules
const app = express()
app.use(express.static("./public")) //serving static files in public
app.use(express.json()) //Parsing json-encoded bodies

//result page text
var result_pg_txt = ""

//navigating to pages
app.get("/load_submit_pg",function(req,res){
    res.redirect("submit.html")
})

app.get("/load_search_pg",function(req,res){
    res.redirect("search.html")
})

app.get("/load_signin_pg",function(req,res){
    res.redirect("signin.html")
})

//get signing up detail, validate, and upload to system if valid
app.post("/validate_and_upload_signup",function(req,res){
    const username = req.body.username
    const password = req.body.password
    let url = req.protocol+"://"+req.get("host")
    if (validate_signup(username,password)==true){
        const account_obj = {username: username, password: password, online: false}
        const d = JSON.parse(fs.readFileSync("accounts.json"))
        d.push(account_obj)
        fs.writeFileSync("accounts.json",JSON.stringify(d,null,2))
        result_pg_txt = "ACCOUNT CREATION SUCCESSFUL"
        res.send(url)
    }else{
        result_pg_txt = "ACCOUNT CREATION UNSUCCESSFUL"
        res.send(url)
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

//validation of username and password upon logging in
app.post("/validate_login",function(req,res){
    //get user and pass from req.body
    const user = req.body.username
    const pass = req.body.password
    let url = req.protocol+"://"+req.get("host")
    //load usernames and passwords from accounts.json and format into iterable array
    let account_details = load_account_details()
    let found = false
    for (var i of account_details){
        if (i["username"]==user && i["password"]==pass){
            found = true
            break
        }
    }
    //check user==usernames && pass=passwords, and if true set result_pg_txt to appropriate txt, return true
    //else set result_pg_txt to appropriate txt, return false
    if (found){
        result_pg_txt = "Logged in"
    }else{
        result_pg_txt = "Failed to Log in"
    }
    //send json response back {url:... , valid:...}
    res.send(url)
})


app.get("/load_result_txt_box",function(req,res){
    res.send(result_pg_txt)
})

load_account_details = function(){
    let accounts = JSON.parse(fs.readFileSync("accounts.json"))
    return accounts
}

module.exports = app