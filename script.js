// ---------- Smooth scroll ----------
document.querySelectorAll('.nav-menu a').forEach(a => {
    a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            document.querySelector(href)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            document.querySelector('.nav-menu').classList.remove('show');
        }
    });
});

// ---------- Mobile nav ----------
document.querySelector('.nav-toggle')?.addEventListener('click', () => {
    document.querySelector('.nav-menu')?.classList.toggle('show');
});

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Dedicated arrays for YouTube embed links ---------- */
/* IMPORTANT: use /embed/VIDEO_ID format, not watch?v=VIDEO_ID */
const reelsLinks = [
    "https://www.youtube.com/embed/VIDEO_ID1",
    "https://www.youtube.com/embed/VIDEO_ID2",
    // ... up to 20
];
const videosLinks = [
    
  "https://player.vimeo.com/video/1160822544?badge=0&autopause=0&player_id=0&app_id=58479",
    "https://player.vimeo.com/video/1161066468?badge=0&autopause=0&player_id=0&app_id=58479",
    // ... up to 20
];
const cinematicsLinks = [
    "https://www.youtube.com/embed/VIDEO_ID1",
    "https://www.youtube.com/embed/VIDEO_ID2",
    // ... up to 20
];
const adsLinks = [
    "https://player.vimeo.com/video/1161478470?h=d5fcdb002d",
    "https://player.vimeo.com/video/1162179102?badge=0&autopause=0&player_id=0&app_id=58479",
    // ... up to 20
];

/* ---------- Card builder with YouTube thumbnails ---------- */
const makeCard = (src, title, desc, category) => {
    const article = document.createElement('article');
    article.className = 'card';
    article.dataset.category = category;
    article.dataset.video = src;

    // Extract video ID from embed URL
    const match = src.match(/embed\/([a-zA-Z0-9_-]{6,})/);
    const videoId = match ? match[1] : null;
    const thumbUrl = videoId
        ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        : `https://source.unsplash.com/1600x900/?luxury,${category}`;

    article.innerHTML = `
        <div class="thumb" style="background-image:url('${thumbUrl}');"></div>
        <div class="card-body">
            <h3>${title}</h3>
            <p>${desc}</p>
        </div>
    `;
    return article;
};

const populateGrid = (gridId, urls, category) => {
    const grid = document.getElementById(gridId);
    urls.forEach((u, i) => {
        const title = `${category.charAt(0).toUpperCase() + category.slice(1)} Edit ${String(i + 1).padStart(2, '0')}`;
        const desc = category === 'reels'
            ? 'Editorial pacing, elegant grade.'
            : category === 'videos'
                ? 'Aesthetic rhythm, soft light.'
                : category === 'cinematics'
                    ? 'Precision lighting, dynamic motion.'
                    : 'Cinematic tension, premium cut.';
        grid.appendChild(makeCard(u, title, desc, category));
    });
};

/* ---------- Populate each section ---------- */
populateGrid('grid-reels', reelsLinks, 'Reels');
populateGrid('grid-videos', videosLinks, 'Videos');
populateGrid('grid-cinematics', cinematicsLinks, 'Cinematics');
populateGrid('grid-ads', adsLinks, 'Ads');

/* ---------- Build "All" grid (first 5 from each) ---------- */
const all = [
    ...reelsLinks.slice(0, 5).map(u => ({ u, c: 'reels' })),
    ...videosLinks.slice(0, 5).map(u => ({ u, c: 'videos' })),
    ...cinematicsLinks.slice(0, 5).map(u => ({ u, c: 'cinematics' })),
    ...adsLinks.slice(0, 5).map(u => ({ u, c: 'ads' })),
];

const gridAll = document.getElementById('grid-all');
all.forEach((item, i) => {
    const title = `Selected ${item.c} ${String(i + 1).padStart(2, '0')}`;
    const desc = 'Curated cinematic selection.';
    gridAll.appendChild(makeCard(item.u, title, desc, item.c));
});

