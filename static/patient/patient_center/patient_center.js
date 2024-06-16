// script.js
/*
document.addEventListener('DOMContentLoaded', function() {
    const patientId = '从用户会话获取的患者ID'; // 假设我们已经获取了患者ID
    fetchBookingHistory(patientId);
});

function fetchBookingHistory(patientId) {
    // 使用fetch API发送异步请求到服务器
    fetch(`/bookings?patientId=${patientId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // 解析JSON数据
    })
    .then(bookings => displayBookings(bookings))
    .catch(error => console.error('Fetching booking history failed:', error));
}
*/
document.addEventListener('DOMContentLoaded', function() {
    fetchBookingHistory();
});

function fetchBookingHistory() {
    // 假设这是从服务器获取的预约记录数据
    const bookings = [
        { id: 1, doctorName: '张医生', specialty: '内科', date: '2024-06-10', time: '09:00' },
        { id: 2, doctorName: '李医生', specialty: '外科', date: '2024-06-15', time: '14:00' }
    ];

    const historyContainer = document.getElementById('booking-history');
    historyContainer.innerHTML = `<h2>我的预约记录</h2>`; // 添加标题
    bookings.forEach(booking => {
        const item = document.createElement('div');
        item.className = 'booking-item';
        item.innerHTML = `
            <div class="booking-info">
                <h3>${booking.doctorName}</h3>
                <p>科室: ${booking.specialty}</p>
                <p>预约日期: ${booking.date}</p>
                <p>时间: ${booking.time}</p>
            </div>
        `;
        historyContainer.appendChild(item);
    });
}
