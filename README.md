# Rustic Birthday Experience

A warm, rustic birthday website with one memory game, an animated page-turn scrapbook, flip-over Polaroid notes, a larger Polaroid photo wall, a keepsake letter, ambient animation, candle-blowing animation, and confetti.

## Visual direction
- Warm paper / ivory, sage, weathered wood, muted copper and olive.
- No pink theme, no fixed age, and no extra floating side notes crowding the screen.
- Responsive mobile layout with swipeable scrapbook pages.

## Personalize it
1. Open `script.js` and replace `YOUR FRIEND` in `FRIEND_NAME`.
2. Edit the messages and captions in `index.html`.
3. Add as many photos as you want. The scrapbook uses `photo-1.jpg` to `photo-3.jpg`; the larger photo wall starts with `photo-4.jpg` to `photo-9.jpg`. Add more `<figure class="wall-polaroid">` blocks to `index.html` for more pictures.
4. Keep images inside `images/`. JPG is recommended; update the filenames in HTML if using another extension.

## QA-only game bypass
For local testing, append `?skipGame=1` to the URL. Example: `http://localhost:8000/?skipGame=1`.
This is only a client-side convenience for previewing, not security or access control. Remove or disable the `QA_SKIP_GAME` override before sharing if you want the game to be mandatory.

## Free GitHub Pages hosting
Upload the files to a GitHub repository. Go to **Settings → Pages → Deploy from a branch**, select `main` and `/ (root)`, and save.

Official guide: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Local preview
Open `index.html` in a browser, or run `python -m http.server 8000` in this folder and visit `http://localhost:8000`.
