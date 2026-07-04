# FinTrack Pro 💰

> A lightweight, privacy-focused personal finance tracker built entirely with Vanilla web technologies.

FinTrack Pro is a simple and elegant web application designed to help you track your daily income and expenses. All your financial data stays completely private and is stored locally in your browser—no servers, no accounts, and no passwords required.

## ✨ Features

* **No Sign-Up Required:** Just enter your name to access your dashboard.
* **Intuitive Dashboard:** View your current balance, total income, total expenses, and total transactions at a glance.
* **Visual Analytics:** Interactive bar charts powered by Chart.js to visualize your cash flow over time.
* **Transaction Management:** * Add detailed income and expense records (Date, Description, Category, Amount).
    * Delete past transactions easily.
    * Filter transactions by All, Income, or Expense.
* **Customizable Settings:**
    * Change your display name.
    * Select your preferred currency (USD, EUR, GBP, INR) which updates across the entire app.
    * **Dark Mode** toggle for comfortable viewing at night.
    * **Reset Data** functionality to clear all local storage if needed.
* **Data Persistence:** Automatically saves your transactions and settings to your browser's `localStorage` so you never lose your data upon refresh.

## 🛠️ Technologies Used

* **HTML5** - Application structure
* **CSS3** - Custom styling, responsive layout, CSS variables, and Dark Mode theme
* **Vanilla JavaScript (ES6)** - DOM manipulation, state management, and local storage integration
* **[Chart.js](https://www.chartjs.org/)** - For rendering beautiful data visualizations

## 🚀 Getting Started

Since this application relies strictly on client-side technologies, running it is incredibly simple.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/yourusername/fintrack-pro.git](https://github.com/yourusername/fintrack-pro.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd fintrack-pro
    ```
3.  **Run the application:**
    Simply double-click the `index.html` file to open it in your default web browser. Alternatively, you can use a local development server like VS Code's "Live Server" extension.

## 📁 Project Structure

```text
📦 fintrack-pro
 ┣ 📜 index.html    # The main HTML document containing the app structure
 ┣ 📜 style.css     # Contains all CSS styling, including dark mode variables
 ┗ 📜 script.js     # Handles app logic, Chart.js rendering, and localStorage
