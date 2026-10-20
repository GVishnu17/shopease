# 🛒 ShopEase

![CI](https://github.com/GVishnu17/shopease/actions/workflows/ci.yml/badge.svg)

An online shop built with React. Customers can register, browse products, save favourites, fill a cart, check out and track an order. Their account, cart and wishlist follow them to any device, and the app installs on a phone like a normal app.

**Live demo:** [shopease-blush.vercel.app](https://shopease-blush.vercel.app)

## What's new

Latest updates (October 2026):

- **Real accounts.** Register, log in and reset a forgotten password with Firebase Authentication. The same login works on every device.
- **Cart and wishlist saved online.** Both are stored in Cloud Firestore under the user's account, so they appear on any device after login.
- **Forgot password.** A link on the login page sends a reset email.
- **Protected pages.** Visitors must log in to see the shop, and a loading screen shows while the login status is checked.
- **Installable app.** A web app manifest, a service worker and the ShopEase icon let people install it from the browser.
- **Better browser tab.** A proper page title, description and icon.
- **Profile page.** Users save their name, phone and address, and checkout fills them in.
- **Orders saved to the account.** A My Orders page lists past orders, and order tracking works on any device for new orders.
- **Automated tests.** Jest unit tests for the cart and the price and coupon rules, run by GitHub Actions on every commit.
- **Admin sales dashboard.** Revenue, orders, average order value, customers and repeat customers, with charts, date filters and a CSV download.
- **Refund process.** A refund process was added for orders.
- **Build fixes.** Missing hook dependencies were fixed so the project builds cleanly on Vercel.

See the [full change log](#change-log) below.

## Features

**Shopping**
- Search products, sort them and filter by category
- Price slider to set a maximum price
- Product cards with ratings, reviews and a quick view window
- Product detail pages
- Announcement bar, contact page and footer

**Cart and checkout**
- Cart with quantity buttons and a free shipping progress message
- Checkout form with shipping, tax and discount lines
- Coupon codes with clear messages for valid and invalid codes
- Payment window (demo only, no real payment is taken)
- Order confirmation and an order tracking page
- Refund process for orders

**Accounts**
- Register and log in with email and password
- Forgot password link that sends a reset email
- Friendly error messages, such as "Incorrect email or password"
- Wishlist and cart saved to the user's account and loaded on any device
- Profile page with a saved delivery address
- My Orders page with order history saved to the account
- Log out button in the top bar

**Admin dashboard**
- Sales summary: revenue, number of orders, average order value, customers, repeat customers and cancelled orders
- Charts: revenue per day, top products by units sold, revenue by category and orders by status
- Date filters (7 days, 30 days, 90 days, all time), a refresh button and a CSV download

**App**
- Installable on Android, iPhone and computers (Progressive Web App)
- Responsive layout for phones and desktops

## Pages

| Page | Address | Needs login |
|---|---|---|
| Home (products, search, filters) | `/` | Yes |
| Product details | `/product/:id` | Yes |
| Cart | `/cart` | Yes |
| Checkout | `/checkout` | Yes |
| Wishlist | `/wishlist` | Yes |
| My profile | `/profile` | Yes |
| My orders | `/orders` | Yes |
| Admin sales dashboard | `/admin` | Yes |
| Order tracking | `/orders/:orderId` | Yes |
| Contact | `/contact` | Yes |
| Log in | `/login` | No |
| Register | `/register` | No |

## Shop rules

| Rule | Value |
|---|---|
| Free shipping | Orders of $50 or more |
| Shipping fee below that | $5 |
| Tax | 8% of the subtotal |

| Coupon | Effect |
|---|---|
| `SAVE10` | 10% off the subtotal |
| `WELCOME5` | 5% off the subtotal |
| `FREESHIP` | Removes the shipping fee |

## How it works

1. `AuthContext` watches the Firebase login status and gives the app the current user.
2. `CartContext` and `WishlistContext` wait for a logged-in user, load that user's saved data from Firestore and save every change back.
3. If a browser still holds a cart or wishlist from before accounts existed, it is merged into the account once and then removed from the browser.
4. Pages are wrapped in a protected route that sends visitors to the login page.

Data in Firestore is stored per user:

```
users/{userId}/data/cart       { items: [ ... ] }
users/{userId}/data/wishlist   { items: [ ... ] }
users/{userId}/data/profile    { phone, address, city, state, pin }
users/{userId}/orders/{orderId}   { items, totals, status, createdAt }
```

## Tech stack

| Area | Tools |
|---|---|
| Interface | React 19, Create React App |
| Navigation | React Router 6 |
| State | Context API and `useReducer` |
| Accounts and data | Firebase Authentication, Cloud Firestore |
| Testing | Jest and GitHub Actions |
| Hosting | Vercel (deployed from GitHub) |
| App install | Web app manifest and a service worker |

## Project structure

```
public/            manifest, service worker, icons
src/
  components/      Navbar, Footer, Filters, ProductCard, CartItem, PaymentModal, AnnouncementBar
  context/         AuthContext, CartContext, WishlistContext
  data/            products.json
  utils/           pricing.js (price and coupon rules)
  pages/           Home, ProductDetail, Cart, Checkout, Wishlist, Orders, OrderTracking, Profile, Admin, Login, Register, Contact
  firebase.js      Firebase setup
  App.js           routes and protected pages
```

## Tests

The cart logic and the price and coupon rules have unit tests. Run them with `npm test`. GitHub Actions runs the tests and a production build on every commit, and the badge at the top shows whether they pass.

## Run it on your computer

1. Install [Node.js](https://nodejs.org) (version 18 or newer).
2. Download the project and install it:

```bash
git clone https://github.com/GVishnu17/shopease.git
cd shopease
npm install
```

3. Add your own Firebase details (see the next section).
4. Start the app:

```bash
npm start
```

It opens at http://localhost:3000.

| Command | What it does |
|---|---|
| `npm start` | Runs the app in development mode |
| `npm run build` | Creates a production build |
| `npm test` | Runs the tests |

## Set up Firebase

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com) (the free Spark plan is enough).
2. Add a **web app** and copy its configuration into `src/firebase.js`.
3. Open **Authentication**, then **Sign-in method**, and turn on **Email/Password**.
4. Open **Firestore**, create a database, and publish these rules so each user can only read and write their own data:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Security

- Passwords are handled by Firebase Authentication. The app never stores them.
- Firestore rules let each user read and write only their own data.
- A Firebase web configuration is not a secret. The rules above are what protect the data.
- The login error message is the same for a wrong password and an unknown email, so it does not reveal which emails are registered.

## Install it as an app

- **Android (Chrome):** open the site, tap the menu (⋮), then **Install app**.
- **iPhone (Safari):** tap **Share**, then **Add to Home Screen**.
- **Computer (Chrome or Edge):** click the install icon at the right end of the address bar.

The app needs an internet connection. Offline use is not supported yet.

## Known limits

- The payment window is a demo and no money moves.
- Orders placed before the My Orders update are saved only on the device that placed them. New orders are saved in the account.
- A cart changed on one device shows on another after that device loads or logs in again, not instantly.
- Product data comes from a local file (`src/data/products.json`), not a database.

## Ideas for next steps

- More admin tools, such as managing products and stock
- Real online payments in test mode
- Accessibility and speed improvements
- Live cart updates between open devices
- Move the product list to a database

## Change log

| Date | Change |
|---|---|
| Oct 19, 2026 | Admin sales dashboard with charts, date filters and CSV export, and a refund process |
| Oct 19, 2026 | Jest unit tests and a GitHub Actions check that runs the tests and build on every commit |
| Oct 13 to 16, 2026 | Profile page with a saved address, orders saved to the account, My Orders page, order tracking on any device |
| Oct 13, 2026 | Firebase Authentication, forgot password, cart and wishlist saved to Firestore |
| Oct 12, 2026 | Login and registration pages, protected routes, page title, icon, installable app |
| Oct 11, 2026 | Wishlist, advanced filtering, order tracking, coupon validation, new styles |
| Jun 22, 2026 | Payment window, login page, footer, contact page, ratings, logo and announcement bar |
| Jun 21, 2026 | First version: React app setup |

## Author

Built by [GVishnu17](https://github.com/GVishnu17).
