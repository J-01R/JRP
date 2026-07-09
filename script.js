/* ==============================
   LIVE CLOCK
============================== */
function tick() {
  const d = new Date();
  const el = document.getElementById('clock');
  if (el) {
    el.textContent = d.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}
tick();
setInterval(tick, 1000);

/* ==============================
   SCROLL REVEAL
============================== */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ==============================
   PROJECTS DATA
   — To add a project, copy one object and fill in your details.
   — Tags must match exactly for filtering to work.
   — status: 'done' | 'wip' | 'upcoming'
   — link: optional URL, leave '' to hide the link button
============================== */
const PROJECTS = [
  {
    name: 'QERS',
    desc: 'Quantum Encryption Resilience Score — a framework for evaluating post-quantum cryptography readiness in Computer, IoT, and IIoT systems.',
    tags: ['Research', 'Quantum', 'IoT'],
    status: 'done',
    year: '2026',
    link: 'https://arxiv.org/abs/2601.13399'
  },
  {
    name: 'Master Thesis',
    desc: 'Integrating Quantum-Aware Security Testing into Embedded Cybersecurity Toolkits.',
    tags: ['Research', 'Embedded', 'Quantum'],
    status: 'done',
    year: '2026',
    link: ''
  },
  {
    name: 'IPv6 Infrastructure',
    desc: 'Deployment and configuration of Linux web services, networking infrastructure and IPv6 environments.',
    tags: ['Networking', 'Linux'],
    status: 'done',
    year: '2025',
    link: ''
  },
  {
    name: 'Dynamic Web Application',
    desc: 'Full-stack web application integrating APIs, databases and responsive design.',
    tags: ['Full-stack', 'Web'],
    status: 'done',
    year: '2024',
    link: ''
  },
  {
    name: 'Tetris',
    desc: 'C# and XAML project focusing on object-oriented programming and game design.',
    tags: ['C#', 'Game'],
    status: 'done',
    year: '2023',
    link: ''
  },
  {
    name: 'Nova Sential Pi HAT',
    desc: 'Raspberry Pi-based cybersecurity auditing and measurement platform for professional, educational, and research use.',
    tags: ['Hardware', 'Embedded', 'Offnova'],
    status: 'wip',
    year: '2026',
    link: ''
  },
  {
    name: 'ON App',
    desc: 'User-focused cybersecurity tool with link analysis, scam detection, and phishing protection.',
    tags: ['Mobile', 'Offnova', 'Security'],
    status: 'wip',
    year: '2026',
    link: ''
  },
  {
    name: 'Home SOC',
    desc: 'Personal Security Operations Centre — log aggregation, alerting, and threat detection at home lab scale.',
    tags: ['SOC', 'Infrastructure'],
    status: 'wip',
    year: '2026',
    link: ''
  },
  {
    name: 'Active Directory Lab',
    desc: 'Windows AD environment for practising identity attacks, privilege escalation, and defensive hardening.',
    tags: ['Windows', 'Lab'],
    status: 'upcoming',
    year: '2026',
    link: ''
  },
  {
    name: 'Wazuh SIEM',
    desc: 'Open-source SIEM deployment with custom rules, dashboards, and integrations.',
    tags: ['SOC', 'SIEM', 'Lab'],
    status: 'upcoming',
    year: '2026',
    link: ''
  },
  {
    name: 'IEC 62443 Lab',
    desc: 'Industrial cybersecurity lab environment based on the IEC 62443 standard for OT/ICS security.',
    tags: ['OT', 'Industrial', 'Lab'],
    status: 'upcoming',
    year: '2026',
    link: ''
  },
];

/* ==============================
   PROJECTS RENDERER
============================== */
const PAGE_SIZE = 10;
let currentPage = 1;
let activeTag = 'All';
let activeStatus = 'All';
let searchQuery = '';

function getAllTags() {
  const tags = new Set(['All']);
  PROJECTS.forEach(p => p.tags.forEach(t => tags.add(t)));
  return [...tags];
}

function getFiltered() {
  return PROJECTS.filter(p => {
    const matchTag    = activeTag === 'All' || p.tags.includes(activeTag);
    const matchStatus = activeStatus === 'All' || p.status === activeStatus;
    const matchSearch = searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery) ||
      p.desc.toLowerCase().includes(searchQuery) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery));
    return matchTag && matchStatus && matchSearch;
  });
}

