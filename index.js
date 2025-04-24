const e = require('express');
const express = require('express');
const bodyParser = require('body-parser');
var fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + "/views"));

const tempUser = {
            "password": "",
            "email": "",
            "friends": [],
            "profile": {
                "age": -1,
                "interests": [],
                "description": ""
            },
            "chats": {},
            "activities": []
            
        }

const tempMessage ={"origin": "",
    "content": "",
    "time": ""}

const tempActivity = {
    "title": "",
    "created": "",
    "description": "",
    "friends": [],
    "participants": []
}

app.get('/', (req, res) => {
    res.render('home');
});
app.get('/login', (req, res) => {
    console.log(req.body)

    res.render('login');
});
app.post('/login', (req, res) => {
    const {username, password} = req.body

    var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    console.log(username, password)
    console.log(obj.users[username])

    if (obj.users[username] && obj.users[username].password === password) {
        res.redirect("/friends/"+username)
    }
    else {
        res.render('login');
    }
});

app.get('/signUp', (req, res) => {
    // console.log(req.body)

    res.render('signUp');
});
app.post('/signUp', (req, res) => {
    const {username, email, password} = req.body

    var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    // console.log(obj.users)

    const emailUsed = false
    for (const user of Object.keys(obj.users)) {
        if (email == obj.users[user].email) {
            emailUsed = true
        }
    }
    
    if (!obj.users[username] && !emailUsed){
        // Create profile
        const newUser = structuredClone(tempUser)
        newUser.username = username
        newUser.password = password
        newUser.email = email

        obj.users[username] = newUser

        const data = JSON.stringify(obj);

        fs.writeFile("data.json", data, (error) => {
            if (error) {
                console.error(error);

                throw error;
            }

            console.log("created new User");
        });

        res.redirect("/profile/"+username)
    }
    else {
        res.render('signUp');
    }
    

    // var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    // console.log(username, password)
    // console.log(obj.users[username])

    // if (obj.users[username] && obj.users[username].password === password) {
    //     res.redirect("/friends/"+username)
    // }
    // else {
    //     res.render('signUp');
    // }
});

app.get('/settings', (req, res) => {
    res.render('settings');
});
app.get('/friends/:username', (req, res) => {
    console.log(req.params.username)

    var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    if (obj.users[req.params.username]) {
        console.log(obj.users[req.params.username].friends)

        // Find latest messages to each user
        messages = {}

        res.render('friends', {friends: obj.users[req.params.username].friends, messages});
    }
    else {
        res.render('friends', {friends: [], messages: []});
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
app.get('/profile/:username', (req, res) => {
    var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));


    // console.log(obj.users[req.params.username].profile)
    res.render('profile', {profile: obj.users[req.params.username].profile, username: req.params.username});
});
app.post('/profile/:username', (req, res) => {
    var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    console.log(req.body)
    
    if (obj.users[req.params.username]){
        obj.users[req.params.username].profile.age = req.body.age
        obj.users[req.params.username].profile.description = req.body.description
        obj.users[req.params.username].profile.interests = JSON.parse(req.body.interests)

        const data = JSON.stringify(obj);

        fs.writeFile("data.json", data, (error) => {
            if (error) {
                console.error(error);

                throw error;
            }

            console.log("Updated user profile");
        });

        res.redirect("/friends/"+req.params.username)
    }
    else {
        res.render('profile');
    }
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