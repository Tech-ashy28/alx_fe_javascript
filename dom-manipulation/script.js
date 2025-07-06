let quotes = [];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

// Load quotes from localStorage
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

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote (filtered)
function showRandomQuote(filteredList = null) {
  const list = filteredList || getFilteredQuotes();
  if (list.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes found for this category.</p>`;
    return;
  }

  const randomIndex = Math.floor(Math.random() * list.length);
  const quote = list[randomIndex];
  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small><em>Category: ${quote.category}</em></small>
  `;

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Filtered quotes based on dropdown
function getFilteredQuotes() {
  const selected = categoryFilter.value;
  if (selected === "all") return quotes;
  return quotes.filter((q) => q.category === selected);
}

// Handle dropdown change
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);
  showRandomQuote();
}

// Load last quote from session
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

// Add quote from form
function addQuote(event) {
  event.preventDefault();

  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategoryFilter();
    showRandomQuote();
    alert("Quote added successfully!");

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("Please fill in both fields.");
  }
}

// Create form dynamically
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
  formContainer.innerHTML = `
    <h2>Add Your Own Quote</h2>
    <form id="quoteForm">
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" required />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" required />
      <button type="submit">Add Quote</button>
    </form>
  `;

  document.getElementById("quoteForm").addEventListener("submit", addQuote);
}

// Populate dropdown with categories
function populateCategoryFilter() {
  const categories = [...new Set(quotes.map((q) => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
  }
}

// Export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategoryFilter();
        showRandomQuote();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format.");
      }
    } catch (err) {
      alert("Error reading file.");
    }
  };
  reader.readAsText(file);
}

// Init
loadQuotes();
populateCategoryFilter();
createAddQuoteForm();
loadLastViewedQuote();
newQuoteBtn.addEventListener("click", showRandomQuote);
