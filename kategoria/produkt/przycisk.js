// document.addEventListener('DOMContentLoaded', function() {
//     document.querySelector('.minus').addEventListener('click', function() {
//         var input = document.getElementById('quantity');
//         var value = parseInt(input.value, 10);
//         if (value > parseInt(input.min)) {
//             input.value = value - 1;
//         }
//     });
//
//     document.querySelector('.plus').addEventListener('click', function() {
//         var input = document.getElementById('quantity');
//         var value = parseInt(input.value, 10);
//         if (value < parseInt(input.max)) {
//             input.value = value + 1;
//         }
//     });
// });
// Import Firebase Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCmCxhe9zhjWlKI1uTJLMRHhqyd2pYvt6k",
    authDomain: "sklep-bull.firebaseapp.com",
    projectId: "sklep-bull",
    storageBucket: "sklep-bull.firebasestorage.app",
    messagingSenderId: "74364332301",
    appId: "1:74364332301:web:4b86ce6c8bbd2d2effa844"
};


/**
 * Funkcja pobierająca dane produktu z Firebase i dynamicznie aktualizująca ilość na stronie.
 * @param {string} id - ID produktu w Firebase.
 */
async function fetchAndDisplayStock(id) {
    const productRef = doc(db, "produkty", id);

    // Dynamiczne nasłuchiwanie zmian w Firebase
    onSnapshot(productRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            const stockElement = document.querySelector(`.prod_main_pra[data-id="${id}"] .stock-value`);
            stockElement.textContent = data.ilosc; // Wyświetl ilość na stronie
        } else {
            console.error("Produkt nie istnieje w bazie danych.");
        }
    });
}

/**

/**
 * Obsługa przycisków plus/minus i dodawania do koszyka.
 */
