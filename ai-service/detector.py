import cv2
import numpy as np
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from ultralytics import YOLO
import mediapipe as mp
import urllib.request
import os

# Load YOLOv11 model
model = YOLO('yolo11n.pt')

# Download MediaPipe model
model_path = 'face_landmarker.task'
if not os.path.exists(model_path):
    urllib.request.urlretrieve(
        'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        model_path
    )

# New MediaPipe API
base_options = python.BaseOptions(model_asset_path=model_path)
options = vision.FaceLandmarkerOptions(
    base_options=base_options,
    num_faces=1
)
face_landmarker = vision.FaceLandmarker.create_from_options(options)

def calculate_ear(landmarks, eye_indices, w, h):
    points = [(int(landmarks[i].x * w), int(landmarks[i].y * h)) for i in eye_indices]
    A = np.linalg.norm(np.array(points[1]) - np.array(points[5]))
    B = np.linalg.norm(np.array(points[2]) - np.array(points[4]))
    C = np.linalg.norm(np.array(points[0]) - np.array(points[3]))
    return (A + B) / (2.0 * C) if C != 0 else 0

def calculate_mar(landmarks, mouth_indices, w, h):
    points = [(int(landmarks[i].x * w), int(landmarks[i].y * h)) for i in mouth_indices]
    vertical = np.linalg.norm(np.array(points[0]) - np.array(points[1]))
    horizontal = np.linalg.norm(np.array(points[2]) - np.array(points[3]))
    return vertical / horizontal if horizontal != 0 else 0

def detect_drowsiness(image_bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    h, w = img.shape[:2]

    result = {
        'yolo_face_detected': False,
        'ear': None,
        'mar': None,
        'status': 'No Face',
        'confidence': 0
    }

    # YOLOv11 face detection
    yolo_results = model(img, verbose=False)
    if len(yolo_results[0].boxes) == 0:
        return result

    result['yolo_face_detected'] = True
    box = yolo_results[0].boxes[0]
    confidence = float(box.conf[0])
    result['confidence'] = round(confidence, 3)

    x1, y1, x2, y2 = map(int, box.xyxy[0])
    pad = 20
    x1 = max(0, x1 - pad)
    y1 = max(0, y1 - pad)
    x2 = min(w, x2 + pad)
    y2 = min(h, y2 + pad)

    face_crop = img[y1:y2, x1:x2]
    fh, fw = face_crop.shape[:2]

    # MediaPipe new API
    rgb_face = cv2.cvtColor(face_crop, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_face)
    detection_result = face_landmarker.detect(mp_image)

    if not detection_result.face_landmarks:
        return result

    landmarks = detection_result.face_landmarks[0]

    LEFT_EYE = [33, 160, 158, 133, 153, 144]
    RIGHT_EYE = [362, 385, 387, 263, 373, 380]
    MOUTH = [13, 14, 78, 308]

    left_ear = calculate_ear(landmarks, LEFT_EYE, fw, fh)
    right_ear = calculate_ear(landmarks, RIGHT_EYE, fw, fh)
    avg_ear = round((left_ear + right_ear) / 2, 3)
    mar = round(calculate_mar(landmarks, MOUTH, fw, fh), 3)

    result['ear'] = avg_ear
    result['mar'] = mar

    if avg_ear < 0.28:
        result['status'] = 'DROWSY'
    elif mar > 0.5:
        result['status'] = 'YAWN'
    else:
        result['status'] = 'ALERT'

    return result