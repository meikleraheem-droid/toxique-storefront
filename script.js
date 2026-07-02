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