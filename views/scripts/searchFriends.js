var startX, startY, endX, endY;
var swipeThreshold = 100;

const requestAddress = "/searchFriends" + document.getElementById("requestPath").textContent

function handleTouch() {
  if (
    Math.abs(endX - startX) >
      Math.abs(endY - startY) &&
    Math.abs(endX - startX) > swipeThreshold
  ) {
    if (endX - startX < 0) {
        console.log("rejecting user")
        fetch(requestAddress, {headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "POST",
          body: JSON.stringify({"type": "reject" })})
        window.location.reload(true)
    } else {
        console.log("sending request")
        fetch(requestAddress, {headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "POST",
          body: JSON.stringify({"type": "request" })})
        window.location.reload(true)
        // .then((response) => response.json())
        // .then((json) => {});
    }
    // Find next profile
  }
}

window.onload = function () {
  window.addEventListener("touchstart", function (event) {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
  });

  window.addEventListener("touchend", function (event) {
    endX = event.changedTouches[0].clientX;
    endY = event.changedTouches[0].clientY;

    handleTouch();
  });
};
