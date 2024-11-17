let students = [];

const classInput = document.getElementById('class');
const docTitle = document.getElementById('doc-title');
const mainTitle = document.getElementById('main-title');
const classTitle = document.getElementById('class-title');
const studentList = document.getElementById('student-list');

classInput.addEventListener('input', updateTitles);

function updateTitles() {
    const classValue = classInput.value.trim();
    if (classValue) {
        docTitle.textContent = `LMS - ${classValue}`;
        mainTitle.textContent = `Learn Metric System - Class ${classValue}`;
        classTitle.textContent = `Student List - Class ${classValue}`;
    } else {
        docTitle.textContent = 'LMS';
        mainTitle.textContent = 'Learn Metric System';
        classTitle.textContent = 'Student List';
    }
}

function addStudent() {
    const classValue = classInput.value.trim();
    const name = document.getElementById('name').value.trim();
    const sex = document.getElementById('sex').value;

    if (!name || !classValue) {
        alert("Please fill in the class and student name.");
        return;
    }

    const subjects = ["english", "maths", "chichewa", "life-skills", "expressive-arts", "social-studies", "agri-science"];
    let marks = [];
    let totalMarks = 0;

    subjects.forEach(subject => {
        const mark = parseInt(document.getElementById(subject).value) || 0;
        marks.push(mark);
        totalMarks += mark;
    });

    const remarks = getRemarks(totalMarks);

    const student = {
        class: classValue,
        name: name,
        sex: sex,
        marks: marks,
        totalMarks: totalMarks,
        remarks: remarks
    };
    students.push(student);

    clearForm();
}

function getRemarks(totalMarks) {
    if (totalMarks < 300) return "Failed";
    if (totalMarks <= 350) return "Average";
    if (totalMarks <= 400) return "Good";
    if (totalMarks <= 500) return "Very Good";
    return "Excellent";
}

function finalizeEntries() {
    students.sort((a, b) => b.totalMarks - a.totalMarks);
    displayStudents();
    sendEmailWithResults(); // Call email function upon finalization
}

function displayStudents() {
    studentList.innerHTML = '';

    students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td style="min-width: 150px;">${student.name}</td>
            <td>${student.sex}</td>
            <td>${student.marks[0]}</td>
            <td>${student.marks[1]}</td>
            <td>${student.marks[2]}</td>
            <td>${student.marks[3]}</td>
            <td>${student.marks[4]}</td>
            <td>${student.marks[5]}</td>
            <td>${student.marks[6]}</td>
            <td>${student.totalMarks}</td>
            <td>${student.remarks}</td>
        `;
        studentList.appendChild(row);
    });
}

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('sex').value = 'M';
    const subjects = ["english", "maths", "chichewa", "life-skills", "expressive-arts", "social-studies", "agri-science"];
    subjects.forEach(subject => {
        document.getElementById(subject).value = '';
    });
}

function sendEmailWithResults() {
    const emailContent = students.map((student, index) => 
        `Position: ${index + 1}, Name: ${student.name}, Total Marks: ${student.totalMarks}, Remarks: ${student.remarks}`
    ).join('\n');

    // Ensure you have configured EmailJS correctly with your credentials
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        message: emailContent,
        recipient_email: "recipient@example.com", // Replace with desired recipient email
        subject: "Finalized Student Results"
    }, "YOUR_PUBLIC_KEY")
    .then(response => {
        alert("Email sent successfully!");
        console.log("SUCCESS:", response.status, response.text);
    }, error => {
        alert("Failed to send email.");
        console.error("FAILED:", error);
    });
}
