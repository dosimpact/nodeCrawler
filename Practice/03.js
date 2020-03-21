import fs from "fs";
import parse from "csv-parse/lib/sync";
import stringify from "csv-stringify";

import axios from "axios";
import cheerio from "cheerio";

const csv = fs.readFileSync("csv/data.csv");
const rows = parse(csv.toString("utf-8"));

const crawler = async () => {
  await Promise.all(
    rows.map(async row => {
      const res = await axios.get(row[1]);
      if (res.status === 200) {
        const html = res.data;
        const $ = cheerio.load(html);
        const text = $(".score.score_left .star_score").text();
        console.log(text.trim());
      }
    })
  );
};

crawler();
