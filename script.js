// script.js
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const photo = document.getElementById('photo');
    const startButton = document.getElementById('startButton');
    const captureButton = document.getElementById('captureButton');

    let stream;

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function(s) {
            stream = s;
            video.srcObject = stream;
        })
        .catch(function(err) {
            console.log("An error occurred! " + err);
        });

    startButton.addEventListener('click', function() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(function(s) {
                stream = s;
                video.srcObject = stream;
            });
    });

    captureButton.addEventListener('click', function() {
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        photo.setAttribute('src', dataUrl);
        photo.style.display = 'block';
        canvas.style.display = 'none';
    });

    document.getElementById('nomadForm').addEventListener('submit', function(event) {
        event.preventDefault();
        // Collect form data and generate PDF
        const formData = new FormData(this);
        const imgData = photo.getAttribute('src');
        formData.append('image', imgData);

        // Generate PDF here using jsPDF or similar library
        const doc = new jsPDF();
        doc.text('Details of Nomads', 10, 10);
        doc.addImage(imgData, 'PNG', 10, 20, 50, 50); // Adjust position and size as needed

        // Add form data to PDF
        let y = 70;
        doc.text(`Name of Family Head: ${formData.get('familyHead')}`, 10, y);
        y += 10;
        doc.text(`S/O, D/O, W/O: ${formData.get('relation')}`, 10, y);
        y += 10;

        // Add family details table
        const tableData = [];
        const headers = ['S.No', 'Name', 'Age', 'Profession', 'Cell No', 'Relationship'];
        tableData.push(headers);
        const familyDetails = JSON.parse(formData.get('familyDetails'));
        familyDetails.forEach((detail, index) => {
            tableData.push([index + 1, detail.name, detail.age, detail.profession, detail.cellNo, detail.relationship]);
        });

        doc.autoTable({
            head: [headers],
            body: tableData.slice(1),
            startY: y,
            theme: 'grid'
        });

        doc.save('nomad_details.pdf');
    });
});
