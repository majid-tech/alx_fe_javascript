const quoteDisplay = document.getElementById("quoteDisplay");
const showNewQuoteBtn = document.getElementById("newQuote");

const addQuoteBtn = document.getElementById("addQuote");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");

const exportBtn = document.getElementById("exportQuotes");
const importInput = document.getElementById("importFile");

// Load quotes from Local Storage or use defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Simplicity is the soul of efficiency.", category: "Programming" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

/* -------------------------
   Local Storage Helpers
-------------------------- */
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

/* -------------------------
   Show Random Quote
-------------------------- */
function showRandomQuote() {
  if (quotes.length === 0) return;

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Save last viewed quote (Session Storage)
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));

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
}

/* -------------------------
   Export Quotes (JSON)
-------------------------- */
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

/* -------------------------
   Import Quotes (JSON)
-------------------------- */
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);

      if (!Array.isArray(importedQuotes)) {
        alert("Invalid file format.");
        return;
      }

      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Error reading JSON file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

/* -------------------------
   Restore Last Session Quote
-------------------------- */
function loadLastQuote() {
  const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
  if (!lastQuote) return;

  quoteDisplay.innerHTML = "";

  const quoteText = document.createElement("p");
  const quoteCategory = document.createElement("span");

  quoteText.textContent = lastQuote.text;
  quoteCategory.textContent = `Category: ${lastQuote.category}`;

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

/* -------------------------
   Event Listeners
-------------------------- */
showNewQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", createAddQuoteForm);
exportBtn.addEventListener("click", exportToJsonFile);
importInput.addEventListener("change", importFromJsonFile);

// Load last viewed quote on refresh
loadLastQuote();
