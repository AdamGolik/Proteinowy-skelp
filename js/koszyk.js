import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Twoja konfiguracja Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCmCxhe9zhjWlKI1uTJLMRHhqyd2pYvt6k",
  authDomain: "sklep-bull.firebaseapp.com",
  projectId: "sklep-bull",
  storageBucket: "sklep-bull.firebasestorage.app",
  messagingSenderId: "74364332301",
  appId: "1:74364332301:web:4b86ce6c8bbd2d2effa844"
};

// Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);
// Inicjalizacja Firestore
const db = getFirestore(app);

// Funkcja pobierająca dane o produkcie z Firebase na podstawie ID
async function getProductDataById(productId) {
  const productRef = doc(db, "produkty", productId);  // Odwołanie do kolekcji "produkty" w Firestore
  const docSnap = await getDoc(productRef);  // Pobranie dokumentu produktu

  if (docSnap.exists()) {
    const productData = docSnap.data();
    if (productData.ilosc <= 0) {
      return null;  // Produkt jest wyprzedany
    }
    return productData;  // Zwracamy dane produktu, jeśli istnieje
  } else {
    return null;  // Produkt nie istnieje
  }
}

// Funkcja dodająca produkt do koszyka
async function addToCart(id, nazwa, cena, ilosc) {
  // Usuń "zł" z ceny i skonwertuj ją na liczbę
  cena = parseFloat(cena.replace('zł', '').trim());
  ilosc = parseInt(ilosc);

  // Pobierz dane produktu z Firestore
  const productData = await getProductDataById(id);
  if (!productData) {
    alert("Produkt jest wyprzedany lub nie istnieje.");
    return;
  }

  // Sprawdzamy, czy dostępna ilość jest wystarczająca
  if (ilosc > productData.ilosc) {
    alert(`Niestety, dostępna ilość to tylko ${productData.ilosc} sztuk.`);
    return;
  }

  // Pobierz aktualny koszyk z localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Sprawdź, czy produkt już jest w koszyku
  const existingProduct = cart.find(product => product.id === id);

  if (existingProduct) {
    // Jeśli produkt istnieje, zwiększ ilość
    existingProduct.quantity += ilosc;
  } else {
    // Jeśli produkt nie istnieje, dodaj go do koszyka
    cart.push({ id, nazwa, cena, quantity: ilosc });
  }

  // Zapisz koszyk w localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Zaktualizuj dostępność w bazie danych
  await updateDoc(doc(db, "produkty", id), {
    ilosc: productData.ilosc - ilosc
  });
  alert("Dodano do koszyka! " + nazwa);
  console.log(`${nazwa} dodano do koszyka!`);
}

// Funkcja, która ustawia wartość "max" w input na podstawie dostępności z Firestore
async function setMaxQuantity(id) {
  const productData = await getProductDataById(id);

  const availabilityText = document.querySelector(`.prod_main_pra[data-id='${id}'] .availability`);
  const quantityInput = document.querySelector(`.prod_main_pra[data-id='${id}'] #quantity`);

  if (!productData || productData.ilosc <= 0) {
    // Jeśli produkt jest wyprzedany
    if (availabilityText) {
      availabilityText.textContent = "Produkt wyprzedany";
    }
    if (quantityInput) {
      quantityInput.disabled = true;  // Wyłączamy możliwość zakupu
    }
    return;
  }

  if (quantityInput) {
    quantityInput.setAttribute("max", productData.ilosc);
  }

  if (availabilityText) {
    availabilityText.textContent = `Dostępne: ${productData.ilosc} sztuk`;
  }
}

// Dodaj event listener do przycisków z klasą "przycisk_produkt"
document.querySelectorAll('.przycisk_produkt').forEach(button => {
  button.addEventListener('click', function(event) {
    // Pobierz element rodzica produktu
    const productElement = event.target.closest('.prod_main_pra');

    // Pobierz ID produktu z atrybutu data-id
    const id = productElement.getAttribute('data-id');
    const nazwa = productElement.querySelector('.nazwa_produktu').textContent;
    const cena = productElement.querySelector('.cena_produktu').textContent.replace('Cena: ', '');
    const ilosc = productElement.querySelector('#quantity').value;

    // Wywołaj funkcję addToCart
    addToCart(id, nazwa, cena, ilosc);
  });
});

// Dodaj event listener do przycisków "+" i "-"
document.querySelectorAll('.plus').forEach(button => {
  button.addEventListener('click', function(event) {
    const quantityInput = event.target.closest('.number-input').querySelector('#quantity');
    const currentValue = parseInt(quantityInput.value);
    const max = parseInt(quantityInput.getAttribute('max'));
    if (currentValue < max) {
      quantityInput.value = currentValue + 1;
    }
  });
});

document.querySelectorAll('.minus').forEach(button => {
  button.addEventListener('click', function(event) {
    const quantityInput = event.target.closest('.number-input').querySelector('#quantity');
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
    }
  });
});

// Ustawiamy "max" dla każdego produktu na stronie i wyświetlamy dostępność
document.querySelectorAll('.prod_main_pra').forEach(productElement => {
  const productId = productElement.getAttribute('data-id');
  setMaxQuantity(productId);
});

// Funkcja wyświetlania koszyka
function displayCart() {
  // Pobierz koszyk z localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  console.log("Koszyk:", cart);
  return cart;
}

// Funkcja usuwania produktu z koszyka
function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Filtruj koszyk, aby usunąć wybrany produkt
  cart = cart.filter(product => product.id !== id);

  // Zapisz zaktualizowany koszyk w localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Funkcja finalizacji koszyka
function finalizeCart() {
  // Pobierz koszyk z localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Oblicz całkowitą kwotę
  const totalPrice = cart.reduce((total, product) => total + product.price * product.quantity, 0);

  // Wyczyść koszyk po finalizacji
  localStorage.removeItem("cart");

  // Zwróć całkowitą kwotę
  console.log(`Koszyk sfinalizowany. Łączna kwota: ${totalPrice} PLN`);
  return totalPrice;
}
