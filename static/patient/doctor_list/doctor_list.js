// script.js
document.addEventListener('DOMContentLoaded', function () {
    fetchDoctorsList();
});
/*
async function fetchDoctorsList() {
    try {
        const response = await fetch('/doctors'); // 假设这是获取医生数据的API端点
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const doctors = await response.json();
        displayDoctors(doctors);
    } catch (error) {
        console.error('Fetching doctors failed:', error);
    }
}
*/

async function fetchDoctorsList() {
    try {
        const response = await fetch('/doctors'); // 假设这是获取医生数据的API端点
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const doctors = await response.json();
        displayDoctors(doctors);
    } catch (error) {
        console.error('Fetching doctors failed:', error);
    }
    displayDoctors(doctors)
    // 假设这是从服务器获取的医生数据
    //const response = await fetch('/doctors');
    //const doctors = await response.json();
    /*fetch('/doctors', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // If authentication is required, add the token here
            // 'Authorization': 'Bearer ' + yourAuthToken
        }
    })
    .then(doctors => response.json())
    .then(displayDoctors(doctors))
    .catch(error => console.error('Error fetching doctors:', error));
    const doctors = [
        { id: 1, name: '张医生', specialty: '内科' ,timelist: ['09:00', '10:00', '11:00']},
        { id: 2, name: '李医生', specialty: '外科' ,timelist: ['08:30', '09:30', '14:00'] },
        { id: 3, name: '王医生', specialty: '儿科' ,timelist: ['10:15', '11:15', '15:00'] }
    ];*/
    function displayDoctors(doctors) {
        const listContainer = document.getElementById('doctor-list');
        doctors.forEach(doctor => {
            const card = document.createElement('div');
            card.className = 'doctor-card';
            card.innerHTML = `
            <img src="../image/doctor.png" alt="${doctor.name}">
            <div class="doctor-info">
                <h2>${doctor.username}</h2>
                <p>科室: ${doctor.specialty}</p>
                <p>ID: ${doctor.id}</p>
            </div>
        `;
            listContainer.appendChild(card);
        });
    }
}