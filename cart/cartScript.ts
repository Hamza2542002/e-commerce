const customerName = document.querySelector<HTMLElement>(".userName");
sessionStorage.getItem("userName")
  ? (customerName!.textContent = sessionStorage.getItem("userName"))
  : (window.location.href = "index.html");

function loadCart() {
  const cartItems: Product[] = localStorage.getItem("items")
    ? JSON.parse(localStorage.getItem("items") as string)
    : [];
  const cartList = document.getElementById("cartList") as HTMLElement;
  const cartEmpty = document.getElementById("cartEmpty") as HTMLElement;
  const cartTotal = document.getElementById("cartTotal") as HTMLElement;
  cartList.innerHTML = "";

  if (cartItems.length === 0) {
    cartEmpty.classList.remove("hidden");
    cartTotal.classList.add("hidden");
  } else {
    cartEmpty.classList.add("hidden");
    cartTotal.classList.remove("hidden");
    let totlaPrice = 0;
    cartItems.forEach((item: Product) => {
      totlaPrice += item.price * item.quantity;
      const itemDiv = document.createElement("div");
      itemDiv.classList.add(
        "flex",
        "justify-between",
        "items-center",
        "border-b",
        "py-2"
      );
      itemDiv.innerHTML = `
              <div class="flex items-center">
                <img src="${item.thumbnail}" alt="${item.title}" class="w-16 h-16 object-cover rounded mr-4">
                <div>
                  <h2 class="font-semibold">${item.title}</h2>
                  <p class="text-gray-600">$${item.price.toFixed(2)}</p>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <button onclick="updateQuantity(${-1}, ${item.id})" id="decrementButton" class="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700">-</button>
                <span id="itemQuantity" class="text-lg font-semibold">${item.quantity}</span>
                <button onclick="updateQuantity(${1}, ${item.id})" id="incrementButton" class="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-700">+</button>
                <button class="bg-red-500 px-2 py-1 rounded-lg text-white hover:bg-red-600" onclick="removeFromCart(${item.id})">Remove</button>
              </div>
            `;
      cartList.appendChild(itemDiv);
    });
    cartTotal.textContent = `Total: $${totlaPrice.toFixed(2)}`;
  }
}

loadCart();

function removeFromCart(id: string) {
  let cartItems = JSON.parse(localStorage.getItem("items") as string) || [];
  cartItems = cartItems.filter((item: Product) => item.id !== id);
  localStorage.setItem("items", JSON.stringify(cartItems));
  loadCart();
}

function updateQuantity(ammount: number, id: string) {
  const item =
    JSON.parse(localStorage.getItem("items") as string).find(
      (item: Product) => item.id == id
    ) || {};
  item.quantity += ammount;
  let cartItems =
    JSON.parse(localStorage.getItem("items") as string).filter(
      (item: Product) => item.id !== id
    ) || [];
  item.quantity > 0
    ? localStorage.setItem("items", JSON.stringify([...cartItems, item]))
    : localStorage.setItem("items", JSON.stringify(cartItems));
  loadCart();
}

document.addEventListener("keydown", (e) => {
  console.log(e.key);
  if (e.key === "Backspace") {
    window.history.back();
  }
});
