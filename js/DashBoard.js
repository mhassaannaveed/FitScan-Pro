const firebaseConfig = {
    apiKey: "AIzaSyAcVcB4nUDTuDuvo3yz1Bzsmo60MfY9-fE",
    authDomain: "final-year-project-6e437.firebaseapp.com",
    databaseURL: "https://final-year-project-6e437-default-rtdb.firebaseio.com",
    projectId: "final-year-project-6e437",
    storageBucket: "final-year-project-6e437.appspot.com",
    messagingSenderId: "606296370149",
    appId: "1:606296370149:web:567cce8e5c9e8c7f791d0c",
    measurementId: "G-CMVRYXQWEX"
  };
  firebase.initializeApp(firebaseConfig);
  
  // Access Firestore
  const firestore = firebase.firestore();
  const storage = firebase.storage();


// Get reference to the logout button
const logoutButton = document.getElementById('logoutButton');

// Add event listener to the logout button
logoutButton.addEventListener('click', function() {
  // Sign out the current user
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    console.log('User signed out successfully.');
    // Redirect the user to the login page or perform any other action
    window.location.href = "/html/AdminLogin.html";
  }).catch(function(error) {
    // An error happened.
    console.error('Error signing out:', error.message);
  });
});





// Get reference to the RECORD button
function viewMemberRecords() {
  // Redirect to member records page
  window.location.href = "/html/MemberRecord.html";
}

