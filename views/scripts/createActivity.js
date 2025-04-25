const friends = document.getElementById("totalFriends").innerHTML.split(" ")

const friendsinput = document.getElementById("friendsinput")
const friendList = document.getElementById("friendList")

document.getElementById("addFriend").addEventListener("click", (e) => {
    const val = document.getElementById("friendsListInput").value
    console.log(val)
    if (friends.includes(val) && !friendsinput.value.split(" ").includes(val)) {
        friendsinput.value += val + " "
        friendList.innerHTML += "<li>" + val + "</li>"
    }
})
