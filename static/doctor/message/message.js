document.addEventListener('DOMContentLoaded', function() {
    fetchDoctorsList();
});

async function fetchDoctorsList() {
    try {
        const response = await fetch('/messages'); // 假设这是获取医生数据的API端点
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const messages = await response.json();
        displayDoctors(appointments);
    } catch (error) {
        console.error('Fetching doctors failed:', error);
    }
    var messages = [
            { id: 1, patient: "张三", time: "周一，8:30~9:00"content: "患者张三希望预约明天上午的咨询。" },
            { id: 2, content: "患者李四希望预约后天下午的复诊。" },
            { id: 3, content: "患者王五希望预约下周一的检查。" }
        ];
    displayMessages(message)
    function displayMessages() {
            var messageList = document.getElementById('messageList');
            messages.forEach(function(message) {
                var listItem = document.createElement('li');
                listItem.textContent = message.content;
                messageList.appendChild(listItem);
            });
        }
}