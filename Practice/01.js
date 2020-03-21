import fs from "fs";
import parse from "csv-parse/lib/sync";
import stringify from "csv-stringify/lib/sync";

const csv = fs.readFileSync("csv/data.csv");

const rows = parse(csv.toString("utf-8"));

const result = [];

for (const [name, url] of rows) {
  console.log(name, ":=>", url);
}

for (const [idx, row] of rows.entries()) {
  console.log(idx, row[0], row[1]);
}

rows.forEach((e, i) => {
  console.log(`${i} : ${e[0]} -> ${e[1]}`);
  result[i] = [i + 1, e[0], e[1]];
});

console.log(result);
const str = stringify(result);
fs.writeFileSync("csv/resultMovieList.csv", str);
