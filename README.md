# Personal Portfolio

A data-driven portfolio for Susana Serwaa Osei Poku. Project cards are loaded from JSON, category filters are built from the project data, and the latest six public repositories are fetched from GitHub at runtime.

## Features

- Project content comes from `data/projects.json` and is rendered with DOM functions; adding a project only requires editing the JSON file.
- Category filter buttons are generated from the project categories and filter the rendered cards.
- The GitHub section fetches the latest six repositories for `SusanaSerwaaOseiPoku`.
- Both requests have loading, error-with-retry, and empty states.
- The light/dark theme and last-used project filter are saved in `localStorage`.
- JavaScript is organized into `js/api.js`, `js/render.js`, and `js/main.js`.
- API content is inserted as text, and external links are limited to HTTPS GitHub URLs.
- The layout supports mobile screens and keyboard focus.

## Run locally

The site uses ES modules and fetches `data/projects.json`, so serve the folder over HTTP instead of opening `index.html` directly.

1. Install Python 3 if it is not already available.
2. Open a terminal in the project folder.
3. Start a local static server:

   ```powershell
   python -m http.server 8000
   ```

4. Open [http://localhost:8000](http://localhost:8000).

No package installation or API token is needed. GitHub's unauthenticated API has a rate limit; if it is reached, the page displays an error and retry button.

## Update project cards

Edit `data/projects.json` and add an object with `title`, `description`, `category`, `technologies`, and `url`. Use an HTTPS GitHub repository URL. The page creates the card and category filter automatically.

## Data sources

- Local portfolio projects: `data/projects.json`
- Public repositories: `https://api.github.com/users/SusanaSerwaaOseiPoku/repos?sort=updated&direction=desc&per_page=6&type=owner`

The public profile and repository links are live. A separate hosted portfolio URL has not been configured.
