const SpotConfig = {
  radius: 50, // Start radius of this.spot.
  radiusMax: 300, // Max snot value.
  radiusMin: 200, // Min snot value.

  snotsCount: 20, // Number of this.snots.

  center: {
    // Coordinates of this.spot center.
    x: 50,
    y: 50
  },
  growthFactor: 0.5,

  fill: true,
  stroke: true,
  fillStyle: "#cccccc",
  lineWidth: "4",
  strokeStyle: "rgba(0, 0, 0, 1)"
};

export default SpotConfig;