/* ---------- Filtering ---------- */
const filterButtons = document.querySelectorAll('.filter-btn');
const grids = {
    all: document.getElementById('grid-all'),
    reels: document.getElementById('grid-reels'),
    videos: document.getElementById('grid-videos'),
    cinematics: document.getElementById('grid-cinematics'),
    ads: document.getElementById('grid-ads')
};

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        Object.entries(grids).forEach(([key, el]) => {
            el.style.display = (f === 'all' && key === 'all') || (f === key) ? 'grid' : 'none';
        });
    });
});

/* ---------- Modal ---------- */
const modal = document.getElementById('videoModal');
const frame = document.getElementById('videoFrame');
const overlay = document.getElementById('titleOverlay');

document.addEventListener('click', e => {
    const card = e.target.closest('.card');
    if (!card) return;

    const src = card.dataset.video;
    let finalSrc = src;

    if (src.includes('youtube.com')) {
        finalSrc =
            src +
            (src.includes('?') ? '&' : '?') +
            'autoplay=1' +
            '&controls=0' +
            '&modestbranding=1' +
            '&rel=0' +
            '&iv_load_policy=3' +
            '&vq=hd1080' +
            '&playsinline=1';
    }

    if (src.includes('vimeo.com')) {
        finalSrc =
            src +
            (src.includes('?') ? '&' : '?') +
            'autoplay=1' +
            '&muted=0' +
            '&quality=1080p';
    }

    frame.src = finalSrc;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    overlay.style.opacity = 1;
});


document.querySelector('.modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
});

function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    frame.src = '';
    overlay.style.opacity = 0; // hide overlay when video ends
}

/* ---------- Testimonials slider ---------- */
const slides = Array.from(document.querySelectorAll('.slide'));
let idx = 0;
const showSlide = i => {
    slides.forEach(s => s.classList.remove('active'));
    slides[i]?.classList.add('active');
};
document.querySelector('.next')?.addEventListener('click', () => {
    idx = (idx + 1) % slides.length;
    showSlide(idx);
});
document.querySelector('.prev')?.addEventListener('click', () => {
    idx = (idx - 1 + slides.length) % slides.length;
    showSlide(idx);
});
setInterval(() => {
    idx = (idx + 1) % slides.length;
    showSlide(idx);
}, 6000);

/* ---------- Contact form validation ---------- */
const form = document.getElementById('contactForm');
form?.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('.error').forEach(el => (el.textContent = ''));
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const budget = form.budget.value;
    const timeline = form.timeline.value;
    const message = form.message.value.trim();

    if (!name) { setError('name', 'Please enter your name'); valid = false; }
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setError('email', 'Please enter a valid email'); valid = false; }
    if (!budget) { setError('budget', 'Please select a budget'); valid = false; }
    if (!timeline) { setError('timeline', 'Please select a timeline'); valid = false; }
    if (message.length < 20) { setError('message', 'Please provide at least 20 characters'); valid = false; }

    if (valid) {
        alert('Thank you! Your inquiry has been received. I will contact you shortly.');
        form.reset();
    }
});

function setError(field, msg) {
    const group = document.getElementById(field).closest('.form-group');
    group.querySelector('.error').textContent = msg;
}

/* ---------- View More / Limit ---------- */
document.addEventListener("DOMContentLoaded", () => {
    const viewMoreBtn = document.getElementById("viewMoreBtn");
    let expanded = false;

    function applyLimit() {
        const grids = document.querySelectorAll(".grid");
        grids.forEach(grid => {
            const items = grid.querySelectorAll(".portfolio-item");
            items.forEach((item, index) => {
                if (!expanded && index >= 6) { item.style.display = "none"; }
                else { item.style.display = "block"; }
            });
        });
    }

    // Run AFTER videos load
    setTimeout(applyLimit, 300);

    viewMoreBtn.addEventListener("click", () => {
        expanded = !expanded;
        applyLimit();
        viewMoreBtn.textContent = expanded ? "Show less" : "View more projects";
    });
});

/* ---------- Page load animations ---------- */
window.addEventListener('load', () => {
    document.body.classList.add('page-shake');
    setTimeout(() => {
        document.body.classList.remove('page-shake');
    }, 800);
});

window.addEventListener('load', function() {
    setTimeout(function() {
        document.querySelector('.hero-media').classList.add('loaded');
    }, 100); // Delay to ensure the page fully loads before fading in
});







