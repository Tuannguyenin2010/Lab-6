const admin = require("../models/firebaseModel"); // Correctly import admin from firebaseModel.js

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
    // Retrieve user by email
    const user = await admin.auth().getUserByEmail(email);

    // Generate a custom token for the user
    const customToken = await admin.auth().createCustomToken(user.uid);

    //Log login time
    const db = admin.database();
    await db.ref(`logs/${user.uid}`).push(({
      action:"login",
      timestamp:Date.now(),
    }))

    res.status(200).json({ message: "Signed in successfully", token: customToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
