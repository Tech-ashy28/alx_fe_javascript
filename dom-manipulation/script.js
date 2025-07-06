// Array to store quotes
const quotes = [
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

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// Function to show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small><em>Category: ${quote.category}</em></small>
  `;
}

// Function to add a new quote from input fields
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    showRandomQuote(); // Optionally show the new or random quote
    textInput.value = "";
    categoryInput.value = "";
    alert("Quote added successfully!");
  } else {
    alert("Please enter both quote and category.");
  }
}

// Event listener for "Show New Quote" button
newQuoteBtn.addEventListener("click", showRandomQuote);

// Show a quote when the page loads
showRandomQuote();
