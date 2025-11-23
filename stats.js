const { Client } = require("@notionhq/client");
const fs = require("fs");

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function countPages(dbId) {
  let hasMore = true;
  let nextCursor = undefined;
  let total = 0;

  while (hasMore) {
    const res = await notion.databases.query({
      database_id: dbId,
      start_cursor: nextCursor,
    });

    total += res.results.length;
    hasMore = res.has_more;
    nextCursor = res.next_cursor;
  }

  return total;
}

async function run() {
  const anime = process.env.DB_ANIME_ID
    ? await countPages(process.env.DB_ANIME_ID)
    : 0;
  const films = process.env.DB_FILM_ID
    ? await countPages(process.env.DB_FILM_ID)
    : 0;
  const series = process.env.DB_SERIES_ID
    ? await countPages(process.env.DB_SERIES_ID)
    : 0;
  const animation = process.env.DB_ANIMATION_ID
    ? await countPages(process.env.DB_ANIMATION_ID)
    : 0;

  const data = {
    anime,
    films,
    series,
    animation,
    lastUpdate: new Date().toISOString(),
  };

  fs.writeFileSync("counts.json", JSON.stringify(data, null, 2));
}

run();
