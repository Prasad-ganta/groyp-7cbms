const API_URL = 'http://localhost/bus-management-system';

function showToast(message, type) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = type === 'success' ? 'toast-success' : 'toast-error';
    toast.style.opacity = 1;
    setTimeout(() => {
        toast.style.opacity = 0;
    }, 3000);
}

function switchTab(tab) {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`[onclick="switchTab('${tab}')"]`).classList.add('active');
    document.getElementById('studentLogin').style.display = tab === 'student' ? 'block' : 'none';
    document.getElementById('adminLogin').style.display = tab === 'admin' ? 'block' : 'none';
}

async function login(type) {
    if (type === 'student') {
        await studentLogin();
    } else if (type === 'admin') {
        await adminLogin();
    }
}

async function studentLogin() {
    const studentId = document.getElementById('studentId').value.trim();
    try {
        const response = await fetch(`${API_URL}/get_student.php?id=${encodeURIComponent(studentId)}`);
        if (response.ok) {
            const student = await response.json();
            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('studentDetails').style.display = 'block';
            document.getElementById('logoutButton').style.display = 'block';
            displayStudentInfo(student);
        } else {
            showToast('Student not found!', 'error');
        }
    } catch (error) {
        console.error('Error during student login:', error);
        showToast('An error occurred during login.', 'error');
    }
}

