if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
navigator.serviceWorker.addEventListener("controllerchange", function() {
  console.log("forced reload due to new sw.");
  window.location.reload();
});
