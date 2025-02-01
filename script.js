const { jsPDF } = window.jspdf;
let familyRowCount = 0;

// Add Family Table Rows
function addFamilyRow() {
    const tbody = document.querySelector('#familyTable tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${String(++familyRowCount).padStart(2, '0')}</td>
        <td><input type="text"></td>
        <td><input type="number"></td>
        <td><input type="text"></td>
        <td><input type="text"></td>
        <td><input type="text"></td>
    `;
    tbody.appendChild(newRow);
}

// Generate PDF (Exact Replica)
document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const doc = new jsPDF();
    
    // Add Static Text (Matching PDF Format)
    doc.setFontSize(16);
    doc.text("Police    Station    Lar.", 105, 10, { align: 'center' });
    doc.setFontSize(14);
    doc.text("DETAILS OF NOMADS", 105, 20, { align: 'center' });
    doc.setFontSize(12);

    // Add Fields with Underlines
    let y = 40;
    const fields = [
        `LOCATION OF DHOK ${document.getElementById('dhok').value || '_________'}`,
        `Name of Family Head ${document.getElementById('familyHead').value || '_________'}`,
        `S/O, D/O, W/O ${document.getElementById('parent').value || '_________'}`,
        `Village ${document.getElementById('village').value || '_________'} Mohalla ${document.getElementById('mohalla').value || '_________'}`,
        `Land Mark ${document.getElementById('landmark').value || '_________'}`,
        `Adjacent DHOKS ${document.getElementById('adjacentDhoks').value || '_________'}`,
        `Structure Details ${document.getElementById('structure').value || '_________'}`,
        `Age ${document.getElementById('age').value || '_________'} Profession ${document.getElementById('profession').value || '_________'}`,
        `Adhaar Card No ${document.getElementById('adhaar').value || '_________'} Cell No ${document.getElementById('cellNo').value || '_________'}`,
        `Vehicle Details if any ${document.getElementById('vehicle').value || '___ Nil ___'}`
    ];

    fields.forEach(text => {
        doc.text(text, 10, y);
        y += 10;
    });

    // Add Family Table to PDF
    doc.autoTable({
        html: '#familyTable',
        startY: y + 10,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [255, 255, 255], textColor: 0, fontStyle: 'bold' }
    });

    // Add Live Photo
    const photoInput = document.getElementById('photo');
    if (photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const finalY = doc.autoTable.previous.finalY + 10;
                doc.addImage(img, 'JPEG', 10, finalY, 50, 50);
                doc.save('nomad_details.pdf');
            };
        };
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        doc.save('nomad_details.pdf');
    }
});
