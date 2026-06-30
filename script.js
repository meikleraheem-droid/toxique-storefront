/* ==========================================================================
   TOXIQUE // CORE OPERATION CORE MATRIX & MASTER DATABASE
   ========================================================================== */

// Global State Indicators
let TOXIQUE_CATALOG = JSON.parse(localStorage.getItem("toxique_live_catalog")) || [];
let PURCHASE_HISTORY = JSON.parse(localStorage.getItem("toxique_sales_ledger")) || [];
let COORDINATES_LOGS = JSON.parse(localStorage.getItem("toxique_coordinates")) || [];
let cart = JSON.parse(localStorage.getItem("toxique_user_cart")) || [];

let ACTIVE_DISCOUNT_PERCENT = 0;
let ACTIVE_CAMPAIGN_NAME = "";

// Unified Initialization Interface
document.addEventListener("DOMContentLoaded", () => {
    evaluateSystemCampaignTimeline();
    interceptStorefrontCheckoutAction();
    if (typeof renderCart === "function") renderCart();
});

/* ==========================================================================
   CAMPAIGNS & DYNAMIC BANNER ENGINE
   ========================================================================== */

/**
 * Evaluates real-time custom overrides and calendars to render ticker messages.
 */
function evaluateSystemCampaignTimeline() {
    const banner = document.getElementById("dynamicPromoBanner");
    const bannerText = document.getElementById("promoBannerText");
    if (!banner || !bannerText) return;

    // FIRST PRIORITY: Check for a back-office manual text input override
    const backOfficeOverrideText = localStorage.getItem("toxique_custom_banner_msg") || "";

    if (backOfficeOverrideText !== "") {
        ACTIVE_DISCOUNT_PERCENT = 0; // Custom custom alerts default back to standard base pricing
        ACTIVE_CAMPAIGN_NAME = "";
        bannerText.innerText = backOfficeOverrideText;
        banner.style.display = "block";
        return; // Break execution loop early since override is live
    }

    // SECOND PRIORITY: Run smart automated calendar configurations if control panel is empty
    const systemClock = new Date();
    const currentMonth = systemClock.getMonth(); 
    const currentDate = systemClock.getDate();

    // 1. Black Friday Verification Parameters (Nov 20 - Nov 30)
    if (currentMonth === 10 && currentDate >= 20 && currentDate <= 30) {
        ACTIVE_DISCOUNT_PERCENT = 0.25;
        ACTIVE_CAMPAIGN_NAME = "BLACK FRIDAY LAUNCH // 25% OFF APPLIED";
        bannerText.innerText = `✦ COMING LIVE // ${ACTIVE_CAMPAIGN_NAME} ✦`;
    } 
    // 2. Christmas Sale Parameters (Dec 1 - Dec 31)
    else if (currentMonth === 11) {
        ACTIVE_DISCOUNT_PERCENT = 0.50;
        ACTIVE_CAMPAIGN_NAME = "CHRISTMAS LUXURY SALE EVENT // 50% OFF APPLIED";
        bannerText.innerText = `✦ COMING LIVE // ${ACTIVE_CAMPAIGN_NAME} ✦`;
    } 
    // 3. New Year "Happy Prince Day" Sale Parameters (Jan 1 - Jan 14)
    else if (currentMonth === 0 && currentDate >= 1 && currentDate <= 14) {
        ACTIVE_DISCOUNT_PERCENT = 0.50; 
        ACTIVE_CAMPAIGN_NAME = "HAPPY PRINCE DAY CELEBRATION // BOGO INVOICE SPECIAL";
        bannerText.innerText = `✦ COMING LIVE // ${ACTIVE_CAMPAIGN_NAME} ✦`;
    }
    // 4. Permanent Baseline Brand Mode (Active all other days of the year)
    else {
        ACTIVE_DISCOUNT_PERCENT = 0;
        ACTIVE_CAMPAIGN_NAME = "";
        bannerText.innerText = "TOXIQUE MAINLINE ✦ HOUSE OF X // RESTRICTED XXX ✦ TOXIQUE BEAUTY LABS";
    }

    banner.style.display = "block";
}

/* ==========================================================================
   HIGH-FASHION CUSTOMER INVOICE PROCESSING ENGINE
   ========================================================================== */

function interceptStorefrontCheckoutAction() {
    const defaultCheckoutButton = document.getElementById("checkoutBtn") || document.querySelector(".checkout-button");
    if (!defaultCheckoutButton) return;

    defaultCheckoutButton.removeAttribute("onclick");
    defaultCheckoutButton.addEventListener("click", (e) => {
        e.preventDefault();
        compileStagedInvoiceData();
    });
}

function compileStagedInvoiceData() {
    let operationalCartArray = cart;

    if (operationalCartArray.length === 0) {
        alert("TRANSMISSION ERROR: YOUR SHOPPING BAG CONTAINS NO ASSETS TO COMPILE.");
        return;
    }

    const manifestContainer = document.getElementById("invoiceManifestItems");
    const dateStamp = document.getElementById("invoiceDateStamp");
    if (!manifestContainer || !dateStamp) return;
    
    dateStamp.innerText = new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });

    let baseSubtotal = 0;
    manifestContainer.innerHTML = "";

    operationalCartArray.forEach(item => {
        let priceValue = parseFloat(item.price || 0);
        baseSubtotal += priceValue;

        const lineRow = document.createElement("div");
        lineRow.className = "invoice-line-item";
        lineRow.innerHTML = `
            <span>${item.title} (x1)</span>
            <strong>$${priceValue.toFixed(2)}</strong>
        `;
        manifestContainer.appendChild(lineRow);
    });

    let campaignDeductionValue = baseSubtotal * ACTIVE_DISCOUNT_PERCENT;
    let baselineFlatShippingRate = 650; 
    let totalGrossInvoicePayload = (baseSubtotal - campaignDeductionValue) + baselineFlatShippingRate;

    document.getElementById("invoiceSubtotal").innerText = `$${baseSubtotal.toFixed(2)}`;
    
    const discountRow = document.getElementById("invoiceDiscountRow");
    if (ACTIVE_DISCOUNT_PERCENT > 0) {
        document.getElementById("invoiceDiscountLabel").innerText = `${ACTIVE_CAMPAIGN_NAME}:`;
        document.getElementById("invoiceDiscountAmount").innerText = `-$${campaignDeductionValue.toFixed(2)}`;
        discountRow.style.display = "flex";
    } else {
        discountRow.style.display = "none";
    }

    document.getElementById("invoiceShipping").innerText = `$${baselineFlatShippingRate}`;
    document.getElementById("invoiceGrandTotal").innerText = `$${totalGrossInvoicePayload.toFixed(2)}`;

    const modal = document.getElementById("invoiceModalOverlay");
    if (modal) {
        modal.style.removeProperty("display");
        modal.style.display = "flex";
    }
}

function closeInvoiceStage() {
    const modal = document.getElementById("invoiceModalOverlay");
    if (modal) modal.style.display = "none";
}

function executeFinalTransaction() {
    alert("TRANSMISSION SECURED: ACCESS PAYLOAD TRANSLATED. INVOICE COGNITION LOGGED INTO LEDGER SUITE SUCCESSFULLY.");
    closeInvoiceStage();
    
    if (typeof clearCart === "function") {
        clearCart();
    } else {
        localStorage.removeItem("toxique_user_cart");
        cart = [];
        if (typeof renderCart === "function") renderCart();
    }
}