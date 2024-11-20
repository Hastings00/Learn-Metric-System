let students = [];

const classInput = document.getElementById('class');
const docTitle = document.getElementById('doc-title');
const mainTitle = document.getElementById('main-title');
const classTitle = document.getElementById('class-title');
const studentList = document.getElementById('student-list');
const progressBar = document.getElementById('progress-bar');

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

    // Updated subject list based on class input
    let subjects;
    switch (classValue.toLowerCase()) {
        case 'standard 1':
        case 'standard 2':
            subjects = ["english", "maths", "chichewa", "social-studies", "expressive-arts", "religious-education"];
            break;
        case 'standard 3':
            subjects = ["english", "maths", "chichewa", "social-studies", "expressive-arts", "religious-education", "life-skills"];
            break;
        case 'standard 4':
            subjects = ["english", "maths", "chichewa", "social-studies", "expressive-arts", "religious-education", "life-skills", "agri-science"];
            break;
        default:
            subjects = ["english", "maths", "chichewa", "life-skills", "expressive-arts", "social-studies", "agri-science", "religious-studies"];
    }

    let marks = [];
    let totalMarks = 0;

    // Loop through only relevant subjects for the current class
    subjects.forEach(subject => {
        const element = document.getElementById(subject);
        if (element) {
            const markValue = element.value.trim();
            const mark = markValue ? parseInt(markValue) : null; // Treat empty entries as null
            marks.push(mark);
            if (mark !== null) totalMarks += mark; // Add only non-null marks
        }
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
    updateProgressBar();
    displayStudents();
    saveDataToLocal();
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
            ${student.marks.map(mark => `<td>${mark !== null ? mark : ''}</td>`).join('')}
            <td>${student.totalMarks}</td>
            <td>${student.remarks}</td>
        `;
        studentList.appendChild(row);
    });
}

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('sex').value = 'M';
    const allSubjects = ["english", "maths", "chichewa", "life-skills", "expressive-arts", "social-studies", "agri-science", "religious-studies"];
    allSubjects.forEach(subject => {
        const element = document.getElementById(subject);
        if (element) {
            element.value = '';
        }
    });
}

function updateProgressBar() {
    const totalStudents = students.length;
    const progress = (totalStudents / 100) * 100;
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${Math.min(progress, 100)}%`;
}

function downloadCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Class,Position,Name,Sex,Eng,Mat,Chi,Lif,Exp,Soc,Agr & Sci,Rel,Total,Rem\n";

    students.forEach((student, index) => {
        let row = `${student.class},${index + 1},${student.name},${student.sex},${student.marks.join(',')},${student.totalMarks},${student.remarks}`;
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
        head: [['Class', 'Pos', 'Name', 'Sex', 'Eng', 'Mat', 'Chi', 'Lif', 'Exp', 'Soc', 'Agr & Sci', 'Rel', 'Total', 'Rem']],
        body: students.map((student, index) => [
            student.class,
            index + 1,
            student.name,
            student.sex,
            ...student.marks,
            student.totalMarks,
            student.remarks
        ]),
        styles: { cellPadding: 2, fontSize: 8 },
        columnStyles: { 1: { minCellWidth: 30 } }
    });
    doc.save('student_data.pdf');
}

function submitToGoogleSheet() {
    const endpoint = "https://script.google.com/macros/s/YOUR_ENDPOINT_URL/exec";

    if (students.length === 0) {
        alert("No student data to submit.");
        return;
    }

    fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(students)
    })
    .then(response => {
        if (!response.ok) {
            console.error("Error response:", response);
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        alert("Data submitted successfully to Google Sheet!");
    })
    .catch(error => {
        alert("Failed to submit data to Google Sheet.");
        console.error("Error submitting data:", error);
    });
}

function sendEmailWithResults() {
    const emailContent = students.map((student, index) => 
        `Position: ${index + 1}, Name: ${student.name}, Total Marks: ${student.totalMarks}, Remarks: ${student.remarks}`
    ).join('\n');

    emailjs.send("service_bq3459o", "template_3remqv", {
        message: emailContent,
        recipient_email: "example@gmail.com",
        subject: "Finalized Student Results"
    }, "YOUR_USER_ID")
    .then(response => {
        alert("Email sent successfully!");
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

window.onload = loadDataFromLocal;
