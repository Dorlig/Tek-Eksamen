const e = require('express');
const express = require('express');
const bodyParser = require('body-parser');
var fs = require('fs');
const path = require('path');
const { rejects } = require('assert');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + "/views"));

function formatDate (date, dateStyle, timeStyle) {
    return new Intl.DateTimeFormat("da-DK", {
        dateStyle: dateStyle,
        timeStyle: timeStyle,
        timeZone: "Europe/Copenhagen",
      }).format(date)
}

const tempUser = {
            "password": "",
            "email": "",
            "friends": [],
            "friendRequests": [],
            "friendRejects": [],
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
    "participants": [],
    "creator": ""
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

    let emailUsed = false
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


app.get('/friends/:username', (req, res) => {
    console.log(req.params.username)

    var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    if (obj.users[req.params.username]) {
        console.log(obj.users[req.params.username].friends)

        // Find latest messages to each user
        messages = {}

        let userFriends = obj.users[req.params.username].friends

        for (const friend of userFriends) {
            const chats = obj.users[req.params.username].chats[friend]


            let mostRecentChat = chats[0]

            for (const chat of chats) {
                if (chat.time > mostRecentChat.time) {
                    mostRecentChat = chat
                }
            }

            // TODO: handle no messages in EJS
            if (mostRecentChat != undefined) {
                // mostRecentChat.time = formatDate(new Date(mostRecentChat.time), "short", "medium")
                messages[friend] = mostRecentChat
            }
            else {
                mostRecentChat = {}
                mostRecentChat.origin = ""
                mostRecentChat.content = ""
                mostRecentChat.time = 0
                messages[friend] = mostRecentChat
            }

            
            // console.log(formatDate(new Date()))
            // console.log(formatDate(new Date(Date.now())))
        }
        
        console.log(messages)
        userFriends.sort((a, b) => messages[b].time - messages[a].time)

        res.render('friends', {friends: userFriends, messages: messages, username: req.params.username});
    }
    else {
        res.render('friends', {friends: [], messages: [], username: req.params.username});
    }

});
app.get('/activities/:username', (req, res) => {
    // console.log(req.params.username)

    var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    if (obj.users[req.params.username]) {
        const userFriends = obj.users[req.params.username].friends

        const activities = []

        for (const friend of userFriends) {
            console.log(friend)
            for (const activity of obj.users[friend].activities) {
                if (activity.friends.includes(req.params.username)) {
                    activity.created = formatDate(new Date(activity.created), "medium", "short")
                    activities.push(activity)
                }
            }
        }

        for (let act of obj.users[req.params.username].activities) {
            act.created = formatDate(new Date(act.created), "medium", "short")
        }

        res.render('activities', {activities: activities, userActivities: obj.users[req.params.username].activities, username: req.params.username});
    }
    else {
        res.render('activities', {activities: []});
    }
});


app.get('/chat/:originTarget', (req, res) => {
    const [username, targetName] = req.params.originTarget.split("-")

    var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    // console.log(username,targetName, obj.users[username].chats[targetName].sort((a, b) => a.time - b.time))

    let userChats = obj.users[username].chats

    if (userChats != undefined) {
        for (let message of userChats[targetName]) {
            message.time = formatDate(new Date(message.time), "short", "short").split(",")[1]
        }
    }
    else {
        userChats = []
    }

    res.render('chat', {username: username, targetName: targetName, messages: obj.users[username].chats[targetName].sort((a, b) => a.time - b.time)});
});
app.post('/chat/:originTarget', (req, res) => {
    const [username, targetName] = req.params.originTarget.split("-")

    var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    console.log(req.body)

    if (req.body.messageContent !== "") {
        const newMessage = structuredClone(tempMessage)
        newMessage.content = req.body.messageContent
        newMessage.time = (new Date()).getTime()
        newMessage.origin = username
    
        obj.users[username].chats[targetName].push(newMessage)
        obj.users[targetName].chats[username].push(newMessage)
    
        const data = JSON.stringify(obj);
    
        fs.writeFile("data.json", data, (error) => {
            if (error) {
                console.error(error);
    
                throw error;
            }
    
            console.log("Updated user profile");
        });
    }

    // console.log(username,targetName, obj.users[username].chats[targetName].sort((a, b) => a.time - b.time))

    const messages = obj.users[username].chats[targetName]

    for (let message of messages) {
        message.time = formatDate(new Date(message.time), "medium", "medium")
    }

    res.render('chat', {username: username, targetName: targetName, messages: obj.users[username].chats[targetName].sort((a, b) => a.time - b.time)});
})
app.get('/chat/:originTarget/messages', (req, res) => {
    const [username, targetName] = req.params.originTarget.split("-")

    var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    // console.log(username,targetName, obj.users[username].chats[targetName].sort((a, b) => a.time - b.time))

    console.log(username)
    console.log(obj.users[username])
    let userChats = obj.users[username].chats

    if (userChats != undefined) {
        for (let message of userChats[targetName]) {
            message.time = formatDate(new Date(message.time), "short", "short").split(",")[1]
        }
    }
    else {
        userChats = []
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(userChats[targetName].sort((a, b) => a.time - b.time)));
})

app.get('/settings/:username', (req, res) => {
    res.render('settings', {username: req.params.username});
});
app.get('/call', (req, res) => {
    res.render('call');
});
app.get('/searchActivity', (req, res) => {
    
    res.render('searchActivity');
});

app.get('/searchFriends/:username', (req, res) => {
    var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    let totalUsers = Object.keys(obj.users).filter(function (user) {return (obj.users[req.params.username].friends.indexOf(user) === -1) && 
                                                                            (user!==req.params.username) && 
                                                                            (obj.users[req.params.username].friendRequests.indexOf(user) === -1) &&
                                                                            (obj.users[req.params.username].friendRejects.indexOf(user) === -1);});

    let withFriendRequests = []

    for (const user of totalUsers) {
        if (obj.users[user].friendRequests.includes(req.params.username)) {
            withFriendRequests.push(user)
        }
    }

    let bestUser = ""
    if (withFriendRequests.length != 0) {
        const userMatching = []

        for (const user of withFriendRequests) {
            userMatching.push([user, obj.users[user].profile.interests.filter(
                value => obj.users[req.params.username].profile.interests.includes(value)).length]
            );
        }

        userMatching.sort((a,b) => b[1] - a[1])

        bestUser = userMatching[0][0]
        console.log(userMatching)
    }
    else {
        const userMatching = []

        for (const user of totalUsers) {
            userMatching.push([user, obj.users[user].profile.interests.filter(value => obj.users[req.params.username].profile.interests.includes(value)).length]);

            // console.log([user, obj.users[user].profile.interests.filter(value => obj.users[req.params.username].profile.interests.includes(value)).length])
        }

        userMatching.sort((a,b) => b[1] - a[1])

        bestUser = userMatching[0][0]
        console.log(userMatching)
    }
    
    res.render('searchFriends', {profile: obj.users[bestUser].profile, targetName: bestUser, username: req.params.username, userInterests: obj.users[req.params.username].profile.interests});
});
app.post('/searchFriends/:username/:target', (req, res) => {
    var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    if (req.body["type"] == "reject") {
        // If reject, then add to list of rejected users
        obj.users[req.params.username].friendRejects.push(req.params.target)
        console.log("reject")
    } else if (req.body["type"] == "request") {
        // if target not on friendReqs, then add to your friend reqs
        // else if on friendReqs, then add both to friends and create chat for both users
        if (!obj.users[req.params.target].friendRequests.includes(req.params.username)) {
            obj.users[req.params.username].friendRequests.push(req.params.target)
        } else {
            obj.users[req.params.username].friends.push(req.params.target)
            obj.users[req.params.username].chats[req.params.target] = []
            obj.users[req.params.target].friends.push(req.params.username)
            obj.users[req.params.target].chats[req.params.username] = []
            obj.users[req.params.target].friendRequests.splice(obj.users[req.params.target].friendRequests.indexOf(req.params.username), 1)
        }
    }

    const data = JSON.stringify(obj);
        
    fs.writeFile("data.json", data, (error) => {
        if (error) {
            console.error(error);

            throw error;
        }

        console.log("Updated friends status");
    });


    // res.redirect('back');
    res.redirect("/searchFriends/"+req.params.username)
    // res.render('searchFriends', {profile: obj.users["user1"].profile, targetName: "user1", username: req.params.username, userInterests: obj.users[req.params.username].profile.interests});
});



app.get('/createActivity/:username', (req, res) => {
    var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    res.render('createActivity', {username: req.params.username, friends: obj.users[req.params.username].friends});
});
app.post('/createActivity/:username', (req, res) => {
    var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    const newActivity = structuredClone(tempActivity)

    newActivity.created = new Date().getTime()
    newActivity.title = req.body.title
    newActivity.description = req.body.description
    newActivity.creator = req.params.username
    newActivity.friends = req.body.friends.split(" ")
    newActivity.participants = []

    obj.users[req.params.username].activities.push(newActivity)

    const data = JSON.stringify(obj);

    fs.writeFile("data.json", data, (error) => {
        if (error) {
            console.error(error);

            throw error;
        }

        console.log("created new User");
    });

    console.log(req.body)

    res.redirect("/activities/"+req.params.username)
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

app.get('/activity/:originTarget/:id', (req, res) => {
    const [username, targetName] = req.params.originTarget.split("-")
    const id = req.params.id

    var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    const info = obj.users[targetName].activities[id]

    info.created = formatDate(new Date(), "long", "short")

    console.log(info)

    res.render('activity', {username: username, activity: info, id: id});
});
app.post('/activity/:originTarget/:id/join', (req, res) => {
    const [username, targetName] = req.params.originTarget.split("-")
    const id = req.params.id

    var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    if (!obj.users[targetName].activities[id].participants.includes(username)) {
        obj.users[targetName].activities[id].participants.push(username)

        const data = JSON.stringify(obj);

        fs.writeFile("data.json", data, (error) => {
            if (error) {
                console.error(error);

                throw error;
            }

            console.log("Updated user profile");
        });
    }

    const info = obj.users[targetName].activities[id]

    info.created = formatDate(new Date(), "long", "short")

    console.log(info)

    res.render('activity', {username: username, activity: info, id: id});
});
app.post('/activity/:originTarget/:id/remove', (req, res) => {
    const [username, targetName] = req.params.originTarget.split("-")
    const id = req.params.id

    var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    if (obj.users[targetName].activities[id].participants.includes(username)) {
        obj.users[targetName].activities[id].participants.splice(obj.users[targetName].activities[id].participants.indexOf(username), 1)

        const data = JSON.stringify(obj);

        fs.writeFile("data.json", data, (error) => {
            if (error) {
                console.error(error);

                throw error;
            }

            console.log("Updated user profile");
        });
    }

    const info = obj.users[targetName].activities[id]

    info.created = formatDate(new Date(), "long", "short")

    console.log(info)

    res.render('activity', {username: username, activity: info, id: id});
});

app.listen(PORT, "localhost", (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
    console.log("Error occurred, server can't start", error);
}
);