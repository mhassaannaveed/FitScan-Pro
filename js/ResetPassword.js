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
  
  // Reference to the Firestore database
  const db = firebase.firestore();
  // const auth = firebase.auth();

  const changePasswordForm = document.getElementById('changePasswordForm');

  // Add event listener for form submission
  changePasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission
  
    // Get the new password from the form input field
    const newPassword = changePasswordForm.newPassword.value;
  
    try {
      // Get the current user
      const user = firebase.auth().currentUser;
      if (user) {
        // Update the password for the current user
        await user.updatePassword(newPassword);
        console.log('Password updated successfully');
        alert('Password updated successfully');
        // Redirect or perform any other action after password update
        window.location.href = `/html/AdminLogin.html`
      } else {
        console.error('User not logged in.');
        alert('User not logged in. Please log in again.');
        // Redirect the user to the login page or perform any other action
      }
    } catch (error) {
      console.error('Error updating password:', error.message);
      alert('Error updating password. Please try again.');
    }
  });