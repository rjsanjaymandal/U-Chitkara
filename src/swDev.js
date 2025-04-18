export default function swDev() {
  let swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  navigator.serviceWorker
    .register(swUrl)
    .then(() => {
      // Registration successful
    })
    .catch((error) => {
      // Registration failed
      console.error("Service worker registration failed:", error);
    });
}
