const { jsPDF } = window.jspdf;
let familyMemberCount = 0;

// Function to add a new family member row
function addFamilyMember() {
    familyMemberCount++;
    const row = `
        <tr>
            <td>${familyMemberCount}</td>
            <td><input type="text" class="form-control" name="name${familyMemberCount}" required></td>
            <td><input type="number" class="form-control" name="age${familyMemberCount}" required></td>
            <td><input type="text" class="form-control" name="profession${familyMemberCount}" required></td>
            <td><input type="text" class="form-control" name="cellNo${familyMemberCount}" required></td>
            <td><input type="text" class="form-control" name="relationship${familyMemberCount}" required></td>
            <td><button type="button" class="btn btn-danger btn-sm" onclick="removeFamilyMember(this)">Remove</button></td>
        </tr>
    `;
    document.getElementById('familyTable').getElementsByTagName('tbody')[0].insertAdjacentHTML('beforeend', row);
}

// Function to remove a family member row
function removeFamilyMember(button) {
    const row = button.closest('tr');
    row.remove();
    familyMemberCount--;
    updateSerialNumbers();
}

// Function to update serial numbers after removing a row
function updateSerialNumbers() {
    const rows = document.querySelectorAll('#familyTable tbody tr');
    rows.forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
}

// Function to generate PDF
document.getElementById('nomadForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const doc = new jsPDF();

    // Add form data to PDF
    doc.setFontSize(12);
    doc.text(`Location of DHOK: ${document.getElementById('location').value}`, 10, 10);
    doc.text(`Name of Family Head: ${document.getElementById('familyHead').value}`, 10, 20);
    doc.text(`S/O, D/O, W/O: ${document.getElementById('parent').value}`, 10, 30);
    doc.text(`Village: ${document.getElementById('village').value}`, 10, 40);
    doc.text(`Mohalla: ${document.getElementById('mohalla').value}`, 10, 50);
    doc.text(`Land Mark: ${document.getElementById('landmark').value}`, 10, 60);
    doc.text(`Adjacent DHOKS: ${document.getElementById('adjacentDhoks').value}`, 10, 70);
    doc.text(`Structure Details: ${document.getElementById('structureDetails').value}`, 10, 80);
    doc.text(`Age: ${document.getElementById('age').value}`, 10, 90);
    doc.text(`Profession: ${document.getElementById('profession').value}`, 10, 100);
    doc.text(`Adhaar Card No: ${document.getElementById('adhaar').value}`, 10, 110);
    doc.text(`Cell No: ${document.getElementById('cellNo').value}`, 10, 120);
    doc.text(`Vehicle Details: ${document.getElementById('vehicleDetails').value}`, 10, 130);

    // Add family details to PDF
    const rows = document.querySelectorAll('#familyTable tbody tr');
    let y = 150;
    rows.forEach((row, index) => {
        const name = row.querySelector('input[name^="name"]').value;
        const age = row.querySelector('input[name^="age"]').value;
        const profession = row.querySelector('input[name^="profession"]').value;
        const cellNo = row.querySelector('input[name^="cellNo"]').value;
        const relationship = row.querySelector('input[name^="relationship"]').value;
        doc.text(`${index + 1}. Name: ${name}, Age: ${age}, Profession: ${profession}, Cell No: ${cellNo}, Relationship: ${relationship}`, 10, y);
        y += 10;
    });

    // Handle photo capture
    const photoInput = document.getElementById('photo');
    if (photoInput.files && photoInput.files[0]) {
        const file = photoInput.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            const image = new Image();
            image.src = event.target.result;

            image.onload = function() {
                // Add image to PDF (resize if necessary)
                const imgWidth = 50; // Width of the image in the PDF
                const imgHeight = (image.height * imgWidth) / image.width; // Maintain aspect ratio
                doc.addImage(image.src, 'JPEG', 10, y, imgWidth, imgHeight);
                doc.save('nomad_details.pdf'); // Save PDF after adding the image
            };
        };

        reader.readAsDataURL(file); // Convert file to data URL
    } else {
        // If no photo is captured, save the PDF without the image
        doc.save('nomad_details.pdf');
    }
});
