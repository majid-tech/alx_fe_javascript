const quoteDisplay = document.getElementById("quoteDisplay");
const showNewQuoteBtn = document.getElementById("newQuote");

const addQuoteBtn = document.getElementById("addQuote");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");

const categoryFilter = document.getElementById("categoryFilter");

// Load quotes from Local Storage or defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Simplicity is the soul of efficiency.", category: "Programming" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Success is not final, failure is not fatal.", category: "Motivation" }
];

/* -------------------------
   Storage Helpers
-------------------------- */
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

/* -------------------------
   Populate Categories
-------------------------- */
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
  if (savedFilter) {
    categoryFilter.value = savedFilter;
  }
}

/* -------------------------
   Filter Quotes
-------------------------- */
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  quoteDisplay.innerHTML = "";

  filteredQuotes.forEach(quote => {
    const quoteText = document.createElement("p");
    const quoteCategory = document.createElement("span");

    quoteText.textContent = quote.text;
    quoteCategory.textContent = `Category: ${quote.category}`;

    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
  });
}

/* -------------------------
   Show Random Quote (Respects Filter)
-------------------------- */
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;

  const availableQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  if (availableQuotes.length === 0) return;

  const randomIndex = Math.floor(Math.random() * availableQuotes.length);
  const quote = availableQuotes[randomIndex];

  quoteDisplay.innerHTML = "";

  const quoteText = document.createElement("p");
  const quoteCategory = document.createElement("span");

  quoteText.textContent = quote.text;
  quoteCategory.textContent = `Category: ${quote.category}`;

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

/* -------------------------
   Add New Quote
-------------------------- */
function createAddQuoteForm() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) return;

  quotes.push({ text, category });
  saveQuotes();

  newQuoteText.value = "";
  newQuoteCategory.value = "";

  populateCategories();
  filterQuotes();
}

/* -------------------------
   Event Listeners
-------------------------- */
showNewQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", createAddQuoteForm);
categoryFilter.addEventListener("change", filterQuotes);

/* -------------------------
   Initialization
-------------------------- */
populateCategories();
filterQuotes();
