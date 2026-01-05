/* =========================
   DOM REFERENCES
========================= */
const quoteDisplay = document.getElementById("quoteDisplay");
const showNewQuoteBtn = document.getElementById("newQuote");

const addQuoteBtn = document.getElementById("addQuote");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");

const categoryFilter = document.getElementById("categoryFilter");
const importFileInput = document.getElementById("importFile");
const manualSyncBtn = document.getElementById("manualSync");

/* =========================
   CONSTANTS
========================= */
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
const SYNC_INTERVAL = 15000;

/* =========================
   STATE
========================= */
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Simplicity is the soul of efficiency.", category: "Programming" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Success is not final, failure is not fatal.", category: "Motivation" }
];

/* =========================
   STORAGE HELPERS
========================= */
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function saveLastViewedQuote(quote) {
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

/* =========================
   UI HELPERS
========================= */
function notifyUser(message) {
  alert(message);
}

/* =========================
   CATEGORY MANAGEMENT
========================= */
function populateCategories() {
  const categories = new Set(quotes.map(q => q.category));
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) categoryFilter.value = savedFilter;
}

/* =========================
   DISPLAY LOGIC
========================= */
function displayQuote(quote) {
  quoteDisplay.innerHTML = "";

  const quoteText = document.createElement("p");
  const quoteCategory = document.createElement("span");

  quoteText.textContent = quote.text;
  quoteCategory.textContent = `Category: ${quote.category}`;

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);

  saveLastViewedQuote(quote);
}

function showRandomQuote() {
  const selectedCategory = categoryFilter.value;

  const availableQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  if (availableQuotes.length === 0) return;

  const randomIndex = Math.floor(Math.random() * availableQuotes.length);
  displayQuote(availableQuotes[randomIndex]);
}

/* =========================
   FILTERING
========================= */
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  quoteDisplay.innerHTML = "";

  filteredQuotes.forEach(displayQuote);
}

/* =========================
   ADD QUOTE
========================= */
function addQuote() {
    quotes.push(newQuote);
localStorage.setItem("quotes", JSON.stringify(quotes));
postQuoteToServer(newQuote);

  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) return;

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  postQuoteToServer(newQuote);

  newQuoteText.value = "";
  newQuoteCategory.value = "";

  populateCategories();
  filterQuotes();
}

/* =========================
   JSON IMPORT / EXPORT
========================= */
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const reader = new FileReader();

  reader.onload = function (e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();

    populateCategories();
    filterQuotes();

    notifyUser("Quotes imported successfully!");
  };

  reader.readAsText(event.target.files[0]);
}

/* =========================
   SERVER SYNC (SIMULATION)
========================= */
async function fetchQuotesFromServer() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();

  return data.slice(0, 5).map(item => ({
    text: item.title,
    category: "Server"
  }));
}


async function postQuoteToServer(quote) {
  await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(quote),
    headers: {
      "Content-Type": "application/json"
    }
  });
}


async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    if (JSON.stringify(serverQuotes) !== JSON.stringify(localQuotes)) {
      quotes = serverQuotes;
      localStorage.setItem("quotes", JSON.stringify(quotes));

      populateCategories();
      filterQuotes();

      alert("Quotes updated from server. Conflicts resolved.");
    }
  } catch (error) {
    console.error("Sync failed:", error);
  }
}


/* =========================
   EVENT LISTENERS
========================= */
showNewQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
categoryFilter.addEventListener("change", filterQuotes);
manualSyncBtn.addEventListener("click", syncWithServer);
importFileInput.addEventListener("change", importFromJsonFile);

/* =========================
   INITIALIZATION
========================= */
populateCategories();
filterQuotes();
setInterval(syncQuotes, 15000);
document.getElementById("manualSync").addEventListener("click", syncQuotes);

