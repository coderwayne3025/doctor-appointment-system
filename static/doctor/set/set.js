 document.getElementById('/submit-settings').addEventListener('submit', function(event){
            event.preventDefault();
            const availableTime = $('#availableTime').val();
            $.ajax({
                url: '/doctor/set_availability',
                type: 'POST',
                contentType: 'application/json',  // 确保设置了正确的 Content-Type
                data: JSON.stringify({ availableDay: available_time: availableTime }),
                success: function (response) {
                    alert(response.message);
                    fetchAppointments();
                },
                error: function (xhr, status, error) {
                    alert('Error: ' + xhr.responseText);
                }
            });
        });