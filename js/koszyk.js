import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Konfiguracja Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCmCxhe9zhjWlKI1uTJLMRHhqyd2d2effa844",
  authDomain: "sklep-bull.firebaseapp.com",
  projectId: "sklep-bull",
  storageBucket: "sklep-bull.appspot.com",
  messagingSenderId: "74364332301",
  appId: "1:74364332301:web:4b86ce6c8bbd2d2effa844"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Wczytanie danych produktu
export async function wczytajDaneProduktu(prodId, container) {
  const productRef = doc(db, "produkty", prodId);
  const productSnap = await getDoc(productRef);

  if (productSnap.exists()) {
    const productData = productSnap.data();

    const stockValueElement = container.querySelector(".stock-value");
    const quantityInput = container.querySelector("#quantity");

    // Ustaw ilość i stan magazynowy
    if (productData.ilosc > 0) {
      stockValueElement.textContent = productData.ilosc;
      quantityInput.max = productData.ilosc;
      container.querySelector(".przycisk_produkt").classList.remove("disabled");
    } else {
      stockValueElement.textContent = "Brak w magazynie";
      container.querySelector(".przycisk_produkt").classList.add("disabled");
    }
  } else {
    console.error(`Produkt o ID ${prodId} nie istnieje.`);
  }
}

// Dodanie produktu do koszyka
export function ustawObslugeKoszyka(container) {
  const addToCartBtn = container.querySelector("#add-to-cart");
  const quantityInput = container.querySelector("#quantity");

  // Pobieranie danych z atrybutów `data-*`
  const prodId = container.dataset.id; // ID produktu
  const productName = container.dataset.name; // Nazwa produktu
  const productPrice = parseFloat(container.dataset.price); // Cena produktu

  if (!productName || isNaN(productPrice)) {
    console.error("Nie można odczytać danych produktu z atrybutów data-*.");
    return;
  }

  // Obsługa kliknięcia przycisku "Dodaj do koszyka"
  addToCartBtn.addEventListener("click", () => {
    const quantity = parseInt(quantityInput.value, 10);

    if (!quantity || quantity < 1) {
      alert("Nieprawidłowa ilość!");
      return;
    }

    // Dodanie do koszyka (localStorage)
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find(item => item.id === prodId);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.push({ id: prodId, name: productName, price: productPrice, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`Dodano ${quantity} sztuk ${productName} do koszyka!`);
  });
}



// Obsługa przycisków "+" i "-"
export function ustawObslugePrzyciskow(container) {
  const plusButton = container.querySelector(".plus");
  const minusButton = container.querySelector(".minus");
  const quantityInput = container.querySelector("#quantity");

  // Obsługa przycisku "+"
  plusButton.addEventListener("click", () => {
    const currentValue = parseInt(quantityInput.value, 10);
    const maxValue = parseInt(quantityInput.max, 10);

    if (currentValue < maxValue) {
      quantityInput.value = currentValue + 1;
    }
  });

  // Obsługa przycisku "-"
  minusButton.addEventListener("click", () => {
    const currentValue = parseInt(quantityInput.value, 10);

    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
    }
  });
}

// Usuwanie produktu z koszyka
export async function usunZKoszyka(id, ilosc) {
  const productRef = doc(db, "produkty", id);
  const productSnap = await getDoc(productRef);

  if (productSnap.exists()) {
    const productData = productSnap.data();

    // Zwiększenie ilości w magazynie
    await updateDoc(productRef, { ilosc: productData.ilosc + ilosc });

    // Aktualizacja koszyka
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== id);

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`Usunięto produkt z koszyka.`);
  } else {
    console.error("Produkt nie istnieje w bazie danych.");
  }
}
