const admin = require("firebase-admin");

// Firebase Admin SDK service account credentials
const serviceAccount = require("../fir-app-44e7a-firebase-adminsdk-ddn8p-6a1007e527.json"); // Update the path to your service account file

// Initialize Firebase Admin SDK
if (!admin.apps.length) { // Prevent reinitialization
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fir-app-44e7a-default-rtdb.firebaseio.com/", // Replace with your Firebase Realtime Database URL
  });
}

// Export the initialized admin object
module.exports = admin;
