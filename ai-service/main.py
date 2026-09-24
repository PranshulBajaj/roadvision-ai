from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from detector import detect_drowsiness

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
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