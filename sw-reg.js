const dismiss = document.getElementById("dismiss");
const refresh = document.getElementById("refresh");
const newRev = document.getElementById("newRev");

let refreshing;
let presentSwReg;

refresh.addEventListener(
  "click",
  () => presentSwReg && presentSwReg.waiting.postMessage("skipWaiting")
);
dismiss.addEventListener("click", () => (newRev.style.display = "none"));
const showNewRev = () => (newRev.style.display = "block");

const waitStateChange = reg => {
  console.log("install statechange", reg.installing);
  reg.installing.addEventListener("statechange", e => {
    console.log("saw statechange", e.target.state);
    if (event.target.state === "installed") showNewRev();
  });
};

const swReg = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("sw.js")
      .then(reg => {
        console.log("sw registered", reg, reg.waiting, reg.installing);
        if (!reg) return console.log("invalid sw registration of", reg);
        presentSwReg = reg;
        if (reg.waiting) return showNewRev();
        if (reg.installing) waitStateChange(reg);
        reg.addEventListener("updatefound", waitStateChange(reg));
      })
      .catch(e => console.log("failed sw register with", e));
  }
};

swReg();

navigator.serviceWorker.addEventListener("controllerchange", () => {
  console.log("forced reload due to new sw.");
  if (refreshing) return;
  refreshing = true;
  window.location.reload();
});
