const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    res.render('home');
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/settings', (req, res) => {
    res.render('settings');
});
app.get('/friends', (req, res) => {
    res.render('friends');
});
app.get('/activities', (req, res) => {
    res.render('activities');
});
app.get('/chat', (req, res) => {
    res.render('chat');
});
app.get('/call', (req, res) => {
    res.render('call');
});
app.get('/searchFriends', (req, res) => {
    res.render('searchFriends');
});
app.get('/searchActivity', (req, res) => {
    res.render('searchActivity');
});
app.get('/createActivity', (req, res) => {
    res.render('createActivity');
});
app.get('/profile', (req, res) => {
    res.render('profile');
});
app.get('/activity', (req, res) => {
    res.render('activity');
});

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);