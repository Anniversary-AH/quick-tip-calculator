// State management
let state = {
    bill: 0,
    tipPercent: 0,
    people: 1,
    dark: false,
    currency: 'AUD'
};

// DOM elements
const elements = {
    billAmount: document.getElementById('billAmount'),
    customTip: document.getElementById('customTip'),
    numPeople: document.getElementById('numPeople'),
    tipAmount: document.getElementById('tipAmount'),
    totalAmount: document.getElementById('totalAmount'),
    perPerson: document.getElementById('perPerson'),
    tipButtons: document.querySelectorAll('.tip-btn'),
    resetBtn: document.getElementById('resetBtn'),
    darkModeToggle: document.getElementById('darkModeToggle'),
    currencySelect: document.getElementById('currencySelect'),
    billError: document.getElementById('billError'),
    peopleError: document.getElementById('peopleError'),
    installPrompt: document.getElementById('installPrompt'),
    installBtn: document.getElementById('installBtn'),
    dismissInstall: document.getElementById('dismissInstall')
};

// Helper function to safely parse numbers
function toNumber(str) {
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-AU', { 
        style: 'currency', 
        currency: state.currency 
    }).format(amount);
}

// Load state from localStorage
function loadState() {
    const saved = localStorage.getItem('tipCalculatorState');
    if (saved) {
        const parsed = JSON.parse(saved);
        state = { ...state, ...parsed };
        
        // Apply saved values to inputs
        elements.billAmount.value = state.bill || '';
        elements.customTip.value = state.tipPercent || '';
        elements.numPeople.value = state.people || 1;
        elements.currencySelect.value = state.currency || 'AUD';
        
        // Apply dark mode
        if (state.dark) {
            document.documentElement.classList.add('dark');
        }
    }
}

// Save state to localStorage
function saveState() {
    localStorage.setItem('tipCalculatorState', JSON.stringify(state));
}

// Validate inputs
function validateInputs() {
    let isValid = true;
    
    // Validate bill amount
    if (state.bill <= 0) {
        elements.billError.textContent = 'Bill amount must be greater than 0';
        elements.billError.classList.remove('hidden');
        isValid = false;
    } else {
        elements.billError.classList.add('hidden');
    }
    
    // Validate number of people
    if (state.people < 1) {
        elements.peopleError.textContent = 'Must be at least 1 person';
        elements.peopleError.classList.remove('hidden');
        isValid = false;
    } else {
        elements.peopleError.classList.add('hidden');
    }
    
    return isValid;
}

// Update tip button states
function updateTipButtons() {
    elements.tipButtons.forEach(btn => {
        const btnTip = parseFloat(btn.dataset.tip);
        if (btnTip === state.tipPercent) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        } else {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        }
    });
}

// Calculate and display results
function calculate() {
    const isValid = validateInputs();
    
    if (!isValid) {
        elements.tipAmount.textContent = '$0.00';
        elements.totalAmount.textContent = '$0.00';
        elements.perPerson.textContent = '$0.00';
        return;
    }
    
    const tipAmount = state.bill * (state.tipPercent / 100);
    const total = state.bill + tipAmount;
    const perPerson = total / state.people;
    
    elements.tipAmount.textContent = formatCurrency(tipAmount);
    elements.totalAmount.textContent = formatCurrency(total);
    elements.perPerson.textContent = formatCurrency(perPerson);
}

// Reset calculator
function reset() {
    state = {
        bill: 0,
        tipPercent: 0,
        people: 1,
        dark: state.dark, // Preserve dark mode setting
        currency: state.currency // Preserve currency setting
    };
    
    elements.billAmount.value = '';
    elements.customTip.value = '';
    elements.numPeople.value = '1';
    elements.billError.classList.add('hidden');
    elements.peopleError.classList.add('hidden');
    
    updateTipButtons();
    calculate();
    saveState();
}

// Toggle dark mode
function toggleDarkMode() {
    state.dark = !state.dark;
    document.documentElement.classList.toggle('dark', state.dark);
    saveState();
}

// Event listeners
function setupEventListeners() {
    // Bill amount input
    elements.billAmount.addEventListener('input', (e) => {
        state.bill = toNumber(e.target.value);
        calculate();
        saveState();
    });
    
    // Custom tip input
    elements.customTip.addEventListener('input', (e) => {
        state.tipPercent = toNumber(e.target.value);
        updateTipButtons();
        calculate();
        saveState();
    });
    
    // Number of people input
    elements.numPeople.addEventListener('input', (e) => {
        state.people = toNumber(e.target.value);
        calculate();
        saveState();
    });
    
    // Tip buttons
    elements.tipButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            state.tipPercent = parseFloat(btn.dataset.tip);
            elements.customTip.value = '';
            updateTipButtons();
            calculate();
            saveState();
        });
    });
    
    // Reset button
    elements.resetBtn.addEventListener('click', reset);
    
    // Currency selector
    elements.currencySelect.addEventListener('change', (e) => {
        state.currency = e.target.value;
        calculate();
        saveState();
    });
    
    // Dark mode toggle
    elements.darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Install prompt buttons
    elements.installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
            elements.installPrompt.classList.add('hidden');
        }
    });
    
    elements.dismissInstall.addEventListener('click', () => {
        elements.installPrompt.classList.add('hidden');
    });
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            calculate();
        } else if (e.key === 'Escape') {
            reset();
        }
    });
}

// PWA Install functionality
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    elements.installPrompt.classList.remove('hidden');
});

// Initialize app
function init() {
    loadState();
    setupEventListeners();
    updateTipButtons();
    calculate();
    registerServiceWorker();
}

// Register service worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    }
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
