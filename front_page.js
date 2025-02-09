// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

// Firebase configuration (Ensure this matches your Firebase project settings)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY, 
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};
  
export default firebaseConfig;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore();


// Elements
const loginBtn = document.querySelector(".login-btn");
const accountBtn = document.querySelector(".account-btn");
const profileImg = document.querySelector(".profile-img");
const accountMenu = document.querySelector('.account-menu');
const dropdownContent = document.querySelector('.dropdown-content');
const logoutBtn = document.querySelector('.logout-btn');

// Google Login Function
const authStateChange = () => {
    auth.onAuthStateChanged((user) => {
      try {
        if (user) {
          // User is signed in
          accountBtn.textContent = user.displayName;
          profileImg.src = user.photoURL;
          loginBtn.style.display = "none";
          accountMenu.style.display = "block";
          console.log('User logged in:', user.email);
        } else {
          // User is signed out
          accountBtn.textContent = "Account";
          profileImg.src = "guest.png"; // Add a default image path
          loginBtn.style.display = "block";
          accountMenu.style.display = "none";
          console.log('User logged out');
        }
      } catch (error) {
        console.error("Auth state change error:", error.message);
      }
    });
  };
  
  // Add this after existing element selections
  authStateChange();



const googleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Update UI with user info
    accountBtn.textContent = user.displayName;
    profileImg.src = user.photoURL;
    loginBtn.style.display = "none"; // Hide login button after login
    accountMenu.style.display = "block"; // Show account menu after login
  } catch (error) {
    console.error("Login Error:", error.message);
  }
};

// Google Logout Function
const googleLogout = async () => {
  try {
    await signOut(auth);
    location.reload(); // Refresh the page to its original form
  } catch (error) {
    console.error("Logout Error:", error.message);
  }
};

// Attach Event Listeners
loginBtn.addEventListener("click", googleLogin);
logoutBtn.addEventListener("click", googleLogout);


// Function to search stocks
async function searchStocks(userInput) {
    const companiesRef = collection(db, "companies");
    const q = query(companiesRef, where("ticker", ">=", userInput.toUpperCase()));

    const querySnapshot = await getDocs(q);
    let results = [];

    querySnapshot.forEach((doc) => {
        results.push(doc.data());
    });

    return results.slice(0, 10); // Return top 5 matches
}

