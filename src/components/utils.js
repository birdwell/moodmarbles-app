export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


export function mean(list) {
    let sum = 0;
    list.forEach(x => {
        sum += x;
    });
    return sum / list.length;
}

export function variance(list) {
    let sum = 0;
    let _mean = Math.pow(mean(list), 2);
    list.forEach( x=> {
        sum += Math.pow(x, 2);
    });
    return sum / list.length - _mean;
}
