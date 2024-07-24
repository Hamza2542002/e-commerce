const navigateBtn = document.querySelector<HTMLButtonElement>(".navigate-btn");
const nameInput = document.getElementById("userName") as HTMLInputElement;
const formMessage = document.querySelector<HTMLDivElement>("form .message");
var userName = document.querySelector<HTMLElement>(".userName");

if (sessionStorage.getItem("userName")) {
  formMessage!.textContent = `👋 Hello ${sessionStorage.getItem("userName")}`;
  userName!.textContent = sessionStorage.getItem("userName");
  navigateBtn!.textContent = `Continue Shopping ...`;
  nameInput!.style.display = "none";
}

nameInput?.addEventListener("change", function (e: Event) {
  userName!.textContent = (e.target as HTMLInputElement).value;
  sessionStorage.setItem("userName", (e.target as HTMLInputElement).value);
});

navigateBtn?.addEventListener("click", (e: Event) => {
  e.preventDefault();
  if (userName) window.location.href = `./products/products.html`;
});
