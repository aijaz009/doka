class CameraHandler {
    constructor() {
        this.stream = null;
        this.videoElement = document.getElementById('videoElement');
        this.canvas = document.getElementById('canvas');
        this.capturedImage = document.getElementById('captured-image');
        this.photoPlaceholder = document.getElementById('photo-placeholder');
        this.cameraModal = document.getElementById('cameraModal');
        
        // Buttons
        this.openCameraBtn = document.getElementById('openCamera');
        this.closeCameraBtn = document.getElementById('closeCamera');
        this.capturePhotoBtn = document.getElementById('capturePhoto');
        this.retakePhotoBtn = document.getElementById('retakePhoto');

        // Bind event listeners
        this.openCameraBtn.addEventListener('click', () => this.openCamera());
        this.closeCameraBtn.addEventListener('click', () => this.closeCamera());
        this.capturePhotoBtn.addEventListener('click', () => this.capturePhoto());
        this.retakePhotoBtn.addEventListener('click', () => this.retakePhoto());

        // Handle modal close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.cameraModal.style.display === 'block') {
                this.closeCamera();
            }
        });
    }

    async openCamera() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });
            
            this.videoElement.srcObject = this.stream;
            this.cameraModal.style.display = 'block';
            
            await new Promise((resolve) => {
                this.videoElement.onloadedmetadata = resolve;
            });
            
            this.videoElement.play();
        } catch (err) {
            console.error('Error accessing camera:', err);
            alert('Unable to access camera. Please ensure you have granted camera permissions.');
        }
    }

    capturePhoto() {
        if (!this.stream) return;

        const context = this.canvas.getContext('2d');
        
        // Set canvas size to match video dimensions
        this.canvas.width = this.videoElement.videoWidth;
        this.canvas.height = this.videoElement.videoHeight;
        
        // Draw the video frame to canvas
        context.drawImage(this.videoElement, 0, 0);
        
        // Convert to image
        const imageData = this.canvas.toDataURL('image/jpeg');
        
        // Display the captured image
        this.capturedImage.src = imageData;
        this.capturedImage.style.display = 'block';
        this.photoPlaceholder.style.display = 'none';
        
        // Show retake button
        this.retakePhotoBtn.style.display = 'block';
        this.openCameraBtn.textContent = 'Change Photo';
        
        // Close camera
        this.closeCamera();
    }

    closeCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        this.videoElement.srcObject = null;
        this.cameraModal.style.display = 'none';
    }

    retakePhoto() {
        this.capturedImage.style.display = 'none';
        this.photoPlaceholder.style.display = 'block';
        this.retakePhotoBtn.style.display = 'none';
        this.openCameraBtn.textContent = 'Open Camera';
        this.openCamera();
    }

    getImageData() {
        return this.capturedImage.style.display === 'none' ? null : this.capturedImage.src;
    }
}

// Initialize camera handler
const cameraHandler = new CameraHandler();
