export default function swDev() {
  // Check if service worker is supported
  if (!("serviceWorker" in navigator)) {
    console.log("Service Worker is not supported in this browser.");
    return;
  }

  // Delay registration until after page load
  window.addEventListener("load", () => {
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log("Service Worker registered successfully.");
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}
