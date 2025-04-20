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

const db = firebase.firestore();
const storage = firebase.storage();

const updateForm = document.getElementById("updateForm");

function populateMemberDetails(memberId) {
  firebase.auth().onAuthStateChanged(async function (user) {
    if (user) {
      const memberRef = db
        .collection("members")
        .where("adminId", "==", user?.uid)
        .where("id", "==", memberId);

      const querySnapshot = await memberRef.get();
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const member = doc.data();
        updateForm.name.value = member.name;
        updateForm.dateOfBirth.value = member.dateOfBirth;
        updateForm.regno.value = member.rfid;
        updateForm.email.value = member.email;
        updateForm.contact.value = member.phoneNumber;
        updateForm.gender.value = member.gender;
        updateForm.image.src = member.pictureUrl;
        updateForm.image.height = "340";
        updateForm.image.width = "270";
        updateForm.image.style.borderRadius = "15px";
      } else {
        console.error("No such member document found.");
      }
    } else {
      console.log("not found anything");
    }
  });
}

updateForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const updateRfid = updateForm.elements.regno.value;
  const updatedName = updateForm.elements.name.value;
  const updatedDateOfBirth = updateForm.elements.dateOfBirth.value;
  const updatedContact = updateForm.elements.contact.value;
  const updateImage = updateForm.elements.picture.files[0];

  const memberRef = db
    .collection("members")
    .where("adminId", "==", firebase.auth().currentUser.uid)
    .where("id", "==", memberId);

  try {
    const querySnapshot = await memberRef.get();
    if (querySnapshot.empty) return alert("No member to update");

    const doc = querySnapshot.docs[0];
    const memberData = doc.data();

    if (updateImage) {
      const pictureRef = storage
        .ref()
        .child("member-profile-pictures/" + updateImage.name);
      const snapshot = await pictureRef.put(updateImage);
      const downloadURL = await snapshot.ref.getDownloadURL();

      await db.collection("members").doc(doc.id).update({
        name: updatedName,
        dateOfBirth: updatedDateOfBirth,
        phoneNumber: updatedContact,
        pictureUrl: downloadURL,
      });

      alert("Member Record Updated with new image");
    } else {
      if (memberData.rfid !== updateRfid && updateRfid.trim() !== "") {
        let memberPrevRfid = memberData?.rfid?.trim();
        let updatedRfid = updateRfid.trim();

        const docRef = await db.collection("bmiCollection").doc(memberPrevRfid);
        const docSnapshot = await docRef.get();

        if (docSnapshot.exists) {
          console.log("in snapshot");
          const bmiData = docSnapshot.data();

          console.log(bmiData,'BMI_DATA')

          const bmiValues = bmiData.bmiEntries;
          const newMemberRef = db.collection("bmiCollection").doc(updatedRfid);

          await newMemberRef.set({
            bmiEntries: bmiValues,
          });

          await db.collection("members").doc(doc.id).update({
            rfid: updateRfid,
          });

          await db.collection("bmiCollection").doc(memberPrevRfid).delete();
        }
      }

      await db.collection("members").doc(doc.id).update({
        name: updatedName,
        dateOfBirth: updatedDateOfBirth,
        phoneNumber: updatedContact,
      });

      alert("Member Record Updated");
    }
  } catch (error) {
    console.error("Error updating member record:", error);
    alert("An error occurred while updating member record");
  }
});

// Get member ID from URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const memberId = urlParams.get("memberId");
populateMemberDetails(memberId);

imageCheck = (event) => {
  let image = URL.createObjectURL(event.target.files[0]);
  let imageDiv = document.getElementById("image");
  imageDiv.src = image;
};
