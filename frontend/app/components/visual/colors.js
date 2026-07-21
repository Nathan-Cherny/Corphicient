export function getRandomColor({
  rmin = 50,
  rmax = 200,
  gmin = 50,
  gmax = 200,
  bmin = 50,
  bmax = 200,
  a = 1,
} = {}) {
  return `rgba(${randint(rmin, rmax)}, ${randint(gmin, gmax)}, ${randint(bmin, bmax)}, ${a})`;
}

export function randint(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}