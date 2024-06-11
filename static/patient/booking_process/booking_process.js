async function loadDoctors() {
    // 获取用户选择的科室值
    var departmentSelect = document.getElementById('department');
    var selectedDepartment = departmentSelect.value;
    // 检查是否选择了科室
    if (!selectedDepartment) {
        alert('请选择一个科室。');
        return;
    }
    // 清空之前加载的医生列表
    var doctorSelect = document.getElementById('doctor');
    doctorSelect.innerHTML = '';

    // 调用后端API获取医生列表
    const response = await fetch('/doctors');
    const doctors = await response.json();

    doctors.forEach(doctor => {
        if (doctor.specialty === selectedDepartment) {
            var option = document.createElement('option');
            option.value = doctor.id; // 假设每个医生有一个唯一的ID
            option.textContent = doctor.username; // 显示医生的名字
            option.setAttribute('data-timelist', JSON.stringify(doctor.availability)); // 假设每个医生有多个时间点
            doctorSelect.appendChild(option);
        }
    })
    document.getElementById('select-department').style.display = 'none';
    document.getElementById('select-doctor').style.display = 'block';
    // 如果没有找到匹配的医生，给用户一个提示
    if (doctorSelect.innerHTML === '') {
        alert('没有找到该科室的医生，请选择其他科室。');
        document.getElementById('select-department').style.display = 'block';
        document.getElementById('select-doctor').style.display = 'none';
    }
    /*
    fetch(`/get-doctors?departmentId=${selectedDepartment}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应错误');
            }
            return response.json();
        })
        .then(doctors => {
            // 遍历医生数据并创建选项
            doctors.forEach(doctor => {
                var option = document.createElement('option');
                option.value = doctor.id; // 假设每个医生有一个唯一的ID
                option.textContent = doctor.name; // 显示医生的名字
                doctorSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('获取医生列表失败:', error);
            alert('无法加载医生列表，请稍后再试。');
        })
        .finally(() => {
            // 无论成功或失败，都显示医生选择器并隐藏科室选择器
            document.getElementById('select-department').style.display = 'none';
            document.getElementById('select-doctor').style.display = 'block';
        });
        */
}


function loadTimeSlots() {
    // 加载时间段的逻辑

    // 获取用户选择的医生ID
    var doctorSelect = document.getElementById('doctor');
    var selectedDoctorId = doctorSelect.value;

    // 检查是否选择了医生
    if (!selectedDoctorId) {
        alert('请选择一个医生。');
        return;
    }
    var selectedOption = doctorSelect.querySelector(`option[value="${selectedDoctorId}"]`);
    // 清空之前加载的时间段列表
    var timeSlotSelect = document.getElementById('time-slot');
    timeSlotSelect.innerHTML = '';

    // 假设有一个函数 getAvailableTimeSlots 可以根据医生ID获取可用的时间段
    // 这里使用了一个硬编码的数组来代替实际的API调用
    // 调用后端API获取医生列表

    const availableTimeSlots = JSON.parse(selectedOption.getAttribute('data-timelist'));

    // 遍历时间段并创建选项
    availableTimeSlots.forEach(timeSlot => {
        var option = document.createElement('option');
        option.value = timeSlot; // 直接使用时间段作为选项的值
        option.textContent = timeSlot; // 显示时间段
        timeSlotSelect.appendChild(option);
    });

    // 显示时间段选择部分并隐藏医生选择部分
    document.getElementById('select-doctor').style.display = 'none';
    document.getElementById('select-time-slot').style.display = 'block';

    // 如果没有找到可用的时间段，给用户一个提示
    if (timeSlotSelect.innerHTML === '') {
        alert('该医生当前没有可用的时间段，请选择其他医生。');
        document.getElementById('select-doctor').style.display = 'block';
        document.getElementById('select-time-slot').style.display = 'none';
    }
}

function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function showAppointmentForm() {

    // 填充已选择的科室和医生
    var departmentSelect = document.getElementById('department');
    var doctorSelect = document.getElementById('doctor');
    var timeSlotSelect = document.getElementById('time-slot');

    // 填充表单
    var selectedDepartment = departmentSelect.options[departmentSelect.selectedIndex].text;
    var selectedDoctor = doctorSelect.options[doctorSelect.selectedIndex].text;
    var selectedTimeSlot = timeSlotSelect.options[timeSlotSelect.selectedIndex].text;
    document.getElementById('select-time-slot').style.display = 'none';
    document.getElementById('appointment-form').style.display = 'block';

    // 填充表单字段
    // 假设表单中有对应的输入字段
    document.getElementById('selected-department').value = selectedDepartment;
    document.getElementById('selected-doctor').value = selectedDoctor;
    document.getElementById('selected-time').value = selectedTimeSlot;
}
function submitAppointment(event) {
    event.preventDefault(); // 阻止表单的默认提交行为

    fetch('/current_user')
        .then(response => response.json())
        .then(data => {
            var currentUserId = data.id;
            console.log("Current User ID:", currentUserId);

            // 继续使用 currentUserId 进行其他操作
            processAppointmentForm(currentUserId);
        })
        .catch(error => console.error('Error fetching current user data:', error));
}

function processAppointmentForm(currentUserId) {
    var doctorSelect = document.getElementById('doctor');
    var selectedDoctorId = doctorSelect.value;

    // 获取表单字段的值
    var patientName = document.getElementById('patient-name').value;
    var selectedDepartment = document.getElementById('selected-department').value;
    var selectedDoctor = document.getElementById('selected-doctor').value;
    var selectedTime = document.getElementById('selected-time').value;
    selectedTime = formatDateTime(selectedTime);

    const formData = {
        patientName: patientName,
        patientID: currentUserId,
        selectedDoctorId: selectedDoctorId,
        selectedDepartment: selectedDepartment,
        selectedDoctor: selectedDoctor,
        selectedTime: selectedTime
    }

    fetch('/appointments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Appointment booked successfully:', data);
            // 可以在这里添加进一步的操作，例如显示确认消息
        })
        .catch(error => console.error('Error booking appointment:', error));
    displaySuccessMessage()
}



function displaySuccessMessage() {
    var successDiv = document.createElement('div');
    successDiv.id = 'success-message';
    successDiv.innerHTML = '<h2>预约成功！</h2><p>您的预约已成功提交。</p>';

    // 将成功消息添加到文档中
    document.body.appendChild(successDiv);

    // 隐藏表单
    document.getElementById('appointment-form').style.display = 'none';
}
