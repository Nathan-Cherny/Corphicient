export function getRandomColor(rmin=50, rmax=200, gmin=50, gmax=200, bmin=50, bmax=200){
    let r = randint(rmin, rmax)
    let g = randint(gmin, gmax)
    let b = randint(bmin, bmax)

    return `rgb(${r}, ${g}, ${b})`
}

export function randint(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}