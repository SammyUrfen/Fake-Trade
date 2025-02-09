# 📈 Fake Trade - Stock Market Simulation

Fake Trade is a **stock trading simulation website** where users can trade stocks using **virtual money** based on **real-world stock prices** from the **NSE & BSE** markets. This project integrates **Firebase Firestore** for data storage and **Alpha Vantage API** for live stock data, allowing users to build and track their portfolios dynamically.

---

## 🌟 Features

### 🏠 **Dashboard**

- Displays major **stock indices** (Sensex, Nifty 50, Nifty Next 50).
- Features a **search bar** to find stocks easily.
- Stock cards show **real-time price updates** and mini-charts.

### 📊 **Stock Details Sidebar**

- Provides **in-depth stock data** with a scrollable layout.
- Includes **interactive charts** for daily, monthly, and yearly trends.
- Users can **toggle between different timeframes** (Day, Month, Year) for stock history.

### 💼 **My Portfolio**

- Displays a **list of stocks owned** by the user.
- Shows **profit/loss calculations**, buy price, and current price.
- Clicking on a stock opens the **Stock Details Sidebar** with a **Sell button**.

### ⭐ **Watchlist**

- Allows users to **track favorite stocks** without purchasing.
- Displays **stock price changes** for the current day.
- Functions similarly to the portfolio but without the **sell button**.

### 🔍 **Stock Search**

- Uses **fuzzy search** to handle typos and return **top matches**.
- Clicking on a result loads the **Stock Details Sidebar**.

### ⚙ **Settings & Profile**

- Users can **edit their profile name & photo**.
- Displays **account balance, transaction history, and virtual money top-up options**.
- Logout functionality included.

### ❓ **Help Section**

> "You'll get no help. I don't get paid for helping you right now. Just open a PR on GitHub and I will check if it's important."

---

## 🛠 Tech Stack

### 💻 **Frontend**

- **HTML, CSS, Vanilla JavaScript** (Single-page app using DOM manipulation)
- **Chart.js** (for visualizing stock trends)

### 🔥 **Backend & Database**

- **Firebase Firestore** (stores stock prices, user portfolios, and transactions)
- **Firebase Authentication** (Google login for user authentication)
- **Firebase Cloud Functions** (fetches stock data every 30 minutes)

### 📡 **Stock Market API**

- **Alpha Vantage API** (fetches real-time and historical stock prices)
- (Optional) **Yahoo Finance / Finnhub API** for additional stock data

---

## 🚀 Installation & Setup

### **1️⃣ Clone the Repository**

```bash
git clone https://github.com/yourusername/fake-trade.git
cd fake-trade
```

### **2️⃣ Set Up Firebase**

- Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
- Enable **Firestore Database** and **Authentication (Google Sign-in)**.
- Set up **Firebase Cloud Functions** for scheduled API calls.
- Download your Firebase **Admin SDK JSON** file and store it securely.

### **3️⃣ Install Dependencies**

If you're running Firebase Cloud Functions, install dependencies:

```bash
cd functions
npm install
```

### **4️⃣ Configure Alpha Vantage API**

- Sign up at [Alpha Vantage](https://www.alphavantage.co/) and get an API key.
- Store the key in Firebase functions or your environment variables.

### **5️⃣ Run Locally**

Since this is a **static web app**, you can open `index.html` directly or use a simple local server:

```bash
npx live-server
```

---

## 📜 Folder Structure

```
/
│── /public        # HTML, CSS, and JavaScript files
│── /functions     # Firebase Cloud Functions
│── /data          # Stock listings (NSE/BSE JSON files)
│── index.html     # Main frontend entry point
│── front_page.js  # Handles UI interactions and API calls
│── README.md      # Project documentation
```

---

## 📈 Roadmap & Future Enhancements

- ✅ Implement **real-time stock updates** using Firebase.
- ✅ Add **historical stock charts** for better trend analysis.
- ⏳ Introduce **buy/sell order history visualization**.
- ⏳ Add **leaderboard for best-performing portfolios**.
- ⏳ Integrate **additional stock market APIs** for improved data coverage.

---

## 🤝 Contributing

Feel free to contribute! Open a **Pull Request (PR)** for bug fixes or new features.

---

## 📜 License

This project is licensed under the **MIT License** – free to use and modify!

---

## 🎯 Credits & Acknowledgements

- **Firebase** for authentication, database, and hosting.
- **Alpha Vantage** for stock market data.
- **Chart.js** for stock chart visualization.
- **Open-source community** for making awesome tools!

