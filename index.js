const e = require('express');
const express = require('express');
var fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + "/views"))

app.get('/', (req, res) => {
    res.render('home');
});
app.get('/login', (req, res) => {
    res.render('login');
    console.log(req).body
});

app.get('/login-request', (req, res) => {
    // console.log(req)

    res.render('login');
});

app.get('/settings', (req, res) => {
    res.render('settings');
});
app.get('/friends/:username', (req, res) => {
    console.log(req.params.username)

    var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    if (obj.users[req.params.username]) {
        console.log(obj.users[req.params.username].friends)
        res.render('friends', {friends: obj.users[req.params.username].friends});
    }
    else {
        res.render('friends', {friends: []});
    }

});
app.get('/activities/:username', (req, res) => {
    // console.log(req.params.username)

    var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    if (obj.users[req.params.username]) {
        const friends = obj.users[req.params.username].friends

        const activities = []

        for (const friend of friends) {
            console.log(friend)
            for (const activity of obj.users[friend].activities) {
                activities.push(activity)
            }
        }

        res.render('activities', {activities: activities});
    }
    else {
        res.render('activities', {activities: []});
    }
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