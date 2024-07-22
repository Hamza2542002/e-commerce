const userName = document.querySelector(".userName");
sessionStorage.getItem("userName")
  ? (userName.textContent = sessionStorage.getItem("userName"))
  : (window.location.href = "index.html");

const productContiner = document.getElementById("productGrid");

const API = "https://dummyjson.com/products";

async function fetchProducts() {
  try {
    const res = await fetch(API);
    const { products } = await res.json();
    return products;
  } catch (error) {
    console.log(error);
  }
}

async function getProducts() {
  try {
    const products = await fetchProducts();
    createCardRow(products);
    createSelect();
  } catch (err) {
    const errorIndicator = document.getElementById("error");
    errorIndicator.classList.remove("hidden");
    errorIndicator.textContent = "Some Thing Went Wrong ...";
  } finally {
    const loadingIndicator = document.getElementById("loading");
    loadingIndicator.classList.add("hidden");
  }
}

const typeInput = document.getElementById("product-type");
async function getProductsByCategory(category) {
  try {
    const res = await fetch(
      category === "all" ? API : `${API}/category/${category}`
    );
    const { products } = await res.json();
    return products;
  } catch (err) {
    const errorIndicator = document.getElementById("error");
    errorIndicator.classList.remove("hidden");
    errorIndicator.textContent = "Some Thing Went Wrong ...";
  }
}

typeInput.addEventListener("change", async (e) => {
  const products = await getProductsByCategory(e.target.value);
  createCardRow(products);
});

const sortInput = document.getElementById("sort-input");
sortInput.addEventListener("change", async (e) => {
  const products = await getProductsByCategory(typeInput.value);
  if (e.target.checked) {
    products.sort((a, b) => a.price - b.price);
    createCardRow(products);
  } else {
    createCardRow(products);
  }
});

async function getCategories() {
  try {
    const res = await fetch(`${API}/category-list`);
    const data = await res.json();
    return data;
  } catch (error) {
    const errorIndicator = document.getElementById("error");
    errorIndicator.classList.remove("hidden");
    errorIndicator.textContent = "Some Thing Went Wrong ...";
  } finally {
    const loadingIndicator = document.getElementById("loading");
    loadingIndicator.classList.add("hidden");
  }
}

async function createSelect() {
  const productTypes = await getCategories();
  productTypes?.forEach((type) => {
    if (type !== undefined) {
      const option = document.createElement("option");
      option.textContent = `${type}`;
      typeInput.appendChild(option);
    }
  });
}

getProducts();

async function serachByName(name) {
  try {
    const products = await getProductsByCategory(typeInput.value);
    if (products.length === 0) throw new Error("No Product with this Name");
    const filtered = products.filter((p) => p.title.includes(name));
    createCardRow(filtered);
  } catch (err) {
    const errorIndicator = document.getElementById("error");
    errorIndicator.classList.remove("hidden");
    productContiner.classList.add("hidden");
    errorIndicator.textContent = err.message;
  } finally {
    const loadingIndicator = document.getElementById("loading");
    loadingIndicator.classList.add("hidden");
  }
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
    productCard.classList.add(
      "bg-white",
      "rounded-lg",
      "shadow-md",
      "p-4",
      "flex",
      "flex-col",
      "items-center"
    );
    productCard.innerHTML = `
        <img src="${product.thumbnail}" alt="${product.title}" class="w-32 h-32 object-cover rounded mb-4">
        <h2 class="text-lg font-semibold mb-2">${product.title}</h2>
        <p class="text-stone-700 mb-2">$${product.price.toFixed(2)}</p>
        <a href="../product/product.html?id=${product.id}" class="mt-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-all">View Details</a>
      `;
    productContiner.appendChild(productCard);
  });
}
