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
    sendEmailWithResults(); // Send email after finalizing entries
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

function downloadCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Class,Position,Name,Sex,Eng,Mat,Chi,Lif,Exp,Soc,Agr & Sci,Total,Rem\n";

    students.forEach((student, index) => {
        let row = `${student.class},${index + 1},${student.name},${student.sex},${student.marks[0]},${student.marks[1]},${student.marks[2]},${student.marks[3]},${student.marks[4]},${student.marks[5]},${student.marks[6]},${student.totalMarks},${student.remarks}`;
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_data.csv");
    document.body.appendChild(link);
    link.click();
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Student Marks Report", 10, 10);
    doc.autoTable({
        head: [['Class', 'Pos', 'Name', 'Sex', 'Eng', 'Mat', 'Chi', 'Lif', 'Exp', 'Soc', 'Agr & Sci', 'Total', 'Rem']],
        body: students.map((student, index) => [
            student.class,
            index + 1,
            student.name,
            student.sex,
            student.marks[0],
            student.marks[1],
            student.marks[2],
            student.marks[3],
            student.marks[4],
            student.marks[5],
            student.marks[6],
            student.totalMarks,
            student.remarks
        ]),
        styles: { cellPadding: 2, fontSize: 8 },
        columnStyles: { 1: { minCellWidth: 30 } }
    });
    doc.save('student_data.pdf');
}

function submitToGoogleSheet() {
    const endpoint = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"; // Replace with your actual endpoint
    fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(students)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Data submitted successfully:", data);
        alert("Data submitted successfully to Google Sheet!");
    })
    .catch(error => {
        console.error("Error submitting data:", error);
        alert("Failed to submit data to Google Sheet.");
    });
}

function sendEmailWithResults() {
    const emailContent = students.map((student, index) => 
        `Position: ${index + 1}, Name: ${student.name}, Total Marks: ${student.totalMarks}, Remarks: ${student.remarks}`
    ).join('\n');

    emailjs.send("service_bq3459o", "template_3remqv", {
        message: emailContent,
        recipient_email: "hephiri3@gmail.com", // Replace with actual recipient
        subject: "Finalized Student Results"
    }, "QFCfDntsjA5TcK0G2")
    .then(response => {
        alert("Email sent successfully!");
        console.log("SUCCESS:", response.status, response.text);
    }, error => {
        alert("Failed to send email.");
        console.error("FAILED:", error);
    });
}

function saveDataToLocal() {
    localStorage.setItem('students', JSON.stringify(students));
}

function loadDataFromLocal() {
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
        students = JSON.parse(savedStudents);
        displayStudents();
    }
}

