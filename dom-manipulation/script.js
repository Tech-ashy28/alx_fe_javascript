let quotes = [];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// Load from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      {
        text: "The only limit to our realization of tomorrow is our doubts of today.",
        category: "Motivation",
      },
      {
        text: "In the middle of difficulty lies opportunity.",
        category: "Inspiration",
      },
      {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        category: "Success",
      },
    ];
    saveQuotes();
  }
}

// Save to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote and store in session storage
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small><em>Category: ${quote.category}</em></small>
  `;

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Restore last viewed quote from session storage
function loadLastViewedQuote() {
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    quoteDisplay.innerHTML = `
      <p>"${quote.text}"</p>
      <small><em>Category: ${quote.category}</em></small>
    `;
  } else {
    showRandomQuote();
  }
}

// Add a new quote
function addQuote(event) {
  event.preventDefault();
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    showRandomQuote();
    alert("Quote added successfully!");

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("Please enter both quote and category.");
  }
}

// Create the quote form dynamically
function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  formContainer.innerHTML = `
    <h2>Add Your Own Quote</h2>
    <form id="quoteForm">
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" required />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" required />
      <button type="submit">Add Quote</button>
    </form>

    <h2>Import / Export Quotes</h2>
    <button id="exportBtn">Export Quotes (JSON)</button>
    <input type="file" id="importInput" accept=".json" />
  `;

  document.body.appendChild(formContainer);

  document.getElementById("quoteForm").addEventListener("submit", addQuote);
  document.getElementById("exportBtn").addEventListener("click", exportQuotes);
  document
    .getElementById("importInput")
    .addEventListener("change", importQuotes);
}

// Export quotes as JSON file
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importQuotes(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = importedQuotes;
        saveQuotes();
        showRandomQuote();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid format. Please upload a valid quotes JSON file.");
      }
    } catch {
      alert("Failed to parse JSON file.");
    }
  };
  reader.readAsText(file);
}

// Init
newQuoteBtn.addEventListener("click", showRandomQuote);

loadQuotes();
createAddQuoteForm();
loadLastViewedQuote();
