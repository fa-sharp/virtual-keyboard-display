let keys = new Array(30);

keys[1] = true;
keys[4] = true;
keys[3] = true;

let playingKeys = [];
keys.forEach((key, index) => playingKeys.push(index));

console.log(playingKeys);