import { fetchLatestRepositories, fetchProjects } from './api.js';
import { renderProjects, renderRepositories } from './render.js';

const THEME_KEY = 'personal-portfolio-theme';
const FILTER_KEY = 'personal-portfolio-project-filter';
const themeButton = document.getElementById('theme-toggle');

function readPreference(key, fallback) {
  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch (error) {
    console.error(`Could not read the ${key} preference.`, error);
    return fallback;
  }
}

function savePreference(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Could not save the ${key} preference.`, error);
  }
}

let theme = readPreference(THEME_KEY, 'light') === 'dark' ? 'dark' : 'light';
let activeFilter = readPreference(FILTER_KEY, 'all');
let projectState = { status: 'loading', projects: [] };
let repositoryState = { status: 'loading', repositories: [] };

function applyTheme() {
  document.documentElement.dataset.theme = theme;
  themeButton.textContent = theme === 'light' ? 'Use dark theme' : 'Use light theme';
  themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
}

function renderProjectSection() {
  renderProjects({
    ...projectState,
    activeFilter,
    onFilterChange: (filter) => {
      activeFilter = filter;
      savePreference(FILTER_KEY, activeFilter);
      renderProjectSection();
    },
    onRetry: loadProjects,
  });
}

function renderRepositorySection() {
  renderRepositories({
    ...repositoryState,
    onRetry: loadRepositories,
  });
}

async function loadProjects() {
  projectState = { status: 'loading', projects: [] };
  renderProjectSection();

  try {
    const projects = await fetchProjects();
    const categoryExists =
      activeFilter === 'all' ||
      projects.some((project) => project.category === activeFilter);
    if (!categoryExists) {
      activeFilter = 'all';
      savePreference(FILTER_KEY, activeFilter);
    }
    projectState = { status: 'success', projects };
  } catch (error) {
    console.error('Project data request failed.', error);
    projectState = { status: 'error', projects: [], error };
  }

  renderProjectSection();
}

async function loadRepositories() {
  repositoryState = { status: 'loading', repositories: [] };
  renderRepositorySection();

  try {
    const repositories = await fetchLatestRepositories();
    repositoryState = { status: 'success', repositories };
  } catch (error) {
    console.error('GitHub repositories request failed.', error);
    repositoryState = { status: 'error', repositories: [], error };
  }

  renderRepositorySection();
}

themeButton.addEventListener('click', () => {
  theme = theme === 'light' ? 'dark' : 'light';
  savePreference(THEME_KEY, theme);
  applyTheme();
});

applyTheme();
renderProjectSection();
renderRepositorySection();
loadProjects();
loadRepositories();
