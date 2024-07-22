function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const id = getQueryParam("id");

const userName = document.querySelector(".userName");

sessionStorage.getItem("userName")
  ? (userName.textContent = sessionStorage.getItem("userName"))
  : (window.location.href = "index.html");

async function getProduct(id) {
  try {
    const api = `https://dummyjson.com/products/${id}`;
    const res = await fetch(api);
    const product = await res.json();
    createProduct(product);
  } catch (err) {
    const errorIndicator = document.getElementById("error");
    errorIndicator.classList.remove("hidden");
    errorIndicator.textContent = "Some Thing Went Wrong ...";
  } finally {
    const loadingIndicator = document.getElementById("loading");
    loadingIndicator.classList.add("hidden");
  }
}

getProduct(id);

function createProduct(product) {
  document.getElementById("productCard").classList.remove("hidden");

  if (id == product.id) {
    document.getElementById("productTitle").textContent = product.title;
    document.getElementById("productImage").src = product.thumbnail;
    document.getElementById("productDescription").textContent =
      product.description;
    document.getElementById("productCategory").textContent =
      "Category: " + product.category;
    document.getElementById("productPrice").textContent =
      "Price: $" + product.price;
    document.getElementById("productRating").textContent =
      "Rating: " + product.rating + " / 5";
    document.getElementById("productStock").textContent =
      "Stock: " + product.stock;
    document.getElementById("productBrand").textContent =
      "Brand: " + product.brand;
    document.getElementById("productSKU").textContent = "SKU: " + product.sku;
    document.getElementById("productWeight").textContent =
      "Weight: " + product.weight + "g";
    document.getElementById("productDimensions").textContent =
      `Dimensions: ${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth} cm`;
    document.getElementById("productWarranty").textContent =
      "Warranty: " + product.warrantyInformation;
    document.getElementById("productShipping").textContent =
      "Shipping: " + product.shippingInformation;
    document.getElementById("productAvailability").textContent =
      "Availability: " + product.availabilityStatus;
    document.getElementById("productReturnPolicy").textContent =
      "Return Policy: " + product.returnPolicy;
    document.getElementById("productMOQ").textContent =
      "Minimum Order Quantity: " + product.minimumOrderQuantity;

    const reviewsContainer = document.getElementById("productReviews");
    product.reviews.forEach((review) => {
      const reviewDiv = document.createElement("div");
      reviewDiv.classList.add("border", "p-2", "rounded", "mb-2", "bg-gray-50");
      reviewDiv.innerHTML = `
      <p class="font-semibold">${review.reviewerName} (${review.rating} / 5)</p>
      <p class="text-gray-600">${review.comment}</p>
      <p class="text-gray-400 text-sm">${new Date(review.date).toLocaleDateString()}</p>
    `;
      reviewsContainer.appendChild(reviewDiv);
    });

    document.getElementById("productQRCode").src = product.meta.qrCode;
    if (isProductAdded(product.id)) {
      document.getElementById("addToCartButton").textContent = "Go To CART";
      document
        .getElementById("addToCartButton")
        .addEventListener("click", () => {
          window.location.href = `../cart/cart.html`;
        });
    } else
      document
        .getElementById("addToCartButton")
        .addEventListener("click", () => {
          addToCart(product);
        });
  }
}

function isProductAdded(productId) {
  let cartItems = localStorage.getItem("items")
    ? JSON.parse(localStorage.getItem("items"))
    : [];
  const ele = cartItems.find((el) => el.id === productId);
  return Boolean(ele);
}

function addToCart(product) {
  let cartItems = localStorage.getItem("items")
    ? JSON.parse(localStorage.getItem("items"))
    : [];
  cartItems.push({ ...product, quantity: 1 });
  localStorage.setItem("items", JSON.stringify(cartItems));
  window.location.href = `../cart/cart.html`;
}

document.addEventListener("keydown", (e) => {
  console.log(e.key);
  if (e.key === "Backspace") {
    window.history.back();
  }
});