// ==================== TAB SWITCHING ====================
function initTabs() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// ==================== UNIT CONVERTER CATEGORY SWITCHING ====================
let currentUnitCategory = 'length';

function initUnitCategories() {
    document.querySelectorAll('.unit-category').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.unit-category').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.unit-options').forEach(opt => opt.classList.remove('active'));
            button.classList.add('active');
            currentUnitCategory = button.getAttribute('data-category');
            document.getElementById(`unit-${currentUnitCategory}`).classList.add('active');
        });
    });
}

// ==================== SIMPLE CALCULATOR ====================
let simpleMemory = null;
let simpleHistory = [];

function simpleAppend(value) {
    const display = document.getElementById('simple-display');
    display.value += value;
}

function simpleClear() {
    document.getElementById('simple-display').value = '';
    document.getElementById('simple-output').value = '';
}

function simpleCalculate() {
    const display = document.getElementById('simple-display');
    const output = document.getElementById('simple-output');
    
    try {
        if (display.value === '') return;
        const sanitized = display.value.replace(/[^0-9+\-*/().]/g, '');
        if (sanitized !== display.value) {
            output.value = 'Invalid input';
            return;
        }
        const result = Function('"use strict"; return (' + sanitized + ')')();
        if (isNaN(result) || !isFinite(result)) {
            output.value = 'Error';
        } else {
            output.value = result;
            simpleHistory.unshift({
                expression: display.value,
                result: result,
                timestamp: new Date().toLocaleTimeString()
            });
            if (simpleHistory.length > 10) simpleHistory.pop();
            updateSimpleHistory();
        }
    } catch (e) {
        output.value = 'Error';
    }
}

function simpleMemoryStore() {
    const display = document.getElementById('simple-display');
    if (display.value !== '') {
        try {
            simpleMemory = Function('"use strict"; return (' + display.value + ')')();
        } catch (e) {
            simpleMemory = null;
        }
    }
}

function simpleMemoryRecall() {
    if (simpleMemory !== null) {
        document.getElementById('simple-display').value += simpleMemory;
    }
}

function simpleMemoryClear() {
    simpleMemory = null;
}

function updateSimpleHistory() {
    const historyList = document.getElementById('simple-history');
    historyList.innerHTML = '';
    simpleHistory.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `<span>${item.expression} = ${item.result}</span><span>${item.timestamp}</span>`;
        historyList.appendChild(div);
    });
}

// ==================== AGE CALCULATOR ====================
let ageHistory = [];

function calculateAge() {
    const dobInput = document.getElementById('age-dob');
    const resultDiv = document.getElementById('age-result');
    const resultDetails = document.getElementById('age-result-details');
    const birthdayDiv = document.getElementById('next-birthday');
    const countdownDiv = document.getElementById('birthday-countdown');
    
    if (!dobInput.value) {
        alert('Please enter your date of birth');
        return;
    }

    const dob = new Date(dobInput.value);
    const today = new Date();
    
    if (dob > today) {
        alert('Date of birth cannot be in the future');
        return;
    }

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();
    let hours = today.getHours() - dob.getHours();
    let minutes = today.getMinutes() - dob.getMinutes();
    let seconds = today.getSeconds() - dob.getSeconds();

    if (seconds < 0) { minutes--; seconds += 60; }
    if (minutes < 0) { hours--; minutes += 60; }
    if (hours < 0) { days--; hours += 24; }
    if (days < 0) {
        months--;
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) { years--; months += 12; }

    resultDetails.innerHTML = `
        <div class="age-item">
            <div class="age-item-label">Years</div>
            <div class="age-item-value">${years}</div>
        </div>
        <div class="age-item">
            <div class="age-item-label">Months</div>
            <div class="age-item-value">${months}</div>
        </div>
        <div class="age-item">
            <div class="age-item-label">Days</div>
            <div class="age-item-value">${days}</div>
        </div>
        <div class="age-item">
            <div class="age-item-label">Hours</div>
            <div class="age-item-value">${hours}</div>
        </div>
        <div class="age-item">
            <div class="age-item-label">Minutes</div>
            <div class="age-item-value">${minutes}</div>
        </div>
        <div class="age-item">
            <div class="age-item-label">Seconds</div>
            <div class="age-item-value">${seconds}</div>
        </div>
    `;
    resultDiv.style.display = 'block';

    const nextBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
    if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
    
    const diffTime = nextBirthday - today;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);

    countdownDiv.innerHTML = `
        <p>Your next birthday is in: <strong>${diffDays} days, ${diffHours} hours, ${diffMinutes} minutes, ${diffSeconds} seconds</strong></p>
        <p>Date: <strong>${nextBirthday.toDateString()}</strong></p>
    `;
    birthdayDiv.style.display = 'block';

    ageHistory.unshift({
        dob: dobInput.value,
        age: `${years} years, ${months} months, ${days} days`,
        timestamp: new Date().toLocaleTimeString()
    });
    if (ageHistory.length > 10) ageHistory.pop();
    updateAgeHistory();
}

