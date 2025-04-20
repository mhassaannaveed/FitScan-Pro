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

  // Access Firebase Authentication
  const auth = firebase.auth();


const loginForm = document.getElementById('adminLoginForm');
// Add submit event listener to the login form
loginForm.addEventListener('submit', function(event) {
  event.preventDefault();

  // Get values from form inputs
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Sign in the user with Firebase Authentication
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      
      // Check if the user is an admin
      firestore.collection('gyms').doc(user.uid).get()
        .then((doc) => {
          if (doc.exists) {
            // Admin logged in successfully
            console.log('Admin logged in successfully:', user);
            window.location.href = "/html/Dashboard.html"; // Redirect to the admin dashboard
          } else {
            // Check if the user is a member
            firestore.collection('members').doc(user.uid).get()
              .then((doc) => {
                if (doc.exists) {
                  // Member logged in successfully
                  console.log('Member logged in successfully:', user);
                  window.location.href = `/html/MemberData.html?userId=${user.uid}`; // Redirect to the member profile page
                } else {
                  // User is not an admin or a member
                  console.error('User is neither an admin nor a member');
                  // Optionally display an error message to the user
                  alert('You are not authorized to access this system.');
                }
              })
              .catch((error) => {
                console.error('Error checking user role (member):', error.message);
                // Optionally display an error message to the user
                alert('An error occurred. Please try again.');
              });
          }
        })
        .catch((error) => {
          console.error('Error checking user role (admin):', error.message);
          // Optionally display an error message to the user
          alert('An error occurred. Please try again.');
        });
    })
    .catch((error) => {
      console.error('Error logging in:', error.message);
      // Optionally display an error message to the user
      alert('Invalid email or password. Please try again.');
    });
});


























// // Get reference to the admin login form
// const adminLoginForm = document.getElementById('adminLoginForm');

// // Add submit event listener to the admin login form
// adminLoginForm.addEventListener('submit', function(event) {
//   event.preventDefault();

//   // Get values from form inputs
//   const email = document.getElementById('email').value;
//   const password = document.getElementById('password').value;

//   // Sign in the admin with Firebase Authentication
//   auth.signInWithEmailAndPassword(email, password)
//     .then((userCredential) => {
//       console.log('Admin logged in successfully:', userCredential.user);
//       // Optionally redirect to the dashboard or show a success message
//       window.location.href = "/html/DashBoard.html"; // Redirect to the admin dashboard page
//     })
//     .catch((error) => {
//       console.error('Error logging in admin:', error.message);
//       // Optionally display an error message to the user
//       alert('Invalid email or password. Please try again.');
//     });
// });