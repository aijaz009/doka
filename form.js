class CameraHandler {
    constructor() {
        this.stream = null;
        this.photoData = null;
        
        // DOM Elements
        this.modal = document.getElementById('camera-modal');
        this.video = document.getElementById('camera-feed');
        this.canvas = document.getElementById('photo-canvas');
        this.capturedPhoto = document.getElementById('captured-photo');
        this.photoPlaceholder = document.getElementById('photo-placeholder');
        
        // Buttons
        this.startButton = document.getElementById('start-camera');
        this.captureButton = document.getElementById('capture-photo');
        this.closeButton = document.getElementById('close-camera');
        this.retakeButton = document.getElementById('retake-photo');

        // Bind event listeners
        this.startButton.addEventListener('click', () => this.startCamera());
        this.captureButton.addEventListener('click', () => this.capturePhoto());
        this.closeButton.addEventListener('click', () => this.closeCamera());
        this.retakeButton.addEventListener('click', () => this.retakePhoto());
    }

    async startCamera() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });
            
            this.video.srcObject = this.stream;
            this.modal.style.display = 'block';
            this.captureButton.disabled = false;
            
            // Wait for video to be ready
            await new Promise((resolve) => {
                this.video.onloadedmetadata = resolve;
            });
            
            this.video.play();
        } catch (err) {
            console.error('Error accessing camera:', err);
            alert('Unable to access camera. Please ensure you have granted camera permissions.');
        }
    }

    capturePhoto() {
        // Set canvas dimensions to match video
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        
        // Draw video frame to canvas
        const context = this.canvas.getContext('2d');
        context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        
        // Convert to data URL
        this.photoData = this.canvas.toDataURL('image/jpeg');
        
        // Display captured photo
        this.capturedPhoto.src = this.photoData;
        this.capturedPhoto.style.display = 'block';
        this.photoPlaceholder.style.display = 'none';
        
        // Show retake button and close camera
        this.retakeButton.style.display = 'block';
        this.closeCamera();
    }

    closeCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        this.video.srcObject = null;
        this.modal.style.display = 'none';
        this.captureButton.disabled = true;
    }

    retakePhoto() {
        this.photoData = null;
        this.capturedPhoto.style.display = 'none';
        this.photoPlaceholder.style.display = 'block';
        this.retakeButton.style.display = 'none';
        this.startCamera();
    }

    getPhotoData() {
        return this.photoData;
    }
}

// Initialize camera handler
const cameraHandler = new CameraHandler();
