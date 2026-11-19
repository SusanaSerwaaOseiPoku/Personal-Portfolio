const GITHUB_USERNAME = 'SusanaSerwaaOseiPoku';
const GITHUB_REPOSITORIES_URL =
  `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=6&type=owner`;

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json' },
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('GitHub rate limit reached. Please try again later.');
    }
    throw new Error(`Request failed with status ${response.status}.`);
  }

  return response.json();
}

export async function fetchProjects() {
  const projects = await fetchJson(new URL('../data/projects.json', import.meta.url));
  if (!Array.isArray(projects)) {
    throw new Error('Project data must be a JSON array.');
  }
  return projects;
}

export async function fetchLatestRepositories() {
  const repositories = await fetchJson(GITHUB_REPOSITORIES_URL);
  if (!Array.isArray(repositories)) {
    throw new Error('GitHub returned an unexpected response.');
  }
  return repositories.slice(0, 6);
}
