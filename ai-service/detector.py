import cv2
import numpy as np
from ultralytics import YOLO

# Load YOLOv11 model
model = YOLO('yolo11n.pt')

def detect_drowsiness(image_bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    result = {
        'yolo_face_detected': False,
        'status': 'No Face',
        'confidence': 0,
        'ear': None,
        'mar': None,
    }

    # YOLOv11 detection
    yolo_results = model(img, verbose=False)
    
    if len(yolo_results[0].boxes) == 0:
        return result

    box = yolo_results[0].boxes[0]
    confidence = float(box.conf[0])
    
    result['yolo_face_detected'] = True
    result['confidence'] = round(confidence, 3)
    result['status'] = 'FACE_DETECTED'

    return result