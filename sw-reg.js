const dismiss = document.getElementById("dismiss");
const refresh = document.getElementById("refresh");
const newRev = document.getElementById("newRev");

dismiss.addEventListener("click", () => (newRev.style.display = "none"));
const showNewRev = sw => {
  if (!sw) return console.error("error. sw null");
  refresh.addEventListener("click", () => sw.postMessage("skipWaiting"));
  newRev.style.display = "block";
};

const waitStateChange = sw => {
  sw.addEventListener("statechange", function() {
    if (this.state === "installed") showNewRev(sw);
  });
};

const swReg = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("sw.js")
      .then(reg => {
        console.log("sw registered");
        if (!navigator.serviceWorker.controller)
          return console.log("no previous sw so no user update prompt");
        if (reg.waiting) return showNewRev(reg.waiting);
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
  if (refreshing) return;
  refreshing = true;
  window.location.reload();
});
