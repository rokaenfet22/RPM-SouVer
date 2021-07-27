//Extract Modules
const express = require("express")
const body_parser = require("body-parser")

//Immediate use of modules
const app = express()
app.use(express.static("./public")) //serving static files in public
app.use(express.json()) //Parsing json-encoded bodies


app.get("/load_submit_pg",function(req,res){
    res.redirect("submit.html")
})

app.get("/load_search_pg",function(req,res){
    res.redirect("search.html")
})

app.get("/load_signin_pg",function(req,res){
    res.redirect("signin.html")
})


module.exports = app