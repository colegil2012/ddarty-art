// =============================================================================
// ddarty-art — Artwork Seed Script
// =============================================================================
// Collection:
//   - artwork  (title, description, medium, year, tags[], imageKey, thumbKey,
//               width, height, lqip, featured, createdAt)
//
// Run against LOCAL:
//   mongosh mongodb://localhost:27017/artist web/src/scripts/ddarty-data-seed.js
//
// Run against PROD (managed DB) — paste the same connection string your app
// uses, and point the db at ddarty-art:
//   mongosh "mongodb+srv://USER:PASS@celtech-dev-....mongo.ondigitalocean.com/ddarty-art?tls=true&authSource=admin&replicaSet=celtech-dev" web/src/scripts/ddarty-data-seed.js
//
// ---------------------------------------------------------------------------
// IMAGE KEYS
//   Files live on disk as:  local-images/full/<file>   and
//                           local-images/thumb/<file>
//   LocalImageStore serves local-images/ at /images, so a file at
//   local-images/full/hollow.png resolves to /images/full/hollow.png.
//   Therefore imageKey = "full/<file>"  and  thumbKey = "thumb/<file>".
//
//   In PROD the same keys are handed to Spaces, so upload the files to the
//   bucket under the same full/ and thumb/ prefixes and it all lines up.
//
//   The `file` field below is the exact filename in BOTH folders (same name
//   in full/ and thumb/, as you have them). Set it per piece — the key is
//   derived from the real filename, never guessed from the title.
// =============================================================================

const dbName = "ddarty-art";
const targetDb = db.getSiblingDB(dbName);

print(`\nSeeding "${targetDb.getName()}"...\n`);

// Full reset each run so edits to this file are authoritative.
targetDb.artwork.drop();
targetDb.inquiry.drop();

// ---- Reusable tag vocabulary ------------------------------------------------
// One canonical spelling per concept. Reference these constants in pieces
// rather than typing strings, so a typo can't fragment a tag (e.g. "portrait"
// vs "portraits"). The gallery filter builds its buttons from whatever tags
// actually appear, so this set == the filters the visitor sees.
const TAG = {
    SCENE:     "scene",       // narrative / environmental moments
    LANDSCAPE: "landscape",   // vistas, terrain, nature
    PORTRAIT:  "portrait",    // character portraits, figures
    NOCTURNE:  "nocturne",    // night, low light, moonlight
    CARTOON:   "cartoon",     // cartoonish, stylized, exaggerated
    GOTHIC:    "gothic",      // dark, spooky, ominous mood
    CYBER:     "cyberpunk",   // cyberpunk
    FANTASY:   "fantasy",     // magic, mythical, supernatural
    DIGITAL:   "digital"      // medium tag — nearly everything, but explicit
};

// ---- Helper -----------------------------------------------------------------
// Keeps each piece declaration short and guarantees the key/URL structure is
// consistent. `file` is the on-disk filename present in BOTH full/ and thumb/.
//
// A neutral 1x1 LQIP placeholder is used for now. If you later generate real
// blur placeholders, drop them in the `lqip` field per piece.
const LQIP_PLACEHOLDER =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=";

function piece({ title, file, description, year, tags,
                   width, height, featured = false, lqip = LQIP_PLACEHOLDER }) {
    return {
        title,
        description,
        medium: "digital",
        year: String(year),
        tags,
        imageKey: "full/"  + file,
        thumbKey: "thumb/" + file,
        width,
        height,
        lqip,
        featured,
        createdAt: new Date()
    };
}

