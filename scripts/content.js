const bars = document.querySelectorAll("td[align=left]");

const firstBar = bars[0];
const referenceWidth = firstBar.children[0].style.width;
const referenceWidthNum = +referenceWidth.substring(0, referenceWidth.length - 2);

const inputButton = document.createElement("button");
inputButton.innerText = "Enter My Total Profit";
inputButton.className = "profit-button";
document.body.appendChild(inputButton);

inputButton.style.position = "fixed";
inputButton.style.top = "20px";
inputButton.style.right = "20px";
inputButton.style.padding = "10px 20px";
inputButton.style.background = "#4CAF50";
inputButton.style.color = "#fff";
inputButton.style.border = "none";
inputButton.style.borderRadius = "5px";
inputButton.style.cursor = "pointer";
inputButton.style.transition = "transform 0.3s, background-color 0.3s";

inputButton.onmouseenter = () => {
  inputButton.style.transform = "scale(1.05)";
};

inputButton.onmouseleave = () => {
  inputButton.style.transform = "scale(1)";
};

// the popup
const createPopup = (profit) => {
  const popup = document.createElement("div");
  popup.className = "profit-popup";
  popup.innerHTML = `
    <div class="popup-content">
      <span class="close-btn">&times;</span>
      <h2>Total Profit</h2>
      <p>Profit: ${profit}</p>
    </div>
  `;
  document.body.appendChild(popup);

  const closeButton = popup.querySelector(".close-btn");
  closeButton.onclick = () => {
    popup.style.display = "none";
  };

  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.background = "#fff";
  popup.style.padding = "20px";
  popup.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
  popup.style.borderRadius = "8px";
  popup.style.zIndex = "1000";
  popup.style.transition = "all 0.3s";

  const popupContent = popup.querySelector(".popup-content");
  popupContent.style.display = "flex";
  popupContent.style.flexDirection = "column";
  popupContent.style.alignItems = "center";
};

bars.forEach((bar) => {
  const barElement = bar.children[0];
  bar.style.position = "relative";
  
  const width = barElement.style.width;
  const widthNum = +width.substring(0, width.length - 2);
  const barPercent = widthNum / referenceWidthNum * 100;
  const barPercentStr = `${Math.round(barPercent)}%`;

  const percentElement = document.createElement("span");
  percentElement.innerText = barPercentStr;
  percentElement.style.position = "absolute";
  percentElement.style.top = 0;
  percentElement.style.right = "-2rem";
  bar.appendChild(percentElement);

  barElement.className = "imghov";

  barElement.onclick = () => {
    const competitorProfit = localStorage.getItem("myProfit");
    const competitorProfitNumber = parseFloat(competitorProfit.replace(/[$,]/g, ''));
    const relativeProfit = (competitorProfitNumber * barPercent / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    createPopup(relativeProfit);
  };
});

inputButton.onclick = () => {
  const myProfit = prompt("Enter your total profit:");
  if (myProfit) {
    localStorage.setItem("myProfit", myProfit);
    alert(`Your total profit of ${myProfit} has been saved.`);
  }
};

const style = document.createElement("style");
style.innerHTML = `
  .imghov {
    transition: transform 0.3s;
    transform: scale(1);
  }

  .imghov:hover {
    transform: scale(1.05);
  }

  .profit-button:hover {
    background-color: #45a049;
  }

  .profit-popup {
    display: none;
  }

  .profit-popup.active {
    display: block;
  }
`;
document.head.appendChild(style);