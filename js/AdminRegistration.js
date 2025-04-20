
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

const adminRegistrationForm = document.getElementById('adminRegistrationForm');

adminRegistrationForm.addEventListener('submit', function(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const gymName = document.getElementById('gymName').value;

  // Register the admin with Firebase Authentication
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Add additional gym information to Firestore
      return firestore.collection('gyms').doc(userCredential.user.uid).set({
        ownerEmail: email,
        gymName: gymName,
        password: password
      });
    })
    .then(() => {
      // Redirect or show success message
      console.log('Admin registered successfully');
      // Redirect to dashboard or show success message
    })
    .catch((error) => {
      // Handle errors
      console.error('Error registering admin:', error.message);
    });
});