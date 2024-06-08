document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    function login() {
        // 构建要发送到服务器的数据对象
        const userData = {
            username: username,
            password: password,
        };

        $.ajax({
                    url: '/login',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(userData),
                    success: function(response) {
                    alert(response.message);
                    if (response.message === 'Logged in as admin' && role === 'admin') {
                    window.location.href = 'http://127.0.0.1:5000/static/admin/admin_dashboard.html';
                } else if (response.message === 'Logged in as doctor' && role === 'doctor') {
                    window.location.href = 'http://127.0.0.1:5000/static/doctor/doctor_dashboard.html';
                } else if (response.message === 'Logged in as patient' && role === 'patient') {
                    window.location.href = "http://127.0.0.1:5000/static/patient/patient_dashboard.html";
                } else {
                    alert(response.message || 'Invalid credentials');
                }
            },
                    error: function(xhr, status, error) {
                        alert('登录失败: ' + error);
                    }
                });
    }
    login();
});
