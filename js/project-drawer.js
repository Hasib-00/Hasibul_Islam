/* ══════════════════════════════════════
   PROJECT DETAIL DRAWER  (pd-*)
   Opens when a .dev-card is clicked.
   Fills with project-specific data.
   Closes on X, red dot, backdrop, Escape.
══════════════════════════════════════ */

/* ── Project data — Hasibul Islam CV ─ */
const PROJECTS = {
    socialchat: {
        num:      '01',
        title:    'SocialChat',
        cat:      'Android App',
        year:     '2024',
        type:     'Android',
        glow:     '#0095ff',
        overview: 'An Android social and messaging application built with Kotlin and XML. ' +
                  'Users can create posts, follow others, and chat in real time. ' +
                  'Firebase handles authentication, Firestore stores messages and posts, ' +
                  'and Firebase Storage manages media uploads. Room Database provides ' +
                  'local caching for reliable offline access. Structured with MVVM and Clean Architecture.',
        stack:    ['Kotlin', 'XML', 'MVVM', 'Firebase Auth', 'Firestore', 'Firebase Storage', 'Room DB', 'Clean Architecture', 'Retrofit', 'REST API', 'JSON'],
        features: [
            'Real-time messaging with Firestore live snapshots',
            'Firebase Authentication for secure user management',
            'Firebase Storage for efficient media (image/video) handling',
            'Room Database for structured local caching & offline access',
            'MVVM + Clean Architecture for scalable, maintainable code',
            'Retrofit & REST APIs for robust network communication',
        ],
        photos: [
            { url: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&q=80', caption: '// chat interface' },
            { url: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=800&q=80', caption: '// social feed' },
            { url: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&q=80', caption: '// user profiles' },
        ],
        filename: 'ChatViewModel.kt',
        lang:     'Kotlin',
        code: `@HiltViewModel
class ChatViewModel @Inject constructor(
  private val repo: ChatRepository
) : ViewModel() {

  val messages: StateFlow<List<Message>> =
    repo.getMessages()
      .stateIn(
        scope   = viewModelScope,
        started = SharingStarted
          .WhileSubscribed(5_000),
        initialValue = emptyList()
      )

  fun sendMessage(text: String) {
    viewModelScope.launch {
      repo.send(Message(text))
    }
  }
}`,
        stats: [
            { num: 'Real-time', label: 'Messaging' },
            { num: 'Offline', label: 'Room Cache' },
            { num: 'Firebase', label: 'Backend' },
        ],
    },

    weather: {
        num:      '02',
        title:    'WeatherNow',
        cat:      'Android App',
        year:     '2024',
        type:     'Android',
        glow:     '#00c8ff',
        overview: 'An Android weather app that fetches real-time data including temperature, ' +
                  'humidity, wind speed, and weather conditions via the OpenWeatherMap API. ' +
                  'Uses the device GPS to auto-detect the user\'s current location and display ' +
                  'relevant forecasts immediately. Retrofit handles all network requests with ' +
                  'Kotlin Coroutines for non-blocking performance, structured within MVVM architecture.',
        stack:    ['Kotlin', 'Retrofit', 'OpenWeatherMap API', 'GPS / Location', 'MVVM', 'Coroutines', 'JSON', 'Android Studio'],
        features: [
            'OpenWeatherMap API for real-time temperature, humidity & wind data',
            'GPS-powered automatic location detection',
            'Retrofit-based network layer with strong error handling',
            'MVVM architecture for clean separation of concerns',
            'Coroutines for non-blocking API calls',
            'Clean, minimal weather UI with condition icons',
        ],
        photos: [
            { url: 'https://images.unsplash.com/photo-1504608524841-42584120d693?w=800&q=80', caption: '// weather display' },
            { url: 'https://images.unsplash.com/photo-1561553873-e8491a564fd0?w=800&q=80', caption: '// forecast view' },
            { url: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&q=80', caption: '// location data' },
        ],
        filename: 'WeatherViewModel.kt',
        lang:     'Kotlin',
        code: `@HiltViewModel
class WeatherViewModel @Inject constructor(
  private val repo: WeatherRepository
) : ViewModel() {

  private val _weather =
    MutableStateFlow<WeatherState>(
      WeatherState.Loading
    )
  val weather = _weather.asStateFlow()

  fun fetchByLocation(
    lat: Double, lon: Double
  ) {
    viewModelScope.launch {
      try {
        val data = repo.getWeather(lat, lon)
        _weather.emit(WeatherState.Success(data))
      } catch (e: Exception) {
        _weather.emit(WeatherState.Error(e))
      }
    }
  }
}`,
        stats: [
            { num: 'GPS', label: 'Auto-locate' },
            { num: 'Real-time', label: 'Weather Data' },
            { num: 'OpenWeather', label: 'API' },
        ],
    },

    news: {
        num:      '03',
        title:    'NewsFlow',
        cat:      'Android App',
        year:     '2024',
        type:     'Android',
        glow:     '#f59e0b',
        overview: 'An Android news reader that fetches live articles from a REST API using Retrofit. ' +
                  'Users can filter by category or search by keyword to find relevant headlines quickly. ' +
                  'Each article opens in a detailed view showing the image, headline, source, timestamp, ' +
                  'and full description. Jetpack Paging 3 handles large article lists efficiently, ' +
                  'built with MVVM architecture and Kotlin Coroutines.',
        stack:    ['Kotlin', 'Retrofit', 'REST API', 'MVVM', 'RecyclerView', 'Pagination', 'Coroutines', 'Glide'],
        features: [
            'REST API integration via Retrofit for real-time news articles',
            'Category-based filtering by topic',
            'Advanced keyword search across headlines and descriptions',
            'Detailed article view with images, timestamps, and full text',
            'Pagination for smooth scrolling and optimised performance',
            'MVVM architecture with clean repository pattern',
        ],
        photos: [
            { url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80', caption: '// news feed' },
            { url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80', caption: '// article view' },
            { url: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80', caption: '// categories' },
        ],
        filename: 'NewsViewModel.kt',
        lang:     'Kotlin',
        code: `@HiltViewModel
class NewsViewModel @Inject constructor(
  private val repo: NewsRepository
) : ViewModel() {

  val newsPager = Pager(
    PagingConfig(pageSize = 20)
  ) {
    repo.newsPagingSource(
      category = _category.value,
      query    = _query.value
    )
  }.flow.cachedIn(viewModelScope)

  private val _category =
    MutableStateFlow("general")

  fun setCategory(cat: String) {
    _category.value = cat
  }
}`,
        stats: [
            { num: 'Paginated', label: 'Articles' },
            { num: 'Search', label: 'by Keyword' },
            { num: 'Categories', label: 'Filtering' },
        ],
    },

    locationshare: {
        num:      '04',
        title:    'LocShare',
        cat:      'Android App',
        year:     '2024',
        type:     'Android',
        glow:     '#818cf8',
        overview: 'A native Android app for real-time location sharing and live map visualisation. ' +
                  'Uses the Fused Location Provider API for continuous, battery-efficient background tracking. ' +
                  'Firebase Realtime Database syncs location updates instantly across devices. ' +
                  'Google Maps SDK renders live pins for all connected users. ' +
                  'Built with Kotlin, MVVM, Hilt dependency injection, and Coroutines/Flow.',
        stack:    ['Kotlin', 'MVVM', 'Hilt', 'Coroutines & Flow', 'Fused Location Provider API', 'Google Maps SDK', 'Firebase Realtime DB', 'Retrofit', 'Jetpack Components', 'Material Design'],
        features: [
            'Real-time location sharing with Google Maps SDK visualisation',
            'Continuous background tracking via Fused Location Provider',
            'Battery-optimised location updates with smart intervals',
            'Firebase Realtime DB / Socket for instant data sync',
            'MVVM + Hilt DI for clean, scalable architecture',
            'Polished Material Design UI following Android best practices',
        ],
        photos: [
            { url: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80', caption: '// live map view' },
            { url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', caption: '// location tracking' },
            { url: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69c6a0?w=800&q=80', caption: '// group sharing' },
        ],
        filename: 'LocationViewModel.kt',
        lang:     'Kotlin',
        code: `@HiltViewModel
class LocationViewModel @Inject constructor(
  private val locationRepo: LocationRepo,
  private val firebaseRepo: FirebaseRepo
) : ViewModel() {

  val liveLocations: StateFlow<List<UserLocation>> =
    firebaseRepo.observeLocations()
      .stateIn(viewModelScope,
        SharingStarted.Eagerly, emptyList())

  fun startTracking() {
    viewModelScope.launch {
      locationRepo.locationUpdates()
        .collect { loc ->
          firebaseRepo.updateMyLocation(loc)
        }
    }
  }
}`,
        stats: [
            { num: 'Real-time', label: 'Map Sync' },
            { num: 'Battery', label: 'Optimised' },
            { num: 'Google Maps', label: 'SDK' },
        ],
    },
};

/* ── Helpers ───────────────────────── */
function qs(id) { return document.getElementById(id); }

function buildLineNums(code) {
    const lines = code.split('\n').length;
    return Array.from({ length: lines }, (_, i) =>
        `<span>${i + 1}</span>`
    ).join('');
}

function syntaxHL(code) {
    return code
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g,
            '<span style="color:#98c379">$1</span>')
        .replace(/(@\w+)/g, '<span style="color:#e06c75">$1</span>')
        .replace(/\b(const|let|var|fun|val|class|import|export|return|default|new|this|if|else|when|is|in|by|private|public|suspend|override|data|object|interface|type|from|of|use|async|await|extends|implements|enum|for|while|do|try|catch|throw|launch|scope|true|false|null)\b/g,
            '<span style="color:#c678dd">$1</span>')
        .replace(/\b(\d[\d_]*)\b/g, '<span style="color:#d19a66">$1</span>')
        .replace(/\b([a-z][a-zA-Z0-9]*)(?=\s*\()/g, '<span style="color:#61afef">$1</span>')
        .replace(/(\/\/[^\n]*)/g, '<span style="color:#4d5566;font-style:italic">$1</span>')
        .replace(/\b([A-Z][a-zA-Z0-9]*)\b/g, '<span style="color:#e5c07b">$1</span>');
}

/* ── Lightbox ──────────────────────── */
let lightbox = null;

function createLightbox() {
    if (lightbox) return;
    lightbox = document.createElement('div');
    lightbox.className = 'pd-lightbox';
    lightbox.innerHTML = `
        <button class="pd-lightbox-close" id="lb-close">✕</button>
        <img id="lb-img" src="" alt="">
        <span class="pd-lightbox-caption" id="lb-caption"></span>
    `;
    document.body.appendChild(lightbox);

    lightbox.addEventListener('click', e => {
        if (e.target === lightbox || e.target.id === 'lb-close') closeLightbox();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && lightbox.classList.contains('lb-open')) closeLightbox();
    });
}

function openLightbox(url, caption) {
    createLightbox();
    const img = lightbox.querySelector('#lb-img');
    const cap = lightbox.querySelector('#lb-caption');
    img.src = url;
    cap.textContent = caption;
    lightbox.classList.add('lb-open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    if (lightbox) lightbox.classList.remove('lb-open');
    document.body.style.overflow = '';
}

/* ── Build gallery ─────────────────── */
function buildGallery(photos, glow) {
    const inner = qs('pd-gallery-inner');
    if (!inner) return;

    // Label
    const gallery = qs('pd-gallery');
    let label = gallery.querySelector('.pd-gallery-label');
    if (!label) {
        label = document.createElement('div');
        label.className = 'pd-gallery-label';
        label.textContent = '// screenshots';
        gallery.insertBefore(label, inner);
    }

    inner.innerHTML = '';

    photos.forEach((photo, i) => {
        const card = document.createElement('div');
        card.className = 'pd-photo-card';
        card.style.animationDelay = `${i * 0.1}s`;

        card.innerHTML = `
            <div class="pd-photo-shimmer"></div>
            <img src="${photo.url}" alt="${photo.caption}" loading="lazy">
            <span class="pd-photo-tag">${String(i + 1).padStart(2, '0')}</span>
            <div class="pd-photo-caption"><span>${photo.caption}</span></div>
        `;

        // Mark loaded & enable lightbox
        const img = card.querySelector('img');
        img.addEventListener('load', () => card.classList.add('loaded'));
        if (img.complete) card.classList.add('loaded');

        card.addEventListener('click', () => openLightbox(photo.url, photo.caption));
        inner.appendChild(card);
    });
}

/* ── Open / close ──────────────────── */
let isOpen = false;
const overlay = qs('pd-overlay');

function openDrawer(projectKey) {
    const p = PROJECTS[projectKey];
    if (!p || !overlay) return;

    qs('pd-tb-path').textContent    = `~/projects/${p.title.toLowerCase().replace(/\s/g,'-')}`;
    qs('pd-tb-badge').textContent   = p.type;
    qs('pd-tb-badge').style.borderColor = p.glow + '55';
    qs('pd-tb-badge').style.color       = p.glow;
    qs('pd-hero-num').textContent   = p.num;
    qs('pd-hero-title').textContent = p.title;
    qs('pd-hero-cat').textContent   = '// ' + p.cat;
    qs('pd-hero-year').textContent  = p.year;
    qs('pd-overview').textContent   = p.overview;
    qs('pd-code-filename').textContent = p.filename;
    qs('pd-code-lang').textContent     = p.lang;

    qs('pd-hero').style.background =
        `linear-gradient(135deg, #0f0f12 0%, ${p.glow}18 100%)`;

    // Gallery
    buildGallery(p.photos, p.glow);

    // Stack pills
    const stackEl = qs('pd-stack');
    stackEl.innerHTML = p.stack.map((s, i) =>
        `<span class="pd-stack-item" style="animation-delay:${i * 0.05}s">${s}</span>`
    ).join('');

    // Features
    const featEl = qs('pd-features');
    featEl.innerHTML = p.features.map((f, i) =>
        `<li style="animation-delay:${i * 0.07 + 0.1}s">${f}</li>`
    ).join('');

    // Code
    qs('pd-code-lines').innerHTML = buildLineNums(p.code);
    qs('pd-code-pre').innerHTML   = syntaxHL(p.code);

    // Stats
    const statsEl = qs('pd-stats');
    statsEl.innerHTML = p.stats.map((s, i) =>
        `<div class="pd-stat" style="animation-delay:${i * 0.1}s">
            <div class="pd-stat-num">${s.num}</div>
            <div class="pd-stat-label">${s.label}</div>
         </div>`
    ).join('');

    qs('pd-content').scrollTop = 0;
    overlay.classList.add('pd-open');
    document.body.style.overflow = 'hidden';
    isOpen = true;
}

function closeDrawer() {
    if (!overlay) return;
    overlay.classList.remove('pd-open');
    document.body.style.overflow = '';
    isOpen = false;
}

/* ── Init ──────────────────────────── */
export function initProjectDrawer() {
    if (!overlay) return;

    document.querySelectorAll('.dev-card[data-project]').forEach(card => {
        card.addEventListener('click', e => {
            e.stopPropagation();
            openDrawer(card.dataset.project);
        });
    });

    qs('pd-close')?.addEventListener('click', closeDrawer);
    qs('pd-close-btn')?.addEventListener('click', closeDrawer);
    qs('pd-backdrop')?.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && isOpen) closeDrawer();
    });
}
