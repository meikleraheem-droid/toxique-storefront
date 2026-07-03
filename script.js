/**
 * TOXIQUE // HOUSE OF X CORE STOREFRONT COMPILER
 * Renders raw catalog database arrays into premium editorial layout cards
 */
function renderStorefrontCatalog(products) {
    const catalogGrid = document.querySelector('.catalog-grid');
    if (!catalogGrid) return;

    // Clear placeholder content
    catalogGrid.innerHTML = '';

    if (products.length === 0) {
        catalogGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 6rem 0; font-family: 'Cormorant Garamond', serif; font-style: italic; color: var(--text-muted); font-size: 1.4rem; letter-spacing: 0.1em;">
                Division currently initializing. Sign up for allocation notifications.
            </div>
        `;
        return;
    }

    // Loop through assets and compile custom HTML nodes
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        // Enforce clean whole integers without currency symbol duplicates
        // Price displays natively as a raw premium figure (e.g., $18500)
        const formattedPrice = `$${product.price}`;

        productCard.innerHTML = `
            <div class="card-image-box">
                <span class="card-category-label">${product.division || 'COLLECTION ONE'}</span>
                <img src="${product.image}" alt="${product.title}" loading="lazy" />
            </div>
            <div class="card-details">
                <span class="card-brand-tag">${product.category}</span>
                <h3 class="card-title">${product.title.toUpperCase()}</h3>
                <span class="card-price">${formattedPrice}</span>
                <button class="add-to-bag-btn" onclick="handleAddToBag(${product.id})">
                    Add To Bag
                </button>
            </div>
        `;
        catalogGrid.appendChild(productCard);
    });
}

/**
 * MASTER DATA INITIALIZATION
 * Pulls local storage cache or falls back to standard framework catalog
 */
function initStorefront() {
    let localCatalog = localStorage.getItem('toxique_production_catalog');
    
    if (localCatalog) {
        const parsedProducts = JSON.parse(localCatalog);
        renderStorefrontCatalog(parsedProducts);
        initializeCategoryFilters(parsedProducts);
    } else {
        // Fallback to fetch raw local file if storage isn't initialized yet
        fetch('./catalog.json')
            .then(res => res.json())
            .then(data => {
                localStorage.setItem('toxique_production_catalog', JSON.stringify(data));
                renderStorefrontCatalog(data);
                initializeCategoryFilters(data);
            })
            .catch(err => {
                console.warn("Storage empty. Use /admin.html to compile your initial drop manifest.");
                renderStorefrontCatalog([]);
            });
    }
}

// Fire the compiler on structural DOM load
document.addEventListener('DOMContentLoaded', initStorefront);
// ==========================================
// TOXIQUE BROADCAST BANNER CONFIGURATION ENGINE
// ==========================================
function initExecutiveBanner() {
    const bannerContainer = document.getElementById('dynamicPromoBanner');
    const bannerTextElement = document.getElementById('promoBannerText');
    const bannerInput = document.getElementById('exec-banner-input');
    
    // Fetch banner layout option configuration or fall back to high-end default text
    const activeText = localStorage.getItem('toxique_banner_text') || "WELCOME TO THE TOXIQUE COLLECTIVE RITUAL";
    
    // If layout finds the storefront banner slot, render text and show the block
    if (bannerContainer && bannerTextElement) {
        bannerTextElement.innerText = activeText.toUpperCase();
        bannerContainer.style.display = "block";
    }
    
    // If layout finds the admin input container, pre-populate field
    if (bannerInput) {
        bannerInput.value = activeText;
    }
}

function publishExecutiveBanner() {
    const newText = document.getElementById('exec-banner-input').value;
    if (!newText) return;
    
    // Save string directly into localized web storage layer
    localStorage.setItem('toxique_banner_text', newText.toUpperCase());
    alert("Executive Broadcast Updated Successfully.");
    
    // Instant fallback check for multi-frame testing
    const bannerContainer = document.getElementById('dynamicPromoBanner');
    const bannerTextElement = document.getElementById('promoBannerText');
    if (bannerContainer && bannerTextElement) {
        bannerTextElement.innerText = newText.toUpperCase();
        bannerContainer.style.display = "block";
    }
}

// Add banner initializer into your existing DOMContentLoaded event hook if it exists, 
// or let this standalone window listener trigger it cleanly:
window.addEventListener('DOMContentLoaded', initExecutiveBanner);
// PATH 5 INTEGRATION: ROBUST LUXURY PALETTE SWITCH ENGINE
function updateLuxuryPalette(mode) {
    if(mode === 'alabaster') {
        document.body.classList.add('alabaster-theme');
        // Explicitly force Alabaster text and panel properties down the DOM chain
        document.documentElement.style.setProperty('--bg-base', '#f7f5fa');
        document.documentElement.style.setProperty('--bg-panel', '#ffffff');
        document.documentElement.style.setProperty('--bg-card', '#f0ecf5');
        document.documentElement.style.setProperty('--border-line', 'rgba(17, 17, 17, 0.15)');
        document.documentElement.style.setProperty('--text-main', '#111111');
        alert("THEME PARADIGM SHIFT: Alabaster Luxury Interface configuration active.");
    } else {
        document.body.classList.remove('alabaster-theme');
        // Hard-reset everything back to your signature TOXIQUE Dark Cyberpunk Aesthetic
        document.documentElement.style.setProperty('--bg-base', '#040206');
        document.documentElement.style.setProperty('--bg-panel', '#0b0712');
        document.documentElement.style.setProperty('--bg-card', '#120c1e');
        document.documentElement.style.setProperty('--border-line', 'rgba(195, 164, 99, 0.15)');
        document.documentElement.style.setProperty('--text-main', '#fcfbfe');
        alert("THEME PARADIGM SHIFT: Deep Onyx Core Matrix configuration active.");
    }
}

    }
}

// --- OPTION C: LIVE INTERFACE ROUTING ENGINE ---
function toggleAssistancePanel() {
    const panel = document.getElementById('assistancePanel');
    const btn = document.getElementById('widgetToggleBtn');
    if (panel.style.display === 'none' || !panel.style.display) {
        panel.style.display = 'block';
        btn.innerText = 'CLOSE';
    } else {
        panel.style.display = 'none';
        btn.innerText = 'ASSISTANCE';
    }
}

function getStoredMessages() {
    return JSON.parse(localStorage.getItem('toxique_desk_logs')) || [];
}

function initCommsDesk() {
    const logContainer = document.getElementById('adminMessageLog');
    if (!logContainer) return; // Only process if rendered inside administrative container
    
    const logs = getStoredMessages();
    if (logs.length === 0) {
        logContainer.innerHTML = `<div style="color: #999; font-style: italic;">Awaiting incoming secure customer inquiries...</div>`;
        return;
    }
    
    logContainer.innerHTML = logs.map(log => `
        <div style="margin-bottom: 0.8rem; padding-bottom: 0.5rem; border-bottom: 1px solid #f0f0f0;">
            <span style="color: #888; font-size: 0.7rem;">[${log.timestamp}]</span> 
            <strong style="color: #111;">INQUIRY:</strong> ${log.text}
        </div>
    `).join('');
    logContainer.scrollTop = logContainer.scrollHeight;
}

function transmitToDesk(messageText) {
    const logs = getStoredMessages();
    const timestamp = new Date().toLocaleTimeString();
    
    logs.push({ text: messageText, timestamp: timestamp });
    localStorage.setItem('toxique_desk_logs', JSON.stringify(logs));
    
    // Refresh view instantly if administrative console runs alongside local storage loop
    initCommsDesk();
}

function sendQuickInquiry(trackName) {
    transmitToDesk(`[TRACK INITIATED] Customer clicked option: ${trackName}`);
    alert("Inquiry successfully routed to Executive Desk.");
    toggleAssistancePanel();
}

function sendCustomInquiry() {
    const input = document.getElementById('customClientMessage');
    if (!input || !input.value.trim()) return;
    
    transmitToDesk(input.value.trim());
    input.value = '';
    alert("Message transmitted securely to Executive Desk.");
    toggleAssistancePanel();
}

function clearCommsLog() {
    if(confirm("Confirm total wipe of all historical desk communication records?")) {
        localStorage.removeItem('toxique_desk_logs');
        initCommsDesk();
    }
}

// Tie everything safely into the existing global router lifecycle hook
window.addEventListener('DOMContentLoaded', () => {
    initLuxuryPalette();
    initCommsDesk();
});