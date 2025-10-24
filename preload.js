import { db } from './firebase.js';
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { auth } from './firebase.js';

const facultyData = [
    // AIDS Department
    { name: "Mrs M.A. Reetha Jeyarani", department: "AIDS", designation: "Assistant Professor", email: "reethajeyarani@rkct.edu" },
    { name: "Ms S Murugavalli", department: "AIDS", designation: "Assistant Professor", email: "murugavalli@rkct.edu" },
    { name: "Mrs E Sri Santhoshini", department: "AIDS", designation: "Assistant Professor", email: "srisanthoshini@rkct.edu" },
    { name: "Mrs D Deena Rose", department: "AIDS", designation: "Assistant Professor", email: "deenarose@rkct.edu" },
    { name: "Mr P.B Aravind Prasad", department: "AIDS", designation: "Assistant Professor", email: "aravindprasad@rkct.edu" },
    { name: "Mr T Praveenkumar", department: "AIDS", designation: "Assistant Professor", email: "praveenkumar@rkct.edu" },
    { name: "Mrs A Sumathi", department: "AIDS", designation: "Assistant Professor", email: "sumathi@rkct.edu" },
    { name: "Mr R Roshan Joshua", department: "AIDS", designation: "Assistant Professor", email: "roshanjoshua@rkct.edu" },
    { name: "Mr Joshuva Isaac", department: "AIDS", designation: "Assistant Professor", email: "joshuvaisaac@rkct.edu" },
    { name: "Mrs G Nalina Keerthana", department: "AIDS", designation: "Assistant Professor", email: "nalinakeerthana@rkct.edu" },
    { name: "Mrs Geetha S", department: "AIDS", designation: "Assistant Professor", email: "geethas@rkct.edu" },
    { name: "Mrs Joany Franklin", department: "AIDS", designation: "Assistant Professor", email: "joanyfranklin@rkct.edu" },
    { name: "Mr T Shyamsundar", department: "AIDS", designation: "Assistant Professor", email: "shyamsundar@rkct.edu" },
    { name: "Ms M Bharathi", department: "AIDS", designation: "Assistant Professor", email: "bharathi@rkct.edu" },
    { name: "Mr Ganga Naidu K", department: "AIDS", designation: "Assistant Professor", email: "ganganaidu@rkct.edu" },
    { name: "Ms R Swethabharathi", department: "AIDS", designation: "Assistant Professor", email: "swethabharathi@rkct.edu" },
    { name: "Mr C Muthukumaran", department: "AIDS", designation: "A-HOD / Assistant Professor", email: "muthukumaran@rkct.edu" },
    { name: "Dr T Avudaiappan", department: "AIDS", designation: "HOD / Associate Professor", email: "avudaiappan@rkct.edu" },

    // EEE Department
    { name: "Ms A.Anton Amala Praveen", department: "EEE", designation: "Assistant Professor", email: "amalapraveen@rkct.edu" },
    { name: "Mr T.Ramkumar", department: "EEE", designation: "Assistant Professor", email: "ramkumar@rkct.edu" },
    { name: "Mr M.D. Udaya Kumar", department: "EEE", designation: "Assistant Professor", email: "udayakumar@rkct.edu" },
    { name: "Ms S.Vijaya Lakshmi", department: "EEE", designation: "Assistant Professor/SG", email: "vijayalakshmi@rkct.edu" },
    { name: "Dr R. Jai Ganesh", department: "EEE", designation: "Assistant Professor", email: "jaiganesh@rkct.edu" },
    { name: "Mr V Sureshkumar", department: "EEE", designation: "Assistant Professor", email: "sureshkumar@rkct.edu" },
    { name: "Dr S Jeyasudha", department: "EEE", designation: "Professor", email: "jeyasudha@rkct.edu" },
    { name: "Dr R.Madavan", department: "EEE", designation: "Professor", email: "madavan@rkct.edu" },
    { name: "Dr J Mahil", department: "EEE", designation: "Professor", email: "mahil@rkct.edu" },
    { name: "Mr P Sekar", department: "EEE", designation: "Assistant Professor", email: "sekar@rkct.edu" },
    { name: "Mr P Prakash", department: "EEE", designation: "Assistant Professor", email: "prakash@rkct.edu" },
    { name: "Dr AT Sankara Subramanian", department: "EEE", designation: "HOD / Assistant Professor", email: "sankarasubramanian@rkct.edu" }
];

document.getElementById('preload-btn').addEventListener('click', async () => {
    console.log('Starting to preload data...');
    for (const faculty of facultyData) {
        try {
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, faculty.email, 'defaultPassword123');
            const user = userCredential.user;
            
            // Use the UID from Auth as the document ID in Firestore
            await setDoc(doc(db, "faculty", user.uid), {
                name: faculty.name,
                department: faculty.department,
                designation: faculty.designation,
                email: faculty.email,
                available: false,
                tentative_time: "",
                last_updated: new Date()
            });
            console.log(`Successfully added ${faculty.name}`);
        } catch (error) {
            console.error(`Error adding ${faculty.name}:`, error);
        }
    }
    console.log('Data preloading complete.');
    alert('Data preloading complete. Check the console for details.');
});

document.getElementById('create-student-btn').addEventListener('click', async () => {
    console.log('Attempting to create a test student...');
    const email = 'teststudent@gmail.com';
    const password = 'password123';

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Successfully created test student:', userCredential.user.uid);
        alert('Test student created successfully!\nEmail: teststudent@gmail.com\nPassword: password123');
    } catch (error) {
        console.error('Error creating test student:', error);
        alert(`Failed to create test student. It might already exist. Error: ${error.message}`);
    }
});