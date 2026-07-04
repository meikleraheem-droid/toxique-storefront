/**
 * TOXIQUE // MAINLINE STOREFRONT CORE ENGINE
 * Shared Local Cache Target: 'toxique_production_catalog'
 */

// Global App State
let storefrontActiveFilter = 'all';
let virtualShoppingBag = [];

// DOM Element Listeners Initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeStorefrontCatalog();
    checkActiveBroadcastTelemetry();
    syncGlobalBagCount();
});

/**
 * 1. DYNAMIC CATALOG PRODUCTION GRID PIPELINE
 */
function initializeStorefrontCatalog() {
    const gridContainer = document.getElementById('storefrontGrid');
    if (!gridContainer) return;

    // Fetch live entries from your master admin desk catalog array
    let productionCatalog = localStorage.getItem('toxique_production_catalog') 
        ? JSON.parse(localStorage.getItem('toxique_production_catalog')) 
        : [];

    // Filter pipeline logic
    if (storefrontActiveFilter !== 'all') {
        productionCatalog = productionCatalog.filter(product => {
            const productDiv = (product.division || '').toLowerCase().trim();
            
            // Map the storefront nav buttons cleanly onto the entry allocations
            if (storefrontActiveFilter === 'garments') return productDiv === 'garments' || productDiv === 'collection one';
            if (storefrontActiveFilter === 'cosmetics') return productDiv === 'cosmetics' || productDiv === 'beauty' || productDiv === 'beauty labs';
            if (storefrontActiveFilter === 'fragrance') return productDiv === 'fragrance' || productDiv === 'perfume';
            if (storefrontActiveFilter === 'xxx') return productDiv === 'xxx' || productDiv === 'restricted xxx';
            return false;
        });
    }

    gridContainer.innerHTML = '';

    if (productionCatalog.length === 0) {
        gridContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 5rem 0; color: #645a72; font-size: 0.8rem; letter-spacing: 0.2em; text-transform: uppercase;">
                NO ASSETS FOUND IN THIS DEDICATED SHOWROOM CATEGORY.
            </div>`;
        return;
    }

    // Loop & build luxury layout presentation templates
    productionCatalog.forEach(product => {
        const basePrice = parseInt(product.price);
        const activePromo = evaluateCurrentPromotionalMarkdown();
        
        let displayPrice = basePrice;
        let originalPriceHtml = '';

        // Wire up automated markdown modifications dynamically onto the card if active
        if (activePromo.discountFactor > 0) {
            displayPrice = Math.floor(basePrice * (1 - activePromo.discountFactor));
            originalPriceHtml = `<span style="text-decoration: line-through; color: #645a72; margin-right: 0.75rem; font-size: 0.85rem;">$${basePrice.toLocaleString()}</span>`;
        }

        const formattedPrice = displayPrice.toLocaleString();
        const cardFrame = document.createElement('div');
        cardFrame.className = 'product-card';
        cardFrame.style.cssText = 'background: var(--bg-card, #0b0712); border: 1px solid rgba(195,164,99,0.15); padding: 1.25rem; position: relative; transition: all 0.4s ease; display: flex; flex-direction: column; justify-content: space-between;';

        cardFrame.innerHTML = `
            <div style="width: 100%; height: 400px; overflow: hidden; background: #000; position: relative;">
                <img src="${product.image}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease;" 
                     onerror="this.src='https://placehold.co/600x800/120c1e/fcfbfe?text=TOXIQUE+STYLE'">
            </div>
            <div style="padding-top: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; flex-grow: 1; justify-content: space-between;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;">
                    <div>
                        <h3 style="margin: 0; font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 400;">${product.title}</h3>
                        <span style="font-size: 0.65rem; color: #645a72; letter-spacing: 0.1em; text-transform: uppercase; display: block; margin-top: 0.25rem;">${product.division || 'COLLECTION ONE'}</span>
                    </div>
                    <div style="font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; color: #c3a463; white-space: nowrap;">
                        ${originalPriceHtml}$${formattedPrice}
                    </div>
                </div>
                <button onclick="injectItemToBag(${product.id})" style="background: transparent; border: 1px solid rgba(195,164,99,0.3); color: #fcfbfe; padding: 0.75rem; width: 100%; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; margin-top: 1rem; transition: background 0.3s;"
                        onmouseover="this.style.background='rgba(195,164,99,0.1)'" onmouseout="this.style.background='transparent'">
                    ADD TO SELECTIONS
                </button>
            </div>
        `;
        gridContainer.appendChild(cardFrame);
    });
}

// Nav filter action trigger handling
window.filterStorefrontCatalog = function(categoryToken) {
    storefrontActiveFilter = categoryToken;
    document.querySelectorAll('.nav-filter').forEach(btn => {
        if (btn.innerText.toLowerCase().includes(categoryToken) || (categoryToken === 'all' && btn.innerText.includes('ALL'))) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    initializeStorefrontCatalog();
};

/**
 * 2. AUTOMATED PROMOTIONAL CALCULATOR ENGINE
 */
function evaluateCurrentPromotionalMarkdown() {
    const today = new Date();
    const currentMonth = today.getMonth(); // 0 = Jan, 10 = Nov, 11 = Dec
    const currentDate = today.getDate();

    // Check Black Friday Markdown window (Nov 20 to Nov 30)
    if (currentMonth === 10 && currentDate >= 20 && currentDate <= 30) {
        return { label: "BLACK FRIDAY CAMPAIGN // 25% DEDUCTION APPLIED LIVE ON SITE", discountFactor: 0.25 };
    }
    // Check Christmas Markdown window (Month of December)
    else if (currentMonth === 11) {
        return { label: "CHRISTMAS WINTER ALLOCATION // 50% DEDUCTION APPLIED LIVE ON SITE", discountFactor: 0.50 };
    }
    // Check Happy Prince Day window (Jan 1 to Jan 14)
    else if (currentMonth === 0 && currentDate >= 1 && currentDate <= 14) {
        return { label: "HAPPY PRINCE DAY // SELECTION ALLOCATION ADJUSTMENTS EN ROUTE", discountFactor: 0.00 };
    }
    // Check New Year Promotional window (Jan 15 to Jan 31)
    else if (currentMonth === 0 && currentDate >= 15 && currentDate <= 31) {
        return { label: "NEW YEAR CELEBRATION // LUXURY APPRECIATION LIVE TIMELINE", discountFactor: 0.00 };
    }
    
    // FALLBACK STATE: Keeps the banner beautifully active on regular calendar dates
    return { label: "TOXIQUE // HAUTE COUTURE LUXURY ONLINE CATALOG // EMBRACE THE RITUAL", discountFactor: 0.00 };
}

// Automatically reveal banner broadcasts and inject active telemetry with force override
function checkActiveBroadcastTelemetry() {
    const banner = document.getElementById('dynamicPromoBanner');
    const textNode = document.getElementById('promoBannerText');
    if (!banner || !textNode) return;

    const promo = evaluateCurrentPromotionalMarkdown();
    if (promo.label) {
        textNode.innerText = promo.label;
        // Absolute visibility override: forces layout engine compliance by bypassing "display: none" inline states
        banner.style.setProperty('display', 'block', 'important');
    }
}

/**
 * 3. SHOPPING BAG / DRAWER TRANSLATION MANAGEMENT
 */
window.toggleCartDrawer = function() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('drawerOverlay');
    if (!drawer) return;
    
    drawer.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
    
    // Fallback mechanics if CSS sheet positioning overrides are active
    if (drawer.style.right === '0px') {
        drawer.style.right = '-450px';
        if (overlay) overlay.style.display = 'none';
    } else {
        drawer.style.right = '0px';
        if (overlay) overlay.style.display = 'block';
    }
    
    renderVirtualBagItems();
};

window.injectItemToBag = function(productId) {
    let productionCatalog = JSON.parse(localStorage.getItem('toxique_production_catalog')) || [];
    const targetProduct = productionCatalog.find(p => p.id === productId);
    
    if (targetProduct) {
        virtualShoppingBag.push(targetProduct);
        syncGlobalBagCount();
        alert(`SELECTION REGISTERED: Added "${targetProduct.title}" to bag.`);
    }
};

function syncGlobalBagCount() {
    const countNode = document.getElementById('cartCountGlobal');
    if (countNode) countNode.innerText = virtualShoppingBag.length;
}

function calculateBagTotals() {
    let unitSubtotal = 0;
    let promoDeduction = 0;
    const promo = evaluateCurrentPromotionalMarkdown();

    virtualShoppingBag.forEach(item => {
        const priceInt = parseInt(item.price);
        unitSubtotal += priceInt;
        if (promo.discountFactor > 0) {
            promoDeduction += Math.floor(priceInt * promo.discountFactor);
        }
    });

    const handlingFee = virtualShoppingBag.length > 0 ? 650 : 0;
    const grandTotal = (unitSubtotal - promoDeduction) + handlingFee;

    return { unitSubtotal, promoDeduction, handlingFee, grandTotal };
}

function renderVirtualBagItems() {
    const container = document.getElementById('drawerCartItems');
    const subtotalNode = document.getElementById('drawerSubtotalAmount');
    if (!container) return;

    container.innerHTML = '';
    
    if (virtualShoppingBag.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding: 4rem 1rem; color: #645a72; font-size: 0.75rem; letter-spacing: 0.1em;">SELECTIONS RECORD CONTAINER VACANT.</div>`;
        if (subtotalNode) subtotalNode.innerText = "$0";
        return;
    }

    virtualShoppingBag.forEach((item, index) => {
        const itemRow = document.createElement('div');
        itemRow.style.cssText = 'display: flex; gap: 1rem; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding: 1rem 0;';
        
        const itemPrice = parseInt(item.price);
        const promo = evaluateCurrentPromotionalMarkdown();
        const outputPrice = promo.discountFactor > 0 ? Math.floor(itemPrice * (1 - promo.discountFactor)) : itemPrice;

        itemRow.innerHTML = `
            <img src="${item.image}" style="width: 50px; height: 65px; object-fit: cover; border: 1px solid rgba(195,164,99,0.15);" onerror="this.src='https://placehold.co/40x50'">
            <div style="flex-grow: 1;">
                <h4 style="margin:0; font-size:0.75rem; letter-spacing:0.1em; text-transform:uppercase;">${item.title}</h4>
                <span style="font-size:0.7rem; color:#c3a463;">$${outputPrice.toLocaleString()}</span>
            </div>
            <button onclick="removeBagItemIndex(${index})" style="background:transparent; border:none; color:#ff4d4d; font-size:0.65rem; letter-spacing:0.1em; cursor:pointer; text-transform:uppercase;">REMOVE</button>
        `;
        container.appendChild(itemRow);
    });

    const totals = calculateBagTotals();
    if (subtotalNode) subtotalNode.innerText = `$${totals.grandTotal.toLocaleString()}`;
}

