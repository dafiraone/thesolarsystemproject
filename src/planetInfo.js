export default (planet) => {
    const planetName = document.getElementById("planet-info-name")
    planetName.innerText = planet.name
}