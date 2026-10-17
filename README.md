# Playroom

A responsive arcade with five solo browser games: Snake, Memory Match, Quick Reflex, Minesweeper, and Target Rush. No accounts, game server, database, or application dependencies are needed.

## GitHub Pages

In repository **Settings → Pages**, choose **Deploy from a branch**, then **gh-pages** and **/ (root)**. Once GitHub finishes publishing, visit https://farisl5.github.io/my-gam-site/.

The `gh-pages` branch contains the contents of `public/`. Publish updates to that branch while preserving its history.

## Local development

With Node.js 22 or newer installed, run `npm start` and open http://localhost:3000. Use `npm run dev` for automatic server restarts and `npm test` for HTTP checks. Set `PORT` to change the local server port.

The optional development server only serves static files. All gameplay runs in the browser. Typography uses optional Google Fonts with local fallbacks.
