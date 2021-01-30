console.log("Service worker loaded...");

self.addEventListener("push", e => {
    const data = e.data.json();
    console.log("Push received...");

    self.registration.showNotification(data.title, {
        body: "Notified by so and so...",
        icon: "https://www.clipartmax.com/png/small/196-1962120_super-mario-icon-mario-png.png",
    });
});





