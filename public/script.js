// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDC0HU1grETWOpFFnIsbdTZo6EWlO44Mu0",
  authDomain: "week11app-64a55.firebaseapp.com",
  databaseURL: "https://week11app-64a55-default-rtdb.firebaseio.com",
  projectId: "week11app-64a55",
  storageBucket: "week11app-64a55.firebasestorage.app",
  messagingSenderId: "782975379361",
  appId: "1:782975379361:web:4754f6800180bc57058de0",
  measurementId: "G-CRRR7L4QPX",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase Database reference
const db = firebase.database();

// Handle Sign-In
document.getElementById("signinForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signinEmail").value;
  const password = document.getElementById("signinPassword").value;

  try {
    // Sign in with email and password
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const idToken = await userCredential.user.getIdToken();

    // Save the token in localStorage
    localStorage.setItem("authToken", idToken);

    // Redirect to welcome page
    window.location.href = "welcome.html";
  } catch (error) {
    document.getElementById("signinMessage").innerText = error.message;
  }
});

// Handle Sign-Up
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const name = document.getElementById("signupName").value;

  try {
    // Create a new user with email and password
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);

    // Save additional user data in the Realtime Database
    const userId = userCredential.user.uid;
    await db.ref(`users/${userId}`).set({
      name: name,
      email: email,
    });

    document.getElementById("signupMessage").innerText = "Account created successfully!";
  } catch (error) {
    document.getElementById("signupMessage").innerText = error.message;
  }
});

// Optionally: Logout Functionality
function logout() {
  firebase.auth().signOut().then(() => {
    localStorage.removeItem("authToken");
    window.location.href = "index.html"; // Redirect to the login page
  }).catch((error) => {
    console.error("Error during logout: ", error.message);
  });
}
