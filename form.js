class FormHandler {
    constructor() {
        this.form = document.getElementById('nomadForm');
        this.familyTable = document.getElementById('familyTable').getElementsByTagName('tbody')[0];
        this.addFamilyMemberBtn = document.getElementById('addFamilyMember');
        this.generatePDFBtn = document.getElementById('generatePDF');
        
        this.familyMemberCount = 0;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.addFamilyMemberBtn.addEventListener('click', () => this.addFamilyMember());
        this.generatePDFBtn.addEventListener('click', () => this.generatePDF());
    }

    addFamilyMember() {
        this.familyMemberCount++;
        const row = this.familyTable.insertRow();
        
        // Create cells
        const cells = [
            this.familyMemberCount,                                    // S.No
            '<input type="text" class="table-input" name="name">',    // Name
            '<input type="number" class="table-input" name="age">',   // Age
            '<input type="text" class="table-input" name="profession">', // Profession
            '<input type="text" class="table-input" name="cellNo">',  // Cell No
            '<input type="text" class="table-input" name="relationship">', // Relationship
            '<button type="button" class="btn delete-btn">Delete</button>' // Action
        ];

        cells.forEach((cell, index) => {
            const td = row.insertCell(index);
            td.innerHTML = cell;
        });

        // Add delete functionality
        const deleteBtn = row.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            row.remove();
            this.reorderSerialNumbers();
        });
    }

    reorderSerialNumbers() {
        const rows = this.familyTable.rows;
        for (let i = 0; i < rows.length; i++) {
            rows[i].cells[0].textContent = i + 1;
        }
        this.familyMemberCount = rows.length;
    }

    collectFormData() {
        const formData = {
            basicInfo: {
                dhokLocation: this.form.querySelector('[name="dhokLocation"]').value,
                familyHead: this.form.querySelector('[name="familyHead"]').value,
                relation: this.form.querySelector('[name="relation"]').value,
                village: this.form.querySelector('[name="village"]').value,
                mohalla: this.form.querySelector('[name="mohalla"]').value,
                landmark: this.form.querySelector('[name="landmark"]').value,
                adjacentDhoks: this.form.querySelector('[name="adjacentDhoks"]').value,
                structureDetails: this.form.querySelector('[name="structureDetails"]').value,
                age: this.form.querySelector('[name="age"]').value,
                profession: this.form.querySelector('[name="profession"]').value,
                adhaarNo: this.form.querySelector('[name="adhaarNo"]').value,
                cellNo: this.form.querySelector('[name="cellNo"]').value,
                vehicleDetails: this.form.querySelector('[name="vehicleDetails"]').value,
                otherDetails: this.form.querySelector('[name="otherDetails"]').value
            },
            familyMembers: this.collectFamilyMembersData()
        };
        return formData;
    }

    collectFamilyMembersData() {
        const familyMembers = [];
        const rows = this.familyTable.rows;
        
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            familyMembers.push({
                serialNo: i + 1,
                name: row.querySelector('[name="name"]').value,
                age: row.querySelector('[name="age"]').value,
                profession: row.querySelector('[name="profession"]').value,
                cellNo: row.querySelector('[name="cellNo"]').value,
                relationship: row.querySelector('[name="relationship"]').value
            });
        }
        
        return familyMembers;
    }

    generatePDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Set font
        doc.setFont("helvetica");
        
        // Title
        doc.setFontSize(16);
        doc.text("POLICE STATION LAR DETAILS OF NOMADS", 105, 15, { align: "center" });
        
        // Add photo if exists
        const photoData = cameraHandler.getImageData();
        if (photoData) {
            doc.addImage(photoData, 'JPEG', 150, 25, 40, 40);
        }

        // Collect form data
        const formData = this.collectFormData();
        
        // Add basic information
        doc.setFontSize(12);
        let y = 30;
        
        const addField = (label, value) => {
            doc.text(`${label}: ${value}`, 20, y);
            y += 10;
        };

        // Basic Information
        Object.entries(formData.basicInfo).forEach(([key, value]) => {
            // Convert camelCase to Title Case
            const label = key.replace(/([A-Z])/g, ' $1')
                           .replace(/^./, str => str.toUpperCase());
            addField(label, value);
        });

        // Add Family Members Table
        if (formData.familyMembers.length > 0) {
            y += 10;
            doc.text("FAMILY DETAILS:", 20, y);
            y += 10;

            // Table headers
            const headers = ["S.No", "Name", "Age", "Profession", "Cell No", "Relationship"];
            const columnWidths = [15, 35, 20, 35, 35, 40];
            let x = 20;
            
            headers.forEach((header, i) => {
                doc.text(header, x, y);
                x += columnWidths[i];
            });

            // Table rows
            y += 10;
            formData.familyMembers.forEach((member) => {
                x = 20;
                doc.text(member.serialNo.toString(), x, y);
                x += columnWidths[0];
                doc.text(member.name, x, y);
                x += columnWidths[1];
                doc.text(member.age.toString(), x, y);
                x += columnWidths[2];
                doc.text(member.profession, x, y);
                x += columnWidths[3];
                doc.text(member.cellNo, x, y);
                x += columnWidths[4];
                doc.text(member.relationship, x, y);
                y += 10;

                // Add new page if needed
                if (y > 280) {
                    doc.addPage();
                    y = 20;
                }
            });
        }

        // Save the PDF
        doc.save('nomad-details.pdf');
    }
}

// Add styles for table inputs
const style = document.createElement('style');
style.textContent = `
    .table-input {
        width: 100%;
        padding: 4px 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    .delete-btn {
        background-color: #ff4444;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
    }
    .delete-btn:hover {
        background-color: #cc0000;
    }
`;
document.head.appendChild(style);

// Initialize form handler
const formHandler = new FormHandler();
