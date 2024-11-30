const admin = require("firebase-admin");

// Firebase Admin SDK service account credentials
const serviceAccount = require("../week11app-64a55-firebase-adminsdk-xhhc5-ad098c5033.json"); // Update the path to your service account file

// Initialize Firebase Admin SDK
if (!admin.apps.length) { // Prevent reinitialization
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://week11app-64a55-default-rtdb.firebaseio.com/", // Replace with your Firebase Realtime Database URL
  });
}

// Export the initialized admin object
module.exports = admin;
