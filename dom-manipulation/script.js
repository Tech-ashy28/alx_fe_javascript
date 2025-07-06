let quotes = [];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// 🟡 Show Notification
function showNotification(message, duration = 4000) {
  const notification = document.getElementById("notification");
  notification.innerText = message;
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.display = "none";
  }, duration);
}

// 🟢 Load Quotes
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

// 💾 Save Quotes
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// 📂 Populate Category Filter
function populateCategories() {
  const categories = [...new Set(quotes.map((q) => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
    filterQuotes();
  }
}

// 🔍 Filter and Display
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  const filtered =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((q) => q.category === selectedCategory);

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes available in this category.</p>`;
    return;
  }

  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small><em>Category: ${randomQuote.category}</em></small>
  `;
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// 🕓 Load Last Viewed Quote
function loadLastViewedQuote() {
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    quoteDisplay.innerHTML = `
      <p>"${quote.text}"</p>
      <small><em>Category: ${quote.category}</em></small>
    `;
  } else {
    filterQuotes();
  }
}

// ➕ Add New Quote
function addQuote(event) {
  event.preventDefault();
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    filterQuotes();
    showNotification("✅ Quote added successfully!");
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("Please fill in both fields.");
  }
}

// 🧾 Create Add Quote Form
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

// 📥 Import Quotes
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
        populateCategories();
        filterQuotes();
        showNotification("✅ Quotes imported successfully!");
      } else {
        alert("Invalid file format.");
      }
    } catch (err) {
      alert("Error reading file.");
    }
  };
  reader.readAsText(file);
}

// 📤 Export Quotes
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

// 🔁 Sync Quotes from Server with Conflict Resolution
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();

    const serverQuotes = data.slice(0, 5).map((item, index) => ({
      text: item.title,
      category: `ServerCat${index + 1}`,
    }));

    let conflicts = 0;
    let newQuotes = 0;

    serverQuotes.forEach((serverQuote) => {
      const localIndex = quotes.findIndex((q) => q.text === serverQuote.text);

      if (localIndex !== -1) {
        quotes[localIndex] = serverQuote; // conflict: overwrite
        conflicts++;
      } else {
        quotes.push(serverQuote);
        newQuotes++;
      }
    });

    if (conflicts > 0 || newQuotes > 0) {
      saveQuotes();
      populateCategories();
      filterQuotes();
      let msg = `🔄 Synced ${newQuotes} new quotes.`;
      if (conflicts > 0)
        msg += ` ⚠️ ${conflicts} conflicts resolved (server wins).`;
      showNotification(msg);
    } else {
      showNotification("✔️ No updates from server.");
    }
  } catch (error) {
    console.error("❌ Failed to fetch from server:", error);
    showNotification("❌ Error: Could not connect to server.");
  }
}

// ⬆️ Push Local Quotes to Server (Simulated)
async function pushQuotesToServer() {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      body: JSON.stringify(quotes),
      headers: { "Content-Type": "application/json" },
    });
    showNotification("✅ Local quotes pushed to server.");
  } catch (error) {
    console.error("❌ Failed to push to server:", error);
    showNotification("❌ Could not push quotes to server.");
  }
}

// 🚀 Init
loadQuotes();
populateCategories();
createAddQuoteForm();
loadLastViewedQuote();
newQuoteBtn.addEventListener("click", filterQuotes);
setInterval(fetchQuotesFromServer, 30000); // Sync every 30 seconds