function clearAge() {
    document.getElementById('age-dob').value = '';
    document.getElementById('age-result').style.display = 'none';
    document.getElementById('next-birthday').style.display = 'none';
}

function updateAgeHistory() {
    const historyList = document.getElementById('age-history');
    historyList.innerHTML = '';
    ageHistory.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `<span>${item.age}</span><span>${item.timestamp}</span>`;
        historyList.appendChild(div);
    });
}

// ==================== BMI CALCULATOR ====================
let bmiHistory = [];

function calculateBMI() {
    const weightInput = document.getElementById('bmi-weight');
    const heightInput = document.getElementById('bmi-height');
    const resultDiv = document.getElementById('bmi-result');
    const valueSpan = document.getElementById('bmi-value');
    const categorySpan = document.getElementById('bmi-category-text');
    const barFill = document.getElementById('bmi-bar-fill');
    const marker = document.getElementById('bmi-marker');
    
    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value) / 100;
    
    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        alert('Please enter valid weight and height');
        return;
    }

    const bmi = (weight / (height * height)).toFixed(2);
    valueSpan.textContent = bmi;

    let category = '';
    let color = '';
    let percentage = 0;

    if (bmi < 18.5) {
        category = 'Underweight';
        color = '#ffc107';
        percentage = (bmi / 18.5) * 25;
    } else if (bmi < 25) {
        category = 'Normal weight';
        color = '#28a745';
        percentage = 25 + ((bmi - 18.5) / 6.5) * 25;
    } else if (bmi < 30) {
        category = 'Overweight';
        color = '#ffc107';
        percentage = 50 + ((bmi - 25) / 5) * 25;
    } else {
        category = 'Obese';
        color = '#dc3545';
        percentage = 75 + ((bmi - 30) / 20) * 25;
    }

    categorySpan.innerHTML = `<strong style="color: ${color}">${category}</strong>`;
    barFill.style.width = percentage + '%';
    barFill.style.background = color;
    marker.style.left = percentage + '%';

    resultDiv.style.display = 'block';

    bmiHistory.unshift({
        weight: weight,
        height: height * 100,
        bmi: bmi,
        category: category,
        timestamp: new Date().toLocaleTimeString()
    });
    if (bmiHistory.length > 10) bmiHistory.pop();
    updateBMIHistory();
}

function clearBMI() {
    document.getElementById('bmi-weight').value = '';
    document.getElementById('bmi-height').value = '';
    document.getElementById('bmi-result').style.display = 'none';
    document.getElementById('bmi-bar-fill').style.width = '0%';
    document.getElementById('bmi-marker').style.left = '0%';
}

function updateBMIHistory() {
    const historyList = document.getElementById('bmi-history');
    historyList.innerHTML = '';
    bmiHistory.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `<span>BMI ${item.bmi} (${item.category})</span><span>${item.timestamp}</span>`;
        historyList.appendChild(div);
    });
}

