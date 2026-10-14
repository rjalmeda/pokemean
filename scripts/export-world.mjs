// One-off: copies the maps from a MongoDB database (the old server's `maps` collection)
// into public/assets/world/maps.json, which the app loads as its built-in world.
//
//   npm run export-world                         # mongodb://127.0.0.1:27017/pokeMean
//   MONGODB_URI=mongodb://host/db npm run export-world
import { writeFile } from 'node:fs/promises';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/pokeMean';
const output = new URL('../public/assets/world/maps.json', import.meta.url);

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
try {
  const docs = await client.db().collection('maps').find().toArray();
  const maps = docs
    .filter((doc) => typeof doc.mapCoordinates === 'string' && Array.isArray(doc.map?.raw))
    // Drop Mongo bookkeeping and the derived `compiled` grid; the app rebuilds it from `raw`.
    .map(({ _id, __v, map, ...rest }) => ({ ...rest, map: { raw: map.raw } }))
    .sort((a, b) => a.mapCoordinates.localeCompare(b.mapCoordinates, undefined, { numeric: true }));

  await writeFile(output, JSON.stringify(maps));
  console.log(`Exported ${maps.length} of ${docs.length} maps to public/assets/world/maps.json`);
} finally {
  await client.close();
}