window.removeBagItemIndex = function(index) {
    virtualShoppingBag.splice(index, 1);
    syncGlobalBagCount();
    renderVirtualBagItems();
};

/**
 * 4. INVOICE OVERLAY MATRIX UTILITIES
 */
document.addEventListener('DOMContentLoaded', () => {
    const checkBtn = document.getElementById('checkoutBtn');
    if (checkBtn) checkBtn.addEventListener('click', compileAcquisitionInvoice);
});

function compileAcquisitionInvoice() {
    if (virtualShoppingBag.length === 0) {
        alert("Operation rejected. Shopping bag contents missing asset items.");
        return;
    }

    const modal = document.getElementById('invoiceModalOverlay');
    const manifest = document.getElementById('invoiceManifestItems');
    const dateNode = document.getElementById('invoiceDateStamp');
    if (!modal || !manifest) return;

    const now = new Date();
    if (dateNode) dateNode.innerText = `${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}/${now.getFullYear()}`;

    manifest.innerHTML = '';
    virtualShoppingBag.forEach(item => {
        const itemPrice = parseInt(item.price);
        const line = document.createElement('div');
        line.style.cssText = 'display:flex; justify-content:space-between; padding:0.5rem 0; font-size:0.8rem; border-bottom:1px dashed rgba(0,0,0,0.05); color:#111;';
        line.innerHTML = `<span>• ${item.title.toUpperCase()} [${item.division || 'STORE'}]</span> <span>$${itemPrice.toLocaleString()}</span>`;
        manifest.appendChild(line);
    });

    const totals = calculateBagTotals();
    
    document.getElementById('invoiceSubtotal').innerText = `$${totals.unitSubtotal.toLocaleString()}`;
    
    const promoRow = document.getElementById('invoiceDiscountRow');
    if (totals.promoDeduction > 0) {
        document.getElementById('invoiceDiscountAmount').innerText = `-$${totals.promoDeduction.toLocaleString()}`;
        promoRow.style.display = 'flex';
    } else {
        promoRow.style.display = 'none';
    }

    document.getElementById('invoiceShipping').innerText = `$${totals.handlingFee.toLocaleString()}`;
    document.getElementById('invoiceGrandTotal').innerText = `$${totals.grandTotal.toLocaleString()}`;

    modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:flex; align-items:center; justify-content:center; z-index:2000;';
}