// ==================== CURRENCY CONVERTER ====================
let currencyHistory = [];

const exchangeRates = {
    USD: { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 150, AUD: 1.50, CAD: 1.35, INR: 83, BDT: 110, PKR: 280, SGD: 1.35 },
    EUR: { USD: 1.09, EUR: 1, GBP: 0.86, JPY: 163, AUD: 1.63, CAD: 1.47, INR: 90, BDT: 120, PKR: 305, SGD: 1.47 },
    GBP: { USD: 1.27, EUR: 1.16, GBP: 1, JPY: 190, AUD: 1.90, CAD: 1.71, INR: 105, BDT: 140, PKR: 355, SGD: 1.71 },
    JPY: { USD: 0.0067, EUR: 0.0061, GBP: 0.0053, JPY: 1, AUD: 0.01, CAD: 0.009, INR: 0.55, BDT: 0.73, PKR: 1.87, SGD: 0.009 },
    AUD: { USD: 0.67, EUR: 0.61, GBP: 0.53, JPY: 100, AUD: 1, CAD: 0.90, INR: 55, BDT: 73, PKR: 187, SGD: 0.90 },
    CAD: { USD: 0.74, EUR: 0.68, GBP: 0.59, JPY: 111, AUD: 1.11, CAD: 1, INR: 61, BDT: 81, PKR: 208, SGD: 1.00 },
    INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.82, AUD: 0.018, CAD: 0.016, INR: 1, BDT: 1.33, PKR: 3.38, SGD: 0.016 },
    BDT: { USD: 0.0091, EUR: 0.0083, GBP: 0.0071, JPY: 1.37, AUD: 0.014, CAD: 0.012, INR: 0.75, BDT: 1, PKR: 2.54, SGD: 0.012 },
    PKR: { USD: 0.0036, EUR: 0.0033, GBP: 0.0028, JPY: 0.54, AUD: 0.0054, CAD: 0.0048, INR: 0.295, BDT: 0.394, PKR: 1, SGD: 0.0048 },
    SGD: { USD: 0.74, EUR: 0.68, GBP: 0.59, JPY: 111, AUD: 1.11, CAD: 1.00, INR: 61, BDT: 81, PKR: 208, SGD: 1 }
};

function convertCurrency() {
    const amountInput = document.getElementById('currency-amount');
    const fromSelect = document.getElementById('currency-from');
    const toSelect = document.getElementById('currency-to');
    const rateInput = document.getElementById('currency-rate');
    const resultDiv = document.getElementById('currency-result');
    const fromDisplay = document.getElementById('currency-from-display');
    const toDisplay = document.getElementById('currency-to-display');
    const rateInfo = document.getElementById('currency-rate-info');
    
    const amount = parseFloat(amountInput.value);
    const from = fromSelect.value;
    const to = toSelect.value;
    
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    let rate;
    if (rateInput.value && !isNaN(parseFloat(rateInput.value))) {
        rate = parseFloat(rateInput.value);
    } else {
        rate = exchangeRates[from] ? exchangeRates[from][to] : 1;
    }

    const result = (amount * rate).toFixed(4);
    fromDisplay.textContent = `${amount} ${from}`;
    toDisplay.textContent = `${result} ${to}`;
    rateInfo.textContent = `1 ${from} = ${rate.toFixed(6)} ${to}`;
    resultDiv.style.display = 'block';

    currencyHistory.unshift({
        amount: amount,
        from: from,
        to: to,
        result: result,
        rate: rate,
        timestamp: new Date().toLocaleTimeString()
    });
    if (currencyHistory.length > 10) currencyHistory.pop();
    updateCurrencyHistory();
}

function swapCurrency() {
    const fromSelect = document.getElementById('currency-from');
    const toSelect = document.getElementById('currency-to');
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
}

