import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { doc, getDoc, updateDoc, collection, query, where, onSnapshot, addDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

function handleLogin() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        const errorMessage = document.getElementById('error-message');

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                if (role === 'faculty') {
                    window.location.href = 'faculty-dashboard.html';
                } else {
                    window.location.href = 'student-dashboard.html';
                }
            })
            .catch((error) => {
                console.error(`Login Error [${error.code}]:`, error.message);
                if (errorMessage) {
                    errorMessage.textContent = 'Login Failed: Please check your email and password.';
                }
            });
    });
}

function handleFacultyDashboard() {
    const facultyDashboard = document.getElementById('faculty-details');
    if (!facultyDashboard) return;

    const facultyNameEl = document.getElementById('faculty-name');
    const facultyDepartmentEl = document.getElementById('faculty-department');
    const facultyDesignationEl = document.getElementById('faculty-designation');
    const availabilityToggle = document.getElementById('availability-toggle');
    const availabilityStatusEl = document.getElementById('availability-status');
    const tentativeTimeInput = document.getElementById('tentative-time');
    const updateAvailabilityBtn = document.getElementById('update-availability-btn');
    const appointmentsListEl = document.getElementById('appointments-list');
    const logoutBtn = document.getElementById('logout-btn');
    let currentFacultyId = null;

    onAuthStateChanged(auth, user => {
        if (user) {
            currentFacultyId = user.uid;
            loadFacultyData(user.uid);
            loadAppointments(user.uid);
        } else {
            window.location.href = 'index.html';
        }
    });

    async function loadFacultyData(facultyId) {
        const docRef = doc(db, "faculty", facultyId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            facultyNameEl.textContent = data.name;
            facultyDepartmentEl.textContent = data.department;
            facultyDesignationEl.textContent = data.designation;
            availabilityToggle.checked = data.available;
            availabilityStatusEl.textContent = data.available ? 'Available' : 'Not Available';
            tentativeTimeInput.value = data.tentative_time;
        }
    }

    availabilityToggle.addEventListener('change', () => {
        availabilityStatusEl.textContent = availabilityToggle.checked ? 'Available' : 'Not Available';
    });

    updateAvailabilityBtn.addEventListener('click', async () => {
        if (!currentFacultyId) return;
        const facultyRef = doc(db, "faculty", currentFacultyId);
        await updateDoc(facultyRef, {
            available: availabilityToggle.checked,
            tentative_time: tentativeTimeInput.value,
            last_updated: new Date()
        });
        alert('Availability updated successfully!');
    });

    function loadAppointments(facultyId) {
        const q = query(collection(db, "appointments"), where("faculty_id", "==", facultyId));
        onSnapshot(q, (querySnapshot) => {
            appointmentsListEl.innerHTML = querySnapshot.empty ? '<p>No upcoming appointments.</p>' : '';
            querySnapshot.forEach((doc) => {
                const appointment = doc.data();
                const appointmentEl = document.createElement('div');
                appointmentEl.innerHTML = `<p><strong>Student:</strong> ${appointment.student_id.substring(0,6)}...</p><p><strong>Time:</strong> ${appointment.scheduled_time}</p><p><strong>Reason:</strong> ${appointment.reason}</p>`;
                appointmentsListEl.appendChild(appointmentEl);
            });
        });
    }

    logoutBtn.addEventListener('click', () => signOut(auth).then(() => window.location.href = 'index.html'));
}

function handleStudentDashboard() {
    const studentDashboard = document.getElementById('faculty-list');
    if (!studentDashboard) return;

    const facultyListEl = document.getElementById('faculty-list');
    const departmentFilter = document.getElementById('department-filter');
    const categoryFilter = document.getElementById('category-filter');
    const facultyNameFilter = document.getElementById('faculty-name-filter');
    const logoutBtn = document.getElementById('logout-btn');
    const bookingModal = document.getElementById('booking-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const bookingForm = document.getElementById('booking-form');
    const modalFacultyName = document.getElementById('modal-faculty-name');
    const modalFacultyId = document.getElementById('modal-faculty-id');
    let currentUserId = null;

    onAuthStateChanged(auth, user => {
        if (user) {
            currentUserId = user.uid;
            loadFaculty();
        } else {
            window.location.href = 'index.html';
        }
    });

    function loadFaculty() {
        let queries = [];
        const dept = departmentFilter.value;
        const category = categoryFilter.value;
        if (dept) queries.push(where("department", "==", dept));
        if (category) queries.push(where("designation", "==", category));
        
        const facultyQuery = queries.length > 0 ? query(collection(db, "faculty"), ...queries) : collection(db, "faculty");

        onSnapshot(facultyQuery, (querySnapshot) => {
            let html = '';
            const nameFilter = facultyNameFilter.value.trim().toLowerCase();
            querySnapshot.forEach((doc) => {
                const faculty = doc.data();
                if (nameFilter && !faculty.name.toLowerCase().includes(nameFilter)) return;
                
                const availabilityClass = faculty.available ? 'available' : 'unavailable';
                html += `
                    <div class="faculty-list-card">
                        <h4>${faculty.name}</h4>
                        <p>${faculty.designation}</p>
                        <p>${faculty.department}</p>
                        <p>Status: <span class="status ${availabilityClass}">${faculty.available ? 'Available' : 'Not Available'}</span></p>
                        <p>Tentative Time: ${faculty.tentative_time || 'N/A'}</p>
                        ${faculty.available ? `<button class="book-meeting-btn" data-id="${doc.id}" data-name="${faculty.name}">Book Meeting</button>` : ''}
                    </div>`;
            });
            facultyListEl.innerHTML = html || '<p>No faculty found.</p>';
        });
    }

    [departmentFilter, categoryFilter, facultyNameFilter].forEach(el => el.addEventListener('change', loadFaculty));
    facultyNameFilter.addEventListener('input', loadFaculty);

    facultyListEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('book-meeting-btn')) {
            modalFacultyId.value = e.target.dataset.id;
            modalFacultyName.textContent = e.target.dataset.name;
            bookingModal.style.display = 'block';
        }
    });

    closeModalBtn.addEventListener('click', () => bookingModal.style.display = 'none');
    window.addEventListener('click', (e) => { if (e.target == bookingModal) bookingModal.style.display = 'none'; });

    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await addDoc(collection(db, "appointments"), {
            student_id: currentUserId,
            faculty_id: modalFacultyId.value,
            scheduled_time: document.getElementById('scheduled-time').value,
            reason: document.getElementById('reason').value,
            status: "pending",
            created_at: new Date()
        });
        alert('Appointment requested!');
        bookingModal.style.display = 'none';
        bookingForm.reset();
    });

    logoutBtn.addEventListener('click', () => signOut(auth).then(() => window.location.href = 'index.html'));
}

// --- Initialize Page Logic ---
document.addEventListener('DOMContentLoaded', () => {
    handleLogin();
    handleFacultyDashboard();
    handleStudentDashboard();
});