const loginButton = document.getElementById('btn1');
const loginInput = document.getElementById('loginName');
const loginScreen = document.querySelector('.login');
const appContainer = document.getElementById('app');

let transactions = loadTransactions();
let cashFlowChart = null;
let activeFilter = 'all';

const userNameDashboard = document.getElementById('dashBoardName');

loginButton.addEventListener('click', function() {
    const userName = loginInput.value.trim();
    if (userName === "") {
        return alert('Please enter your name to get started.');
    }
    loginScreen.style.display = 'none';
    appContainer.style.display = 'block';
    userNameDashboard.textContent = userName;
});

const navLogoutBtn = document.querySelector('#navLogoutBtn');

navLogoutBtn.addEventListener('click', () => {
    appContainer.style.display = 'none';
    loginScreen.style.display = 'flex';
    loginInput.value = "";
});

const modalOverlay = document.getElementById('modalOverlay');
const navAddBtn = document.getElementById('navAddBtn');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalCancelBtn = document.getElementById('modalCancelBtn');

navAddBtn.addEventListener('click', () => {
    modalOverlay.classList.add('show');
});

function closeModal() {
    modalOverlay.classList.remove('show');
    document.getElementById('modalError').classList.remove('show');
}

modalCancelBtn.addEventListener('click', closeModal);
modalCloseBtn.addEventListener('click', closeModal);

const typeIncomeBtn = document.getElementById('typeIncomeBtn');
const typeExpenseBtn = document.getElementById('typeExpenseBtn');

let activeTxType = 'income';

typeIncomeBtn.addEventListener('click', () => {
    activeTxType = 'income';
    typeExpenseBtn.classList.remove('active');
    typeIncomeBtn.classList.add('active');
});

typeExpenseBtn.addEventListener('click', () => {
    activeTxType = 'expense';
    typeIncomeBtn.classList.remove('active');
    typeExpenseBtn.classList.add('active');
});

const modalSaveBtn = document.getElementById('modalSaveBtn');
const txDescription = document.getElementById('txDescription');
const txAmount = document.getElementById('txAmount');
const txDate = document.getElementById('txDate');
const modalError = document.getElementById('modalError');

modalSaveBtn.addEventListener('click', function() {
    if (txDescription.value.trim() === '' || txAmount.value === '' || txDate.value === '') {
        modalError.classList.add('show');
        return;
    }
    modalError.classList.remove('show'); 
    
    const newTransaction = {
        id: Date.now(),
        description: txDescription.value.trim(),
        amount: parseFloat(txAmount.value), 
        date: txDate.value,
        category: document.getElementById('txCategory').value,
        type: activeTxType 
    };

    transactions.push(newTransaction);
    saveTransactions();
    masterRefresh();
    
    txDescription.value = '';
    txAmount.value = '';
    txDate.value = '';
    
    closeModal(); 
});

const txTable = document.getElementById('txTable');
const emptyState = document.getElementById('emptyState');
const txTableBody = document.getElementById('txTableBody');

function setFilter(filterType) {
    activeFilter = filterType;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === filterType) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    renderTable();
}

const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        const clickedFilterWord = button.dataset.filter;
        setFilter(clickedFilterWord);
    });
});

function getCurrencySymbol() {
    const settings = loadSettings();
    const symbols = { USD: '$', EUR: '€', GBP: '£', INR: '₹' };
    return symbols[settings.currency] || '$';
}

function renderTable() {
    let listToRender = transactions;
    if (activeFilter !== 'all') {
        listToRender = transactions.filter(tx => tx.type === activeFilter);
    }

    if (listToRender.length === 0) {
        emptyState.style.display = 'block';
        txTable.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    txTable.style.display = 'table';
    txTableBody.innerHTML = '';

    const sym = getCurrencySymbol();

    listToRender.forEach(transaction => {
        const formattedAmount = transaction.amount.toFixed(2);
        const amountColor = transaction.type === 'income' ? 'var(--green)' : 'var(--red)';
        const amountSign = transaction.type === 'income' ? '+' : '-';
        
        const rowHTML = `
            <tr>
                <td>${transaction.date}</td>
                <td><strong>${transaction.description}</strong></td>
                <td>${transaction.category}</td>
                <td style="color: ${amountColor}; font-weight: 700;">
                    ${amountSign}${sym}${formattedAmount}
                </td>
                <td>
                    <button class="btn-delete" data-id="${transaction.id}" style="background:none; border:none; cursor:pointer;">🗑️</button>
                </td>
            </tr>
        `;
        txTableBody.insertAdjacentHTML('beforeend', rowHTML);
    });
}

const cardBalance = document.getElementById('cardBalance');
const cardIncome = document.getElementById('cardIncome');
const cardExpense = document.getElementById('cardExpense');
const cardCount = document.getElementById('cardCount');

function updateSummaryCards() {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(function(transaction) {
        if (transaction.type === 'income') {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }
    });

    const balance = totalIncome - totalExpense;
    const sym = getCurrencySymbol();

    cardIncome.textContent = `${sym}${totalIncome.toFixed(2)}`;
    cardExpense.textContent = `${sym}${totalExpense.toFixed(2)}`;
    cardBalance.textContent = `${sym}${balance.toFixed(2)}`;
    cardCount.textContent = transactions.length; 
}

txTableBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-delete')) {
        const idToDelete = Number(e.target.getAttribute('data-id'));
        transactions = transactions.filter(transaction => transaction.id !== idToDelete);
        saveTransactions();
        masterRefresh();
    }
});