// Event listener for Enter key press in the search bar
document.querySelector(".search-bar").addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
        const searchQuery = e.target.value;
        if (searchQuery.length > 1) {
            const matches = await searchStocks(searchQuery);
            console.log("Top Matches:", matches);
            // TODO: Display matches in UI dropdown
        }
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const stockCards = document.querySelectorAll('.stock-card');
    const stockDetailsSidebar = document.querySelector('.stock-details-sidebar');
    const closeSidebarBtn = document.querySelector('.close-btn');
    const content = document.querySelector('.main-content');
    const pages = document.querySelectorAll(".page");
    const menuLinks = document.querySelectorAll(".side-menu a");

    function showPage(pageId) {
        pages.forEach(page => {
            page.style.display = page.id === pageId ? "block" : "none";
        });
    }

    menuLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const targetPage = event.target.textContent.toLowerCase().replace(" ", "");
            showPage(targetPage);
            // console.log(targetPage);
            stockDetailsSidebar.style.display = 'none';
            document.querySelector(`#${targetPage}`).style.width = '100%';
            content.style.width = '80%';
        });
    });

    // Show Dashboard by default
    showPage("dashboard");

    // Load stock data into the index fund sections
    // fetchIndexStocks();

    // Function to create chart configuration
    function createChartConfig(data, isMiniChart = true) {
        return {
            type: 'line',
            data: {
                labels: data.map(item => item.time),
                datasets: [{
                    data: data.map(item => item.price),
                    borderColor: data[data.length - 1].price >= data[0].price ? '#48BB78' : '#F56565',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointRadius: isMiniChart ? 0 : 2,
                    pointHoverRadius: isMiniChart ? 0 : 4,
                    tension: 0  // This makes the lines straight instead of curved
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: !isMiniChart,
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'white',
                        titleColor: '#2D3748',
                        bodyColor: '#2D3748',
                        borderColor: '#E2E8F0',
                        borderWidth: 1,
                        padding: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return '₹' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: !isMiniChart,
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        display: !isMiniChart,
                        grid: {
                            display: !isMiniChart,
                            color: '#E2E8F0'
                        },
                        ticks: {
                            callback: value => '₹' + value.toLocaleString()
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        };
    }


    function attachStockItemListeners() {
        // Watchlist items
        document.querySelectorAll('.watchlist-item').forEach(item => {
            // Add click handler for View button
            item.querySelector('.view-details').addEventListener('click', () => {
                const stockDetailsSidebar = document.querySelector('.stock-details-sidebar');
                const content = document.querySelector('.main-content');
                
                // Get stock data from the row
                const stockName = item.querySelector('.stock-name').textContent;
                const stockSymbol = item.querySelector('.stock-symbol').textContent;
                const currentPrice = item.querySelector('.last-price').textContent;
                const change = item.querySelector('.change-24h').textContent;
                
                // Update sidebar content
                stockDetailsSidebar.querySelector('h2').textContent = stockName;
                stockDetailsSidebar.querySelector('.exchange-tag').textContent = 'NSE';
                stockDetailsSidebar.querySelector('.price').textContent = currentPrice;
                stockDetailsSidebar.querySelector('.change-percent').textContent = change;
                
                // Show sidebar
                stockDetailsSidebar.style.display = 'block';
                content.style.width = '55%';
                
                // Update chart
                const chartContainer = stockDetailsSidebar.querySelector('.chart-container');
                chartContainer.innerHTML = '<canvas></canvas>';
                const ctx = chartContainer.querySelector('canvas').getContext('2d');
                new Chart(ctx, createChartConfig(getStockData(), false));
            });
        });

        // Portfolio items
        document.querySelectorAll('.portfolio-item').forEach(item => {
            // Add click handler for View button
            item.querySelector('.view-details').addEventListener('click', () => {
                const stockDetailsSidebar = document.querySelector('.stock-details-sidebar');
                const content = document.querySelector('.main-content');
                
                // Get stock data from the row
                const stockName = item.querySelector('.stock-name').textContent;
                const stockSymbol = item.querySelector('.stock-symbol').textContent;
                const currentPrice = item.querySelector('.current-price').textContent;
                const profitLoss = item.querySelector('.profit-loss').textContent;
                
                // Update sidebar content
                stockDetailsSidebar.querySelector('h2').textContent = stockName;
                stockDetailsSidebar.querySelector('.exchange-tag').textContent = 'NSE';
                stockDetailsSidebar.querySelector('.price').textContent = currentPrice;
                stockDetailsSidebar.querySelector('.change-percent').textContent = profitLoss;
                
                // Show sidebar
                stockDetailsSidebar.style.display = 'block';
                content.style.width = '55%';
                
                // Update chart
                const chartContainer = stockDetailsSidebar.querySelector('.chart-container');
                chartContainer.innerHTML = '<canvas></canvas>';
                const ctx = chartContainer.querySelector('canvas').getContext('2d');
                new Chart(ctx, createChartConfig(getStockData(), false));
            });
        });
    }



    // Mock stock data - replace with real API data
    function getStockData() {
        return [
            { time: '9:15', price: 500 },
            { time: '10:30', price: 515 },
            { time: '11:45', price: 508 },
            { time: '13:00', price: 520 },
            { time: '14:15', price: 535 },
            { time: '15:30', price: 525 }
        ];
    }

    // Initialize mini charts
    stockCards.forEach(card => {
        const chartContainer = card.querySelector('.chart-container');
        const canvas = document.createElement('canvas');
        chartContainer.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        new Chart(ctx, createChartConfig(getStockData(), true));

        // Click handler for stock cards
        card.addEventListener('click', () => {
            stockDetailsSidebar.style.display = 'block';
            content.style.width = '55%'; // Change width to 55%

            // Update detailed chart
            const detailedChartContainer = stockDetailsSidebar.querySelector('.chart-container');
            detailedChartContainer.innerHTML = '<canvas></canvas>';
            const detailedCtx = detailedChartContainer.querySelector('canvas').getContext('2d');
            new Chart(detailedCtx, createChartConfig(getStockData(), false));

            // Update stock info
            const ticker = card.querySelector('.ticker').textContent;
            const price = card.querySelector('.price').textContent;
            stockDetailsSidebar.querySelector('h2').textContent = `${ticker} Details`;
        });
    });

    // Close sidebar handler
    closeSidebarBtn?.addEventListener('click', () => {
        stockDetailsSidebar.style.display = 'none';
        content.style.width = '80%';
    });

    attachStockItemListeners();
    // Add this after DOMContentLoaded to initialize mini charts
    document.querySelectorAll('.mini-chart canvas').forEach(canvas => {
        const ctx = canvas.getContext('2d');
        new Chart(ctx, createChartConfig(getStockData(), true));
    });
});


// Function to Fetch Index Stocks from Firebase
async function fetchIndexStocks() {
    const db = getFirestore();
    const stocksRef = collection(db, "stocks");
    
    // Fetch and sort stocks into index categories
    const querySnapshot = await getDocs(stocksRef);
    let sensexStocks = [], nifty50Stocks = [], niftyNext50Stocks = [];

    querySnapshot.forEach((doc) => {
        const stock = doc.data();
        if (stock.index === "Sensex") sensexStocks.push(stock);
        else if (stock.index === "Nifty 50") nifty50Stocks.push(stock);
        else if (stock.index === "Nifty Next 50") niftyNext50Stocks.push(stock);
    });

    // Inject stock cards into carousels
    populateStockCarousel("sensex-stocks", sensexStocks);
    populateStockCarousel("nifty50-stocks", nifty50Stocks);
    populateStockCarousel("niftyNext50-stocks", niftyNext50Stocks);
}

// Function to Populate Stock Carousels
function populateStockCarousel(containerId, stocks) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    stocks.forEach(stock => {
        const stockCard = document.createElement("div");
        stockCard.classList.add("stock-card");
        stockCard.innerHTML = `
            <div class="stock-header">
                <span class="ticker">${stock.ticker}</span>
                <span class="exchange">${stock.exchange}</span>
            </div>
            <div class="price-info">
                <span class="price">₹${stock.price}</span>
                <span class="change ${stock.change >= 0 ? 'up' : 'down'}">${stock.change}%</span>
            </div>
        `;
        container.appendChild(stockCard);
    });
}

// Add this to your front_page.js file

function updateStockSidebar(stockData) {
    const sidebar = document.querySelector('.stock-details-sidebar');
    
    // Update header information
    sidebar.querySelector('h2').textContent = stockData.ticker;
    sidebar.querySelector('.exchange-tag').textContent = stockData.exchange;
    sidebar.querySelector('.current-price .price').textContent = `₹${stockData.price.toLocaleString()}`;
    
    const changePercent = sidebar.querySelector('.current-price .change-percent');
    changePercent.textContent = `${stockData.changePercent > 0 ? '+' : ''}${stockData.changePercent}%`;
    changePercent.className = `change-percent ${stockData.changePercent >= 0 ? 'up' : 'down'}`;

    // Update details table
    sidebar.querySelector('.market-cap').textContent = `₹${(stockData.marketCap / 10000000).toFixed(2)} Cr`;
    sidebar.querySelector('.day-range').textContent = `₹${stockData.dayLow} - ₹${stockData.dayHigh}`;
    sidebar.querySelector('.year-range').textContent = `₹${stockData.yearLow} - ₹${stockData.yearHigh}`;
    sidebar.querySelector('.volume').textContent = stockData.volume.toLocaleString();
    sidebar.querySelector('.pe-ratio').textContent = stockData.peRatio.toFixed(2);
    sidebar.querySelector('.eps').textContent = `₹${stockData.eps.toFixed(2)}`;
    sidebar.querySelector('.dividend').textContent = `${stockData.dividendYield.toFixed(2)}%`;

    // Update trading section
    const quantityInput = sidebar.querySelector('#quantity');
    const priceInput = sidebar.querySelector('#price');
    
    // Update price when quantity changes
    quantityInput.addEventListener('input', () => {
        const quantity = parseInt(quantityInput.value) || 0;
        priceInput.value = (quantity * stockData.price).toFixed(2);
    });

    // Update quantity when price changes
    priceInput.addEventListener('input', () => {
        const price = parseFloat(priceInput.value) || 0;
        quantityInput.value = Math.floor(price / stockData.price);
    });
}

// Time period buttons functionality
const timeButtons = document.querySelectorAll('.time-button');
timeButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        timeButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        // Update chart data based on selected period
        const period = button.dataset.period;
        updateChartData(period);
    });
});

