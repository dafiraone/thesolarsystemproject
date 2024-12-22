export default (planet) => {
    document.getElementById("planet-card-left-header").innerText = planet.name
    document.getElementById("planet-card-left-desc").innerText = planet.information.description
    document.getElementById("planet-card-right-image").src = `./${planet.name}-image.png`
    document.getElementById("planet-card-right-video").firstChild.src = `./${planet.name}-video.mp4`
    document.getElementById("planet-card-right-video").load()
}