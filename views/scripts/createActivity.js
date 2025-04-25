const friends = document.getElementById("totalFriends").innerHTML.split(" ")

const friendsinput = document.getElementById("friendsinput")
const friendList = document.getElementById("friendList")

document.getElementById("addFriend").addEventListener("click", (e) => {
    const val = document.getElementById("friendsListInput").value
    console.log(val)
    if (!friendsinput.value.split(" ").includes(val)) {
        friendsinput.value += val + " "

        // console.log("inp", friendsinput.value)
        
        friendList.innerHTML += `<li class='friendOption friendName-${val}' onclick='handleRemove("${val}")'>${val}</li>`
    }
})

function handleRemove(friend) {
    friendsinput.value = friendsinput.value.replace(friend + " ", "")

    document.getElementsByClassName("friendName-"+friend)[0].remove()

    // console.log("inp del", friendsinput.value)

    console.log(friend)
}

// document.getElementsByClassName("friendOption").addEventListener("click", () => {console.log("click")})
// .forEach(element => { 
//     element.addEventListener("click", (e) => {
//         element.remove()
//     })

// })