function clearCurrency() {
    document.getElementById('currency-amount').value = '1';
    document.getElementById('currency-rate').value = '';
    document.getElementById('currency-result').style.display = 'none';
}

function updateCurrencyHistory() {
    const historyList = document.getElementById('currency-history');
    historyList.innerHTML = '';
    currencyHistory.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `<span>${item.amount} ${item.from} -> ${item.result} ${item.to}</span><span>${item.timestamp}</span>`;
        historyList.appendChild(div);
    });
}

// ==================== LOAN CALCULATOR ====================
let loanHistory = [];

function calculateLoan() {
    const amountInput = document.getElementById('loan-amount');
    const rateInput = document.getElementById('loan-rate');
    const termInput = document.getElementById('loan-term');
    const resultDiv = document.getElementById('loan-result');
    const resultsDiv = document.getElementById('loan-results');
    
    const principal = parseFloat(amountInput.value);
    const annualRate = parseFloat(rateInput.value);
    const years = parseFloat(termInput.value);
    
    if (isNaN(principal) || isNaN(annualRate) || isNaN(years) || principal <= 0 || annualRate < 0 || years <= 0) {
        alert('Please enter valid values');
        return;
    }

    const monthlyRate = annualRate / 100 / 12;
    const totalPayments = years * 12;
    const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
    const totalPayment = monthlyPayment * totalPayments;
    const totalInterest = totalPayment - principal;

    resultsDiv.innerHTML = `
        <div class="loan-result-item">
            <span class="loan-result-label">Monthly Payment:</span>
            <span class="loan-result-value">$${monthlyPayment.toFixed(2)}</span>
        </div>
        <div class="loan-result-item">
            <span class="loan-result-label">Total Payment:</span>
            <span class="loan-result-value">$${totalPayment.toFixed(2)}</span>
        </div>
        <div class="loan-result-item">
            <span class="loan-result-label">Total Interest:</span>
            <span class="loan-result-value">$${totalInterest.toFixed(2)}</span>
        </div>
        <div class="loan-result-item">
            <span class="loan-result-label">Number of Payments:</span>
            <span class="loan-result-value">${totalPayments.toFixed(0)}</span>
        </div>
    `;
    resultDiv.style.display = 'block';

    loanHistory.unshift({
        principal: principal,
        rate: annualRate,
        term: years,
        monthlyPayment: monthlyPayment,
        totalPayment: totalPayment,
        timestamp: new Date().toLocaleTimeString()
    });
    if (loanHistory.length > 10) loanHistory.pop();
    updateLoanHistory();
}

function clearLoan() {
    document.getElementById('loan-amount').value = '';
    document.getElementById('loan-rate').value = '';
    document.getElementById('loan-term').value = '';
    document.getElementById('loan-result').style.display = 'none';
}

function updateLoanHistory() {
    const historyList = document.getElementById('loan-history');
    historyList.innerHTML = '';
    loanHistory.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `<span>$${item.principal.toFixed(2)} at ${item.rate}% for ${item.term} years</span><span>${item.timestamp}</span>`;
        historyList.appendChild(div);
    });
}

// ==================== UNIT CONVERTER ====================
let unitHistory = [];

const unitConversions = {
    length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.34 },
    weight: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495, ton: 1000 },
    temperature: {
        c: { f: (c) => c * 9/5 + 32, k: (c) => c + 273.15 },
        f: { c: (f) => (f - 32) * 5/9, k: (f) => (f - 32) * 5/9 + 273.15 },
        k: { c: (k) => k - 273.15, f: (k) => (k - 273.15) * 9/5 + 32 }
    },
    area: { m2: 1, km2: 1000000, cm2: 0.0001, ft2: 0.092903, in2: 0.00064516, ac: 4046.86, ha: 10000 },
    volume: { l: 1, ml: 0.001, m3: 1000, gal: 3.78541, qt: 0.946353, pt: 0.473176 },
    speed: { mps: 1, kph: 0.277778, mph: 0.44704, fps: 0.3048, knot: 0.514444 }
};

