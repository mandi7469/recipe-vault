<div align="center">

# Recipe Vault

A full-stack recipe management application where users can browse, search, and manage their own recipes. Built with modern web technologies and authentication.

[Recipe Vault - Click Here](https://recipe-vault-ten.vercel.app/) 

</div>

## Table of Contents 

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Running Locally](#running-locally)
- [Future Improvements](#future-improvements)
- [Contribute](#how-to-contribute)
- [Questions/Contact](#questions)


## Features

🔍 **Public browsing & search**
  - View all recipes without logging in
  - Filter by category
  - Pagination for performance

🔐 **Authentication (Auth.js / NextAuth)**
  - Sign up, log in, log out
  - Secure session-based authentication

👤 **User-specific functionality**
  - Create, edit, and delete your own recipes
  - View your personal recipes on the **My Recipes** page

🧾 **Rich recipe data**
  - Ingredients
  - Instructions
  - Prep time, cook time, servings
  - Category and difficulty

⚡ **Optimized UX**
  - Debounced search
  - URL-synced filters
  - Smart pagination UI


## Tech Stack

Frontend
- Next.js (App Router)
- React
- Tailwind CSS
- TypeScript

Backend
- Next.js Route Handlers (API)
- MongoDB + Mongoose

Authentication
- Auth.js (NextAuth)
- Credentials provider
- bcryptjs


## Running Locally
Clone the repository

```
git clone https://github.com/yourusername/recipe-vault
```

Install dependencies and run application

```
npm install
npm run dev
```

App runs at:

```
http://localhost:3000
```

## Future Improvements

- Recipe images / uploads
- Favorites / bookmarking
- Comments and ratings
- Improved homepage UI
- Advanced validation and error handling

## How to Contribute

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated and if you have any suggestions please let me know. 

Do not forget to give the project a **STAR**⭐. Thank you!

The Contributor Covenant guidelines are here for your review: [Contributor Covenant](https://www.contributor-covenant.org/).

## Questions

[Link to GitHub Profile](https://github.com/mandi7469)

If you have additional questions please email me at mandi7469@aol.com

## License

MIT License
