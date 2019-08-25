const dismiss = document.getElementById("dismiss");
const refresh = document.getElementById("refresh");
const newRev = document.getElementById("newRev");

let presentSwReg;

refresh.addEventListener(
  "click",
  () => presentSwReg && presentSwReg.waiting.postMessage("skipWaiting")
);
dismiss.addEventListener("click", () => (newRev.style.display = "none"));
const showNewRev = () => (newRev.style.display = "block");

const waitStateChange = sw => {
  console.log("install statechange", sw);
  sw.addEventListener("statechange", function() {
    console.log("saw statechange", this.state);
    if (this.state === "installed") showNewRev();
  });
};

const swReg = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("sw.js")
      .then(reg => {
        console.log("sw registered", reg, reg.waiting, reg.installing);
        if (!navigator.serviceWorker.controller)
          return console.log("no previous sw so no user prompt");
        presentSwReg = reg;
        if (reg.waiting) return showNewRev();
        if (reg.installing) return waitStateChange(reg.installing);
        reg.addEventListener("updatefound", () =>
          waitStateChange(reg.installing)
        );
      })
      .catch(e => console.log("failed sw register with", e));
  }
};

swReg();

let refreshing;
navigator.serviceWorker.addEventListener("controllerchange", () => {
  console.log("forced reload due to new sw.");
  if (refreshing) return;
  refreshing = true;
  window.location.reload();
});
