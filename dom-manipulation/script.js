const quoteDisplay = document.getElementById('quoteDisplay');
const showNewQuoteBtn = document.getElementById('newQuote');

const addQuoteBtn = document.getElementById('addQuote');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');

const quotes = [
  { text: "Simplicity is the soul of efficiency.", category: "Programming" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

// Show a random quote (DOM creation REQUIRED)
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Clear previous quote
  quoteDisplay.innerHTML = "";

  // Create elements
  const quoteText = document.createElement("p");
  const quoteCategory = document.createElement("span");

  quoteText.textContent = quote.text;
  quoteCategory.textContent = quote.category;

  // Append to DOM
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// Add a new quote
function createAddQuoteForm() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) return;

  quotes.push({ text, category });

  newQuoteText.value = "";
  newQuoteCategory.value = "";
}

// ✅ REQUIRED event listener for “Show New Quote”
showNewQuoteBtn.addEventListener("click", showRandomQuote);

// Event listener for adding quotes
addQuoteBtn.addEventListener("click", createAddQuoteForm);
