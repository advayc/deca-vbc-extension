const bars = document.querySelectorAll("td[align=left]");

const inputContainer = document.createElement("div");
inputContainer.style.position = "fixed";
inputContainer.style.top = "10px";
inputContainer.style.right = "10px";
inputContainer.style.zIndex = "1000";
inputContainer.style.background = "white";
inputContainer.style.padding = "10px";
inputContainer.style.borderRadius = "5px";
inputContainer.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
inputContainer.style.transition = "all 0.3s ease";

const profitInput = createInput("number", "Enter your team's profit");
const percentageInput = createInput("number", "Enter your team's percentage");
const rankInput = createInput("number", "Enter your team's rank");

const submitButton = document.createElement("button");
submitButton.textContent = "Calculate Profits";
submitButton.style.backgroundColor = "darkblue";
submitButton.style.color = "white";
submitButton.style.border = "none";
submitButton.style.padding = "5px 10px";
submitButton.style.cursor = "pointer";
submitButton.style.borderRadius = "3px";
submitButton.style.transition = "background-color 0.3s ease";

submitButton.addEventListener("mouseover", () => {
    submitButton.style.backgroundColor = "#000080";
});
submitButton.addEventListener("mouseout", () => {
    submitButton.style.backgroundColor = "darkblue";
});

[profitInput, percentageInput, rankInput, submitButton].forEach(el => inputContainer.appendChild(el));
document.body.appendChild(inputContainer);

submitButton.addEventListener("click", calculateProfits);

function createInput(type, placeholder) {
    const input = document.createElement("input");
    input.type = type;
    input.placeholder = placeholder;
    input.style.marginBottom = "5px";
    input.style.width = "100%";
    input.style.padding = "5px";
    input.style.borderRadius = "3px";
    input.style.border = "1px solid #ccc";
    return input;
}

function calculateProfits() {
    const teamProfit = parseFloat(profitInput.value);
    const teamPercentage = parseFloat(percentageInput.value);
    const teamRank = parseInt(rankInput.value);

    if (isNaN(teamProfit) || isNaN(teamPercentage) || isNaN(teamRank)) {
        alert("Please enter valid values for all fields.");
        return;
    }

    alert(`Calculations based on:\nProfit: $${teamProfit.toFixed(2)}\nPercentage: ${teamPercentage}%\nRank: ${teamRank}`);

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
        infoContainer.style.right = "-16rem";
        infoContainer.style.whiteSpace = "nowrap";
        infoContainer.style.transition = "opacity 0.3s ease";

        const percentElement = document.createElement("span");
        percentElement.innerText = `${barPercent.toFixed(2)}%`;
        infoContainer.appendChild(percentElement);

        const profit = (teamProfit * barPercent) / teamPercentage;
        const profitElement = document.createElement("span");
        profitElement.innerText = ` | $${profit.toFixed(2)}`;
        profitElement.style.marginLeft = "10px";
        profitElement.style.fontWeight = "bold";
        infoContainer.appendChild(profitElement);

        bar.appendChild(infoContainer);

        bar.addEventListener("mouseover", () => {
            infoContainer.style.opacity = "1";
        });
        bar.addEventListener("mouseout", () => {
            infoContainer.style.opacity = "0.7";
        });
    });
}

displayPercentages();

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