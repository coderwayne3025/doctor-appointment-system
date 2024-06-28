document.addEventListener('DOMContentLoaded', function () {
    // 监听添加医生表单的提交事件
    updateDoctorList();
    document.getElementById('addDoctorForm').addEventListener('submit', function (event) {
        event.preventDefault(); // 阻止表单默认提交行为

        var formData = new FormData(event.target);
        var doctorData = {
            name: formData.get('name'),
            specialty: formData.get('specialty'),
            contact: formData.get('contact'),
            location: formData.get('location')
        };

        // 使用AJAX发送数据到服务器
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/add-doctor', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status === 200) {
                // 添加成功后，更新医生列表
                updateDoctorList();
                alert('医生添加成功！');
            } else {
                alert('添加医生失败，请重试！');
            }
        };
        xhr.send(JSON.stringify(doctorData));
    });

    // 为每个删除按钮添加点击事件监听器
    document.getElementById('doctor-list').addEventListener('click', function (event) {
        if (event.target && event.target.matches('.delete-doctor')) {
            var doctorId = event.target.getAttribute('data-id');
            // 使用AJAX发送删除请求到服务器
            var xhr = new XMLHttpRequest();
            xhr.open('DELETE', '/delete-doctor/' + doctorId, true);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    // 删除成功后，更新医生列表
                    updateDoctorList();
                    alert('医生删除成功！');
                } else {
                    alert('删除医生失败，请重试！');
                }
            };
            xhr.send();
        }
    });
});

function updateDoctorList() {
    // 使用AJAX请求获取最新的医生列表
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/doctors-show', true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var doctors = JSON.parse(xhr.responseText);
            var tbody = document.querySelector('#doctor-list tbody');
            tbody.innerHTML = ''; // 清空现有列表
            doctors.forEach(function (doctor) {
                var row = `<tr>
                    <td>${doctor.name}</td>
                    <td>${doctor.specialty}</td>
                    <td>${doctor.contact}</td>
                    <td>${doctor.location}</td>
                    <td><button class="delete-doctor" data-id="${doctor.id}">删除</button></td>
                </tr>`;
                tbody.innerHTML += row;
            });
        }
    };
    xhr.send();
}