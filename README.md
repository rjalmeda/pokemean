# Pokemean

Pokemon browser game built with Angular. There is no server and no login: your player
and your maps are saved locally in the browser's IndexedDB.

Requires Node `^22.22.3` or `>=24.15` (`nvm use` picks 24).

```sh
npm install
npm start      # dev server on http://localhost:4200
npm run build  # static build in dist/client/browser
```

- New games start with three eggs that hatch on the splash screen (needs internet: Pokemon data comes from PokeAPI).
- **Built-in world:** `public/assets/world/maps.json` ships with the app and is read-only. Saving a map in the editor (`/mapeditor`) stores your own copy in IndexedDB that overrides the built-in one; Delete Map reverts to the built-in map.
- **Seeding the world from the old MongoDB:** `npm run export-world` (set `MONGODB_URI` if it isn't `mongodb://127.0.0.1:27017/pokeMean`) writes that file from the old `maps` collection.
- `npm run build-world` regenerates the starter world (a town, three building interiors and a route) from `scripts/build-world.mjs`. Anything you save in the editor overrides it.
- Export Maps / Import Maps in the editor back up or move your own maps.
