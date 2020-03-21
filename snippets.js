let res = "A1:B11";

res = res.split(":");
console.log(res); //[ 'A1', 'B11' ]

res = res.join("+"); //A1+B11
console.log(res);
