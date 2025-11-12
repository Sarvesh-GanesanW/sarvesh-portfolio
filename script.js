/**
 * Initializes dark mode toggle functionality.
 * Persists user preference in localStorage and updates UI accordingly.
 */
function initializeDarkMode() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        // Update icon
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Initialize dark mode
initializeDarkMode();

/**
 * Initializes mobile navigation toggle functionality.
 * Handles hamburger menu clicks and closes menu when nav link is clicked.
 */
function initializeMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Initialize mobile navigation
initializeMobileNav();

/**
 * Initializes smooth scrolling for all anchor links.
 * Enables smooth scroll behavior when clicking internal navigation links.
 */
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize smooth scrolling
initializeSmoothScroll();

/**
 * Initializes navbar scroll behavior.
 * Hides navbar on scroll down, shows on scroll up, and adds scrolled class for styling.
 */
function initializeNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class for styling
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide navbar on scroll down, show on scroll up (after 100px)
        if (currentScroll > 100) {
            if (currentScroll > lastScroll) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

// Initialize navbar scroll behavior
initializeNavbarScroll();

/**
 * Initializes fade-in animations on scroll using IntersectionObserver.
 * Adds 'visible' class to elements when they enter the viewport.
 */
function initializeFadeInAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    document.querySelectorAll('section, .timeline-item, .skill-category, .project-card, .highlight-card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Initialize fade-in animations
initializeFadeInAnimations();

/**
 * Updates the active navigation link based on which section is in view.
 * Uses IntersectionObserver for better performance than scroll events.
 */
function initializeActiveNavObserver() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = new Map(
        Array.from(document.querySelectorAll('.nav-link')).map(link => [
            link.getAttribute('href').substring(1),
            link
        ])
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const navLink = navLinks.get(id);

            if (navLink) {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    // Remove active from all links first
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-100px 0px -100px 0px'
    });

    sections.forEach(section => observer.observe(section));
}

// Initialize active nav observer
initializeActiveNavObserver();

// Custom Cursor - Fast and Responsive
document.addEventListener('DOMContentLoaded', () => {
    const cursorDot = document.createElement('div');
    const cursorRing = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    cursorRing.classList.add('cursor-ring');
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let isHovering = false;

    // Track mouse position - instant for dot
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Dot follows instantly - no lag
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    // Smooth ring animation with faster follow
    function animateRing() {
        // Faster follow for ring
        ringX += (mouseX - ringX) * 0.25;
        ringY += (mouseY - ringY) * 0.25;

        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

        requestAnimationFrame(animateRing);
    }

    animateRing();

    // Click animation with delay for visibility
    let clickTimeout;
    document.addEventListener('mousedown', () => {
        cursorDot.classList.add('click');
        cursorRing.classList.add('click');

        // Clear any existing timeout
        clearTimeout(clickTimeout);
    });

    document.addEventListener('mouseup', () => {
        // Keep the animation visible for a moment
        clickTimeout = setTimeout(() => {
            cursorDot.classList.remove('click');
            cursorRing.classList.remove('click');
        }, 150);
    });

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-tag, .contact-detail, .hamburger, .highlight-card, .skill-category, input, textarea');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            isHovering = true;
            cursorRing.classList.add('hover');
        });

        el.addEventListener('mouseleave', () => {
            isHovering = false;
            cursorRing.classList.remove('hover');
        });
    });
});

/**
 * Initializes contact form submission handler with Formspree.
 * Provides visual feedback during and after submission.
 */
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        statusDiv.style.display = 'none';

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success
                statusDiv.innerHTML = '<i class="fas fa-check-circle"></i> Thanks for your message! I\'ll get back to you soon.';
                statusDiv.className = 'form-status success';
                statusDiv.style.display = 'block';
                form.reset();
            } else {
                // Error
                statusDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Oops! There was a problem. Please try again or email me directly.';
                statusDiv.className = 'form-status error';
                statusDiv.style.display = 'block';
            }
        } catch (error) {
            // Network error
            statusDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Network error. Please check your connection and try again.';
            statusDiv.className = 'form-status error';
            statusDiv.style.display = 'block';
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';

            // Hide status message after 5 seconds
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
        }
    });
}

