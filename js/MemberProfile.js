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

// Reference to the Firestore database
const db = firebase.firestore();
// Access Firebase Authentication


const memberDetailsDiv = document.getElementById("memberProfile");

function showMember(memberId) {
  firebase.auth().onAuthStateChanged(async function (user) {
    if (user) {
      try {
        let mem_reg = document.getElementById("member_regno");
        let mem_name = document.getElementById("member_name");
        let mem_age = document.getElementById("member_age");
        let mem_email = document.getElementById("member_email");
        let mem_contact = document.getElementById("member_num");
        let mem_gen = document.getElementById("member_gender");
        let mem_bmi = document.getElementById("member_bmi");
        let mem_image = document.getElementById("image_container");

        const memberRef = db
          .collection("members")
          .where("adminId", "==", user.uid)
          .where("id", "==", memberId);

        const querySnapshot = await memberRef.get();

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const memberData = doc.data();
          console.log("Member Data:", memberData);
          mem_reg.innerText = memberData.rfid;
          mem_name.innerText = memberData.name;
          mem_age.innerText = memberData.age;
          mem_gen.innerText = memberData.gender;
          mem_email.innerText = memberData.email;
          mem_contact.innerText = memberData.phoneNumber;
          mem_image.innerHTML = `<img class='card-img' src='${memberData.pictureUrl}' /> `;
          createChart(memberData?.rfid);
        } else {
          memberDetailsDiv.innerHTML = "<p>Member not found.</p>";
        }
      } catch (error) {
        console.error("Error fetching member details:", error);
        memberDetailsDiv.innerHTML = "<p>Error fetching member details.</p>";
      }
    }
  });
}

const createChart = async (documentId) => {
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];
  try {
    const docRef = db.collection("bmiCollection").doc(documentId);
    const docSnapshot = await docRef.get();

    if (docSnapshot.exists) {
      const bmiData = docSnapshot.data();
      console.log(bmiData);

      const bmiValues = bmiData?.bmiEntries?.map((entr) => entr.bmi);
      const timeStamp = bmiData?.bmiEntries?.map((entr) =>
        new Date(entr.timeStamp).toLocaleDateString()
      );
      const ctx = document.getElementById("myChart");
      const chartData = {
        labels: 'BMI Over Time',
        datasets: [
          {
            label: 'BMI Over Time',
            data: bmiValues,
            fill: false,
            borderColor: "rgb(220, 53, 69)",
            pointBackgroundColor: "rgb(220, 53, 69)",
            pointBorderColor: "rgb(220, 53, 69)",
            pointColor: "rgb(220, 53, 69)",
            pointStrokeColor: "rgb(220, 53, 69)",
            tension: 0.3,
          },
        ],
      };
      const chartConfig = {
        type: "line",
        data: chartData,
      };
      new Chart(ctx, chartConfig);
    } else {
      console.log("Document does not exist.");
    }
  } catch (error) {
    console.error("Error fetching document:", error);
  }
};

const urlParams = new URLSearchParams(window.location.search);
const memberId = urlParams.get("memberId");
showMember(memberId);
