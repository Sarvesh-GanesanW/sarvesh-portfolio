// Dark Mode Toggle
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

// Mobile Navigation Toggle
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

// Smooth Scrolling
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

// Enhanced Navbar on Scroll
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

// Fade In Animation on Scroll
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

// Active Navigation Link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

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

// Contact Form Handler
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Create mailto link as fallback
        const mailtoLink = `mailto:sarveshganesan2002@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        )}`;

        // Open default email client
        window.location.href = mailtoLink;

        // Show success message
        formStatus.textContent = 'Opening your email client...';
        formStatus.className = 'form-status success';

        // Reset form after short delay
        setTimeout(() => {
            contactForm.reset();
            formStatus.style.display = 'none';
        }, 3000);
    });
}

// GitHub Activity Dashboard
const GITHUB_USERNAME = 'Sarvesh-GanesanW';
const GITHUB_API_BASE = 'https://api.github.com';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes cache

// Simple cache implementation
const cache = {
    data: {},
    set(key, value) {
        this.data[key] = {
            value,
            timestamp: Date.now()
        };
    },
    get(key) {
        const item = this.data[key];
        if (!item) return null;
        if (Date.now() - item.timestamp > CACHE_DURATION) {
            delete this.data[key];
            return null;
        }
        return item.value;
    }
};

// Utility function to format date
function formatDate(dateString) {
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

// Fetch GitHub user data with caching
async function fetchGitHubUser() {
    const cacheKey = 'github_user';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        cache.set(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Error fetching GitHub user:', error);
        return null;
    }
}

// Fetch GitHub repositories with caching
async function fetchGitHubRepos() {
    const cacheKey = 'github_repos';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        if (!response.ok) throw new Error('Failed to fetch repositories');
        const data = await response.json();
        cache.set(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        return [];
    }
}

// Fetch GitHub events (activity) with caching
async function fetchGitHubEvents() {
    const cacheKey = 'github_events';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/events?per_page=30`);
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        cache.set(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Error fetching GitHub events:', error);
        return [];
    }
}

// Calculate commit streak
function calculateCommitStreak(events) {
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

// Get activity icon based on event type
function getActivityIcon(eventType) {
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

// Get activity description
function getActivityDescription(event) {
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

// Render GitHub stats
function renderGitHubStats(userData, repos, events) {
    // Total repositories
    document.getElementById('total-repos').textContent = userData.public_repos || 0;

    // Total stars
    const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    document.getElementById('total-stars').textContent = totalStars;

    // Recent commits (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCommits = events.filter(event =>
        event.type === 'PushEvent' && new Date(event.created_at) > thirtyDaysAgo
    ).reduce((sum, event) => sum + (event.payload.commits?.length || 0), 0);
    document.getElementById('recent-commits').textContent = recentCommits;

    // Commit streak
    const streak = calculateCommitStreak(events);
    document.getElementById('commit-streak').textContent = streak;
}

// Render recent activity
function renderGitHubActivity(events) {
    const activityList = document.getElementById('github-activity-list');

    // Filter to show only the most relevant events
    const relevantEvents = events.filter(event =>
        ['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent', 'ForkEvent'].includes(event.type)
    ).slice(0, 8);

    if (relevantEvents.length === 0) {
        activityList.innerHTML = '<p style="text-align: center; color: var(--text-dark);">No recent activity</p>';
        return;
    }

    activityList.innerHTML = relevantEvents.map(event => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas ${getActivityIcon(event.type)}"></i>
            </div>
            <div class="activity-content">
                <h4>${event.repo.name}</h4>
                <p>${getActivityDescription(event)}</p>
                <div class="activity-meta">${formatDate(event.created_at)}</div>
            </div>
        </div>
    `).join('');
}

// Render top repositories
function renderTopRepos(repos) {
    const reposList = document.getElementById('github-repos-list');

    // Sort by stars and filter out forks, take top 5
    const topRepos = repos
        .filter(repo => !repo.fork)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5);

    if (topRepos.length === 0) {
        reposList.innerHTML = '<p style="text-align: center; color: var(--text-dark);">No repositories found</p>';
        return;
    }

    reposList.innerHTML = topRepos.map(repo => `
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

// Initialize GitHub Dashboard
async function initGitHubDashboard() {
    try {
        const [userData, repos, events] = await Promise.all([
            fetchGitHubUser(),
            fetchGitHubRepos(),
            fetchGitHubEvents()
        ]);

        if (userData && repos && events) {
            renderGitHubStats(userData, repos, events);
            renderGitHubActivity(events);
            renderTopRepos(repos);
        } else {
            // Show error state
            document.getElementById('github-activity-list').innerHTML =
                '<p style="text-align: center; color: var(--accent-coral);">Failed to load GitHub data</p>';
            document.getElementById('github-repos-list').innerHTML =
                '<p style="text-align: center; color: var(--accent-coral);">Failed to load repositories</p>';
        }
    } catch (error) {
        console.error('Error initializing GitHub dashboard:', error);
        document.getElementById('github-activity-list').innerHTML =
            '<p style="text-align: center; color: var(--accent-coral);">Failed to load GitHub data</p>';
        document.getElementById('github-repos-list').innerHTML =
            '<p style="text-align: center; color: var(--accent-coral);">Failed to load repositories</p>';
    }
}

// Lazy load GitHub dashboard when section is visible
if (document.getElementById('github-activity-list')) {
    let githubInitialized = false;

    const githubObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !githubInitialized) {
                githubInitialized = true;
                initGitHubDashboard();
                githubObserver.disconnect();
            }
        });
    }, { threshold: 0.1 });

    const githubSection = document.getElementById('github');
    if (githubSection) {
        githubObserver.observe(githubSection);
    }
}