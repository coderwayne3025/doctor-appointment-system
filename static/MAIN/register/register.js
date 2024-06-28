document.getElementById('registrationForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;


    // 验证密码是否匹配
    if (password !== confirmPassword) {
        alert('密码不匹配，请重新输入。');
        console.log('密码不匹配，已显示警告框。');
        // 清除表单输入
        document.getElementById('password').value = '';
        document.getElementById('confirmPassword').value = '';

        // 将焦点移至密码输入框
        document.getElementById('password').focus();
        return;

    }
    function register() {
        var userData = {
            username: $('#username').val(),
            password: $('#password').val(),

        };

        // 发送AJAX请求
        $.ajax({
            url: '/register',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function (response) {
                alert(response.message);
                // 根据需要重定向或刷新页面
                if (response.message === 'User registered successfully!') {
                    // 弹出提示信息
                    alert(response.message);

                    // 重定向到登录页面
                    window.location.href = 'http://127.0.0.1:5000/static/MAIN/login/login.html';

                    // window.location.reload(true);
                } else {
                    // 如果服务器返回的消息不是预期的成功消息，可以在这里处理
                    alert('注册失败，请稍后再试或联系管理员。');
                }
            },
            error: function (xhr, status, error) {
                alert('注册失败: ' + error);
            }
        });
    }
    register();
    /*if (username!='' && password!=''&& role!='') {
        alert('User registered successfully! You can now login.');
        window.location.href = '../login/login.html';
    } else {
        alert(data.message);
    }*/
});