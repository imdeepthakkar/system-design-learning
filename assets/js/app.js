// SystemDesign.dev - App Logic
(function() {
  'use strict';

  // ---- State ----
  const TOPICS = [
    'intro','ip','osi','tcp-udp','dns','load-balancing','clustering','caching',
    'cdn','proxy','availability','scalability','storage','databases','sql','nosql',
    'sql-vs-nosql','replication','indexes','normalization','acid-base','cap','pacelc',
    'transactions','distributed-transactions','sharding','consistent-hashing','federation',
    'n-tier','message-brokers','message-queues','pubsub','esb','microservices','eda',
    'event-sourcing','cqrs','api-gateway','rest-graphql-grpc','websockets','geohashing',
    'circuit-breaker','rate-limiting','service-discovery','sla','disaster-recovery',
    'containers','oauth','sso','tls','interviews','url-shortener','whatsapp','twitter',
    'netflix','uber',
    'gh-note-01', 'gh-note-02', 'gh-note-03', 'gh-note-04', 'gh-note-05', 'gh-note-06', 'gh-note-07', 'gh-note-08', 'gh-note-09', 'gh-note-10', 'gh-note-11', 'gh-note-12', 'gh-note-13', 'gh-note-14', 'gh-note-15', 'gh-note-16', 'gh-note-17', 'gh-note-18', 'gh-note-19', 'gh-note-20', 'gh-note-21', 'gh-note-22', 'gh-note-23', 'gh-note-24', 'gh-note-25', 'gh-note-26', 'gh-note-27', 'gh-note-28'
  ];
  const TOPIC_TITLES = {
    'intro':'What is System Design?','ip':'IP Addressing','osi':'OSI Model',
    'tcp-udp':'TCP and UDP','dns':'Domain Name System','load-balancing':'Load Balancing',
    'clustering':'Clustering','caching':'Caching','cdn':'Content Delivery Network',
    'proxy':'Proxy','availability':'Availability','scalability':'Scalability',
    'storage':'Storage','databases':'Databases & DBMS','sql':'SQL Databases',
    'nosql':'NoSQL Databases','sql-vs-nosql':'SQL vs NoSQL','replication':'DB Replication',
    'indexes':'Indexes','normalization':'Normalization & Denormalization',
    'acid-base':'ACID and BASE','cap':'CAP Theorem','pacelc':'PACELC Theorem',
    'transactions':'Transactions','distributed-transactions':'Distributed Transactions',
    'sharding':'Sharding','consistent-hashing':'Consistent Hashing',
    'federation':'Database Federation','n-tier':'N-Tier Architecture',
    'message-brokers':'Message Brokers','message-queues':'Message Queues',
    'pubsub':'Publish-Subscribe','esb':'Enterprise Service Bus',
    'microservices':'Monoliths & Microservices','eda':'Event-Driven Architecture',
    'event-sourcing':'Event Sourcing','cqrs':'CQRS','api-gateway':'API Gateway',
    'rest-graphql-grpc':'REST, GraphQL, gRPC','websockets':'WebSockets & SSE',
    'geohashing':'Geohashing & Quadtrees','circuit-breaker':'Circuit Breaker',
    'rate-limiting':'Rate Limiting','service-discovery':'Service Discovery',
    'sla':'SLA, SLO, SLI','disaster-recovery':'Disaster Recovery',
    'containers':'VMs & Containers','oauth':'OAuth 2.0 & OIDC',
    'sso':'Single Sign-On','tls':'SSL, TLS, mTLS',
    'interviews':'System Design Interviews','url-shortener':'Design: URL Shortener',
    'whatsapp':'Design: WhatsApp','twitter':'Design: Twitter',
    'netflix':'Design: Netflix','uber':'Design: Uber',
    'gh-note-01':'Scaling', 'gh-note-02':'Back Of the Envelope Estimation', 'gh-note-03':'System Design Framework', 'gh-note-04':'Rate Limiter', 'gh-note-05':'Consistent Hashing', 'gh-note-06':'Key-Value Store', 'gh-note-07':'Unique-Id Generator', 'gh-note-08':'URL Shortener', 'gh-note-09':'Web Crawler', 'gh-note-10':'Notification System', 'gh-note-11':'News Feed System', 'gh-note-12':'Chat System', 'gh-note-13':'Search Autocomplete', 'gh-note-14':'Youtube', 'gh-note-15':'Google Drive', 'gh-note-16':'Proximity Service', 'gh-note-17':'Nearby Friends', 'gh-note-18':'Google Maps', 'gh-note-19':'Distributed Message Queue', 'gh-note-20':'Metrics Monitoring and Alerting System', 'gh-note-21':'Ad Click Event Aggregation', 'gh-note-22':'Hotel Reservation System', 'gh-note-23':'Distributed Email Service', 'gh-note-24':'S3-like Object Storage', 'gh-note-25':'Real-time Gaming Leaderboard', 'gh-note-26':'Payment System', 'gh-note-27':' Digital Wallet', 'gh-note-28':'Stock Exchange'
  };

  let visited = new Set(JSON.parse(localStorage.getItem('sd_visited') || '[]'));
  let currentTopic = localStorage.getItem('sd_current') || 'intro';
  let darkMode = localStorage.getItem('sd_theme') === 'dark';

  // ---- DOM refs ----
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('overlay');
  const menuBtn   = document.getElementById('menuBtn');
  const sidebarClose = document.getElementById('sidebarClose');
  const topbarTitle  = document.getElementById('topbarTitle');
  const progressBar  = document.getElementById('progressBar');
  const progressLabel= document.getElementById('progressLabel');
  const themeToggle  = document.getElementById('themeToggle');
  const scrollTopBtn = document.getElementById('scrollTop');
  const topicSearch  = document.getElementById('topicSearch');
  const startBtn     = document.getElementById('startCourseBtn');
  const tocList      = document.getElementById('tocList');
  const markCompleteBtn = document.getElementById('markCompleteBtn');
  const resetProgressBtn = document.getElementById('resetProgressBtn');

  // ---- Navigation ----
  function showTopic(topicId) {
    if (!document.getElementById('topic-' + topicId)) return;
    // Hide all
    document.querySelectorAll('.topic-content').forEach(el => el.classList.remove('active'));
    // Show target
    document.getElementById('topic-' + topicId).classList.add('active');
    // Update nav active
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const navEl = document.getElementById('nav-' + topicId);
    if (navEl) {
      navEl.classList.add('active');
      navEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
    // Update topbar title
    topbarTitle.textContent = TOPIC_TITLES[topicId] || 'System Design';

    localStorage.setItem('sd_current', topicId);
    currentTopic = topicId;

    if (markCompleteBtn) {
      if (visited.has(topicId)) {
        markCompleteBtn.textContent = 'Completed ✓';
        markCompleteBtn.style.opacity = '0.6';
        markCompleteBtn.style.pointerEvents = 'none';
      } else {
        markCompleteBtn.textContent = 'Mark Complete';
        markCompleteBtn.style.opacity = '1';
        markCompleteBtn.style.pointerEvents = 'auto';
      }
    }
    // Update progress
    updateProgress();
    // Build TOC
    buildTOC(topicId);
    // Scroll to top
    const main = document.querySelector('.main-content');
    if (main) main.scrollTop = 0;
    window.scrollTo({ top: 0 });
    // Close sidebar on mobile
    if (window.innerWidth < 900) closeSidebar();
    // Update page title
    document.title = (TOPIC_TITLES[topicId] || 'System Design') + ' | SystemDesign.dev';
  }

  function updateProgress() {
    const pct = Math.round((visited.size / TOPICS.length) * 100);
    progressBar.style.width = pct + '%';
    progressLabel.textContent = pct + '%';
  }

  // ---- TOC Generation ----
  function buildTOC(topicId) {
    if (!tocList) return;
    const article = document.getElementById('topic-' + topicId);
    if (!article) { tocList.innerHTML = ''; return; }
    const headings = article.querySelectorAll('h2');
    if (headings.length === 0) { tocList.innerHTML = ''; return; }
    tocList.innerHTML = '';
    headings.forEach((h, i) => {
      const id = 'toc-h-' + i;
      h.id = id;
      const item = document.createElement('div');
      item.className = 'toc-item';
      item.textContent = h.textContent;
      item.addEventListener('click', () => {
        h.scrollIntoView({ behavior: 'smooth', block: 'start' });
        tocList.querySelectorAll('.toc-item').forEach(t => t.classList.remove('active'));
        item.classList.add('active');
      });
      tocList.appendChild(item);
    });
  }

  // ---- Event delegation for nav clicks ----
  document.querySelectorAll('.nav-item[data-topic]').forEach(el => {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      showTopic(this.dataset.topic);
    });
  });

  // ---- Data-goto buttons (chapter cards, topic-nav) ----
  document.addEventListener('click', function(e) {
    const target = e.target.closest('[data-goto]');
    if (target) {
      e.preventDefault();
      showTopic(target.dataset.goto);
    }
  });

  // ---- Start course button ----
  if (startBtn) {
    startBtn.addEventListener('click', () => showTopic('ip'));
  }

  // ---- Mark Complete button ----
  if (markCompleteBtn) {
    markCompleteBtn.addEventListener('click', () => {
      if (!visited.has(currentTopic)) {
        visited.add(currentTopic);
        localStorage.setItem('sd_visited', JSON.stringify([...visited]));
        updateProgress();
        
        markCompleteBtn.textContent = 'Completed ✓';
        markCompleteBtn.style.opacity = '0.6';
        markCompleteBtn.style.pointerEvents = 'none';
      }
    });
  }

  // ---- Reset Progress button ----
  if (resetProgressBtn) {
    resetProgressBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset your progress?')) {
        visited.clear();
        localStorage.removeItem('sd_visited');
        updateProgress();
        showTopic(currentTopic); // Refresh button state
      }
    });
  }

  // ---- Mobile sidebar ----
  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    menuBtn.setAttribute('aria-expanded', 'true');
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  menuBtn.addEventListener('click', openSidebar);
  sidebarClose.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);

  // ---- Theme toggle ----
  function applyTheme() {
    document.body.classList.toggle('light', !darkMode);
    themeToggle.querySelector('.theme-icon').textContent = darkMode ? '☀' : '🌙';
  }
  themeToggle.addEventListener('click', () => {
    darkMode = !darkMode;
    localStorage.setItem('sd_theme', darkMode ? 'dark' : 'light');
    applyTheme();
  });
  themeToggle.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') themeToggle.click(); });

  // ---- Scroll to top ----
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
  });
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ---- Search ----
  topicSearch.addEventListener('input', function() {
    const q = this.value.toLowerCase().trim();
    document.querySelectorAll('.nav-item[data-topic]').forEach(el => {
      const text = el.textContent.toLowerCase();
      el.classList.toggle('hidden', q && !text.includes(q));
    });
    // Show all section labels — hide if all items hidden
    document.querySelectorAll('.nav-section').forEach(section => {
      const items = section.querySelectorAll('.nav-item');
      const anyVisible = [...items].some(i => !i.classList.contains('hidden'));
      section.style.display = anyVisible || !q ? '' : 'none';
    });
  });

  // ---- Keyboard navigation ----
  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      const idx = TOPICS.indexOf(currentTopic);
      if (idx < TOPICS.length - 1) showTopic(TOPICS[idx + 1]);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      const idx = TOPICS.indexOf(currentTopic);
      if (idx > 0) showTopic(TOPICS[idx - 1]);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      topicSearch.focus();
    }
  });

  // ---- Init ----
  applyTheme();
  showTopic(currentTopic);
  updateProgress();

})();
