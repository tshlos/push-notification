import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import webpush from "web-push";
import path from "path";
import cors from "cors";

const app = express();

// Set static path
app.use(express.static(path.join(process.cwd(), "client")));

dotenv.config();

// Configuring body parser middleware
app.use(bodyParser.json());


app.get("/", (req, res) => {
    res.status(200);
    res.end("hello world");
});

const corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 204,
    allowedHeaders: ["Origin", "X-Requested-With", "X-PINGOTHER", "Content-Type", "Accept"],
    credentials: false,
    preflightContinue: false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}
app.use(cors(corsOptions));

// vapid keys identify who is sending push notifications
const publicVapidKey = "BKp52Ja0ImfU9iETuVWJHVspkNU8r6YAoC8BnLar0b0us2yIaZli-_PwJ648tspSIiM5TYl77XX4WQOvNQ7Eoa0";
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webpush.setVapidDetails("mailto:test@test.com", publicVapidKey, privateVapidKey);


const dummyDB = {};
// Subscribe route
app.post("/subscribe", (req, res) => {
    // Get pushSubscription object
    const subscription = req.body;

    // Send 201 - resource created
    res.status(201).json({});

    dummyDB.subscription = subscription;
});



app.post("/send", async (req, res) => {

    // Create payload
    const payload = JSON.stringify({
        title: "Push notifications with Service Workers"
    });

    // Pass object into sendNotification
    try {
        await webpush.sendNotification(dummyDB.subscription, payload);
    } catch (error) {
        console.log(error);
    }
    res.status(201).json({});
});



const port = 5000;

app.listen(port, () => console.log(`listening on port ${port}`));