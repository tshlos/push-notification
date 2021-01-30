const publicVapidKey = "BKp52Ja0ImfU9iETuVWJHVspkNU8r6YAoC8BnLar0b0us2yIaZli-_PwJ648tspSIiM5TYl77XX4WQOvNQ7Eoa0";


function urlBase64ToUint8Array(base64String) {

    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


// Register SW, Register Push, Send Push
async function subscribe() {

    console.log("Registering service worker...");

    if ("serviceWorker" in navigator) {

        const register = await navigator.serviceWorker.register("/worker.js", {
            scope: "/"
        });
        console.log("Service worker registered...");
    
        //Register Push
        console.log("Register push...");
        
        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
            // applicationServerKey: publicVapidKey
        });
        console.log("Push registered...");
       
        // Send push notification
        console.log("Sending push...");

        await fetch("/subscribe", {
            method: "POST",
            body: JSON.stringify(subscription),
            headers: {
                "Content-Type": "application/json"
            },
        });
        console.log("push sent...");
    } else {
        console.error("Service workers are not supported in this browser.");
    }
}


const triggerPush = document.querySelector(".trigger-push");

triggerPush.addEventListener("click", () => {
    console.log("button triggered");
    subscribe().catch(error => console.log(error));
});
