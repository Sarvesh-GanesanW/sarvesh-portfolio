const DETAILS_SHEET = '2';

// Stroke groups in the elevation start 220 ms apart; the last group then needs ~1.3 s to finish.
const DRAW_STAGES = 10;
const DRAW_STAGE_MS = 220;
const DRAW_TAIL_MS = 1300;

const REORDER_MS = 280;
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';

const RESUME_BY_LENS = {
    all: 'Sarvesh_Resume.pdf',
    ai: 'Sarvesh_Resume_AI.pdf',
    data: 'Sarvesh_Resume_Data.pdf',
    infra: 'Sarvesh_Resume_Infra.pdf'
};
const RESUME_NOTE_BY_LENS = {
    all: 'PDF',
    ai: 'AI, PDF',
    data: 'Data, PDF',
    infra: 'Infra, PDF'
};

function motionAllowed() {
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// The one first-run moment: the platform elevation draws itself in.
function initializeDrawIn() {
    if (!motionAllowed()) return;
    // Dashed lines keep real units so their dash pattern stays readable; they fade in instead.
    document
        .querySelectorAll('#elevation .ln:not(.dash):not(.ext)')
        .forEach((stroke) => stroke.setAttribute('pathLength', '1'));
    document.documentElement.classList.add('is-drawing');
    setTimeout(
        () => document.documentElement.classList.remove('is-drawing'),
        DRAW_STAGES * DRAW_STAGE_MS + DRAW_TAIL_MS
    );
}

// Mark the sheet in view in the title block.
function initializeCurrentSheet() {
    const links = Array.from(document.querySelectorAll('.sheet-index a'));
    if (!links.length) return;

    function markCurrent(id) {
        links.forEach((link) =>
            link.setAttribute('aria-current', String(link.getAttribute('href') === `#${id}`))
        );
    }

    markCurrent(document.querySelector('.sheet').id);
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) markCurrent(entry.target.id);
            });
        },
        { rootMargin: '-45% 0px -50% 0px' }
    );
    document.querySelectorAll('.sheet').forEach((sheet) => observer.observe(sheet));
}

// data-order="ai:2 data:1 infra:3" -> rank for the chosen lens; "all" keeps the authored order
function lensRank(element, lens) {
    if (lens === 'all') return Number(element.dataset.origIndex);
    const match = (element.dataset.order || '')
        .split(' ')
        .find((part) => part.startsWith(`${lens}:`));
    return match ? Number(match.split(':')[1]) : Number(element.dataset.origIndex);
}

function sortByLens(list, lens) {
    Array.from(list.children)
        .sort((a, b) => lensRank(a, lens) - lensRank(b, lens))
        .forEach((item) => list.appendChild(item));
}

// Items slide from where they were to where they now sit, so the reorder reads as one move.
function reorderWithMotion(list, lens) {
    const items = Array.from(list.children);
    const before = new Map(items.map((item) => [item, item.getBoundingClientRect()]));
    sortByLens(list, lens);
    if (!motionAllowed()) return;
    items.forEach((item) => {
        const from = before.get(item);
        const to = item.getBoundingClientRect();
        const dx = from.left - to.left;
        const dy = from.top - to.top;
        if (!dx && !dy) return;
        item.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], {
            duration: REORDER_MS,
            easing: EASE_OUT
        });
    });
}

// Detail numbers follow their position, in the drawings and in the elevation's callouts.
function renumberDetails() {
    document.querySelectorAll('.detail').forEach((detail, index) => {
        const number = String(index + 1);
        detail.querySelector('.mark span').textContent = number;
        const bubble = document.querySelector(`.bubble[href="#${detail.id}"]`);
        if (!bubble) return;
        bubble.querySelector('.bubble-no').textContent = number;
        const title = detail.querySelector('h3').textContent;
        bubble.setAttribute(
            'aria-label',
            `Open detail ${number} on sheet ${DETAILS_SHEET}: ${title}`
        );
    });
}

// Sheet numbers follow their position, on the sheets and in the index.
function renumberSheets() {
    const index = document.querySelector('.sheet-index');
    document.querySelectorAll('main .sheet').forEach((sheet, position) => {
        const number = String(position + 1);
        const sheetNumber = sheet.querySelector('.sheet-head .sheet-no b');
        if (sheetNumber) sheetNumber.textContent = number;
        const link = index.querySelector(`a[href="#${sheet.id}"]`);
        link.querySelector('.no').textContent = number;
        index.appendChild(link.parentElement);
    });
}

function initializeLens() {
    const buttons = document.querySelectorAll('.lens-option');
    if (!buttons.length) return;

    const lists = document.querySelectorAll('.lens-list');
    lists.forEach((list) =>
        Array.from(list.children).forEach((item, index) => {
            item.dataset.origIndex = String(index);
        })
    );
    const resumeLinks = document.querySelectorAll('a[href^="Sarvesh_Resume"]');

    function applyLens(lens, { animate }) {
        buttons.forEach((button) =>
            button.setAttribute('aria-pressed', String(button.dataset.lens === lens))
        );
        lists.forEach((list) => {
            if (animate && list.classList.contains('details')) reorderWithMotion(list, lens);
            else sortByLens(list, lens);
        });
        renumberDetails();
        renumberSheets();
        resumeLinks.forEach((link) => {
            const file = RESUME_BY_LENS[lens];
            link.setAttribute('href', file);
            link.setAttribute('download', file.replace('Sarvesh_', 'Sarvesh_Ganesan_'));
            const note = link.querySelector('.resume-note');
            if (note) note.textContent = RESUME_NOTE_BY_LENS[lens];
        });
    }

    function setUrl(lens) {
        const url = new window.URL(window.location.href);
        if (lens === 'all') url.searchParams.delete('for');
        else url.searchParams.set('for', lens);
        window.history.replaceState(null, '', url);
    }

    buttons.forEach((button) =>
        button.addEventListener('click', () => {
            applyLens(button.dataset.lens, { animate: true });
            setUrl(button.dataset.lens);
        })
    );

    const requested = new window.URLSearchParams(window.location.search).get('for');
    if (requested && requested in RESUME_BY_LENS) applyLens(requested, { animate: false });
}

function bootstrap() {
    initializeDrawIn();
    initializeLens();
    initializeCurrentSheet();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}
