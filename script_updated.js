
async function fetchData() {
    try {
        const mexcResponse = await fetch("https://gen4ik-proxy-cors-1.fly.dev/mexc");
        const lbankResponse = await fetch("https://gen4ik-proxy-cors-1.fly.dev/lbank");

        const mexcData = await mexcResponse.json();
        const lbankData = await lbankResponse.json();

        const table = document.getElementById("data-table");

        table.innerHTML = `
            <tr>
                <th>Symbol</th>
                <th>MEXC Price</th>
                <th>LBank Price</th>
                <th>Spread (%)</th>
            </tr>
        `;

        mexcData.forEach((mexcItem, index) => {
            const symbol = mexcItem.symbol;
            const mexcPrice = parseFloat(mexcItem.price);
            const lbankItem = lbankData.find(item => item.symbol === symbol);
            if (lbankItem) {
                const lbankPrice = parseFloat(lbankItem.price);
                const spread = ((lbankPrice - mexcPrice) / mexcPrice * 100).toFixed(2);

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${symbol}</td>
                    <td>${mexcPrice}</td>
                    <td>${lbankPrice}</td>
                    <td>${spread}</td>
                `;
                table.appendChild(row);
            }
        });
    } catch (error) {
        console.error("Error loading data:", error);
        const table = document.getElementById("data-table");
        table.innerHTML = `
            <tr>
                <th>Symbol</th>
                <th>MEXC Price</th>
                <th>LBank Price</th>
                <th>Spread (%)</th>
            </tr>
            <tr>
                <td colspan="4" style="color:red;">Error loading data</td>
            </tr>
        `;
    }
}

setInterval(fetchData, 10000);
fetchData();
