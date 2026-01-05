const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');

const addQuoteBtn = document.getElementById('addQuote');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');

const quotes = [
  {
    text: "Simplicity is the soul of efficiency.",
    category: "Programming"
  },
  {
    text: "Code is like humor. When you have to explain it, it’s bad.",
    category: "Programming"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    category: "Motivation"
  },
  {
    text: "Your time is limited, so don’t waste it living someone else’s life.",
    category: "Life"
  },
  {
    text: "First, solve the problem. Then, write the code.",
    category: "Software Engineering"
  }
];

// Display a random quote
function ShowRandomQuote() {
  if (quotes.length === 0) return;

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const { text } = quotes[randomIndex];

  quoteDisplay.innerHTML = text;
}

// Add a new quote
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert('Please enter both a quote and a category.');
    return;
  }

  quotes.push({ text, category });

  newQuoteText.value = '';
  newQuoteCategory.value = '';
}

newQuoteBtn.addEventListener('click', ShowRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);