// Initialize contact form
initializeContactForm();

/**
 * Service class for interacting with the GitHub API.
 * Handles all data fetching with automatic caching.
 */
class GitHubApiService {
    /**
     * Creates a new GitHubApiService instance.
     * @param {string} userName - The GitHub username to fetch data for.
     */
    constructor(userName) {
        this.userName = userName;
        this.apiBase = 'https://api.github.com';
        this.cacheDuration = 10 * 60 * 1000; // 10 minutes
        this.cache = new Map();
    }

    /**
     * Private helper to manage fetching and caching.
     * @param {string} endpoint - The API endpoint to fetch.
     * @returns {Promise<object|Array>} The JSON response from the API.
     * @private
     */
    async _fetch(endpoint) {
        const cacheKey = endpoint;
        const cachedItem = this.cache.get(cacheKey);

        if (cachedItem && (Date.now() - cachedItem.timestamp < this.cacheDuration)) {
            return cachedItem.value;
        }

        try {
            const response = await fetch(`${this.apiBase}${endpoint}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status}`);
            }
            const data = await response.json();
            this.cache.set(cacheKey, { value: data, timestamp: Date.now() });
            return data;
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            throw error;
        }
    }

    /**
     * Fetches the user's profile data.
     * @returns {Promise<object>} User profile data.
     */
    getUser() {
        return this._fetch(`/users/${this.userName}`);
    }

    /**
     * Fetches the user's repositories.
     * @returns {Promise<Array>} Array of repository objects.
     */
    getRepos() {
        return this._fetch(`/users/${this.userName}/repos?sort=updated&per_page=100`);
    }

    /**
     * Fetches the user's public events.
     * @returns {Promise<Array>} Array of event objects.
     */
    getEvents() {
        return this._fetch(`/users/${this.userName}/events?per_page=30`);
    }

    /**
     * Checks the current API rate limit status.
     * @returns {Promise<object>} Rate limit information.
     */
    getRateLimit() {
        return this._fetch('/rate_limit');
    }
}

/**
 * Dashboard class for rendering GitHub data.
 * Handles all DOM manipulation and UI updates for the GitHub section.
 */
class GitHubDashboard {
    /**
     * Creates a new GitHubDashboard instance.
     * @param {GitHubApiService} apiService - The API service instance to use for data fetching.
     */
    constructor(apiService) {
        this.service = apiService;
        this.stats = {
            repos: document.getElementById('total-repos'),
            stars: document.getElementById('total-stars'),
            commits: document.getElementById('recent-commits'),
            streak: document.getElementById('commit-streak')
        };
        this.lists = {
            activity: document.getElementById('github-activity-list'),
            repos: document.getElementById('github-repos-list')
        };
    }

    /**
     * Main method to initialize and render all components.
     * Checks rate limits and fetches data from GitHub API.
     */
    async initialize() {
        try {
            // Check rate limit first
            const rateLimit = await this.service.getRateLimit();

            if (rateLimit.resources.core.remaining === 0) {
                this._showRateLimitMessage(rateLimit.resources.core.reset);
                return;
            }

            // Show loading state
            this.lists.activity.innerHTML = this._getLoaderHtml('Loading activity...');
            this.lists.repos.innerHTML = this._getLoaderHtml('Loading repositories...');

            // Fetch all data in parallel
            const [user, repos, events] = await Promise.all([
                this.service.getUser(),
                this.service.getRepos(),
                this.service.getEvents()
            ]);

            // Render all sections
            this.renderStats(user, repos, events);
            this.renderActivity(events);
            this.renderTopRepos(repos);

        } catch (error) {
            console.error('Failed to initialize GitHub dashboard:', error);
            this.lists.activity.innerHTML = this._getErrorHtml('Failed to load GitHub data');
            this.lists.repos.innerHTML = this._getErrorHtml('Failed to load repositories');
        }
    }