window.closeInvoiceStage = function() {
    const modal = document.getElementById('invoiceModalOverlay');
    if (modal) modal.style.display = 'none';
};

window.executeFinalTransaction = function() {
    alert("TRANSACTION COMPLETED // Acquisition records successfully cataloged. Inventory allocation finalized.");
    virtualShoppingBag = [];
    syncGlobalBagCount();
    closeInvoiceStage();
    toggleCartDrawer();
};

/**
 * 5. TOXIQUE CUSTOMER ASSISTANCE MODAL ROUTERS
 */
window.toggleAssistancePanel = function() {
    const panel = document.getElementById('assistancePanel');
    if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
};

window.sendQuickInquiry = function(trackType) {
    alert(`TRANSMISSION INITIALIZED:\nRouting quick request tracking token for [${trackType.toUpperCase()}] straight into master operations terminal framework.`);
    toggleAssistancePanel();
};

window.sendCustomInquiry = function() {
    const field = document.getElementById('customClientMessage');
    const text = field ? field.value.trim() : '';
    if (!text) return;

    alert(`DIRECT TRANSMISSION FIRED:\n"${text}" sent to dashboard master console queue updates.`);
    if (field) field.value = '';
    toggleAssistancePanel();
};

/**
 * 6. ADMINISTRATIVE ASSET CREATION PIPELINE
 */
