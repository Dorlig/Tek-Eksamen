let interests = [
    "Sport",
    "Fodbold",
    "Håndbold",
    "Tennis",
    "Badminton",
    "Svømning",
    "Løb",
    "Cykling",
    "Fitness",

    "Computerspil",
    "Counter Strike",
    "Fortnite",
    "Leage of Legends",
    "Valorant",
    "World of Warcraft",
    "Minecraft",
    "GTA 5",
    "Stardew Valey",
    "BTD 6",
    "Celeste",

    "Underholdning",
    "Teater",
    "Film",
    "Musical",
    "Læsning",

    "Musik",
    "Klassisk musik",
    "Rock",
    "EDM",
    "Pop",
    "Country",
    "Rap",
    "Hip Hop",
    "Folkemusik",

    "Skole",
    "Matematik",
    "Fysik",
    "Kemi",
    "Sprog",
    "Programmering",
    "Biologi",
    "Geografi",
    "Politik",


    "Fotografi",
    "Skak",
    "Madlavning",
    "Bagning",
    "Skriving",
    "Videoproduktion",
    "Design",
    "Maleri",
    "Rejse",
    "Fest",
    "Alkohol"
    
]

let categories = {
    'sport': ["Fodbold","Håndbold","Tennis","Badminton","Svømning",],
    'computerspil': ["Counter Strike","Fortnite","Leage of Legends","Valorant","World of Warcraft","Minecraft","GTA 5","Stardew Valey","BTD 6","Celeste"],
    'ost': ["Ost", "Parmesan", "Cheddar"],
    'mejeri': ["Mælk", "Fløde"],
    'alkohol': ["Øl", "Snaps", "Rødvin", "Rosévin", "Hvidvin", "Ethanol", "Vodka", "Whisky"]
}

interests.sort()

$(document).ready(function() {
    for (const key of interests) {
        let int = document.createElement("div")
        int.classList.add("interest")
        let name = document.createElement("h3")
        name.innerHTML = key

        int.append(name)

        $(".resultsGrid").append(int)
    }

    var selected = JSON.parse($('#variableJSON').val());
    // $('#variableJSON').remove();

    // After loading page, select each element, which was previously selected from local storage
    $(".resultsGrid").children(".interest").each(function() {
        let intName = $(this).first().text().toString()
        if (selected.includes(intName)) {
            $(this).toggleClass("select", true)
            $(this).css("order", "-1")
        }
    })

    $(".interest").on('click', function() {
        $(this).toggleClass("select")

        let intName = $(this).first().text().toString()

        // console.log(ingName)
        if (selected.includes(intName)) {
            selected.splice(selected.indexOf(intName),1)
            $('#variableJSON').val(JSON.stringify(selected))
            $(this).css("order", "0")
        } else {
            selected.push(intName)
            console.log(selected)
            $('#variableJSON').val(JSON.stringify(selected))
            $(this).css("order", "-1")
        }

        // Gem informationen om valgte ingredienser i session storage
        sessionStorage.setItem("selected", selected)
        // console.log(selected)
    })

    // When something typed into searchbar filter interests
    $("#searchBar").on('input', function() {
        // Get what is seatched
        searchedString = $("#searchBar").val()
        
        // For each interest
        $(".resultsGrid").children(".interest").each(function() {
            let intName = $(this).first().text().toString()

            // Get the categories of interests, which are searched for
            let selectedCats = Object.keys(categories).filter(value => value.includes(searchedString))
            // Find all the interests in the searched categories
            let catinterests = []
            for (let cat of selectedCats) {
                catinterests.push(...categories[cat])
            }

            // If interests is not searched for and not in one of the searched categories then hide, else show
            if (!intName.includes(searchedString) && !catinterests.includes(intName)) {
                $(this).toggleClass("hide", true)
            }
            else {
                $(this).toggleClass("hide", false)
            }
        })
    })

    // When remove button is clicked remove all selected interests, and set all to grey
    $(".removeBtn").on('click', function() {
        selected = []
        $('#variableJSON').val(JSON.stringify(selected))
        sessionStorage.setItem("selected", selected)
        $(".resultsGrid").children(".interest").each(function() {
            $(this).toggleClass("select", false)
            $(this).css("order", "0")
        })
    })
})