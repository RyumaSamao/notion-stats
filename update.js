// update.js

import fs from "fs";
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY
});

async function countPages(dbId) {
  let hasMore = true;
  let nextCursor = undefined;
  let total = 0;

  while (hasMore) {
    const res = await notion.databases.query({
      database_id: dbId,
      start_cursor: nextCursor
    });

    total += res.results.length;
    hasMore = res.has_more;
    nextCursor = res.next_cursor;
  }

  return total;
}

async function run() {
  const anime = await countPages(process.env.DB_ANIME_ID);
  const films = await countPages(process.env.DB_FILM_ID);
  const series = await countPages(process.env.DB_SERIES_ID);

  const data = {
    anime,
    films,
    series,
    lastUpdate: new Date().toISOString()
  };

  fs.writeFileSync("counts.json", JSON.stringify(data, null, 2));
  console.log("counts.json mis à jour !");
}

run();
