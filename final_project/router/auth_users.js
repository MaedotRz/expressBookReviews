const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
    let filtered = users.filter(user=> username ===user.username && password ===user.password) 
    if(filtered.length>0) return true
    else return false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    let username = req.body.username
    let password = req.body.password
    if(username && password){
        if(authenticatedUser(username, password)){
            let accessToken = jwt.sign({
                data: username,
            }, 'access', {expiresIn: 60*60})
            req.session.authorization = {accessToken, username}
            return res.status(200).json({msg: 'successfully logged in'})
        }else{
            return res.status(403).json({err:'No such User'})
        }
    }else{
        return res.status(208).json({err: 'please provide credentials'})
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    if(req.params.isbn){
        let isbn = req.params.isbn
        let book = books[isbn]

        if(book){
            if(req.body.review){
                book['reviews'] = {
                    username: req.user.data,
                    review: req.body.review
                }
            }
        }
        books[isbn] = book
        console.log(books[isbn])
        res.send('review added')

    }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn
    if(isbn){
        let book = books[isbn]
        if(book){
            delete book['reviews']
            res.send('reveiw successfully deleted')
        }
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
