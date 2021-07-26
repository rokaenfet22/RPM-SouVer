//Extract Modules
const express = require("express")
const body_parser = require("body-parser")
const fs = require("fs")
const date = require("date-and-time")
const multer = require("multer")
const _ = require("lodash")

//Immediate use of modules
const app = express()
app.use(express.static("./client")) //serving static files from /client dir
app.use(express.json()) //Parsing json-encoded bodies
const now = new Date()

//Load both comment and content
app.get("/content",function(req,res) {
  res.json(read_json())
})

//For uploading new card content
app.post("/new",function(req,res) {
  if (req.body.title === "" && req.body.content === "") {
    res.status(400).send("empty input values")
  }
  if (!("title" in req.body) && !("date" in req.body) && !("content" in req.body)) {
    res.status(400).send("missing body keys")
  } else {
    let date_content = req.body.date
    if (date_content === "") {
      const now = new Date()
      date_content = date.format(now,"YYYY-MM-DD")
    }
    const obj = {
      title: req.body.title,
      content: req.body.content,
      date: date_content
    }
    const data = JSON.stringify(obj,null,2)
    const card_json = read_json()[0]

    card_json.push(JSON.parse(data))
    fs.writeFileSync("cards.json",JSON.stringify(card_json,null,2))

    const new_comment_obj = {
      comment: []
    }
    const d = JSON.parse(fs.readFileSync("comment.json"))
    d.push(new_comment_obj)
    fs.writeFileSync("comment.json",JSON.stringify(d,null,2))

    res.json(read_json()[0])
  }
})

//For updating preview
app.post("/preview",function(req,res) {
  const parameter = [req.body.title,req.body.content]
  if (req.body.date === "") {
    const now = new Date()
    parameter.push(date.format(now,"YYYY-MM-DD"))
  } else {
    parameter.push(req.body.date)
  }
  res.json([parameter])
})

//For updating comment
app.post("/commented",function(req,res) {
  if (req.body.target_data === "" || req.body.id === "") {
    res.status(400).send("empty values")
  } else {
    const i = req.body.id
    const comment_txt = req.body.target_data

    const data = JSON.parse(fs.readFileSync("comment.json"))
    const relevant_data = data[i].comment
    const whole_data = data
    relevant_data.push(comment_txt)
    const obj = {
      comment: relevant_data
    }
    whole_data.splice(i,1,obj)
    fs.writeFileSync("comment.json",JSON.stringify(whole_data,null,2))
    res.json(read_json()[1])
  }
})

//For sorting cards by date
app.get("/sort",function (req,res) {
  const data_jsons = read_json()
  const cards_data = data_jsons[0]
  const comments_data = data_jsons[1]

  const cards_record = []
  let comments_record = []
  for (i in cards_data) {
    cards_record.push([i,cards_data[i],cards_data[i].date])
    comments_record.push([i,comments_data[i]])
  }

  //Sort cards_record, then rearrange comments_record accordingly to match it, then rewrite it all
  cards_record.sort(compare_dates)
  const sorting_arr = []
  for (const n of cards_record) {
    sorting_arr.push(n[0])
  }

  const result_comments_records = []
  sorting_arr.forEach(function(key) {
    let found = false
    comments_record = comments_record.filter(function(item) {
      if (!found && item[0] === key) {
        result_comments_records.push(item)
        found = true
        return false
      } else {
        return true
      }
    })
  })

  //cards_record and result_comments_records is now sorted relative to each other
  //Update json files accordingly
  const cards_obj = []
  const comments_obj = []
  for (const n of cards_record) {
    cards_obj.push(n[1])
  }
  for (const n of result_comments_records) {
    comments_obj.push(n[1])
  }

  fs.writeFileSync("comment.json",JSON.stringify(comments_obj,null,2))
  fs.writeFileSync("cards.json",JSON.stringify(cards_obj,null,2))

  res.json(read_json())
})
//sort 2d array on 3rd column, ascending order
compare_dates = function(date1,date2) {
  d1 = new Date(date1[2])
  d2 = new Date(date2[2])
  if (d1 > d2) return 1
  else if (d1 < d2) return -1
  else return 0
}

app.get("/sort_freq",function(req,res) {
  const data_jsons = read_json()
  const cards_data = data_jsons[0]
  const comments_data = data_jsons[1]

  let cards_record = []
  const comments_record = []
  for (const i in cards_data) {
    cards_record.push([i,cards_data[i]])
    comments_record.push([i,comments_data[i],comments_data[i].comment.length])
  }
  //Sort comments_record by 3rd element (comment list length), then arrange cards_record to match that
  comments_record.sort(compare_dates)
  const sorting_arr = []
  for (const n of comments_record) {
    sorting_arr.push(n[0])
  }
  const result_cards_records = []
  sorting_arr.forEach(function(key) {
    let found = false
    cards_record = cards_record.filter(function(item) {
      if (!found && item[0] === key) {
        result_cards_records.push(item)
        found = true
        return false
      } else {
        return true
      }
    })
  })
  //comments_record and result_cards_records is now sorted relative to each other
  //Update json files accordingly
  const cards_obj = []
  const comments_obj = []
  for (const n of result_cards_records) {
    cards_obj.push(n[1])
  }
  for (const n of comments_record) {
    comments_obj.push(n[1])
  }

  fs.writeFileSync("comment.json",JSON.stringify(comments_obj,null,2))
  fs.writeFileSync("cards.json",JSON.stringify(cards_obj,null,2))

  res.json(read_json())
})

//JSON interpreting. Returns List[[cards object1, cards object2],[comments object1, commetns object2]]
function read_json() {
  const cards = JSON.parse(fs.readFileSync("cards.json"))
  const comment = JSON.parse(fs.readFileSync("comment.json"))
  return [cards,comment]
}

module.exports = app
