function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function safeGitHubUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' && url.hostname === 'github.com') {
      return url.href;
    }
  } catch {
    return null;
  }
  return null;
}

function createExternalLink(url, label, className = 'card-link') {
  const safeUrl = safeGitHubUrl(url);
  if (!safeUrl) return null;

  const link = createElement('a', className, label);
  link.href = safeUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
}

function renderStatus(container, message, retry) {
  container.replaceChildren();
  container.hidden = !message;
  if (!message) return;

  container.append(document.createTextNode(message));
  if (retry) {
    const button = createElement('button', 'retry-button', 'Try again');
    button.type = 'button';
    button.addEventListener('click', retry);
    container.append(' ', button);
  }
}

function renderProjectCard(project) {
  const card = createElement('article', 'project-card');
  const category = createElement('p', 'card-category', project.category);
  const title = createElement('h3', 'card-title', project.title);
  const description = createElement('p', 'card-description', project.description);
  const technologies = createElement('ul', 'tag-list');

  for (const technology of project.technologies ?? []) {
    technologies.append(createElement('li', 'tag', technology));
  }

  card.append(category, title, description, technologies);
  const link = createExternalLink(project.url, 'View project');
  if (link) card.append(link);
  return card;
}

function renderProjectFilters(container, projects, activeFilter, onFilterChange) {
  container.replaceChildren();
  const categories = ['all', ...new Set(projects.map((project) => project.category))];

  for (const category of categories) {
    const label = category === 'all' ? 'All' : category;
    const button = createElement('button', 'filter-button', label);
    button.type = 'button';
    button.dataset.filter = category;
    button.setAttribute('aria-pressed', String(category === activeFilter));
    button.addEventListener('click', () => onFilterChange(category));
    container.append(button);
  }
}

export function renderProjects({
  status,
  projects = [],
  activeFilter = 'all',
  error,
  onFilterChange,
  onRetry,
}) {
  const filters = document.getElementById('project-filters');
  const statusElement = document.getElementById('projects-status');
  const grid = document.getElementById('project-grid');
  filters.replaceChildren();
  grid.replaceChildren();

  if (status === 'loading') {
    filters.hidden = true;
    renderStatus(statusElement, 'Loading projects…');
    return;
  }
  if (status === 'error') {
    filters.hidden = true;
    renderStatus(statusElement, `Could not load projects: ${error.message}`, onRetry);
    return;
  }
  if (projects.length === 0) {
    filters.hidden = true;
    renderStatus(statusElement, 'No projects to show yet.');
    return;
  }

  filters.hidden = false;
  renderProjectFilters(filters, projects, activeFilter, onFilterChange);
  const visibleProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  if (visibleProjects.length === 0) {
    renderStatus(statusElement, `No projects found in ${activeFilter}.`);
    return;
  }

  renderStatus(statusElement, '');
  grid.append(...visibleProjects.map(renderProjectCard));
}

function formatUpdatedDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Update date unavailable';
  return `Updated ${new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
  }).format(date)}`;
}

function renderRepositoryCard(repository) {
  const card = createElement('article', 'repository-card');
  const title = createElement('h3', 'card-title', repository.name);
  const description = createElement(
    'p',
    'card-description',
    repository.description || 'No description provided.'
  );
  const details = createElement('p', 'repository-details');
  const language = repository.language || 'Language not specified';
  details.textContent =
    `${language} · ${repository.stargazers_count} stars · ` +
    formatUpdatedDate(repository.updated_at);

  card.append(title, description, details);
  const link = createExternalLink(repository.html_url, 'View repository');
  if (link) card.append(link);
  return card;
}

export function renderRepositories({ status, repositories = [], error, onRetry }) {
  const statusElement = document.getElementById('repositories-status');
  const grid = document.getElementById('repositories-grid');
  grid.replaceChildren();

  if (status === 'loading') {
    renderStatus(statusElement, 'Loading repositories…');
    return;
  }
  if (status === 'error') {
    renderStatus(
      statusElement,
      `Could not load GitHub repositories: ${error.message}`,
      onRetry
    );
    return;
  }
  if (repositories.length === 0) {
    renderStatus(statusElement, 'No public repositories to show yet.');
    return;
  }

  renderStatus(statusElement, '');
  grid.append(...repositories.map(renderRepositoryCard));
}
