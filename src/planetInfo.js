export default (planet) => {
    document.getElementById("planet-card-left-header").innerText = planet.name
    document.getElementById("planet-card-left-desc").innerText = planet.information.description
    document.getElementById("planet-card-right-image").src = `./image/${planet.name}.webp`
    document.getElementById("planet-card-right-video").firstChild.src = `./video/${planet.name}.mp4`
    document.getElementById("planet-card-right-video").load()

    document.getElementById("planet-card-left-fact").innerHTML = ""

    for (const fact of planet.information.facts) {
        const planetFact = document.createElement("p")
        planetFact.innerText = `${fact[0]}: ${fact[1]}`
        document.getElementById("planet-card-left-fact").append(planetFact)
    }
}