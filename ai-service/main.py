from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from detector import detect_drowsiness

app = FastAPI()

origins = [
    "https://roadvision-ai-omega.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "RoadVision AI Service Running"}

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    image_bytes = await file.read()
    result = detect_drowsiness(image_bytes)
    return result