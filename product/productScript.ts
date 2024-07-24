function getQueryParam(param: string) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const id = getQueryParam("id") as string;

const user = document.querySelector<HTMLElement>(".userName");
sessionStorage.getItem("userName")
  ? (user!.textContent = sessionStorage.getItem("userName"))
  : (window.location.href = "index.html");

const loading = document.getElementById("loading") as HTMLElement;

async function getProduct(id: string) {
  try {
    const api = `https://dummyjson.com/products/${id}`;
    const res = await fetch(api);
    const product = await res.json();
    createProduct(product);
  } catch (err) {
    const errorIndicator = document.getElementById("error") as HTMLDivElement;
    errorIndicator.classList.remove("hidden");
    errorIndicator.textContent = (err as Error).message;
  } finally {
    loading.classList.add("hidden");
  }
}

getProduct(id);

function createProduct(product: Product) {
  document.getElementById("productCard")!.classList.remove("hidden");

  if (id == product.id) {
    document.getElementById("productTitle")!.textContent = product.title;
    (document.getElementById("productImage") as HTMLImageElement).src =
      product.thumbnail;
    document.getElementById("productDescription")!.textContent =
      product.description;
    document.getElementById("productCategory")!.textContent =
      "Category: " + product.category;
    document.getElementById("productPrice")!.textContent =
      "Price: $" + product.price;
    document.getElementById("productRating")!.textContent =
      "Rating: " + product.rating + " / 5";
    document.getElementById("productStock")!.textContent =
      "Stock: " + product.stock;
    document.getElementById("productBrand")!.textContent =
      "Brand: " + product.brand;
    document.getElementById("productSKU")!.textContent = "SKU: " + product.sku;
    document.getElementById("productWeight")!.textContent =
      "Weight: " + product.weight + "g";
    document.getElementById("productDimensions")!.textContent =
      `Dimensions: ${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth} cm`;
    document.getElementById("productWarranty")!.textContent =
      "Warranty: " + product.warrantyInformation;
    document.getElementById("productShipping")!.textContent =
      "Shipping: " + product.shippingInformation;
    document.getElementById("productAvailability")!.textContent =
      "Availability: " + product.availabilityStatus;
    document.getElementById("productReturnPolicy")!.textContent =
      "Return Policy: " + product.returnPolicy;
    document.getElementById("productMOQ")!.textContent =
      "Minimum Order Quantity: " + product.minimumOrderQuantity;

    const reviewsContainer = document.getElementById(
      "productReviews"
    ) as HTMLElement;
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

    (document.getElementById("productQRCode") as HTMLImageElement).src =
      product.meta.qrCode;
    if (isProductAdded(product.id)) {
      document.getElementById("addToCartButton")!.textContent = "Go To CART";
      (
        document.getElementById("addToCartButton") as HTMLButtonElement
      ).addEventListener("click", () => {
        window.location.href = `../cart/cart.html`;
      });
    } else
      (
        document.getElementById("addToCartButton") as HTMLButtonElement
      ).addEventListener("click", () => {
        addToCart(product);
      });
  }
}

function isProductAdded(productId: string) {
  let cartItems: Product[] = localStorage.getItem("items")
    ? JSON.parse(localStorage.getItem("items") as string)
    : [];
  const ele = cartItems.find((el) => el.id == productId);
  return Boolean(ele);
}

function addToCart(product: Product) {
  let cartItems = localStorage.getItem("items")
    ? JSON.parse(localStorage.getItem("items") as string)
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
