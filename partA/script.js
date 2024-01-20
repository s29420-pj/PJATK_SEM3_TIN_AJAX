const apiUrl = 'http://szuflandia.pjwstk.edu.pl/~ppisarski/zad8/dane.php';
let lastStockData = null;
let lastNews = [];

function fetchData() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (JSON.stringify(data.stock) !== JSON.stringify(lastStockData)) {
                lastStockData = data.stock;
                updateStockTable(data.stock);
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

function updateStockTable(stock) {
    const tableBody = $('#stock-table tbody');
    tableBody.empty();

    for (const [company, price] of Object.entries(stock)) {
        const row = `<tr>
                      <td>${company}</td>
                      <td>${price}</td>
                    </tr>`;
        tableBody.append(row);
    }
}

function updateNewsRotator() {
    const rotator = $('#news-rotator');
    rotator.find('p').removeClass('active');

    for (let i = 0; i < lastNews.length; i++) {
        const paragraph = rotator.find(`p:eq(${i})`);
        paragraph.text(`Ostatnie wiadomości: ${lastNews[i]}`);
    }

    rotator.find('p:first').addClass('active');
}

function fetchNews() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const news = data.news;
            if (news && lastNews[0] !== news) {
                lastNews.unshift(news);
                if (lastNews.length > 3) {
                    lastNews.pop();
                }
                updateNewsRotator();
            }
        })
        .catch(error => console.error('Error fetching news:', error));
}

// Pobieranie danych co 10 sekund
setInterval(fetchData, 10000);

// Pobieranie i aktualizacja wiadomości co 30 sekund
setInterval(fetchNews, 30000);

// Inicjalne pobranie danych i wiadomości
fetchData();
fetchNews();