function getUnitSymbol(category, unit) {
    const symbols = {
        length: { m: 'm', km: 'km', cm: 'cm', mm: 'mm', in: 'in', ft: 'ft', yd: 'yd', mi: 'mi' },
        weight: { kg: 'kg', g: 'g', mg: 'mg', lb: 'lb', oz: 'oz', ton: 'ton' },
        temperature: { c: 'C', f: 'F', k: 'K' },
        area: { m2: 'm2', km2: 'km2', cm2: 'cm2', ft2: 'ft2', in2: 'in2', ac: 'ac', ha: 'ha' },
        volume: { l: 'L', ml: 'mL', m3: 'm3', gal: 'gal', qt: 'qt', pt: 'pt' },
        speed: { mps: 'm/s', kph: 'km/h', mph: 'mph', fps: 'ft/s', knot: 'kn' }
    };
    return symbols[category] ? symbols[category][unit] : unit;
}

function convertUnit() {
    const category = currentUnitCategory;
    const valueInput = document.getElementById(`unit-value-${category}`);
    const fromSelect = document.getElementById(`unit-from-${category}`);
    const toSelect = document.getElementById(`unit-to-${category}`);
    const resultDiv = document.getElementById('unit-result');
    const fromDisplay = document.getElementById('unit-from-display');
    const toDisplay = document.getElementById('unit-to-display');
    
    const value = parseFloat(valueInput.value);
    const from = fromSelect.value;
    const to = toSelect.value;
    
    if (isNaN(value)) {
        alert('Please enter a valid value');
        return;
    }

    let result;
    if (category === 'temperature') {
        const conversions = unitConversions.temperature;
        result = conversions[from][to](value);
    } else {
        const factors = unitConversions[category];
        const fromFactor = factors[from];
        const toFactor = factors[to];
        result = (value * fromFactor) / toFactor;
    }

    fromDisplay.textContent = `${value} ${getUnitSymbol(category, from)}`;
    toDisplay.textContent = `${result.toFixed(6)} ${getUnitSymbol(category, to)}`;
    resultDiv.style.display = 'block';

    unitHistory.unshift({
        value: value,
        from: from,
        to: to,
        result: result,
        category: category,
        timestamp: new Date().toLocaleTimeString()
    });
    if (unitHistory.length > 10) unitHistory.pop();
    updateUnitHistory();
}

function swapUnit() {
    const category = currentUnitCategory;
    const fromSelect = document.getElementById(`unit-from-${category}`);
    const toSelect = document.getElementById(`unit-to-${category}`);
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    convertUnit();
}

function clearUnit() {
    const category = currentUnitCategory;
    const valueInput = document.getElementById(`unit-value-${category}`);
    valueInput.value = '';
    document.getElementById('unit-result').style.display = 'none';
}

function updateUnitHistory() {
    const historyList = document.getElementById('unit-history');
    historyList.innerHTML = '';
    unitHistory.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `<span>${item.value} ${getUnitSymbol(item.category, item.from)} -> ${item.result.toFixed(3)} ${getUnitSymbol(item.category, item.to)}</span><span>${item.timestamp}</span>`;
        historyList.appendChild(div);
    });
}

// ==================== KEYBOARD SUPPORT ====================
document.addEventListener('keydown', (e) => {
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab && activeTab.id === 'simple-calc') {
        const display = document.getElementById('simple-display');
        if (e.key >= '0' && e.key <= '9') {
            display.value += e.key;
        } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/' || e.key === '.' || e.key === '(' || e.key === ')') {
            display.value += e.key;
        } else if (e.key === 'Enter' || e.key === '=') {
            simpleCalculate();
        } else if (e.key === 'Escape') {
            simpleClear();
        } else if (e.key === 'Backspace') {
            display.value = display.value.slice(0, -1);
        }
    }
});

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initUnitCategories();
    document.getElementById('age-dob').max = new Date().toISOString().split('T')[0];
});
