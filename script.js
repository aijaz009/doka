const { jsPDF } = window.jspdf;
let rowCount = 0;

// Add Family Member
function addRow() {
    const tbody = document.querySelector('#familyTable tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${++rowCount}</td>
        <td><input type="text" required></td>
        <td><input type="number" required></td>
        <td><input type="text" required></td>
        <td><input type="text" required></td>
        <td><input type="text" required></td>
        <td><button class="btn btn-sm btn-danger" onclick="this.closest('tr').remove(); updateSerial()">Remove</button></td>
    `;
    tbody.appendChild(row);
}

// Update Serial Numbers
function updateSerial() {
    document.querySelectorAll('#familyTable tbody tr').forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
}

// Generate PDF
document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Initialize PDF
    const doc = new jsPDF();
    let yPos = 10;

    // Add Form Data
    const fields = ['dhok', 'familyHead', 'parent', 'village', 'mohalla', 'landmark', 
                    'adjacentDhoks', 'structure', 'age', 'profession', 'adhaar', 'cellNo', 'vehicle'];
    fields.forEach(field => {
        doc.text(`${field.replace(/([A-Z])/g, ' $1').toUpperCase()}: ${document.getElementById(field).value}`, 10, yPos);
        yPos += 10;
    });

    // Add Family Table
    const familyData = [];
    document.querySelectorAll('#familyTable tbody tr').forEach(row => {
        const cells = row.querySelectorAll('input');
        familyData.push([
            row.cells[0].textContent,
            cells[0].value,
            cells[1].value,
            cells[2].value,
            cells[3].value,
            cells[4].value
        ]);
    });
    doc.autoTable({
        head: [['S.No', 'Name', 'Age', 'Profession', 'Cell No', 'Relationship']],
        body: familyData,
        startY: yPos + 10,
        theme: 'grid'
    });

    // Add Photo
    const photo = document.getElementById('photo').files[0];
    if (photo) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                doc.addImage(img, 'JPEG', 10, doc.autoTable.previous.finalY + 10, 50, 50);
                doc.save('nomad_details.pdf');
            };
        };
        reader.readAsDataURL(photo);
    } else {
        doc.save('nomad_details.pdf');
    }
});
