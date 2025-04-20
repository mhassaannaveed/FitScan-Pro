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
// Access Firebase Authentication

//storage
const storage = firebase.storage();

// Get reference to the tbody element of the table
const memberRecordsBody = document.getElementById('memberRecordsBody');



// Function to fetch and display member records
function displayMemberRecords() {
  console.log('Function displayMemberRecords called.');

  // Add an authentication state change listener
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log('Auth state changed: User is logged in.');
      console.log('Fetching member records for admin:', user.uid);


      db.collection('members').where('adminId', '==', user?.uid).get()
        .then((querySnapshot) => {
          console.log('Received member records:', querySnapshot.size);
          memberRecordsBody.innerHTML = '';

          let index = 1;
          querySnapshot.forEach((doc) => {
            const member = doc.data();
            const row = `
            <tr class="border-dark">
              <td class="text-center">${index}</td>
              <td class="text-center">${member.rfid}</td>
              <td class="text-center">${member.name}</td>
              <td class="text-center">
                <button class="mx-1 btn text-danger border border-danger" onclick="deleteMember('${doc.id}')">Delete</button>
                <button class="mx-1 btn text-success border border-success" onclick="showMember('${doc.id}')">Show</button>
                <button class="mx-1 btn text-secondary border border-secondary" onclick="updateMember('${doc.id}')">Update</button>
              </td>
            </tr>
          `;
            console.log(doc.id)
            memberRecordsBody.innerHTML += row;
            index++;
          });
        })
        .catch((error) => {
          console.error('Error fetching member records:', error);
        });
    } else {
      // No user is signed in.
      console.log('No user logged in.');
    }
  });
}

displayMemberRecords();


// Function to delete a member and associated data
async function deleteMember(memberId) {
  // Confirm deletion with the admin
  const confirmDelete = confirm("Are you sure you want to delete this member?");

  if (confirmDelete) {
    const memberRef = db.collection('members')
      .where('adminId', '==', firebase.auth().currentUser.uid)
      .where('id', '==', memberId);

    const querySnapshot = await memberRef.get();

    if (!querySnapshot.empty) {

      const doc = querySnapshot.docs[0];



      db.collection('members').doc(doc.id).delete()
        .then(async () => {
          console.log('Member deleted successfully');

          const memberData = doc.data();
          if (memberData.pictureUrl) {
            const storageRef = storage.refFromURL(memberData.pictureUrl);
            await storageRef.delete();
            console.log('Associated image deleted successfully');
          }

          displayMemberRecords();
        })
        .catch((error) => {
          console.error('Error deleting member:', error);
        });
    } else {
      console.error('No matching member documents found.');
    }

  }
}


// Define the showMember function
function showMember(memberId) {
  // Redirect to the memberProfile.html page with the member ID as a query parameter
  window.location.href = `/html/MemberProfile.html?memberId=${memberId}`;
}
// Define the updateMember function
function updateMember(memberId) {
  // Redirect to the updateMember.html page with the member ID as a query parameter
  window.location.href = `/html/MemberUpdate.html?memberId=${memberId}`;
}
