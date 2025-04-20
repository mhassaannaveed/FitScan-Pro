const firebaseConfig = {
  apiKey: "AIzaSyAcVcB4nUDTuDuvo3yz1Bzsmo60MfY9-fE",
  authDomain: "final-year-project-6e437.firebaseapp.com",
  databaseURL: "https://final-year-project-6e437-default-rtdb.firebaseio.com",
  projectId: "final-year-project-6e437",
  storageBucket: "final-year-project-6e437.appspot.com",
  messagingSenderId: "606296370149",
  appId: "1:606296370149:web:567cce8e5c9e8c7f791d0c",
  measurementId: "G-CMVRYXQWEX",
};
firebase.initializeApp(firebaseConfig);

// Access Firestore
const firestore = firebase.firestore();
// Access Firebas  e Authentication
const auth = firebase.auth();
const storage = firebase.storage();

// Get reference to the member registration form
const memberRegistrationForm = document.getElementById(
  "memberRegistrationForm"
);

function calculateAge(birthDate) {
  const now = new Date();
  const birth = new Date(birthDate);

  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  const dayDiff = now.getDate() - birth.getDate();

  console.log(age, monthDiff, dayDiff);

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

// Add submit event listener to the member registration form
memberRegistrationForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  // Get values from form inputs
  const rfid = document.getElementById("rfid").value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const gender = document.getElementById("gender").value;
  const medicalhistory = document.getElementById("medicalhistory").value;
  const dateOfBirth = document.getElementById("dateOfBirth").value;
  const password = document.getElementById("password").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  const pictureFile = document.getElementById("picture").files[0];

  const age = calculateAge(dateOfBirth);
  const minimumAge = 18;

  if (age < minimumAge) {
    alert(`Member must be at least ${minimumAge} years old to register.`);
    return;
  }

  try {
    // Create user account with email and password using Firebase Auth REST API
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error.message);
    }
    // Get user ID from the response
    const data = await response.json();
    const userId = data.localId;

    // Upload picture to Firebase Storage
    const pictureRef = storage
      .ref()
      .child("member-profile-pictures/" + pictureFile.name);
    await pictureRef.put(pictureFile);
    const pictureUrl = await pictureRef.getDownloadURL();

    // Get authenticated admin user
    const user = firebase.auth().currentUser;

    // Get gym ID from the admin user data
    const gymId = user ? user.uid : null;

    if (!gymId) {
      console.error("Admin not authenticated or gym ID not found");
      return;
    }

    await firestore.collection("bmiCollection").doc(rfid).set({
      bmiEntries: [],
    });

    await firestore.collection("members").doc(userId).set({
      id: userId,
      adminId: gymId,
      rfid: rfid?.trim(),
      name,
      email: email,
      gender: gender,
      medicalhistory: medicalhistory,
      age: age,
      password: password,
      phoneNumber: phoneNumber,
      pictureUrl: pictureUrl,
    });

    console.log("Member registered successfully");
    alert("Member registered successfully!");
  } catch (error) {
    console.error("Error registering member:", error.message);
    alert("Error registering member. Please try again.");
  }
});

getImagePreview = (event) => {
  let image = URL.createObjectURL(event.target.files[0]);
  let imagediv = document.getElementById("preview");
  let newimage = document.createElement("img");
  imagediv.innerHTML = "";
  newimage.src = image;
  newimage.height = "340";
  newimage.width = "270";
  newimage.style.borderRadius = "15px";
  imagediv.appendChild(newimage);
};
