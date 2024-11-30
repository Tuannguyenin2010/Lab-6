// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAW9R61KJT_GRH7cdETDOajlAp9tZSWDOU",
  authDomain: "fir-app-44e7a.firebaseapp.com",
  projectId: "fir-app-44e7a",
  storageBucket: "fir-app-44e7a.firebasestorage.app",
  messagingSenderId: "372641714760",
  appId: "1:372641714760:web:11fe1e76e23f9cfbf7fe7d",
  measurementId: "G-Q4XCDTS4W3"
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
