# Ryan's Christmas Wishlist

A static site (no build step). Edit `data.js` to change the list, drop images into `assets/img/`.

**Deploy:** push to GitHub, then Settings → Pages → Deploy from branch → `main` / root.

## Shared purchases (Supabase)

Visitors can mark items as bought so nobody doubles up. The state lives in a free Supabase project.

1. Create a Supabase project.
2. In the SQL editor, run `supabase/schema.sql`.
3. Copy the Project URL and the publishable (anon) key from Settings → API into `config.js`.
4. Push. Leave `config.js` empty and the site works without the bought buttons.
