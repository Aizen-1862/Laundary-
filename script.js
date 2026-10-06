const items = [
  { id: "shirts", name: "Shirts" },
  { id: "pants", name: "Pants" },
  { id: "tshirts", name: "T-Shirts" },
  { id: "shorts", name: "Shorts" },
  { id: "trackpants", name: "Track Pants" },
  { id: "bedsheets", name: "Bedsheets" },
  { id: "towels", name: "Towels" },
  { id: "pillowcovers", name: "Pillow Covers" },
  { id: "underwear", name: "Underwear" },
  { id: "innertopwear", name: "Inner Top Wear" }
];

const quantities = {};

items.forEach(item => {
  quantities[item.id] = 0;
});

const itemsGrid = document.getElementById("itemsGrid");
const submitBtn = document.getElementById("submitBtn");
const errorMessage = document.getElementById("errorMessage");

const formScreen = document.getElementById("formScreen");
const receiptScreen = document.getElementById("receiptScreen");

const receiptNumber = document.getElementById("receiptNumber");
const receiptDate = document.getElementById("receiptDate");
const receiptTime = document.getElementById("receiptTime");
const receiptItems = document.getElementById("receiptItems");
const totalItems = document.getElementById("totalItems");

const printBtn = document.getElementById("printBtn");
const newBtn = document.getElementById("newBtn");

function renderItems() {
  itemsGrid.innerHTML = items.map(item => `
    <div class="item">
      <span class="item-name">${item.name}</span>

      <div class="quantity-control">
        <button
          class="qty-btn"
          type="button"
          aria-label="Decrease ${item.name}"
          data-action="decrease"
          data-id="${item.id}"
        >−</button>

        <span class="qty-value" id="qty-${item.id}">0</span>

        <button
          class="qty-btn"
          type="button"
          aria-label="Increase ${item.name}"
          data-action="increase"
          data-id="${item.id}"
        >+</button>
      </div>
    </div>
  `).join("");
}

function updateQuantity(id, change) {
  const nextValue = quantities[id] + change;

  if (nextValue < 0) {
    return;
  }

  if (nextValue > 99) {
    return;
  }

  quantities[id] = nextValue;

  const valueElement = document.getElementById(`qty-${id}`);
  if (valueElement) {
    valueElement.textContent = nextValue;
  }
}

itemsGrid.addEventListener("click", event => {
  const button = event.target.closest(".qty-btn");

  if (!button) {
    return;
  }

  const id = button.dataset.id;
  const action = button.dataset.action;

  updateQuantity(id, action === "increase" ? 1 : -1);
});

function getTotalItems() {
  return Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0);
}

function createReceiptNumber() {
  const now = new Date();

  const datePart =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const randomPart = Math.floor(1000 + Math.random() * 9000);

  return `LD-${datePart}-${randomPart}`;
}

function formatDate(date) {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function formatTime(date) {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

function generateReceipt() {
  const total = getTotalItems();

  if (total === 0) {
    errorMessage.textContent = "Please select at least one laundry item.";
    return;
  }

  errorMessage.textContent = "";

  const now = new Date();

  receiptNumber.textContent = createReceiptNumber();
  receiptDate.textContent = formatDate(now);
  receiptTime.textContent = formatTime(now);
  totalItems.textContent = total;

  const selectedItems = items.filter(item => quantities[item.id] > 0);

  receiptItems.innerHTML = selectedItems.map(item => `
    <div class="receipt-row">
      <span>${item.name}</span>
      <span>${quantities[item.id]}</span>
    </div>
  `).join("");

  formScreen.classList.remove("active");
  receiptScreen.classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function resetForm() {
  items.forEach(item => {
    quantities[item.id] = 0;

    const valueElement = document.getElementById(`qty-${item.id}`);
    if (valueElement) {
      valueElement.textContent = "0";
    }
  });

  receiptItems.innerHTML = "";
  errorMessage.textContent = "";

  receiptScreen.classList.remove("active");
  formScreen.classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

submitBtn.addEventListener("click", generateReceipt);

printBtn.addEventListener("click", () => {
  window.print();
});

newBtn.addEventListener("click", resetForm);

renderItems();
