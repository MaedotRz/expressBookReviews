const express = require('express');
const axios = require('axios')
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    let username = req.body.username
    let password = req.body.password
    if(username && password){
        let checkExist = users.filter(user=> username === user.username)
        if(checkExist.length == 0){
            users.push({'username': username, 'password': password})
            res.status(200).json({msg: 'user successfully registerd'})
        }else{
            res.status(208).json({err: "User already exists"});
        }
    }else{
            res.status(208).json({err: "Not Registerd"});
        }
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    let allBooks = await axios.get(books)
    return  res.status(200).send(JSON.stringify(allBooks, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async (req, res)=> {
  if(req.params.isbn){
      let isbn = req.params.isbn
      let selectedBook = await axios.get(books[isbn])
      res.send(selectedBook)
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async (req, res)=> {
    if(req.params.author){
        let allBooks = await axios.get(Object.values(books))
        for(let i=0; i<allBooks.length;i++){
            if(req.params.author == allBooks[i].author){
               return res.send(books[i+1])
            }
        }
    }
});

// Get all books based on title
public_users.get('/title/:title',async (req, res)=> {
    if(req.params.title){
        let allBooks = await axios.get(Object.values(books))
        console.log(allBooks)
        for(let i=0; i<allBooks.length;i++){
            if(req.params.title == allBooks[i].title){
               return res.send(books[i+1])
            }
        }
    }
});

//  Get book review
public_users.get('/review/:isbn',async (req, res)=> {
    if(req.params.isbn){
        let isbn = req.params.isbn
        let selectedReview = await axios.get(books[isbn].reviews)
        res.send(selectedReview)
    }
  });

module.exports.general = public_users;
