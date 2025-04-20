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
  const db = firebase.firestore();
  // Access Firebase Authentication
  const auth = firebase.auth();

  // function calculateAge(birthDate) {
  //   const now = new Date();
  //   const birth = new Date(birthDate);
  
  //   let age = now.getFullYear() - birth.getFullYear();
  //   const monthDiff = now.getMonth() - birth.getMonth();
  //   const dayDiff = now.getDate() - birth.getDate();
  
  //   console.log(age, monthDiff, dayDiff);
  
  //   if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
  //     age--;
  //   }
  
  //   return age;
  // }
  

  
const memberDataDiv = document.getElementById('MemberData');


function showMember(memberId) {
  auth.onAuthStateChanged(async function (user) {
    console.log(user)
    if (user) {
      try {
        let mem_reg = document.getElementById('member_regno');
        let mem_name = document.getElementById('member_name');
        let mem_age = document.getElementById('member_age');
        let mem_email = document.getElementById('member_email');
        let mem_contact = document.getElementById('member_num');
        let mem_gen = document.getElementById('member_gender')
        let mem_medhistory = document.getElementById('member_medhistory');
        let mem_image = document.getElementById('image_container');
        
        console.log(memberId)
        const memberRef = db.collection('members')
            .where('id', '==', memberId);

        const querySnapshot = await memberRef.get();

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const memberData = doc.data();
          console.log('Member Data:', memberData);
          mem_reg.innerText = memberData.rfid;
          mem_name.innerText = memberData.name;
          mem_age.innerText = memberData.age;
          mem_gen.innerText = memberData.gender
          mem_email.innerText = memberData.email;
          mem_contact.innerText = memberData.phoneNumber;
          mem_medhistory.innerText = memberData.medicalhistory
          mem_image.innerHTML = `<img class='card-img' src='${memberData.pictureUrl}' /> ` 
          createChart(memberData?.rfid)
        } else {
          memberDataDiv.innerHTML = "<p>Member not found.</p>";
        }
      } catch (error) {
        console.error('Error fetching member details:', error);
        memberDataDiv.innerHTML = "<p>Error fetching member details.</p>";
      }
    }
  });
}