function statusLabel(s) {
  return { done: 'Completed', wip: 'In Progress', upcoming: 'Upcoming' }[s] || s;
}

function renderProjects() {
  const filtered  = getFiltered();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = totalPages;

  const slice = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const list = document.getElementById('project-list');
  const counter = document.getElementById('project-counter');
  const pagination = document.getElementById('project-pagination');

  // Counter
  counter.textContent = `${filtered.length} project${filtered.length !== 1 ? 's' : ''}`;

  // Rows
  list.innerHTML = slice.map((p, i) => {
    const idx = String((currentPage - 1) * PAGE_SIZE + i + 1).padStart(2, '0');
    const tagHtml = p.tags.map(t =>
      `<span class="project-tag" style="cursor:pointer" data-tag="${t}">${t}</span>`
    ).join('');
    const linkHtml = p.link
      ? `<a class="pub-link" href="${p.link}" target="_blank" rel="noopener" style="font-size:11px;margin-top:4px;display:inline-block">Link &nearr;</a>`
      : '';
    return `
      <div class="project-row" style="opacity:0;transform:translateY(10px);transition:opacity .3s ${i * 0.04}s,transform .3s ${i * 0.04}s">
        <span class="project-idx">${idx}</span>
        <div class="project-info">
          <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;margin-bottom:0.35rem">
            <div class="project-name" style="margin:0">${p.name}</div>
            <span class="proj-status proj-status--${p.status}">${statusLabel(p.status)}</span>
            <span style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:#bbb">${p.year}</span>
          </div>
          <div class="project-desc">${p.desc}</div>
          ${linkHtml}
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.35rem">
          ${tagHtml}
        </div>
      </div>`;
  }).join('');

  // Animate in
  requestAnimationFrame(() => {
    list.querySelectorAll('.project-row').forEach(row => {
      row.style.opacity = '1';
      row.style.transform = 'none';
    });
  });

  // Tag click inside list
  list.querySelectorAll('[data-tag]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      activeTag = el.dataset.tag;
      currentPage = 1;
      updateTagButtons();
      renderProjects();
    });
  });

  // Pagination
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  let pages = '';
  for (let i = 1; i <= totalPages; i++) {
    pages += `<button class="page-btn${i === currentPage ? ' page-btn--active' : ''}" data-page="${i}">${i}</button>`;
  }
  pagination.innerHTML =
    `<button class="page-btn" id="prev-btn" ${currentPage === 1 ? 'disabled' : ''}>← Prev</button>` +
    pages +
    `<button class="page-btn" id="next-btn" ${currentPage === totalPages ? 'disabled' : ''}>Next →</button>`;

  pagination.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage = parseInt(btn.dataset.page);
      renderProjects();
      document.getElementById('projects').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; renderProjects(); }
  });
  document.getElementById('next-btn').addEventListener('click', () => {
    if (currentPage < totalPages) { currentPage++; renderProjects(); }
  });
}

function updateTagButtons() {
  document.querySelectorAll('.tag-filter-btn').forEach(btn => {
    btn.classList.toggle('tag-filter-btn--active', btn.dataset.tag === activeTag);
  });
}

function buildFilters() {
  // Tag buttons
  const tagWrap = document.getElementById('tag-filters');
  tagWrap.innerHTML = getAllTags().map(t =>
    `<button class="tag-filter-btn${t === activeTag ? ' tag-filter-btn--active' : ''}" data-tag="${t}">${t}</button>`
  ).join('');
  tagWrap.querySelectorAll('.tag-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTag = btn.dataset.tag;
      currentPage = 1;
      updateTagButtons();
      renderProjects();
    });
  });

  // Status buttons
  document.querySelectorAll('.status-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeStatus = btn.dataset.status;
      currentPage = 1;
      document.querySelectorAll('.status-filter-btn').forEach(b =>
        b.classList.toggle('status-filter-btn--active', b.dataset.status === activeStatus));
      renderProjects();
    });
  });

  // Search
  const search = document.getElementById('project-search');
  if (search) {
    search.addEventListener('input', () => {
      searchQuery = search.value.toLowerCase().trim();
      currentPage = 1;
      renderProjects();
    });
  }
}

// Boot
document.addEventListener('DOMContentLoaded', () => {
  buildFilters();
  renderProjects();
});
