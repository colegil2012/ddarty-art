
// =============================================================================
// cgsKitchen — Menu Seed Script
// =============================================================================
// Collections:
//   - categories       (id, name, sortOrder)
//   - badges           (id, label, color)
//   - option_choices   (id, label, priceDeltaCents, available, tag)
//   - option_groups    (id, label, selectionType, required, maxSelections,
//                       choiceIds, defaultChoiceId)
//   - menu_items       (id, name, description, priceCents, categoryId,
//                       badgeId, optionGroupIds, available, sortOrder)
//   - orders           (cleared)
//
//   mongosh mongodb://localhost:27017/cgskitchen cgs-kitchen-data-seed.js
// =============================================================================

const dbName = "ddarty-art";
const targetDb = db.getSiblingDB(dbName);

print(`\nSeeding "${targetDb.getName()}"...\n`);

targetDb.artwork.drop();
targetDb.inquiry.drop();

const pieces = [
    {
        title: "Breakfast Boxty",
        description: "Bacon, sausage, egg and cheese — any combination — on a traditional Celtic boxty.",
        medium: 550,
        year: "breakfast",
        tags: "most-loved",
        imageKey: ["protein", "cheese"],
        thumbKey: true,
        width: 1000,
        height: 1000,
        lqip: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=",
        featured: true,
    }
];
targetDb.artwork.insertMany(items);

print(`\nDone! ${pieces.length} pieces.\n`);