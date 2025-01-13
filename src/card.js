export default () => {
    const cardLeft = document.createElement("div")
    cardLeft.id = "planet-card-left"
    cardLeft.classList.add("planet-card", "card-left")

    const cardRight = document.createElement("div")
    cardRight.id = "planet-card-right"
    cardRight.classList.add("planet-card", "card-right")

    const cardRightImage = document.createElement("img")
    cardRightImage.id = "planet-card-right-image"
    cardRightImage.src = "/Sun-image.webp"
    cardRight.append(cardRightImage)

    const cardRightVideo = document.createElement("video")
    cardRightVideo.id = "planet-card-right-video"
    // cardRightVideo.width = "350"
    // cardRightVideo.height = "240"
    cardRightVideo.controls = true
    // cardRightVideo.autoplay = true
    const cardRightVideoSource = document.createElement("source")
    cardRightVideoSource.src = "/Sun-video.mp4"
    cardRightVideoSource.type = "video/mp4"
    cardRightVideo.append(cardRightVideoSource)
    cardRight.append(cardRightVideo)

    const btnClose = document.createElement("button")
    btnClose.type = "button"
    const btnCloseIcon = document.createElement("img")
    btnCloseIcon.src = "./icons8-left-arrow-50.png"
    btnCloseIcon.height = 20
    btnCloseIcon.width = 20
    btnClose.append(btnCloseIcon)
    btnClose.id = "close-planet-card"

    btnClose.addEventListener("click", (e) => {
        const ele = document.getElementsByClassName("planet-card")
        for (const elem of ele) {
            elem.hidden = true
        }
        document.getElementById("planet-card-right-video").pause()
        btnClose.style.display = "none"
    })


    const planetName = document.createElement("h1")
    planetName.id = "planet-card-left-header"
    planetName.innerText = "Sun"

    const planetDesc = document.createElement("p")
    planetDesc.id = "planet-card-left-desc"
    planetDesc.innerText = "The center of the solar system. It is a star that provides light and energy to all the planets"

    const planetFactDiv = document.createElement("div")
    planetFactDiv.id = "planet-card-left-fact"

    cardLeft.append(planetName)
    cardLeft.append(document.createElement("hr"))
    cardLeft.append(planetDesc)
    cardLeft.append(planetFactDiv)

    const tutorialButton = document.createElement("button")
    tutorialButton.type = "button"
    tutorialButton.id = "tutorial-button"
    tutorialButton.innerText = "Show Tutorial"
    
    cardRight.hidden = true
    cardLeft.hidden = true
    btnClose.style.display = "none"
    document.body.prepend(tutorialButton)
    document.body.prepend(cardRight)
    document.body.prepend(cardLeft)
    document.body.prepend(btnClose)

    document.body.addEventListener("keydown", e => {
        if (e.key === "Escape") {
        document.getElementById("close-planet-card").style.display = "none"
        document.getElementById("planet-card-left").hidden = true
        document.getElementById("planet-card-right").hidden = true
        }
    })

    tutorialButton.addEventListener("click", () => {
        btnClose.style.display = "none"
        cardRight.hidden = true

        planetName.innerText = "Tutorial"
        planetDesc.innerText = "How to use Solar System Website"
        const planetLeftTutorial = document.getElementById("planet-card-left-fact")

        planetLeftTutorial.innerHTML = ""

        const tutorials = ["Orbitting: Click + Drag Mouse@orbit", "Panning: Shift + Click + Drag Mouse@panning", "Zoom: Use Scroll or Pinch & Spread@zoom", "Show Info: Click Object@showinfo", "Hide Info: Press Escape or Click Back Button on top left@hideinfo", "Show Tweaks: Shift + T@showtweaks"]

        tutorials.forEach(tut => {
            const tuts = tut.split("@")
            const tutorialTitle = document.createElement("p")
            tutorialTitle.innerText = tuts[0]
            planetLeftTutorial.append(tutorialTitle)
            
            const tutorialGif = document.createElement("img")
            tutorialGif.className = "tutorial-gif"
            tutorialGif.src = `./tutorial-${tuts[1]}.gif`
            planetLeftTutorial.append(tutorialGif)
        })
        

        cardLeft.toggleAttribute("hidden")
        tutorialButton.innerText = cardLeft.hidden ? "Show Tutorial" : "Hide Tutorial"
    })

    document.body.addEventListener("keydown", e => {
        if (e.key === "t") {
            tutorialButton.click()
        }
    })
}