const GITHUB_USERNAME = 'Sarvesh-GanesanW';
const FORM_TIMEOUT_MS = 15000;
const CACHE_TTL_MS = 10 * 60 * 1000;

function initializeDarkMode() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    const themeIcon = themeToggle.querySelector('i');

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    applyTheme(initialTheme);

    themeToggle.addEventListener('click', () => {
        const next = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('theme', next);
    });

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            themeToggle.setAttribute('aria-pressed', 'true');
        } else {
            document.body.classList.remove('dark-mode');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            themeToggle.setAttribute('aria-pressed', 'false');
        }
    }
}

function initializeMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        hamburger.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hash = this.getAttribute('href');
            if (hash === '#' || hash === '#main') return;
            const target = document.querySelector(hash);
            if (!target) return;
            e.preventDefault();
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            target.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        });
    });
}

function initializeNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const currentScroll = window.pageYOffset;
            navbar.classList.toggle('scrolled', currentScroll > 50);

            if (currentScroll > 100) {
                navbar.style.transform = currentScroll > lastScroll
                    ? 'translateY(-100%)'
                    : 'translateY(0)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            lastScroll = currentScroll;
            ticking = false;
        });
    }, { passive: true });
}

function initializeFadeInAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('section, .timeline-item, .skill-category, .project-card, .highlight-card')
            .forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    document.querySelectorAll('section, .timeline-item, .skill-category, .project-card, .highlight-card')
        .forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
}

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
            if (navLink && entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        });
    }, { threshold: 0.5, rootMargin: '-100px 0px -100px 0px' });

    sections.forEach(section => observer.observe(section));
}

function initializeCustomCursor() {
    // only initialize on fine-pointer devices with no motion preference
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    if (!mediaQuery.matches) return;

    document.body.classList.add('custom-cursor-enabled');

    const cursorDot = document.createElement('div');
    const cursorRing = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorRing.className = 'cursor-ring';
    cursorDot.setAttribute('aria-hidden', 'true');
    cursorRing.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.25;
        ringY += (mouseY - ringY) * 0.25;
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateRing);
    }
    animateRing();

    let clickTimeout;
    document.addEventListener('mousedown', () => {
        cursorDot.classList.add('click');
        cursorRing.classList.add('click');
        clearTimeout(clickTimeout);
    });

    document.addEventListener('mouseup', () => {
        clickTimeout = setTimeout(() => {
            cursorDot.classList.remove('click');
            cursorRing.classList.remove('click');
        }, 150);
    });

    const interactiveSelector = 'a, button, .btn, .project-card, .skill-tag, .contact-detail, .hamburger, .highlight-card, .skill-category, input, textarea';
    document.querySelectorAll(interactiveSelector).forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
}

function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    if (!form || !statusDiv || !submitBtn) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const honeypot = form.querySelector('input[name="_gotcha"]');
        if (honeypot && honeypot.value) return;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
        statusDiv.style.display = 'none';

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FORM_TIMEOUT_MS);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: new FormData(form),
                headers: { 'Accept': 'application/json' },
                signal: controller.signal
            });

            if (response.ok) {
                showStatus('success', '<i class="fas fa-check-circle" aria-hidden="true"></i> Thanks for your message! I\'ll get back to you soon.');
                form.reset();
            } else {
                showStatus('error', '<i class="fas fa-exclamation-circle" aria-hidden="true"></i> Oops! There was a problem. Please try again or email me directly.');
            }
        } catch (error) {
            const msg = error.name === 'AbortError'
                ? 'Request timed out. Please check your connection and try again.'
                : 'Network error. Please check your connection and try again.';
            showStatus('error', `<i class="fas fa-exclamation-circle" aria-hidden="true"></i> ${msg}`);
        } finally {
            clearTimeout(timeoutId);
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane" aria-hidden="true"></i> Send Message';
            setTimeout(() => { statusDiv.style.display = 'none'; }, 6000);
        }
    });

    function showStatus(kind, html) {
        statusDiv.innerHTML = html;
        statusDiv.className = `form-status ${kind}`;
        statusDiv.style.display = 'block';
    }
}

class GitHubApiService {
    constructor(userName) {
        this.userName = userName;
        this.apiBase = 'https://api.github.com';
        this.cache = new Map();
    }

    async _fetch(endpoint) {
        const cached = this.cache.get(endpoint);
        if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
            return cached.value;
        }

        const response = await fetch(`${this.apiBase}${endpoint}`);
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        const data = await response.json();
        this.cache.set(endpoint, { value: data, timestamp: Date.now() });
        return data;
    }

    getUser() {
        return this._fetch(`/users/${this.userName}`);
    }

    getRepos() {
        return this._fetch(`/users/${this.userName}/repos?sort=updated&per_page=100`);
    }

    getEvents() {
        return this._fetch(`/users/${this.userName}/events?per_page=30`);
    }

    getRateLimit() {
        return this._fetch('/rate_limit');
    }
}

class GitHubDashboard {
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

    async initialize() {
        try {
            const rateLimit = await this.service.getRateLimit();
            if (rateLimit.resources.core.remaining === 0) {
                this._showRateLimitMessage(rateLimit.resources.core.reset);
                return;
            }

            this.lists.activity.innerHTML = this._loaderHtml('Loading activity...');
            this.lists.repos.innerHTML = this._loaderHtml('Loading repositories...');

            const [user, repos, events] = await Promise.all([
                this.service.getUser(),
                this.service.getRepos(),
                this.service.getEvents()
            ]);

            this.renderStats(user, repos, events);
            this.renderActivity(events);
            this.renderTopRepos(repos);
        } catch (error) {
            console.error('GitHub dashboard failed:', error);
            this.lists.activity.innerHTML = this._errorHtml('Failed to load GitHub activity');
            this.lists.repos.innerHTML = this._errorHtml('Failed to load repositories');
        } finally {
            this.lists.activity.setAttribute('aria-busy', 'false');
            this.lists.repos.setAttribute('aria-busy', 'false');
        }
    }

