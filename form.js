class FormHandler {
    constructor() {
        this.form = document.getElementById('nomadForm');
        this.familyTable = document.getElementById('familyTable').getElementsByTagName('tbody')[0];
        this.addFamilyMemberBtn = document.getElementById('addFamilyMember');
        this.generatePDFBtn = document.getElementById('generatePDF');

        this.familyMembers = [];
        this.initializeEventListeners
