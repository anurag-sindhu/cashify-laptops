# cashify-laptops

Polls the Cashify catalogue API every 15 minutes for in-stock refurbished laptops and stores new listings in MySQL.

## Setup

```sh
npm install
cp .env.example .env   # fill in DB_USER / DB_PASSWORD
npm run db:seed        # creates the database + `laptops` table and loads db/seed/laptops.json
npm start
```

`npm run db:migrate` applies [db/schema.sql](db/schema.sql) without seeding. Both scripts are idempotent.

## Notifications

After each run, newly found laptops are sent as a single notification to `POST /notifications` on the notification service (`NOTIFICATION_URL`, default `http://localhost:3006/notifications`). Set `NOTIFICATION_AUTH_TOKEN` (sent as the `auth-token` header) and `NOTIFICATION_CHANNELS` in `.env`. If the token is unset, notifications are skipped. A failed notification is logged and doesn't stop the scraper.

## Layout

- `index.js` – run loop
- `scraper/` – fetches and processes API pages
- `services/product.service.js` – MySQL reads/writes
- `config/` – scraper and DB config (DB credentials come from `.env`)
- `db/` – schema, connection pool, seed data
