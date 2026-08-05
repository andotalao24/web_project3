# PantryPal 🥫

A full-stack web app for tracking the food you have at home and deciding what to
cook with it. Log pantry items on a calendar of shopping days, keep a shopping
cart for what you still need, and see real recipes ranked by how much of each one
you can already make.

- **Author:** Jiachen Zhao
- **Class link:** https://johnguerra.co/classes/webDevelopment_online_summer_2026/
- **Live demo:** https://web-project3-s5w7.onrender.com/
- **design document and mockup:** https://docs.google.com/document/d/14iKH0xFDyhCws_omgvVKZsafctT_EoysBNPQyxWJU1M/edit?usp=sharing 

## Project Objective

Help busy people (students, parents, professionals) keep track of what they have
already bought, avoid buying duplicates, remember what to buy next, and answer
the daily question of what to cook — all in one lightweight app. No external
recipe API is used: recipes live in the app's own database and are matched
against the user's pantry.

## Screenshot

![PantryPal screenshot](./screenshot.PNG)

## Tech Stack

- **Backend:** Node.js + Express + native MongoDB driver
- **Auth:** Passport (local strategy) with express-session
- **Frontend:** React (function components + Hooks) + Vite, PropTypes, Bootstrap 5 (CSS)
- **No** Mongoose, axios, or the `cors` package are used.

## Collections

- `pantryItems` — food already at home (name, category, quantity, purchase date, notes)
- `groceryItems` — food to buy (name, category, quantity, purchased)
- `recipes` — curated recipes (name, ingredients, minutes, servings, steps)
- `users` — accounts for Passport authentication

Both `pantryItems` and `groceryItems` support full CRUD.

The recipe recommender compares each recipe's ingredients against the pantry and
ranks them, so dishes you can cook right now appear first. Recipes are preloaded
into MongoDB by the seed script — no external recipe API is called.

## Build & Run

### 1. Backend

```bash
cd backend
cp .env.example .env        # then edit .env with your Mongo connection string
npm install
npm run seed                # populate 1000+ synthetic records
npm start                   # starts API on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                 # starts React app on http://localhost:5173
```

The Vite dev server proxies `/api` requests to the backend
(see `frontend/vite.config.js`), so sessions work same-origin.

### 3. Lint & Format

```bash
# from either backend/ or frontend/
npm run lint
npm run format
```

## How to Use

Sign in with the demo account — **demo / demo1234** — or click *Need an account?
Register* to create your own. Everything below is private to your account.

### 1. Pantry — what you already have

The calendar shows the days you went shopping; tinted days are the ones with
items.

- **Click any day** to add something you bought that day. The date drops into
  the form above, so you only type a name and press **Add**.
- **Click a day again** to review what you bought then, and to edit or delete it.
- **Click an item's name** to read its note. Rows holding a note are marked
  `note`, so you know which are worth opening.
- **Switch to *List*** for the whole inventory in one place, newest purchases
  first.
- Use **Edit** to correct an item after cooking, **Delete** when it's gone.

### 2. Shopping Cart — what you still need

- Type an item, pick a category, press **Add**.
- **−** and **+** adjust quantities.
- **Tick the checkbox** as you shop; purchased items grey out and move down.
- **Remove** clears items once they're home.

### 3. Recipes — what you can actually cook

Every recipe is matched against your pantry and ranked, closest-to-cookable
first.

- **Ready to cook** needs nothing you don't already have.
- **Missing 1–2** is one short shop away. Ingredients you have appear in green;
  the ones you lack are crossed out.
- **"Add N missing to Shopping Cart"** sends exactly those ingredients to your
  cart — no retyping.
- **Click a recipe name** for the method.

Recipes are stored in the app's own database. No external recipe API is used.

## Using PantryPal with a keyboard

The whole app works without a mouse. Every control is a standard HTML element,
so the usual keys behave as you'd expect.

| Key | Does |
| --- | --- |
| `Tab` / `Shift+Tab` | Move forward / back |
| `Enter` or `Space` | Activate the focused control |
| `Space` | Tick the purchased checkbox |
| `↑` `↓` | Change a dropdown or step a date field |

- The **first `Tab`** on any page reveals a **Skip to main content** link that
  jumps past the navigation.
- Whatever has focus is outlined in green.
- Calendar days announce themselves as, for example, *"August 1, 2026. 13
  item(s) bought."* — press `Enter` to pick one.

The app has been checked with axe-core and reports no accessibility violations
on any screen.

## API Routes

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` · `/login` · `/logout` | Account and session |
| `GET` | `/api/auth/user` | Who is signed in |
| `GET` `POST` | `/api/pantry` | List (`?sort=purchased`) / create |
| `GET` `PUT` `DELETE` | `/api/pantry/:id` | Read / update / delete |
| `GET` `POST` | `/api/grocery` | List / create |
| `GET` `PUT` `DELETE` | `/api/grocery/:id` | Read / update / delete |
| `GET` | `/api/recipes` | Recipes ranked against the pantry |

Everything except the auth routes requires a signed-in session.

## License

[MIT](./LICENSE)
