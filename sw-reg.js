const dismiss = document.getElementById("dismiss");
const refresh = document.getElementById("refresh");
const newRev = document.getElementById("newRev");

const swReg = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
  }
};

var refreshing;
navigator.serviceWorker.addEventListener("controllerchange", () => {
  if (refreshing) return;
  refreshing = true;
  console.log("forced reload due to new sw.");
  newRev.style.display = "block";
});

swReg();

refresh.addEventListener("click", () => window.location.reload());
dismiss.addEventListener("click", () => (newRev.style.display = "none"));
