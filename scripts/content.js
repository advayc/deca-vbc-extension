const bars = document.querySelectorAll("td[align=left]");

const inputContainer = document.createElement("div");
inputContainer.style.position = "absolute";
inputContainer.style.zIndex = "1000";
inputContainer.style.background = "white";
inputContainer.style.padding = "10px";
inputContainer.style.borderRadius = "5px";
inputContainer.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
inputContainer.style.transition = "all 0.3s ease";
inputContainer.style.display = "flex";
inputContainer.style.alignItems = "center";
inputContainer.style.gap = "10px";

const profitInput = createInput("number", "Total Profit", "120px");
const percentageInput = createInput("number", "%", "56px");
const rankInput = createInput("number", "Rank", "60px");

const submitButton = document.createElement("button");
submitButton.textContent = "Calculate";
submitButton.style.backgroundColor = "rgb(30, 120, 152)";
submitButton.style.color = "white";
submitButton.style.border = "none";
submitButton.style.padding = "5px 10px";
submitButton.style.cursor = "pointer";
submitButton.style.borderRadius = "3px";
submitButton.style.transition = "background-color 0.3s ease, transform 0.3s";
submitButton.style.transform = "scale(1)";

submitButton.addEventListener("mouseover", () => {
    submitButton.style.backgroundColor = "rgb(30, 120, 152)";
    submitButton.style.transform = "scale(1.05)";
});
submitButton.addEventListener("mouseout", () => {
    submitButton.style.backgroundColor = "rgb(30, 120, 152)";
    submitButton.style.transform = "scale(1)";
});

[profitInput, percentageInput, rankInput, submitButton].forEach(el => inputContainer.appendChild(el));

const referenceElement = document.querySelector('table');

if (referenceElement) {
    referenceElement.parentNode.insertBefore(inputContainer, referenceElement);
    
    inputContainer.style.position = "relative";
    inputContainer.style.marginTop = "-10px";
    inputContainer.style.marginBottom = "20px";
    inputContainer.style.marginLeft = "0px";
} else {
    document.body.appendChild(inputContainer);
}

submitButton.addEventListener("click", calculateProfits);

loadSavedValues();

function createInput(type, placeholder, width) {
    const input = document.createElement("input");
    input.type = type;
    input.placeholder = placeholder;
    input.style.width = width;
    input.style.padding = "5px";
    input.style.borderRadius = "3px";
    input.style.border = "1px solid #ccc";
    input.style.marginRight = "0";
    return input;
}

function formatMoney(amount) {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function numberToWords(num) {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? '-' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' hundred' + (num % 100 ? ' and ' + numberToWords(num % 100) : '');
    if (num < 1000000) return numberToWords(Math.floor(num / 1000)) + ' thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
    return numberToWords(Math.floor(num / 1000000)) + ' million' + (num % 1000000 ? ' ' + numberToWords(num % 1000000) : '');
}

function calculateProfits() {
    let givenProfit = parseFloat(profitInput.value);
    let givenPercentage = parseFloat(percentageInput.value);
    let teamRank = parseInt(rankInput.value);

    if (isNaN(givenProfit) || isNaN(givenPercentage) || isNaN(teamRank)) {
        const savedValues = getSavedValues();
        if (savedValues) {
            givenProfit = savedValues.profit;
            givenPercentage = savedValues.percentage;
            teamRank = savedValues.rank;
            profitInput.value = givenProfit;
            percentageInput.value = givenPercentage;
            rankInput.value = teamRank;
        } else {
            alert("Please enter valid values for all fields.");
            return;
        }
    }

    // Validate input values
    if (givenProfit <= 0 || givenPercentage <= 0 || givenPercentage > 100 || teamRank <= 0) {
        alert("Please enter valid values for profit, percentage, and rank.");
        return;
    }

    // save values to localStorage
    saveValues(givenProfit, givenPercentage, teamRank);

    alert(`Calculations based on:\nProfit: ${formatMoney(givenProfit)}\nPercentage: ${givenPercentage}%\nRank: ${teamRank}`);

    const firstBar = bars[0];
    const referenceWidth = firstBar.children[0].style.width;
    const referenceWidthNum = +referenceWidth.substring(0, referenceWidth.length - 2);

    bars.forEach((bar, index) => {
        const barElement = bar.children[0];
        bar.style.position = "relative";

        const width = barElement.style.width;
        const widthNum = +width.substring(0, width.length - 2);
        const barPercent = (widthNum / referenceWidthNum) * 100;

        const existingElements = bar.querySelectorAll(".percentage-profit");
        existingElements.forEach(el => el.remove());

        const infoContainer = document.createElement("span");
        infoContainer.className = "percentage-profit";
        infoContainer.style.position = "absolute";
        infoContainer.style.top = 0;
        infoContainer.style.right = "-14rem";
        infoContainer.style.whiteSpace = "nowrap";
        infoContainer.style.transition = "opacity 0.3s ease";
        infoContainer.style.fontFamily = "Arial, sans-serif";

        const profit = (givenProfit * barPercent) / givenPercentage;
        
        const profitElement = document.createElement("span");
        profitElement.innerText = ` | ${formatMoney(profit)}`;
        profitElement.style.marginLeft = "10px";
        profitElement.style.fontWeight = "bold";
        profitElement.style.color = "#0066cc";
        profitElement.style.cursor = "pointer";
        infoContainer.appendChild(profitElement);

        profitElement.addEventListener("click", () => {
            alert(`Profit: ${formatMoney(profit)}\n${numberToWords(Math.round(profit))} dollars`);
        });

        bar.appendChild(infoContainer);

        bar.addEventListener("mouseover", () => {
            infoContainer.style.opacity = "1";
        });
        bar.addEventListener("mouseout", () => {
            infoContainer.style.opacity = "0.7";
        });
    });
}

function displayPercentages() {
    const firstBar = bars[0];
    const referenceWidth = firstBar.children[0].style.width;
    const referenceWidthNum = +referenceWidth.substring(0, referenceWidth.length - 2);

    bars.forEach(bar => {
        const barElement = bar.children[0];
        const width = barElement.style.width;
        const widthNum = +width.substring(0, width.length - 2);
        const barPercent = (widthNum / referenceWidthNum) * 100;

        const percentElement = document.createElement("span");
        percentElement.innerText = `${barPercent.toFixed(2)}%`;
        percentElement.style.position = "absolute";
        percentElement.style.top = 0;
        percentElement.style.right = "-5rem";
        percentElement.style.transition = "opacity 0.3s ease";
        percentElement.style.fontFamily = "Arial, sans-serif";
        percentElement.style.color = "#444";

        bar.style.position = "relative";
        bar.appendChild(percentElement);

        bar.addEventListener("mouseover", () => {
            percentElement.style.opacity = "1";
        });
        bar.addEventListener("mouseout", () => {
            percentElement.style.opacity = "0.7";
        });
    });
}

function saveValues(profit, percentage, rank) {
    localStorage.setItem('calculatorValues', JSON.stringify({ profit, percentage, rank }));
}

function getSavedValues() {
    const savedValues = localStorage.getItem('calculatorValues');
    if (savedValues) {
        return JSON.parse(savedValues);
    } else {
        return null;
    }
}

function loadSavedValues() {
    const savedValues = getSavedValues();
    if (savedValues) {
        profitInput.value = savedValues.profit;
        percentageInput.value = savedValues.percentage;
        rankInput.value = savedValues.rank;
    }
}

displayPercentages();