export default [
  {
    name: "Sun",
    realDistance: 0,
    distance: 0,
    scale: 1,
    speed: 0,
  },
  {
    name: "Mercury",
    realDistance: 3.9,
    distance: 3,
    scale: 0.1,
    speed: 0.01, // Kecepatan tertinggi
  },
  {
    name: "Venus",
    realDistance: 7.2,
    distance: 6,
    scale: 0.2,
    speed: 0.008, // Kecepatan sedikit lebih rendah
  },
  {
    name: "Earth",
    realDistance: 10,
    distance: 9,
    scale: 0.3,
    speed: 0.007, // Kecepatan menengah
    size: 10,
  },
  {
    name: "Mars",
    realDistance: 15.2,
    distance: 12,
    scale: 0.4,
    speed: 0.005, // Kecepatan lebih rendah
  },
  {
    name: "Jupiter",
    realDistance: 50.2,
    distance: 15,
    scale: 0.5,
    speed: 0.003, // Kecepatan rendah
  },
  {
    name: "Saturn",
    realDistance: 90.54,
    distance: 18,
    scale: 0.6,
    speed: 0.0025, // Kecepatan sangat rendah
    ring: true,
  },
  {
    name: "Uranus",
    realDistance: 190.2,
    distance: 21,
    scale: 0.7,
    speed: 0.002, // Kecepatan lebih lambat
  },
  {
    name: "Neptune",
    realDistance: 300.06,
    distance: 24,
    scale: 0.8,
    speed: 0.001, // Kecepatan paling lambat
  },
];