function updateChartData(period) {
    // Mock function to update chart data based on time period
    const chartData = getStockDataForPeriod(period);
    const chartContainer = document.querySelector('.stock-detail-chart .chart-container');
    const canvas = chartContainer.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    
    // Update chart with new data
    new Chart(ctx, createChartConfig(chartData, false));
}

function getStockDataForPeriod(period) {
    // Mock function to get data for different time periods
    // In real implementation, this would fetch data from your backend
    const data = [];
    const periods = {
        '1D': 6,
        '1W': 7,
        '1M': 30,
        '3M': 90,
        '1Y': 250,
        '5Y': 1250
    };

    const numPoints = periods[period];
    const basePrice = 500;
    
    for (let i = 0; i < numPoints; i++) {
        data.push({
            time: `${i}:00`,
            price: basePrice + Math.random() * 100 - 50
        });
    }
    
    return data;
}

// Add this function after the existing attachStockItemListeners function

async function showStockDetails(symbol) {
    const stockData = await fetchStockData(symbol);
    const sidebar = document.querySelector('.stock-details-sidebar');
    
    // Update sidebar content
    updateSidebarContent(stockData);
    
    // Show sidebar
    sidebar.style.display = 'block';
}

function updateSidebarContent(stockData) {
    const sidebar = document.querySelector('.stock-details-sidebar');
    
    // Update stock info
    sidebar.querySelector('.stock-name').textContent = stockData.name;
    sidebar.querySelector('.stock-symbol').textContent = stockData.symbol;
    sidebar.querySelector('.current-price').textContent = `₹${stockData.price}`;
    
    // Update chart
    updateStockChart(stockData.chartData);
    
    // Update details table
    updateStockDetailsTable(stockData);
}

function updateStockDetailsTable(data) {
    const tableBody = document.querySelector('.stock-details-table tbody');
    tableBody.innerHTML = `
        <tr><td>Market Cap</td><td>₹${data.marketCap}</td></tr>
        <tr><td>52W High</td><td>₹${data.high52w}</td></tr>
        <tr><td>52W Low</td><td>₹${data.low52w}</td></tr>
        <tr><td>Volume</td><td>${data.volume}</td></tr>
        <tr><td>P/E Ratio</td><td>${data.peRatio}</td></tr>
        <tr><td>Today's High</td><td>₹${data.dayHigh}</td></tr>
        <tr><td>Today's Low</td><td>₹${data.dayLow}</td></tr>
    `;
}