async function adminLogin() {
    const enteredPassword = document.getElementById('adminPassword').value;
    try {
        const formData = new FormData();
        formData.append('password', enteredPassword);
        
        const response = await fetch(`${API_URL}/admin_login.php`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (result.success) {
            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('adminContainer').style.display = 'block';
            document.getElementById('logoutButton').style.display = 'block';
            showToast('Admin login successful!', 'success');
        } else {
            showToast('Incorrect password!', 'error');
        }
    } catch (error) {
        console.error('Error during admin login:', error);
        showToast('An error occurred during login.', 'error');
    }
}

function displayStudentInfo(student) {
    const studentInfo = document.getElementById('studentInfo');
    studentInfo.innerHTML = `
        <h2>Student Information</h2>
        <p><strong>Student ID:</strong> ${student.id}</p>
        <p><strong>Name:</strong> ${student.name}</p>
        <p><strong>Department:</strong> ${student.department}</p>
        <p><strong>Year of Study:</strong> ${student.year}</p>
        <p><strong>Bus Name:</strong> ${student.busName}</p>
        <p><strong>Bus Stop:</strong> ${student.busStop || 'Not set'}</p>
        <p><strong>Total Fees:</strong> ${student.feesTotal}</p>
        <p><strong>Fees Paid:</strong> ${student.feesPaid}</p>
        <p><strong>Fees Due:</strong> ${student.feesTotal - student.feesPaid}</p>
        <p><strong>Fine:</strong> ${student.fine || 0}</p>
        <p><strong>Permission Granted:</strong> ${student.permissionGranted ? 'Yes' : 'No'}</p>
    `;
}

function logout() {
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('adminContainer').style.display = 'none';
    document.getElementById('studentDetails').style.display = 'none';
    document.getElementById('logoutButton').style.display = 'none';
    document.getElementById('studentId').value = '';
    document.getElementById('adminPassword').value = '';
    showToast('Logged out successfully', 'success');
}

async function displayBusDetails() {
    const busName = document.getElementById('busInput').value.trim();
    const busDetails = document.getElementById('busDetails');

    try {
        const response = await fetch(`${API_URL}/get_bus_details.php?name=${encodeURIComponent(busName)}`);
        const busStudents = await response.json();

        if (busStudents.length > 0) {
            let html = `<h2>Details for ${busName}</h2>`;
            busStudents.forEach(student => {
                html += `
                    <div class="student-card">
                        <p><strong>Student ID:</strong> ${student.id}</p>
                        <p><strong>Name:</strong> ${student.name}</p>
                        <p><strong>Department:</strong> ${student.department}</p>
                        <p><strong>Year of Study:</strong> ${student.year}</p>
                        <p><strong>Total Fees:</strong> ${student.feesTotal}</p>
                        <p><strong>Fees Paid:</strong> ${student.feesPaid}</p>
                        <p><strong>Fees Due:</strong> ${student.feesTotal - student.feesPaid}</p>
                        <p><strong>Fine:</strong> ${student.fine || 0}</p>
                        <p><strong>Bus Stop:</strong> ${student.busStop || 'Not set'}</p>
                        <p><strong>Permission Granted:</strong> ${student.permissionGranted ? "Yes" : "No"}</p>
                        <button onclick="changeStudentYearById('${student.id}')">Change Year</button>
                    </div>`;
            });
            busDetails.innerHTML = html;
        } else {
            busDetails.innerHTML = `<p class="alert">No details found for ${busName}</p>`;
        }
    } catch (error) {
        console.error('Error fetching bus details:', error);
        busDetails.innerHTML = `<p class="alert">Error fetching bus details</p>`;
    }
}

function showAddBusForm() {
    document.getElementById('formContainer').style.display = 'block';
    document.getElementById('addBusForm').style.display = 'block';
    document.getElementById('addStudentForm').style.display = 'none';
    document.getElementById('changePasswordForm').style.display = 'none';
    document.getElementById('searchStudentForm').style.display = 'none';
    document.getElementById('addBusStopForm').style.display = 'none';
}

function showAddStudentForm() {
    document.getElementById('formContainer').style.display = 'block';
    document.getElementById('addBusForm').style.display = 'none';
    document.getElementById('addStudentForm').style.display = 'block';
    document.getElementById('changePasswordForm').style.display = 'none';
    document.getElementById('searchStudentForm').style.display = 'none';
    document.getElementById('addBusStopForm').style.display = 'none';
    populateBusStops();
}

function showChangePasswordForm() {
    document.getElementById('formContainer').style.display = 'block';
    document.getElementById('addBusForm').style.display = 'none';
    document.getElementById('addStudentForm').style.display = 'none';
    document.getElementById('changePasswordForm').style.display = 'block';
    document.getElementById('searchStudentForm').style.display = 'none';
    document.getElementById('addBusStopForm').style.display = 'none';
}

function showSearchStudentForm() {
    document.getElementById('formContainer').style.display = 'block';
    document.getElementById('addBusForm').style.display = 'none';
    document.getElementById('addStudentForm').style.display = 'none';
    document.getElementById('changePasswordForm').style.display = 'none';
    document.getElementById('searchStudentForm').style.display = 'block';
    document.getElementById('addBusStopForm').style.display = 'none';
}

function showAddBusStopForm() {
    document.getElementById('formContainer').style.display = 'block';
    document.getElementById('addBusForm').style.display = 'none';
    document.getElementById('addStudentForm').style.display = 'none';
    document.getElementById('changePasswordForm').style.display = 'none';
    document.getElementById('searchStudentForm').style.display = 'none';
    document.getElementById('addBusStopForm').style.display = 'block';
}

async function addBus() {
    const busName = document.getElementById('newBusName').value.trim();
    if (busName) {
        try {
            const formData = new FormData();
            formData.append('name', busName);
            
            const response = await fetch(`${API_URL}/add_bus.php`, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                showToast(`Bus ${busName} added successfully.`, 'success');
                document.getElementById('newBusName').value = '';
            } else {
                showToast(result.message, 'error');
            }
        } catch (error) {
            console.error('Error adding bus:', error);
            showToast("Error adding bus. Please try again.", 'error');
        }
    } else {
        showToast("Bus name is required.", 'error');
    }
}

async function addStudent() {
    const studentData = {
        id: document.getElementById('newStudentId').value.trim(),
        name: document.getElementById('studentName').value.trim(),
        department: document.getElementById('studentDepartment').value.trim(),
        year:  document.getElementById('studentYear').value.trim(),
        feesTotal: document.getElementById('feesTotal').value.trim(),
        feesPaid: document.getElementById('feesPaid').value.trim(),
        fine: document.getElementById('fine').value.trim() || '0',
        busStop: document.getElementById('busStop').value,
        busName: document.getElementById('studentBusName').value.trim()
    };

    if (Object.values(studentData).some(value => value === '')) {
        showToast("All fields are required.", 'error');
        return;
    }

    try {
        const formData = new FormData();
        for (const [key, value] of Object.entries(studentData)) {
            formData.append(key, value);
        }
        
        const response = await fetch(`${API_URL}/add_students.php`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.success) {
            showToast(`Student ${studentData.name} added successfully.`, 'success');
            // Clear form fields
            Object.keys(studentData).forEach(key => {
                document.getElementById(key === 'id' ? 'newStudentId' : key).value = '';
            });
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Error adding student:', error);
        showToast(error.message || "Error adding student. Please try again.", 'error');
    }
}

async function changeAdminPassword() {
    const currentPassword = document.getElementById('currentPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();

    if (currentPassword && newPassword) {
        try {
            const formData = new FormData();
            formData.append('currentPassword', currentPassword);
            formData.append('newPassword', newPassword);
            
            const response = await fetch(`${API_URL}/change_admin_password.php`, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                showToast("Password changed successfully.", 'success');
                document.getElementById('currentPassword').value = '';
                document.getElementById('newPassword').value = '';
            } else {
                showToast(result.message, 'error');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            showToast("Error changing password. Please try again.", 'error');
        }
    } else {
        showToast("Please enter both current and new passwords.", 'error');
    }
}

async function searchStudent() {
    const studentId = document.getElementById('searchStudentId').value.trim();
    const searchResult = document.getElementById('searchResult');

    try {
        const response = await fetch(`${API_URL}/get_student.php?id=${encodeURIComponent(studentId)}`);
        if (response.ok) {
            const student = await response.json();
            searchResult.innerHTML = `
                <h2>Search Result</h2>
                <div class="student-card">
                    <p><strong>Student ID:</strong> ${student.id}</p>
                    <p><strong>Name:</strong> ${student.name}</p>
                    <p><strong>Department:</strong> ${student.department}</p>
                    <p><strong>Year of Study:</strong> ${student.year}</p>
                    <p><strong>Total Fees:</strong> ${student.feesTotal}</p>
                    <p><strong>Fees Paid:</strong> ${student.feesPaid}</p>
                    <p><strong>Fees Due:</strong> ${student.feesTotal - student.feesPaid}</p>
                    <p><strong>Fine:</strong> ${student.fine || 0}</p>
                    <p><strong>Bus Stop:</strong> ${student.busStop || 'Not set'}</p>
                    <p><strong>Bus Name:</strong> ${student.busName}</p>
                    <p><strong>Permission Granted:</strong> ${student.permissionGranted ? "Yes" : "No"}</p>
                    <button onclick="changeStudentYearById('${student.id}')">Change Year</button>
                </div>`;
        } else {
            searchResult.innerHTML = `<p class="alert">No student found with ID ${studentId}</p>`;
        }
    } catch (error) {
        console.error('Error searching for student:', error);
        searchResult.innerHTML = `<p class="alert">Error searching for student</p>`;
    }
}

async function updateFeeByIdOrDept() {
    const input = prompt("Enter Student ID or Department:");
    const amount = parseFloat(prompt("Enter fee amount to update:"));
    
    if (input && !isNaN(amount)) {
        try {
            const formData = new FormData();
            formData.append('input', input);
            formData.append('amount', amount);
            
            const response = await fetch(`${API_URL}/update_fee.php`, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                showToast(result.message, 'success');
                displayBusDetails();
            } else {
                showToast(result.message, 'error');
            }
        } catch (error) {
            console.error('Error updating fees:', error);
            showToast("Error updating fees. Please try again.", 'error');
        }
    } else {
        showToast("Invalid input", 'error');
    }
}

async function grantPermissionByIdOrDept() {
    const input = prompt("Enter Student ID or Department:");
    
    if (input) {
        try {
            const formData = new FormData();
            formData.append('input', input);
            
            const response = await fetch(`${API_URL}/grant_permission.php`, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                showToast(result.message, 'success');
                displayBusDetails();
            } else {
                showToast(result.message, 'error');
            }
        } catch (error) {
            console.error('Error granting permission:', error);
            showToast("Error granting permission. Please try again.", 'error');
        }
    } else {
        showToast("Invalid input", 'error');
    }
}

async function deleteStudentByIdOrDept() {
    const input = prompt("Enter Student ID or Department:");
    
    if (input) {
        try {
            const formData = new FormData();
            formData.append('input', input);
            
            const response = await fetch(`${API_URL}/delete_student.php`, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                showToast(result.message, 'success');
                displayBusDetails();
            } else {
                showToast(result.message, 'error');
            }
        } catch (error) {
            console.error('Error deleting student(s):', error);
            showToast("Error deleting student(s). Please try again.", 'error');
        }
    } else {
        showToast("Invalid input", 'error');
    }
}

async function printAllBusDetails() {
    try {
        const response = await fetch(`${API_URL}/get_all_bus_details.php`);
        const buses = await response.json();
        
        let printContent = '<h1>All Bus Details</h1>';
        for (let bus of buses) {
            printContent += `<h2>Bus: ${bus.name}</h2>`;
            bus.students.forEach(student => {
                printContent += `
                    <div class="student-card">
                        <p><strong>Student ID:</strong> ${student.id}</p>
                        <p><strong>Name:</strong> ${student.name}</p>
                        <p><strong>Department:</strong> ${student.department}</p>
                        <p><strong>Year of Study:</strong> ${student.year}</p>
                        <p><strong>Total Fees:</strong> ${student.feesTotal}</p>
                        <p><strong>Fees Paid:</strong> ${student.feesPaid}</p>
                        <p><strong>Fees Due:</strong> ${student.feesTotal - student.feesPaid}</p>
                        <p><strong>Fine:</strong> ${student.fine || 0}</p>
                        <p><strong>Bus Stop:</strong> ${student.busStop || 'Not set'}</p>
                        <p><strong>Permission Granted:</strong> ${student.permissionGranted ? "Yes" : "No"}</p>
                    </div>`;
            });
        }
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>All Bus Details</title>');
        printWindow.document.write('<style>body { font-family: Arial, sans-serif; } .student-card { border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    } catch (error) {
        console.error('Error fetching all bus details:', error);
        showToast("Error fetching all bus details. Please try again.", 'error');
    }
}

async function changeStudentYearById(studentId) {
    const newYear = prompt(`Enter new year for student ${studentId}:`);
    if (newYear) {
        try {
            const formData = new FormData();
            formData.append('id', studentId);
            formData.append('year', newYear);
            
            const response = await fetch(`${API_URL}/change_student_year.php`, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                showToast(`Year updated for student ${studentId}`, 'success');
                displayBusDetails();
            } else {
                showToast(result.message, 'error');
            }
        } catch (error) {
            console.error('Error updating student year:', error);
            showToast("Error updating student year. Please try again.", 'error');
        }
    }
}

async function addBusStop() {
    const busStopName = document.getElementById('newBusStop').value.trim();
    if (busStopName) {
        try {
            const formData = new FormData();
            formData.append('name', busStopName);
            
            const response = await fetch(`${API_URL}/add_bus_stop.php`, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                showToast(`Bus stop ${busStopName} added successfully.`, 'success');
                document.getElementById('newBusStop').value = '';
                await populateBusStops();
            } else {
                showToast(result.message, 'error');
            }
        } catch (error) {
            console.error('Error adding bus stop:', error);
            showToast("Error adding bus stop. Please try again.", 'error');
        }
    } else {
        showToast("Bus stop name is required.", 'error');
    }
}

async function populateBusStops() {
    try {
        const response = await fetch(`${API_URL}/get_bus_stops.php`);
        const busStops = await response.json();
        const busStopSelect = document.getElementById('busStop');
        busStopSelect.innerHTML = '<option value="">Select Bus Stop</option>';
        busStops.forEach(stop => {
            busStopSelect.innerHTML += `<option value="${stop.name}">${stop.name}</option>`;
        });
    } catch (error) {
        console.error('Error fetching bus stops:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    switchTab('student');
    populateBusStops();
});
