const messages = document.getElementById("messages")
const originTarget = document.getElementById("extraInfo").textContent
const [username,targetName] = originTarget.split("-")
const requestAddress = "/chat/"+originTarget+"/messages"

console.log(requestAddress)


setInterval(() => {
    fetch(requestAddress)
    .then((response) => response.json())
    .then((json) => {
        let newInner = ""
        for (const message of json) {
            newInner += `<div class="message ${message.origin === username ? "right" : "left"}">
                        	<div class="messageText">${ message.content}</div>
                            <div class="messageText">${ message.time}</div>
                        </div>\n`
        }
        
        messages.innerHTML = newInner
        

        console.log(json)

    });
}, 2000)