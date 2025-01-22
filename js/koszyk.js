// Funkcja dodawania produktu do koszyka
function addToCart(id, name, price, quantity) {
  // Sprawdź, czy koszyk istnieje w localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Sprawdź, czy produkt już istnieje w koszyku
  const existingProduct = cart.find(product => product.id === id);
  if (existingProduct) {
    // Zwiększ ilość, jeśli produkt istnieje
    existingProduct.quantity += quantity;
  } else {
    // Dodaj nowy produkt do koszyka
    cart.push({ id, name, price, quantity });
  }

  // Zapisz koszyk w localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
}

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