    renderStats(user, repos, events) {
        this.stats.repos.textContent = user.public_repos || 0;

        const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
        this.stats.stars.textContent = totalStars;

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentCommits = events
            .filter(e => e.type === 'PushEvent' && new Date(e.created_at) > thirtyDaysAgo)
            .reduce((sum, e) => sum + (e.payload.commits?.length || 0), 0);
        this.stats.commits.textContent = recentCommits;

        this.stats.streak.textContent = this._calculateCommitStreak(events);
    }

    renderActivity(events) {
        const relevant = events
            .filter(e => ['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent', 'ForkEvent'].includes(e.type))
            .slice(0, 8);

        if (relevant.length === 0) {
            this.lists.activity.innerHTML = `<p class="github-empty">No recent activity</p>`;
            return;
        }

        this.lists.activity.innerHTML = relevant.map(event => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas ${this._activityIcon(event.type)}" aria-hidden="true"></i>
                </div>
                <div class="activity-content">
                    <h4>${this._escape(event.repo.name)}</h4>
                    <p>${this._escape(this._activityDescription(event))}</p>
                    <div class="activity-meta">${this._formatDate(event.created_at)}</div>
                </div>
            </div>
        `).join('');
    }

    renderTopRepos(repos) {
        const topRepos = repos
            .filter(r => !r.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 5);

        if (topRepos.length === 0) {
            this.lists.repos.innerHTML = `<p class="github-empty">No repositories found</p>`;
            return;
        }

        this.lists.repos.innerHTML = topRepos.map(repo => `
            <div class="repo-item">
                <div class="repo-header">
                    <i class="fas fa-folder" aria-hidden="true"></i>
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${this._escape(repo.name)}</a>
                </div>
                ${repo.description ? `<p class="repo-description">${this._escape(repo.description)}</p>` : ''}
                <div class="repo-footer">
                    ${repo.language ? `<span class="repo-language">${this._escape(repo.language)}</span>` : ''}
                    <div class="repo-stats">
                        <span><i class="fas fa-star" aria-hidden="true"></i> ${repo.stargazers_count}</span>
                        <span><i class="fas fa-code-branch" aria-hidden="true"></i> ${repo.forks_count}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    _calculateCommitStreak(events) {
        const pushEvents = events.filter(e => e.type === 'PushEvent');
        if (pushEvents.length === 0) return 0;

        const commitDates = new Set();
        pushEvents.forEach(e => {
            commitDates.add(new Date(e.created_at).toDateString());
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

    _activityIcon(type) {
        const icons = {
            PushEvent: 'fa-code-commit',
            CreateEvent: 'fa-plus-circle',
            DeleteEvent: 'fa-trash',
            ForkEvent: 'fa-code-branch',
            IssuesEvent: 'fa-exclamation-circle',
            IssueCommentEvent: 'fa-comment',
            PullRequestEvent: 'fa-code-pull-request',
            WatchEvent: 'fa-star',
            ReleaseEvent: 'fa-tag',
            PublicEvent: 'fa-lock-open'
        };
        return icons[type] || 'fa-circle';
    }

    _activityDescription(event) {
        const repo = event.repo.name;
        switch (event.type) {
            case 'PushEvent': {
                const n = event.payload.commits?.length || 0;
                return `Pushed ${n} commit${n !== 1 ? 's' : ''} to ${repo}`;
            }
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

    _formatDate(dateString) {
        const date = new Date(dateString);
        const diffDays = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    }

    _showRateLimitMessage(resetTimestamp) {
        const minutesUntilReset = Math.ceil((new Date(resetTimestamp * 1000) - new Date()) / 60000);
        ['repos', 'stars', 'commits', 'streak'].forEach(k => {
            this.stats[k].textContent = '--';
        });
        this.lists.activity.innerHTML = `<p class="github-empty">GitHub API rate limit reached.<br><small>Resets in ${minutesUntilReset} minutes.</small></p>`;
        this.lists.repos.innerHTML = `<p class="github-empty">Rate limit reached.<br><small>Visit <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noopener noreferrer">my GitHub</a> to see all repos.</small></p>`;
    }

    _loaderHtml(message) {
        return `<div class="activity-loading"><i class="fas fa-spinner fa-spin" aria-hidden="true"></i> ${this._escape(message)}</div>`;
    }

    _errorHtml(message) {
        return `<p class="github-error" role="alert">${this._escape(message)}</p>`;
    }

    _escape(str) {
        if (str == null) return '';
        return String(str).replace(/[&<>"']/g, c => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[c]));
    }
}

function initializeGitHubSection() {
    const githubSection = document.getElementById('github');
    if (!githubSection) return;

    let initialized = false;
    const start = () => {
        if (initialized) return;
        initialized = true;
        const service = new GitHubApiService(GITHUB_USERNAME);
        new GitHubDashboard(service).initialize();
    };

    // eager-load if already in view, else lazy-load via observer
    const rect = githubSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
        start();
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            start();
            observer.disconnect();
        }
    }, { threshold: 0.1 });
    observer.observe(githubSection);
}

function initializeFooterYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
}

function bootstrap() {
    initializeDarkMode();
    initializeMobileNav();
    initializeSmoothScroll();
    initializeNavbarScroll();
    initializeFadeInAnimations();
    initializeActiveNavObserver();
    initializeCustomCursor();
    initializeContactForm();
    initializeGitHubSection();
    initializeFooterYear();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}
