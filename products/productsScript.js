"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API = "https://dummyjson.com/products";
var userName = document.querySelector(".userName");
sessionStorage.getItem("userName")
    ? (userName.textContent = sessionStorage.getItem("userName"))
    : (window.location.href = "index.html");
const productContiner = document.getElementById("productGrid");
const loadingIndicator = document.getElementById("loading");
function fetchProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(API);
            const { products } = yield res.json();
            return products;
        }
        catch (error) {
            console.log(error);
            return [];
        }
    });
}
function getProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const products = yield fetchProducts();
            createCardRow(products);
            createSelect();
        }
        catch (err) {
            displayError(err.message);
        }
        finally {
            loadingIndicator.classList.add("hidden");
        }
    });
}
const typeInput = document.getElementById("product-type");
function getProductsByCategory(category) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(category === "all" ? API : `${API}/category/${category}`);
            const { products } = yield res.json();
            return products;
        }
        catch (err) {
            displayError(err.message);
            return [];
        }
    });
}
typeInput.addEventListener("change", (e) => __awaiter(void 0, void 0, void 0, function* () {
    const products = (yield getProductsByCategory(e.target.value));
    createCardRow(products);
}));
const sortInput = document.getElementById("sort-input");
sortInput.addEventListener("change", (e) => __awaiter(void 0, void 0, void 0, function* () {
    const products = (yield getProductsByCategory(typeInput.value));
    if (e.target.checked) {
        products.sort((a, b) => a.price - b.price);
        createCardRow(products);
    }
    else {
        createCardRow(products);
    }
}));
function getCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(`${API}/category-list`);
            const data = yield res.json();
            return data;
        }
        catch (error) {
            displayError(error.message);
            return [];
        }
        finally {
            const loadingIndicator = document.getElementById("loading");
            loadingIndicator.classList.add("hidden");
        }
    });
}
function createSelect() {
    return __awaiter(this, void 0, void 0, function* () {
        const productTypes = yield getCategories();
        productTypes === null || productTypes === void 0 ? void 0 : productTypes.forEach((type) => {
            if (type !== undefined) {
                const option = document.createElement("option");
                option.textContent = `${type}`;
                typeInput.appendChild(option);
            }
        });
    });
}
getProducts();
function serachByName(name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const products = yield getProductsByCategory(typeInput.value);
            if (products.length === 0)
                throw new Error("No Product with this Name");
            const filtered = products.filter((p) => p.title.includes(name));
            createCardRow(filtered);
        }
        catch (err) {
            displayError(err.message);
            productContiner.classList.add("hidden");
        }
        finally {
            loadingIndicator.classList.add("hidden");
        }
    });
}
const serachFrom = document.getElementById("searchFrom");
const serachInput = document.getElementById("searchInput");
serachFrom.addEventListener("submit", (e) => {
    e.preventDefault();
    serachByName(serachInput.value);
});
function createCardRow(products) {
    productContiner.classList.remove("hidden");
    productContiner.innerHTML = ``;
    products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("bg-white", "rounded-lg", "shadow-md", "p-4", "flex", "flex-col", "items-center");
        productCard.innerHTML = `
        <img src="${product.thumbnail}" alt="${product.title}" class="w-32 h-32 object-cover rounded mb-4">
        <h2 class="text-lg font-semibold mb-2">${product.title}</h2>
        <p class="text-stone-700 mb-2">$${product.price.toFixed(2)}</p>
        <a href="../product/product.html?id=${product.id}" class="mt-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-all">View Details</a>
      `;
        productContiner.appendChild(productCard);
    });
}
function displayError(message) {
    const errorIndicator = document.getElementById("error");
    errorIndicator.classList.remove("hidden");
    errorIndicator.textContent = message;
}