window.yourSaveProductFunction = function() {
    // Intercept with the file upload pipeline first
    handleLocalImageUploadPipeline((resolvedImageSrc) => {
        if (!resolvedImageSrc) {
            alert("Matrix rejected. An image asset link or local file selection is required.");
            return;
        }

        const newProduct = {
            id: Date.now(),
            title: document.getElementById('productTitleInput').value.trim(),
            price: document.getElementById('productPriceInput').value.trim(),
            division: document.getElementById('productDivisionSelect').value,
            image: resolvedImageSrc // Securely holds either the text URL or the fresh uploaded image data string!
        };

        // --- KEEP ALL YOUR REMAINING EXACT SAVING LOGIC HERE UNCHANGED ---
        let catalog = localStorage.getItem('toxique_production_catalog') ? JSON.parse(localStorage.getItem('toxique_production_catalog')) : [];
        catalog.push(newProduct);
        localStorage.setItem('toxique_production_catalog', JSON.stringify(catalog));

        alert("ASSET PROFILED SUCCESSFULLY // Synchronized directly to mainline storefront showroom grid.");
        
        // Clear the file input slot cleanly for the next design item
        if (document.getElementById('adminLocalImageInput')) {
            document.getElementById('adminLocalImageInput').value = '';
        }
        if (typeof renderAdminTable === 'function') renderAdminTable();
        // --- END OF YOUR REMAINING LOGIC ---
    });
};