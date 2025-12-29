# World Encyclopedia (Dünya Ansiklopedisi)

A modern, interactive, and SEO-friendly encyclopedia of countries recognized by the Republic of Turkey.

![World Encyclopedia Map](public/screenshots/map.png)

## Features

-   **Interactive World Map**: Navigate via a 3D-style map projection.
-   **Comprehensive Data**:
    -   Detailed geography, population, and economic stats via `restcountries` API.
    -   **Deep Integration**: Fetches Wikipedia summaries (history, culture) in real-time.
    -   **Regional Data**: Lists all administrative divisions (States/Provinces).
    -   **Neighbors**: Explore bordering countries with one click.
-   **Fully Localized**: Switch between **Turkish** and **English** instantly.
-   **User Personalization**:
    -   **Favorites**: Save key countries to your personal list.
    -   **Discovery**: "Shuffle" button to discover random nations.
-   **Premium UI**:
    -   Glassmorphism design language.
    -   `framer-motion` entrance animations.
    -   Responsive grid layouts.
-   **Technical**:
    -   Next.js 15 (App Router).
    -   Dynamic SEO (Sitemap + JSON-LD + Meta Tags).
    -   Resilient Data Parsing (Fallback mechanisms).

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```

3.  **Open in browser**:
    Navigate to [http://localhost:3000](http://localhost:3000).

## Project Structure

-   `src/app`: App Router pages and API routes.
-   `src/components`: UI components (Map, List, Header).
-   `src/lib`: Utilities (Recognized countries parser).
-   `src/context`: React Context providers (Language, Favorites).
-   `src/data`: Static data files (`recognized.md`).

## Deployment

The project is optimized for deployment on Vercel or any Node.js container.
-   `npm run build`: Generates the production build.
-   `npm run start`: Starts the production server.

---

**Note**: This project strictly adheres to the official recognized countries list of the Republic of Turkey.
