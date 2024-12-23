// Distance dalam satuan AU

export default [
    {
        name: "Sun",
        distance: 0,
        scale: 1,
        speed: 0.001,
        speed: 0.001,
        zVector: 4,
        information: {
            description: "The center of the solar system. It is a star that provides light and energy to all the planets",
            facts: [
                ["Equator Circumference", "4,379,000km"],
                ["Radius", "695,700km"],
                ["Temperature", "5,973°C to 15,000,000°C"],
                ["Average orbital speed around the Milky Way", "720,000km/h (200km/s)"],
                ["Star type", "Yellow dwarf"],
                ["Average time taken to rotate on axis", "27 Earth days"],
                ["Number of planets", "8"]
            ]
        }
    },
    {
        name: "Mercury",
        distance: 3,
        scale: 0.1,
        speed: 0.001,
        zVector: 0.5,
        information: {
            description: "The closest planet to the Sun. It has a very thin atmosphere and extreme temperatures",
            facts: [
                ["Equator Circumference", "15,329km"],
                ["Radius", "2,440km"],
                ["Average distance from Sun", "58 million km"],
                ["Surface temperature", " -180°C to 430°C"],
                ["Day length", "59 Earth days"],
                ["Year length", " 88 Earth days"],
                ["Average orbital speed", "170,500km/h (47km/s)"],
                ["Moons", "0"],
                ["Planet type", "Terrestrial"],
            ],
        }
    },
    {
        name: "Venus",
        distance: 6,
        scale: 0.2,
        speed: 0.001,
        zVector: 1,
        information: {
            description: "Known as Earth's twin. It has a thick atmosphere and surface temperatures high enough to melt lead",
            facts: [
                ["Equator Circumference", "38,025km"],
                ["Radius", "6,052km"],
                ["Average distance from Sun", "108 million km"],
                ["Surface temperature", "462°C"],
                ["Day length", "126,074km/h (35km/s)"],
                ["Solar day length: ", "117 Earth days"],
                ["Year length", "225 Earth days"],
                ["Average orbital speed", "107,218 km/h (29.78 km/s)"],
                ["Moons", "0"],
                ["Planet type", "Terrestrial"],
            ],        
        }
    },
    {
        name: "Earth",
        distance: 9,
        scale: 0.3,
        speed: 0.001,
        zVector: 1.5,
        information: {
            description: "The only planet known to support life. It has a breathable atmosphere and abundant water",
            facts: [
                ["Equator Circumference", "40,075 km"],
                ["Radius", "6,371 km"],
                ["Average distance from Sun", "49.6 million km"],
                ["Surface temperature", "-88°C to 58°C"],
                ["Day length", "24 hours (1 Earth day)"],
                ["Year length", " 365.25 Earth days"],
                ["Average orbital speed", "107,218 km/h (29.78 km/s)"],
                ["Moons", "1"],
                ["Planet type", "Terrestrial"],
            ],
        }
    },
    {
        name: "Mars",
        distance: 12,
        scale: 0.4,
        speed: 0.001,
        zVector: 2,
        information: {
            description: "Known as the Red Planet due to its reddish appearance. It has a thin atmosphere and ice caps",
            facts: [
                ["Equator Circumference", " 21,344 km"],
                ["Radius", " 3,390 km"],
                ["Average distance from Sun", "228 million km"],
                ["Surface temperature", "-125°C to 20°C"],
                ["Day length", "24.6 hours (1.03 Earth days)"],
                ["Year length", "687 Earth days"],
                ["Average orbital speed", "86,871 km/h (24.08 km/s)"],
                ["Moons", " 2 (Phobos, Deimos)"],
                ["Planet type", "Terrestrial"],
            ],
        }
    },
    {
        name: "Jupiter",
        distance: 15,
        scale: 0.5,
        speed: 0.001,
        zVector: 2,
        information: {
            description: "The largest planet in the solar system. It has a stormy atmosphere, including the Great Red Spot",
            facts: [
                ["Equator Circumference", " 439,264 km"],
                ["Radius", "69,911 km"],
                ["Average distance from Sun", "778 million km"],
                ["Surface temperature", "-145°C"],
                ["Day length", "9.9 hours"],
                ["Year length", "4,333 Earth days (11.86 Earth years)"],
                ["Average orbital speed", "47,051 km/h (13.07 km/s)"],
                ["Moons", "92"],
                ["Planet type", " Gas giant"],
            ],        
        }
    },
    {
        name: "Saturn",
        distance: 20,
        scale: 0.6,
        speed: 0.001,
        zVector: 3,
        information: {
            description: "Known for its beautiful ring system, Saturn is a gas giant with dozens of moons",
            facts: [
                ["Equator Circumference", "378,675 km"],
                ["Radius", "58,232 km"],
                ["Average distance from Sun", "1.43 billion km"],
                ["Surface temperature", " -178°C"],
                ["Day length", "10.7 hours"],
                ["Year length", "10,759 Earth days (29.5 Earth years)"],
                ["Average orbital speed", " 34,821 km/h (9.69 km/s)"],
                ["Moons", "146"],
                ["Planet type", " Gas giant"],
            ],        
        }
    },
    {
        name: "Uranus",
        distance: 25,
        scale: 0.7,
        speed: 0.001,
        zVector: 3,
        information: {
            description: "A gas giant with a tilted rotation axis, giving it unique seasons and weather patterns",
            facts: [
                ["Equator Circumference", "159,354 km"],
                ["Radius", "25,362 km"],
                ["Average distance from Sun", "2.87 billion km"],
                ["Surface temperature", "-224°C"],
                ["Day length", "17.2 hours"],
                ["Year length", "30,687 Earth days (84 Earth years)"],
                ["Average orbital speed", "24,477 km/h (6.8 km/s)"],
                ["Moons", "27"],
                ["Planet type", "Ice giant"],
            ],
        }
    },
    {
        name: "Neptune",
        distance: 30,
        scale: 0.8,
        speed: 0.001,
        zVector: 3,
        information: {
            description: "The farthest planet from the Sun. It has strong winds and a deep blue color",
            facts: [
                ["Equator Circumference", "155,600 km"],
                ["Radius", "24,622 km"],
                ["Average distance from Sun", "4.5 billion km"],
                ["Surface temperature", " -214°C"],
                ["Day length", "16.1 hours"],
                ["Year length", "60,190 Earth days (164.8 Earth years)"],
                ["Average orbital speed", "19,566 km/h (5.43 km/s)"],
                ["Moons", "14"],
                ["Planet type", " Ice giant"],
            ],        
        }
    },
]