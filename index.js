"use strict";
const navigateBtn = document.querySelector(".navigate-btn");
const nameInput = document.getElementById("userName");
const formMessage = document.querySelector("form .message");
var userName = document.querySelector(".userName");
if (sessionStorage.getItem("userName")) {
    formMessage.textContent = `👋 Hello ${sessionStorage.getItem("userName")}`;
    userName.textContent = sessionStorage.getItem("userName");
    navigateBtn.textContent = `Continue Shopping ...`;
    nameInput.style.display = "none";
}
nameInput === null || nameInput === void 0 ? void 0 : nameInput.addEventListener("change", function (e) {
    userName.textContent = e.target.value;
    sessionStorage.setItem("userName", e.target.value);
});
navigateBtn === null || navigateBtn === void 0 ? void 0 : navigateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (userName)
        window.location.href = `./products/products.html`;
});
