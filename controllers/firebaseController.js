const admin = require("../models/firebaseModel"); // Correctly import admin from firebaseModel.js
const axios = require("axios");

// Controller for sign up
const signUp = async (req, res) => {
  const { email, password,name } = req.body;

  try {
    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    //saving user info in Realtime Database
    const db = admin.database();
    await db.ref(`users/${userRecord.uid}`).set({
      name:name,
      email:email
    })

    res.status(201).json({ message: "User created successfully", uid: userRecord.uid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller for sign-in (get token)
const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Firebase Authentication REST API endpoint for signing in
    const firebaseAuthURL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=
AIzaSyAW9R61KJT_GRH7cdETDOajlAp9tZSWDOU`;

    // Authenticate the user using Firebase REST API
    const response = await axios.post(firebaseAuthURL, {
      email,
      password,
      returnSecureToken: true,
    });

    const { idToken, localId } = response.data;

    // Log login time in Firebase Realtime Database
    const db = admin.database();
    await db.ref(`logs/${localId}`).push({
      action: "login",
      timestamp: Date.now(),
    });

    // Return the ID token
    res.status(200).json({ message: "Signed in successfully", token: idToken });
  } catch (error) {
    // Handle error response from Firebase REST API
    res.status(400).json({ error: error.response?.data?.error?.message || error.message });
  }
};





// Middleware to verify Firebase ID Token
const verifyToken = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  //Authorization:Bearer <token>

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const idToken = authHeader.split("Bearer ")[1];  // Extract token from 'Authorization' header

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);  // Verify the ID token
    req.user = decodedToken;  // Attach the decoded token to the request object
    next();  // Continue to the protected route handler
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};


module.exports = { signUp, signIn, verifyToken };