    /**
     * Renders the 4 main stat cards.
     * @param {object} user - User data from API.
     * @param {Array} repos - Repository data from API.
     * @param {Array} events - Event data from API.
     */
    renderStats(user, repos, events) {
        this.stats.repos.textContent = user.public_repos || 0;

        const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
        this.stats.stars.textContent = totalStars;

        // Recent commits (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentCommits = events.filter(event =>
            event.type === 'PushEvent' && new Date(event.created_at) > thirtyDaysAgo
        ).reduce((sum, event) => sum + (event.payload.commits?.length || 0), 0);
        this.stats.commits.textContent = recentCommits;

        // Commit streak
        const streak = this._calculateCommitStreak(events);
        this.stats.streak.textContent = streak;
    }

    /**
     * Renders the recent activity list.
     * @param {Array} events - Array of GitHub events.
     */
    renderActivity(events) {
        const relevantEvents = events.filter(event =>
            ['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent', 'ForkEvent'].includes(event.type)
        ).slice(0, 8);

        if (relevantEvents.length === 0) {
            this.lists.activity.innerHTML = '<p style="text-align: center; color: var(--text-dark);">No recent activity</p>';
            return;
        }

        this.lists.activity.innerHTML = relevantEvents.map(event => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas ${this._getActivityIcon(event.type)}"></i>
                </div>
                <div class="activity-content">
                    <h4>${event.repo.name}</h4>
                    <p>${this._getActivityDescription(event)}</p>
                    <div class="activity-meta">${this._formatDate(event.created_at)}</div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Renders the top repositories list.
     * @param {Array} repos - Array of repository objects.
     */
    renderTopRepos(repos) {
        const topRepos = repos
            .filter(repo => !repo.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 5);

        if (topRepos.length === 0) {
            this.lists.repos.innerHTML = '<p style="text-align: center; color: var(--text-dark);">No repositories found</p>';
            return;
        }

        this.lists.repos.innerHTML = topRepos.map(repo => `
            <div class="repo-item">
                <div class="repo-header">
                    <i class="fas fa-folder"></i>
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a>
                </div>
                ${repo.description ? `<p class="repo-description">${repo.description}</p>` : ''}
                <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
                    ${repo.language ? `<span class="repo-language">${repo.language}</span>` : ''}
                    <div class="repo-stats">
                        <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                        <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Calculates the current commit streak from events.
     * @param {Array} events - Array of GitHub events.
     * @returns {number} Number of consecutive days with commits.
     * @private
     */
    _calculateCommitStreak(events) {
        const pushEvents = events.filter(event => event.type === 'PushEvent');
        if (pushEvents.length === 0) return 0;

        const commitDates = new Set();
        pushEvents.forEach(event => {
            const date = new Date(event.created_at).toDateString();
            commitDates.add(date);
        });

        const sortedDates = Array.from(commitDates).map(d => new Date(d)).sort((a, b) => b - a);

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < sortedDates.length; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            checkDate.setHours(0, 0, 0, 0);

            const eventDate = new Date(sortedDates[i]);
            eventDate.setHours(0, 0, 0, 0);

            if (eventDate.getTime() === checkDate.getTime()) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    /**
     * Gets the Font Awesome icon class for an event type.
     * @param {string} eventType - The GitHub event type.
     * @returns {string} Font Awesome icon class.
     * @private
     */
    _getActivityIcon(eventType) {
        const icons = {
            'PushEvent': 'fa-code-commit',
            'CreateEvent': 'fa-plus-circle',
            'DeleteEvent': 'fa-trash',
            'ForkEvent': 'fa-code-branch',
            'IssuesEvent': 'fa-exclamation-circle',
            'IssueCommentEvent': 'fa-comment',
            'PullRequestEvent': 'fa-code-pull-request',
            'WatchEvent': 'fa-star',
            'ReleaseEvent': 'fa-tag',
            'PublicEvent': 'fa-lock-open'
        };
        return icons[eventType] || 'fa-circle';
    }

    /**
     * Gets a human-readable description for an event.
     * @param {object} event - The GitHub event object.
     * @returns {string} Description of the event.
     * @private
     */
    _getActivityDescription(event) {
        const repo = event.repo.name;

        switch (event.type) {
            case 'PushEvent':
                const commitCount = event.payload.commits?.length || 0;
                return `Pushed ${commitCount} commit${commitCount !== 1 ? 's' : ''} to ${repo}`;
            case 'CreateEvent':
                return `Created ${event.payload.ref_type} in ${repo}`;
            case 'DeleteEvent':
                return `Deleted ${event.payload.ref_type} in ${repo}`;
            case 'ForkEvent':
                return `Forked ${repo}`;
            case 'IssuesEvent':
                return `${event.payload.action} an issue in ${repo}`;
            case 'IssueCommentEvent':
                return `Commented on an issue in ${repo}`;
            case 'PullRequestEvent':
                return `${event.payload.action} a pull request in ${repo}`;
            case 'WatchEvent':
                return `Starred ${repo}`;
            case 'ReleaseEvent':
                return `Published a release in ${repo}`;
            case 'PublicEvent':
                return `Made ${repo} public`;
            default:
                return `Activity in ${repo}`;
        }
    }

    /**
     * Formats an ISO date string into a human-readable relative time.
     * @param {string} dateString - The ISO 8601 date string to format.
     * @returns {string} A relative time string (e.g., "Today", "2 days ago").
     * @private
     */
    _formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    }

    /**
     * Shows a rate limit message to the user.
     * @param {number} resetTimestamp - Unix timestamp when rate limit resets.
     * @private
     */
    _showRateLimitMessage(resetTimestamp) {
        const resetTime = new Date(resetTimestamp * 1000);
        const now = new Date();
        const minutesUntilReset = Math.ceil((resetTime - now) / 60000);

        this.stats.repos.textContent = '--';
        this.stats.stars.textContent = '--';
        this.stats.commits.textContent = '--';
        this.stats.streak.textContent = '--';

        this.lists.activity.innerHTML =
            `<p style="text-align: center; color: var(--text-dark); padding: 2rem;">GitHub API rate limit reached.<br><small>Resets in ${minutesUntilReset} minutes. Please refresh the page then.</small></p>`;
        this.lists.repos.innerHTML =
            `<p style="text-align: center; color: var(--text-dark); padding: 2rem;">Rate limit reached.<br><small>Visit <a href="https://github.com/Sarvesh-GanesanW" target="_blank" style="color: var(--accent-cyan);">my GitHub profile</a> to see all repositories.</small></p>`;
    }

    /**
     * Returns loading spinner HTML.
     * @param {string} message - Loading message to display.
     * @returns {string} HTML string.
     * @private
     */
    _getLoaderHtml(message) {
        return `<div style="text-align: center; padding: 2rem; color: var(--text-dark); font-family: 'JetBrains Mono', monospace;">
            <i class="fas fa-spinner fa-spin" style="color: var(--accent-cyan); margin-right: 0.5rem; font-size: 1.2rem;"></i> ${message}
        </div>`;
    }

    /**
     * Returns error message HTML.
     * @param {string} message - Error message to display.
     * @returns {string} HTML string.
     * @private
     */
    _getErrorHtml(message) {
        return `<p style="text-align: center; color: var(--accent-coral); padding: 2rem;">${message}</p>`;
    }
}

/**
 * Initializes the GitHub dashboard when the section becomes visible.
 * Uses IntersectionObserver for lazy loading.
 */
function initializeGitHubSection() {
    const githubSection = document.getElementById('github');
    if (!githubSection) return;

    let initialized = false;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !initialized) {
            initialized = true;
            const apiService = new GitHubApiService('Sarvesh-GanesanW');
            const dashboard = new GitHubDashboard(apiService);
            dashboard.initialize();
            observer.disconnect();
        }
    }, { threshold: 0.1 });

    observer.observe(githubSection);
}

// Initialize GitHub section
initializeGitHubSection();