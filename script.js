
async function fetchPrices() {
  const tableBody = document.querySelector("#spread-table tbody");
  tableBody.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

  try {
    const mexcRes = await fetch("https://contract.mexc.com/api/v1/contract/ticker");
    const lbankRes = await fetch("https://fapi.lbank.site/v1/futures/ticker/24hr");

    const mexcData = await mexcRes.json();
    const lbankData = await lbankRes.json();

    const lbankMap = {};
    lbankData.data.forEach(item => {
      lbankMap[item.symbol.toUpperCase()] = parseFloat(item.lastPrice);
    });

    const rows = mexcData.data.map(item => {
      const symbol = item.symbol.toUpperCase();
      const mexcPrice = parseFloat(item.lastPrice);
      const lbankPrice = lbankMap[symbol];
      if (!lbankPrice) return null;

      const spread = ((mexcPrice - lbankPrice) / lbankPrice * 100).toFixed(2);
      return `<tr>
        <td>${symbol}</td>
        <td>${mexcPrice}</td>
        <td>${lbankPrice}</td>
        <td style="color:${spread > 0 ? 'lime' : 'red'}">${spread}</td>
      </tr>`;
    }).filter(Boolean);

    tableBody.innerHTML = rows.join("") || "<tr><td colspan='4'>No data</td></tr>";
  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan='4'>Error loading data</td></tr>`;
    console.error(error);
  }
}

setInterval(fetchPrices, 5000);
fetchPrices();