const createChart = async (documentId) => {
  const labels = [
    'January', 
    'February', 
    'March', 
    'April', 
    'May', 
    'June', 
    'July'];
  try {
    const docRef = db.collection('bmiCollection').doc(documentId);
    const docSnapshot = await docRef.get();
    let mem_fitlevel = document.getElementById('member_fitlevel')
    let mem_weight = document.getElementById('member_weight')
    let mem_height = document.getElementById('member_height')
    let mem_BMI = document.getElementById('member_BMI')
    
    console.log(docSnapshot)
    if (docSnapshot.exists) {
      const bmiData = docSnapshot.data();
      length = bmiData.bmiEntries.length - 1;
      const heightcm = bmiData.bmiEntries[length].height;
      const heightfeet = heightcm*0.0328;

      
      mem_fitlevel.innerText = bmiData.bmiEntries[length].bmiCategory
      mem_weight.innerText = bmiData.bmiEntries[length].weight
      mem_height.innerText = heightfeet.toFixed(2)
      mem_BMI.innerText = bmiData.bmiEntries[length].bmi
        
  
      const bmiValues = bmiData?.bmiEntries?.map((entr) => entr.bmi);
      const timeStamp = bmiData?.bmiEntries?.map((entr) =>
        new Date(entr.timeStamp).toLocaleDateString()
      );

      // const ctx = document.getElementById('myChart');
      // const chartData = {
      //   labels: timeStamp,
      //   datasets: [{
      //     label: 'BMI Over Time', // ✅ Corrected here
      //     data: bmiValues,
      //     fill: true,
      //     borderColor: 'rgb(220, 53, 69)',
      //     pointBackgroundColor: 'rgb(220, 53, 69)',
      //     pointBorderColor: 'rgb(220, 53, 69)',
      //     pointColor: 'rgb(220, 53, 69)',
      //     pointStrokeColor: 'rgb(220, 53, 69)',
      //     tension: 0.3,
      //   }],
      // };
      const ctx = document.getElementById('myChart').getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(220, 53, 69, 0.4)');
      gradient.addColorStop(1, 'rgba(220, 53, 69, 0)'); // fade to transparent
      const chartData = {
        labels: timeStamp,
        datasets: [{
          label: 'BMI Over Time',
          data: bmiValues,
          fill: true,
          backgroundColor: gradient,  // ✅ gradient fill
          borderColor: 'rgb(220, 53, 69)',
          pointBackgroundColor: 'rgb(220, 53, 69)',
          pointBorderColor: '#fff',
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.4,
        }],
      };
      const chartOptions = {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#333',
              font: {
                size: 14,
                family: 'Arial'
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => `BMI: ${context.parsed.y.toFixed(2)}`
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(0,0,0,0.05)',
            },
            ticks: {
              color: '#444',
              font: {
                size: 12
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(0,0,0,0.05)',
            },
            ticks: {
              color: '#444',
              font: {
                size: 12
              }
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutCubic'
        }
      };   
      

      const chartConfig = {
        type: 'line',
        data: chartData,
        options: chartOptions
      };
      new Chart(ctx, chartConfig);
    } else {
      console.log('Document does not exist.');
    }
  } catch (error) {
    console.error('Error fetching document:', error);
  }
};


const urlParams = new URLSearchParams(window.location.search);
const memberId = urlParams.get('userId');
showMember(memberId);

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


const changePasswordButton = document.getElementById('changePassword');

changePasswordButton.addEventListener('click', () => {
  const user = firebase.auth().currentUser;
  if (user) {
    const userId = user.uid;
    // Redirect to the change password page with user info as URL parameters
    window.location.href = `/html/ResetPassword.html?userId=${userId}`;
  } else {
    console.error('User not logged in.');
    alert('User not logged in. Please log in again.');
    // Redirect to the login page
    window.location.href = 'login.html';
  }
});

async function callAPI() {
  console.log('hello')
  try {
    // Extract memberId from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const memberId = urlParams.get('userId');
    
    if (!memberId) {
      throw new Error('Member ID not found in URL parameters.');
    }

    // Fetch member details from Firebase
    const memberRef = db.collection('members').where('id', '==', memberId);
    const memberSnapshot = await memberRef.get();
    if (memberSnapshot.empty) {
      throw new Error('Member not found.');
    }
    const memberData = memberSnapshot.docs[0].data();

    // Fetch BMI and fitness level details from Firebase
    const bmiRef = db.collection('bmiCollection').doc(memberData.rfid);
    const bmiSnapshot = await bmiRef.get();
    if (!bmiSnapshot.exists) {
      throw new Error('BMI data not found.');
    }
    const bmiData = bmiSnapshot.data();
    const latestBmiEntry = bmiData.bmiEntries[bmiData.bmiEntries.length - 1];

    // Construct the request body
    const requestBody = {
      Age: [memberData.age],
      Height: [latestBmiEntry.height*0.0328],
      Weight: [latestBmiEntry.weight],
      Gender: [memberData.gender],
      BMI: [latestBmiEntry.bmi],
      Fitness_Level: [latestBmiEntry.bmiCategory],
      Medical_History: [memberData.medicalhistory]
    };
   console.log(requestBody)
    // Call the API
    const response = await fetch('http://127.0.0.1:8000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API Response:', data);

    // Display the results
    document.getElementById('diet').innerText = data["Prediction for Diet Recommended"];
    document.getElementById('exercise').innerText = data["Prediction for Exercise"];
    document.getElementById('bmr').innerText = Math.round(data["Prediction for BMR"]);
    document.getElementById('calories').innerText = Math.round(data["Prediction for Calories"]);
  } catch (error) {
    console.error('Error calling API:', error);
  }
}
    