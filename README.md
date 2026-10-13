# 🛒 ShopEase

An online shop built with React. Customers can register, browse products, save favourites, fill a cart, check out and track an order. Their account, cart and wishlist follow them to any device, and the app installs on a phone like a normal app.

**Live demo:** [shopease-blush.vercel.app](https://shopease-blush.vercel.app)

## What's new

Latest update (October 2026):

- **Real accounts.** Register, log in and reset a forgotten password with Firebase Authentication. The same login works on every device.
- **Cart and wishlist saved online.** Both are stored in Cloud Firestore under the user's account, so they appear on any device after login.
- **Forgot password.** A link on the login page sends a reset email.
- **Protected pages.** Visitors must log in to see the shop, and a loading screen shows while the login status is checked.
- **Installable app.** A web app manifest, a service worker and the ShopEase icon let people install it from the browser.
- **Better browser tab.** A proper page title, description and icon.
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

**Accounts**
- Register and log in with email and password
- Forgot password link that sends a reset email
- Friendly error messages, such as "Incorrect email or password"
- Wishlist and cart saved to the user's account and loaded on any device
- Log out button in the top bar

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
```

## Tech stack

| Area | Tools |
|---|---|
| Interface | React 19, Create React App |
| Navigation | React Router 6 |
| State | Context API and `useReducer` |
| Accounts and data | Firebase Authentication, Cloud Firestore |
| Hosting | Vercel (deployed from GitHub) |
| App install | Web app manifest and a service worker |

## Project structure

```
public/            manifest, service worker, icons
src/
  components/      Navbar, Footer, Filters, ProductCard, CartItem, PaymentModal, AnnouncementBar
  context/         AuthContext, CartContext, WishlistContext
  data/            products.json
  pages/           Home, ProductDetail, Cart, Checkout, Wishlist, OrderTracking, Login, Register, Contact
  firebase.js      Firebase setup
  App.js           routes and protected pages
```

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
- Orders are saved in the browser of the device that placed them, not in the account.
- A cart changed on one device shows on another after that device loads or logs in again, not instantly.
- Product data comes from a local file (`src/data/products.json`), not a database.

## Ideas for next steps

- Save orders to the user's account
- Real online payments
- Live cart updates between open devices
- Move the product list to a database

## Change log

| Date | Change |
|---|---|
| Oct 13, 2026 | Firebase Authentication, forgot password, cart and wishlist saved to Firestore |
| Oct 12, 2026 | Login and registration pages, protected routes, page title, icon, installable app |
| Oct 11, 2026 | Wishlist, advanced filtering, order tracking, coupon validation, new styles |
| Jun 22, 2026 | Payment window, login page, footer, contact page, ratings, logo and announcement bar |
| Jun 21, 2026 | First version: React app setup |

## Author

Built by [GVishnu17](https://github.com/GVishnu17).
