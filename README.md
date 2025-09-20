# 🍬 SweetShop Frontend

A modern **Next.js 13+** frontend for the SweetShop application.
This project provides a user-friendly interface for browsing sweets, purchasing items, and managing inventory (admin only).

Built with:

- ⚡ [Next.js](https://nextjs.org/) (App Router)
- 🎨 [TailwindCSS](https://tailwindcss.com/)
- 🔒 JWT-based Authentication with Context API
- 🌐 Axios for API requests
- 🛠️ TypeScript for type safety

---

## 🚀 Features

- User authentication (login & register)
- Browse sweets with filters and search
- Purchase sweets (user flow)
- Add / edit sweets (admin flow)
- Secure route protection
- Responsive design

## 🔑 Environment Variables

Create a `.env.local` file (use `.env.local.example` as reference):

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

👉 This means you need to have the **Spring Boot backend** running locally at `http://localhost:8080`.

The backend repository is available here:

🔗 [Sweet Shop Backend](https://github.com/itsdeekshit098/sweetshop-backend)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

![1758356397351](image/README/1758356397351.png)
