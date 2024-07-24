const API: string = "https://dummyjson.com/products";
type Dimensions = {
  width: number;
  height: number;
  depth: number;
};

type Review = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
};

type Meta = {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
};

type Product = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: Meta;
  images: string[];
  thumbnail: string;
  quantity: number;
};
var userName = document.querySelector<HTMLElement>(".userName");
sessionStorage.getItem("userName")
  ? (userName!.textContent = sessionStorage.getItem("userName"))
  : (window.location.href = "index.html");

const productContiner = document.getElementById("productGrid") as HTMLElement;
const loadingIndicator = document.getElementById("loading") as HTMLElement;

async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(API);
    const { products } = await res.json();
    return products;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function getProducts() {
  try {
    const products = await fetchProducts();
    createCardRow(products as Product[]);
    createSelect();
  } catch (err) {
    displayError((err as Error).message);
  } finally {
    loadingIndicator.classList.add("hidden");
  }
}

const typeInput = document.getElementById("product-type") as HTMLInputElement;
async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const res = await fetch(
      category === "all" ? API : `${API}/category/${category}`
    );
    const { products } = await res.json();
    return products;
  } catch (err) {
    displayError((err as Error).message);
    return [];
  }
}

typeInput.addEventListener("change", async (e: Event) => {
  const products = (await getProductsByCategory(
    (e.target as HTMLInputElement).value
  )) as Product[];
  createCardRow(products);
});

const sortInput = document.getElementById("sort-input") as HTMLInputElement;
sortInput.addEventListener("change", async (e: Event) => {
  const products = (await getProductsByCategory(typeInput.value)) as Product[];
  if ((e.target as HTMLInputElement).checked) {
    products.sort((a, b) => a.price - b.price);
    createCardRow(products);
  } else {
    createCardRow(products);
  }
});

async function getCategories(): Promise<string[]> {
  try {
    const res = await fetch(`${API}/category-list`);
    const data = await res.json();
    return data;
  } catch (error) {
    displayError((error as Error).message);
    return [];
  } finally {
    const loadingIndicator = document.getElementById("loading");
    loadingIndicator!.classList.add("hidden");
  }
}

async function createSelect() {
  const productTypes = await getCategories();
  productTypes?.forEach((type) => {
    if (type !== undefined) {
      const option = document.createElement("option") as HTMLOptionElement;
      option.textContent = `${type}`;
      typeInput.appendChild(option);
    }
  });
}

getProducts();

async function serachByName(name: string) {
  try {
    const products = await getProductsByCategory(typeInput.value);
    if (products.length === 0) throw new Error("No Product with this Name");
    const filtered = products.filter((p) => p.title.includes(name));
    createCardRow(filtered);
  } catch (err) {
    displayError((err as Error).message);
    productContiner.classList.add("hidden");
  } finally {
    loadingIndicator.classList.add("hidden");
  }
}

const serachFrom = document.getElementById("searchFrom") as HTMLFormElement;
const serachInput = document.getElementById("searchInput") as HTMLInputElement;
serachFrom.addEventListener("submit", (e: Event) => {
  e.preventDefault();
  serachByName(serachInput.value);
});

function createCardRow(products: Product[]) {
  productContiner.classList.remove("hidden");
  productContiner.innerHTML = ``;
  products.forEach((product) => {
    const productCard: HTMLDivElement = document.createElement("div");
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

function displayError(message: string) {
  const errorIndicator = document.getElementById("error") as HTMLDivElement;
  errorIndicator.classList.remove("hidden");
  errorIndicator.textContent = message;
}