// ---- Artwork ----------------------------------------------------------------
// TEMPLATE — replace these with the real pieces. One object per artwork.
//
//   title        display name
//   file         exact filename in BOTH local-images/full and local-images/thumb
//                (e.g. "hollow.png" -> full/hollow.png + thumb/hollow.png)
//   description  1–3 sentences; shown in the lightbox
//   year         number or string
//   tags         array from the TAG constants above; a piece can carry several
//   width/height pixel dimensions of the FULL image (used for layout / aspect)
//   featured     true -> appears in the homepage "featured" pulls
//
// Duplicate a block, fill it in, done. Delete the examples once yours are in.
const artwork = [
    piece({
        title:       "Bingo",
        file:        "bingo.png",
        description: "He's kinda like a cyberpunk rat",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.PORTRAIT, TAG.CYBER],
        width:       3000,
        height:      3000,
        featured:    false
    }),
    piece({
        title:       "Brandi",
        file:        "brandi.png",
        description: "She's a fiesty lass",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.PORTRAIT],
        width:       3000,
        height:      3000,
        featured:    false
    }),
    piece({
        title:       "Bungo2",
        file:        "bungo2.png",
        description: "Scary Shark",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.PORTRAIT, TAG.CARTOON],
        width:       3000,
        height:      3000,
        featured:    false
    }),
    piece({
        title:       "Cyber Samurai",
        file:        "cyber_samurai.png",
        description: "He kinda looks like Jax",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.PORTRAIT, TAG.CARTOON],
        width:       2550,
        height:      3300,
        featured:    true
    }),
    piece({
        title:       "Evil",
        file:        "evil.png",
        description: "EVVVIIIIILLLLLLLLLLL",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.PORTRAIT, TAG.GOTHIC],
        width:       3000,
        height:      3000,
        featured:    false
    }),
    piece({
        title:       "Frobert",
        file:        "frobert.png",
        description: "From the childrens book",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.PORTRAIT, TAG.CARTOON],
        width:       2550,
        height:      3300,
        featured:    false
    }),
    piece({
        title:       "Gardner",
        file:        "gardner.png",
        description: "He's a cute lil bunny",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.SCENE, TAG.CARTOON],
        width:       3000,
        height:      3000,
        featured:    true
    }),
    piece({
        title:       "Ghost",
        file:        "ghost.png",
        description: "Spoopy",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.PORTRAIT, TAG.CARTOON],
        width:       3000,
        height:      3000,
        featured:    false
    }),
    piece({
        title:       "Jester",
        file:        "jester.png",
        description: "Finest in all the land",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.PORTRAIT, TAG.CARTOON],
        width:       3000,
        height:      3000,
        featured:    false
    }),
    piece({
        title:       "Life",
        file:        "life.png",
        description: "That about sums it up",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.SCENE, TAG.GOTHIC],
        width:       3000,
        height:      3000,
        featured:    true
    }),
    piece({
        title:       "Me",
        file:        "me.png",
        description: "Check yes if you like me.",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.PORTRAIT, TAG.CARTOON],
        width:       3000,
        height:      3000,
        featured:    false
    }),
    piece({
        title:       "Me, in the West",
        file:        "me_in_the_west.png",
        description: "Yeehaw if you like me.",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.SCENE, TAG.CARTOON],
        width:       3000,
        height:      3000,
        featured:    false
    }),
    piece({
        title:       "Monkey",
        file:        "monkey.png",
        description: "Well.",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.PORTRAIT, TAG.CARTOON],
        width:       3000,
        height:      3000,
        featured:    false
    }),
    piece({
        title:       "Mouse and Frog",
        file:        "mouse_and_frog.png",
        description: "Just having a nice fireside chat.",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.SCENE, TAG.CARTOON],
        width:       3000,
        height:      3000,
        featured:    false
    }),
    piece({
        title:       "Noes Goes",
        file:        "noes_goes.png",
        description: "Pretty cool noses",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.CARTOON],
        width:       3000,
        height:      3000,
        featured:    false
    }),
    piece({
        title:       "Orc",
        file:        "orc.png",
        description: "Straight outta Middle Earth.",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.PORTRAIT, TAG.CARTOON, TAG.FANTASY],
        width:       3000,
        height:      3000,
        featured:    false
    }),
    piece({
        title:       "Owl",
        file:        "owl.png",
        description: "Oh Wise One, indeed.",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.PORTRAIT, TAG.CARTOON, TAG.GOTHIC],
        width:       3000,
        height:      3000,
        featured:    true
    }),
    piece({
        title:       "Sad",
        file:        "sad.png",
        description: "Way sadder than Taylor Swift",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.PORTRAIT, TAG.GOTHIC],
        width:       3000,
        height:      3000,
        featured:    true
    }),
    piece({
        title:       "Skelly Cat",
        file:        "skelly_cat.png",
        description: "Skelly Cat, Skelly Cat",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.PORTRAIT, TAG.CARTOON],
        width:       3000,
        height:      3000,
        featured:    true
    }),
    piece({
        title:       "Skull Cat",
        file:        "skull_cat.png",
        description: "Skelly Cats long lost twin.",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.PORTRAIT, TAG.CARTOON],
        width:       4000,
        height:      5000,
        featured:    false
    }),
    piece({
        title:       "Snake Samurai",
        file:        "snake_samurai.png",
        description: "Half Snake, half Samurai.",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.PORTRAIT, TAG.CARTOON],
        width:       3000,
        height:      3000,
        featured:    true
    }),
    piece({
        title:       "Sword",
        file:        "sword.png",
        description: "Very.... Very Scary",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.SCENE, TAG.GOTHIC],
        width:       3000,
        height:      3000,
        featured:    true
    }),
    piece({
        title:       "Tokyo Tops",
        file:        "tokyo_tops.png",
        description: "Beautiful Mountain View",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.SCENE, TAG.CARTOON],
        width:       3000,
        height:      3000,
        featured:    true
    }),
    piece({
        title:       "Tube Top",
        file:        "tube_top.png",
        description: "Cyberpunk Girl in a tube top",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.PORTRAIT, TAG.CARTOON, TAG.CYBER],
        width:       2550,
        height:      3300,
        featured:    true
    }),
    piece({
        title:       "Untitled Artwork",
        file:        "untitled_artwork.png",
        description: "Microsoft XP Screensaver",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.SCENE, TAG.FANTASY],
        width:       2550,
        height:      3300,
        featured:    true
    }),
    piece({
        title:       "Zendaya",
        file:        "zendaya.png",
        description: "Couldn't think of anything else",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.PORTRAIT, TAG.CARTOON],
        width:       2550,
        height:      3300,
        featured:    true
    }),
    piece({
        title:       "Zendaya, but different",
        file:        "zendaya_but_different.png",
        description: "Creativity is lacking",
        year:        2025,
        tags:        [TAG.DIGITAL, TAG.SCENE, TAG.CARTOON],
        width:       2550,
        height:      3300,
        featured:    true
    })
];

targetDb.artwork.insertMany(artwork);

// ---- Summary ----------------------------------------------------------------
const featuredCount = artwork.filter(a => a.featured).length;
const allTags = [...new Set(artwork.flatMap(a => a.tags))].sort();

print(`\nDone! ${artwork.length} pieces (${featuredCount} featured).`);
print(`Tags in use: ${allTags.join(", ")}\n`);
print("Reminder: files must exist at local-images/full/<file> and");
print("local-images/thumb/<file> (locally), or under the same full/ and");
print("thumb/ prefixes in the Space (prod).\n");