function loadTransactions() {
    const savedData = localStorage.getItem('finTrack_data');
    if (savedData) {
        return JSON.parse(savedData);
    }
    return [];
}

function saveTransactions() {
    localStorage.setItem('finTrack_data', JSON.stringify(transactions));
}

function masterRefresh() {
    renderTable();
    updateSummaryCards();
    renderChart();
}

function renderChart() {
    const canvas = document.getElementById('cashFlowChart');
    if (cashFlowChart !== null) {
        cashFlowChart.destroy();
    }

    const chartLabels = transactions.map(tx => tx.date); 
    const incomeData = transactions.map(tx => tx.type === 'income' ? tx.amount : 0);
    const expenseData = transactions.map(tx => tx.type === 'expense' ? tx.amount : 0);

    // Determine colors based on active theme
    const isDark = document.body.classList.contains('dark');
    const textColor = isDark ? '#A0A5B5' : '#6B7080';
    const gridColor = isDark ? '#2A2D3A' : '#E7E9F3';

    cashFlowChart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: chartLabels,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    backgroundColor: '#0E9F6E',
                    borderRadius: 4
                },
                {
                    label: 'Expense',
                    data: expenseData,
                    backgroundColor: '#E11D48',
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                },
                y: {
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                }
            },
            plugins: {
                legend: {
                    labels: { color: textColor }
                }
            }
        }
    });
}

function showPage(page) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));

    if (page === 'dashboard') {
        document.getElementById('dashboardPage').classList.add('active');
        document.getElementById('navDashboardBtn').classList.add('active');
    } else {
        document.getElementById('settingsPage').classList.add('active');
        document.getElementById('navSettingsBtn').classList.add('active');
    }
}

function loadSettings() {
    const saved = localStorage.getItem('finTrack_settings');
    return saved ? JSON.parse(saved) : { name: '', currency: 'USD', darkMode: false };
}

function saveSettings(settings) {
    localStorage.setItem('finTrack_settings', JSON.stringify(settings));
}

function applyDarkMode() {
    const settings = loadSettings();
    document.body.classList.toggle('dark', settings.darkMode);
    
    const switchBtn = document.getElementById('darkModeSwitch');
    if (switchBtn) {
        switchBtn.classList.toggle('on', settings.darkMode);
    }
    
    // Force the chart to redraw when theme changes
    if (document.getElementById('cashFlowChart')) {
        renderChart();
    }
}

applyDarkMode();

const navDashboardBtn = document.getElementById('navDashboardBtn');
const navSettingsBtn = document.getElementById('navSettingsBtn');

navDashboardBtn.addEventListener('click', function() {
    showPage('dashboard');
});

navSettingsBtn.addEventListener('click', function() {
    showPage('settings');
});

function populateSettingsUI() {
    const settings = loadSettings();
    document.getElementById('settingName').value = settings.name || '';
    document.getElementById('settingCurrency').value = settings.currency || 'USD';
    
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = settings.darkMode === true;
    }
}

const saveProfileBtn = document.getElementById('saveProfileBtn');
if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', function() {
        const settings = loadSettings();
        settings.name = document.getElementById('settingName').value.trim();
        settings.currency = document.getElementById('settingCurrency').value;
        saveSettings(settings);
        
        document.getElementById('dashBoardName').textContent = settings.name;
        masterRefresh();
        
        const originalText = this.textContent;
        this.textContent = 'Saved!';
        setTimeout(() => { this.textContent = originalText; }, 2000);
    });
}

const darkModeToggle = document.getElementById('darkModeToggle');
if (darkModeToggle) {
    darkModeToggle.addEventListener('change', function() {
        const settings = loadSettings();
        settings.darkMode = this.checked;
        saveSettings(settings);
        applyDarkMode();
    });
}

function resetData() {
    if (confirm("Are you sure you want to permanently delete all data? This cannot be undone.")) {
        localStorage.removeItem('finTrack_data');
        localStorage.removeItem('finTrack_settings');
        transactions = [];
        masterRefresh();
        populateSettingsUI();
        applyDarkMode();
        document.getElementById('dashBoardName').textContent = "";
    }
}

const resetBtn = document.getElementById('resetDataBtn');
if (resetBtn) {
    resetBtn.addEventListener('click', resetData);
}

populateSettingsUI();
masterRefresh();
