const navigateBtn = document.querySelector(".navigate-btn");
const nameInput = document.getElementById("userName");
const userName = document.querySelector(".userName");
const formMessage = document.querySelector("form .message");

if (sessionStorage.getItem("userName")) {
  formMessage.textContent = `👋 Hello ${sessionStorage.getItem("userName")}`;
  userName.textContent = sessionStorage.getItem("userName");
  navigateBtn.textContent = `Continue Shopping ...`;
  nameInput.style.display = "none";
}

nameInput?.addEventListener("change", function (e) {
  userName.textContent = e.target.value;
  sessionStorage.setItem("userName", e.target.value);
});

navigateBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  if (userName) window.location.href = `./products/products.html`;
});
