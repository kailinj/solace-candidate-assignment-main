## Solace Candidate Assignment

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

1. Install dependencies
    ```bash
    npm i
    ```
2. Uncomment the url in `.env` to retrieve advocates from the database.
3. Set up postgres via Docker
    ```bash
    docker compose up -d
    ```
4. Create a `solaceassignment` database.
5. Push migration to the database
    ```bash
    npx drizzle-kit push
    ```
6. Run the development server:
    ```bash
    npm run dev
    ```
