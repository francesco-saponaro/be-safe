const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

const app = express();
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
const serviceAccount = require("./firebaseKey/be-safe-49968-firebase-adminsdk-fbsvc-880774d13f.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Endpoint to send notifications
app.post("/send-notification", async (req, res) => {
  const { fcmToken, notification, data } = req.body;

  try {
    const message = {
      token: fcmToken,
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: data,
    };

    // Send the message using Firebase Admin SDK
    const response = await admin.messaging().send(message);
    console.log("Notification sent successfully:", response);
    res
      .status(200)
      .json({ success: true, message: "Notification sent successfully" });
  } catch (error) {
    console.error("Error sending notification:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send notification" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
