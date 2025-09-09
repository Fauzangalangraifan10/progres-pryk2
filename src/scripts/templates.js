// ==========================
// Header untuk user yang sudah login
// ==========================
export const LoggedInHeader = `
  <div class="main-header">
    <h1 class="brand-name">
      <a href="#/">
        <span class="logo-icon">📖</span> Story App
      </a>
    </h1>

    <!-- Hamburger button -->
    <button class="drawer-button" aria-label="Toggle Navigation">☰</button>

    <!-- Desktop Nav -->
    <nav class="desktop-nav" aria-label="Main Navigation">
      <ul>
        <li>
          <button id="subscribe-btn" class="nav-btn">
            <span id="subscribe-icon">🔔</span> 
            <span id="subscribe-text">Subscribe</span>
          </button>
        </li>
        <li>
          <a href="#/saved" class="nav-btn">
            Saved Stories <i class="fas fa-bookmark"></i>
          </a>
        </li>
        <li>
          <a href="#/add" class="nav-btn">
            Add Story <i class="fas fa-plus"></i>
          </a>
        </li>
        <li>
          <a href="#/logout" class="nav-btn logout-btn">
            Logout <i class="fas fa-sign-out-alt"></i>
          </a>
        </li>
      </ul>
    </nav>

    <!-- Navigation Drawer for Mobile -->
    <nav class="navigation-drawer">
      <ul class="nav-list">
        <li>
          <button id="subscribe-btn-mobile" class="nav-btn">
            <span id="subscribe-icon">🔔</span> 
            <span id="subscribe-text">Subscribe</span>
          </button>
        </li>
        <li>
          <a href="#/saved" class="nav-btn">
            Saved Stories <i class="fas fa-bookmark"></i>
          </a>
        </li>
        <li>
          <a href="#/add" class="nav-btn">
            Add Story <i class="fas fa-plus"></i>
          </a>
        </li>
        <li>
          <a href="#/logout" class="nav-btn logout-btn">
            Logout <i class="fas fa-sign-out-alt"></i>
          </a>
        </li>
      </ul>
    </nav>
  </div>
`;

// ==========================
// Header untuk user yang belum login
// ==========================
export const LoggedOutHeader = `
  <div class="main-header">
    <h1 class="brand-name">
      <a href="#/">
        <span class="logo-icon">📖</span> Story App
      </a>
    </h1>

    <!-- Hamburger button -->
    <button class="drawer-button" aria-label="Toggle Navigation">☰</button>

    <!-- Desktop Nav -->
    <nav class="desktop-nav" aria-label="Main Navigation">
      <ul>
        <li><a href="#/login" class="nav-btn">Login</a></li>
        <li><a href="#/register" class="nav-btn">Register</a></li>
      </ul>
    </nav>

    <!-- Navigation Drawer for Mobile -->
    <nav class="navigation-drawer">
      <ul class="nav-list">
        <li><a href="#/login" class="nav-btn">Login</a></li>
        <li><a href="#/register" class="nav-btn">Register</a></li>
      </ul>
    </nav>
  </div>
`;

// ==========================
// Template untuk 1 item story (Home & Bookmark)
// ==========================
export const StoryItemTemplate = (story) => `
  <div class="story-item">
    <div class="story-thumbnail">
      <img src="${story.photoUrl}" alt="Gambar ${story.name}" class="story-item__image" />
    </div>
    <div class="story-item__content">
      <h3 class="story-item__name">${story.name}</h3>
      <small class="story-date">📅 ${new Date(story.createdAt).toLocaleDateString()}</small>
      <p class="story-item__description">${story.description}</p>
      <div class="story-actions">
        <a href="#/detail/${story.id}" class="btn btn-primary read-more-btn">
          📖 Read More
        </a>
        <button class="btn btn-danger remove-btn" data-id="${story.id}">
          ❌ Remove
        </button>
      </div>
    </div>
  </div>
`;

// ==========================
// Template untuk detail story
// ==========================
export const StoryDetailTemplate = (story, isSaved = false) => `
  <div class="story-detail-card">
    <img src="${story.photoUrl}" alt="Gambar ${story.name}" class="story-detail-img"/>
    <h2 class="story-detail-title">${story.name}</h2>
    <small class="story-date">📅 ${new Date(story.createdAt).toLocaleDateString()}</small>
    <p class="story-detail-desc">${story.description}</p>
    
    <div class="story-actions">
      <button 
        class="btn btn-primary save-btn" 
        data-id="${story.id}">
        ${isSaved ? '💾 Unsave' : '💾 Save'}
      </button>
      <a href="#/" class="btn btn-secondary">← Back to Home</a>
    </div>
  </div>
`;

// ==========================
// Template 404 page
// ==========================
export const NotFoundTemplate = `
  <div class="not-found">
    <h2>404 - Page Not Found</h2>
    <p>Halaman yang kamu cari tidak ada.</p>
    <a href="#/" class="btn btn-primary">Kembali ke Home</a>
  </div>
`;

// ==========================
// Template loading
// ==========================
export const LoadingTemplate = `
  <div class="loading">
    <p>Loading...</p>
  </div>
`;
