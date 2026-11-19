// An illustrative honeycomb block rendered in oblique projection.
const canvas = document.getElementById('lattice');
const ctx = canvas.getContext('2d');
function project(x, y, z) {
  return [320 + x * 0.95 - y * 0.58, 165 + x * 0.24 + y * 0.66 - z];
}
function face(points, fill, stroke) {
  ctx.beginPath();
  points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.stroke();
}
const cells = [];
for (let row = 0; row < 6; row++) {
  for (let col = 0; col < 8; col++) {
    const x = (col - 3.75 + (row % 2) / 2) * 49;
    const y = (row - 2.5) * 42.5;
    cells.push({x, y, depth:project(x,y,0)[1]});
  }
}
for (const {x, y} of cells.sort((a, b) => a.depth - b.depth)) {
  const top = [], bottom = [];
  for (let k = 0; k < 6; k++) {
    const angle = (60 * k + 30) * Math.PI / 180;
    const px = x + 28.3 * Math.cos(angle), py = y + 28.3 * Math.sin(angle);
    top.push(project(px,py,8));
    bottom.push(project(px,py,-34));
  }
  for (let k = 0; k < 6; k++) {
    const n = (k + 1) % 6;
    face([bottom[k], bottom[n], top[n], top[k]], ['#693e2a','#74482e','#4d3329'][k%3], '#936040');
  }
  face(top, '#302c23', '#efb17d');
}
