# GearNest - Equipment Rental Platform

**Assignment 09 | Category 003**

GearNest is a full-stack equipment rental platform where customers can browse, search, filter and book construction, photography, electronics and event equipment, owners can list their equipment, and admins can manage the whole platform.

### Live Links

- **Client:** https://gearnest-client-one.vercel.app
- **Server:** https://gearnest-server.onrender.com
- **Server API - All Equipment:** https://gearnest-server.onrender.com/api/equipment

### Features

- **Authentication:** Email / Password register + login, Google login, JWT, role based access (customer / owner / admin)
- **Equipment:** Add equipment (owner), Admin approve / reject, All Equipment with search, category, location, rental type, price range, availability filter, sort, pagination
- **Equipment Details:** Gallery, price, availability, quantity, booking modal with date validation (past date blocked), total calculation Daily / Weekly / Monthly
- **Booking & Payment:** Stripe Checkout (Test Mode), payment success -> Paid / Confirmed, My Rentals, Owner Bookings, Admin All Bookings
- **Email:** Booking Confirmed email via Gmail App Password
- **Dashboards:** Customer Dashboard (My Rentals), Owner Dashboard (My Equipment + Bookings), Admin Dashboard (All Users, Equipment, Bookings)
- **Design:** Original GearNest design, fully responsive, English UI, professional footer

### Tech Stack

- **Client:** Next.js (App Router), TypeScript, Tailwind CSS
- **Server:** Node.js, Express, TypeScript, Mongoose, MongoDB Atlas
- **Auth:** JWT, bcrypt
- **Payment:** Stripe Checkout (Test Mode)
- **Email:** Nodemailer + Gmail App Password
- **Deploy:** Vercel (client), Render (server)

### Test Payment (Stripe Test Mode)

- Card: `4242 4242 4242 4242`
- Expiry: `12/34`
- CVC: `123`
- Country for Stripe test account: United States (Bangladesh does not support live Stripe)

### Run Locally - Client

```bash
cd client
npm install
npm run dev
```

Create `client/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Project Structure - Client

```
client/
  app/
    equipment/ - All Equipment + Details
    dashboard/ - customer / owner / admin
    payment-success/
  components/ - Navbar, Footer
```

### Note

Do not commit `.env.local` - it contains secrets. Use `.env.local.example` as template.
