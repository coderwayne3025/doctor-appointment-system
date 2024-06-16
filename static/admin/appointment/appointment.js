document.addEventListener('DOMContentLoaded', function() {
    // 初始加载预约列表
    loadAppointments();

    // 搜索功能
    document.getElementById('search').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchAppointments();
        }
    });
});

function loadAppointments() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/get-appointments', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var appointments = JSON.parse(xhr.responseText);
            updateAppointmentTable(appointments);
        } else {
            console.error('Failed to fetch appointments:', xhr.statusText);
        }
    };
    xhr.onerror = function() {
        console.error('Request error...');
    };
    xhr.send();
}

function updateAppointmentTable(appointments) {
    var tbody = document.querySelector('#appointment-list tbody');
    tbody.innerHTML = ''; // 清空现有列表

    appointments.forEach(function(appointment) {
        var row = `
            <tr>
                <td>${appointment.id}</td>
                <td>${appointment.patientName}</td>
                <td>${appointment.doctorName}</td>
                <td>${appointment.appointmentTime}</td>
                <td>${appointment.status}</td>
                <!-- 可以添加更多列 -->
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function searchAppointments() {
    var searchTerm = document.getElementById('search').value;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `/get-appointments?search=${encodeURIComponent(searchTerm)}`, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var appointments = JSON.parse(xhr.responseText);
            updateAppointmentTable(appointments);
        } else {
            console.error('Search failed:', xhr.statusText);
        }
    };
    xhr.onerror = function() {
        console.error('Request error...');
    };
    xhr.send();
}