// Lookbook Mock Raw Data Configuration Block
const lookbookData = [
    {
        title: "01 // CRUSHED ASYMMETRIC JACKET",
        image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80",
        material: "100% Deconstructed Heavy Canvas",
        treatment: "Industrial Mineral Oil Wash Finish",
        hardware: "Oxidized Black Steel Structural Eyelets"
    },
    {
        title: "02 // OVERSIZED MATRIX REEFER CONSTRUCT",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
        material: "Ethically Sourced Heavyweight Calfskin Leather",
        treatment: "Matte Charcoal Abrasion Treatment",
        hardware: "Blind Hidden Magnetic Plate Snaps"
    },
    {
        title: "03 // THERMAL COMPRESSION SHROUD BODYSUIT",
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80",
        material: "High-Density Ribbed Neoprene Mesh Matrix",
        treatment: "Antistatic Reactive Laser Filament Seaming",
        hardware: "Rear Submergible Semi-Auto Lock Enclosure Zippers"
    }
];

// Fragrance Module Data Catalog
const fragranceData = {
    "cyber-musk": {
        title: "CYBER MUSK",
        notes: "Notes: Synthetic Iso-E Super, Crisp Ambergris, Crushed Iron Filings.",
        desc: "A cold, sharp signature that cuts through space. Engineered for high-density metropolitan movement."
    },
    "neon-saffron": {
        title: "NEON SAFFRON",
        notes: "Notes: Sharp Distilled Saffron, Black Leather Accord, Toasted Styrax.",
        desc: "An aggressive, radiant warmth mimicking artificial city light grids. Highly volatile and expressive."
    },
    "ozone-vamp": {
        title: "OZONE VAMP",
        notes: "Notes: Cold Lightning Static, Crushed Vetiver Root, Wet Concrete Silt.",
        desc: "Captured petrichor mixed with pure industrial voltage. Lingering, haunting, and deeply atmospheric."
    }
};

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Lookbook Rendering Engine ---
    const lookbookDisplay = document.getElementById('lookbook-display');
    const btnEditorial = document.getElementById('btn-editorial');
    const btnTechnical = document.getElementById('btn-technical');

    function renderLookbook() {
        if (!lookbookDisplay) return;
        lookbookDisplay.innerHTML = '';
        
        lookbookData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'lookbook-card';
            card.innerHTML = `
                <div class="visual-pane" style="background-image: url('${item.image}')">
                    <div class="tech-spec-overlay">
                        <h4>TECHNICAL SPECIFICATIONS //</h4>
                        <p><strong>FABRIC:</strong> ${item.material}</p>
                        <p><strong>TREATMENT:</strong> ${item.treatment}</p>
                        <p><strong>HARDWARE:</strong> ${item.hardware}</p>
                    </div>
                </div>
                <div class="card-title">${item.title}</div>
            `;
            lookbookDisplay.appendChild(card);
        });
    }

    if (btnEditorial && btnTechnical) {
        btnEditorial.addEventListener('click', () => {
            btnEditorial.classList.add('active');
            btnTechnical.classList.remove('active');
            lookbookDisplay.classList.remove('technical-mode');
            lookbookDisplay.classList.add('editorial-mode');
        });

        btnTechnical.addEventListener('click', () => {
            btnTechnical.classList.add('active');
            btnEditorial.classList.remove('active');
            lookbookDisplay.classList.remove('editorial-mode');
            lookbookDisplay.classList.add('technical-mode');
        });
    }

    // --- 2. Fragrance Selection Engine ---
    const fragNodes = document.querySelectorAll('.frag-node');
    const scentTitle = document.getElementById('scent-title');
    const scentNotes = document.getElementById('scent-notes');
    const scentDesc = document.getElementById('scent-desc');

    fragNodes.forEach(node => {
        node.addEventListener('click', () => {
            fragNodes.forEach(n => n.classList.remove('active'));
            node.classList.add('active');

            const scentKey = node.getAttribute('data-scent');
            const data = fragranceData[scentKey];

            if (data && scentTitle && scentNotes && scentDesc) {
                scentTitle.textContent = data.title;
                scentNotes.textContent = data.notes;
                scentDesc.textContent = data.desc;
            }
        });
    });

    // --- 3. VIP Intake Capture Engine ---
    const intakeForm = document.getElementById('toxique-intake-form');
    const feedbackMsg = document.getElementById('intake-feedback');

    if (intakeForm && feedbackMsg) {
        intakeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const clientEmail = document.getElementById('vip-email').value;
            
            feedbackMsg.style.color = "var(--neon-accent)";
            feedbackMsg.textContent = "TRANSMITTING ACCESS REQUEST...";

            setTimeout(() => {
                console.log(`SECURE SYSTEM NODE INJECTED: ${clientEmail}`);
                feedbackMsg.style.color = "#ffffff";
                feedbackMsg.textContent = "ENTRY GRANTED. WELCOME TO THE UNIVERSE.";
                intakeForm.reset();
            }, 1200);
        });
    }

    // Run lookbook generator initial execution
    renderLookbook();
});
// Preview of our future Multi-Vendor Architecture
const vendorProducts = [
    {
        vendorName: "TOXIQUE MAINLINE",
        title: "01 // ASYMMETRIC JACKET",
        price: "$420"
    },
    {
        vendorName: "GUEST DESIGNER // ARCHIVE X",
        title: "02 // MODULAR PARACHUTE PANTS",
        price: "$310"
    }
];
