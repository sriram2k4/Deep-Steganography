from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from model import load_autoencoder_model, process_images
from utils import numpy_to_base64, read_imagefile

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = load_autoencoder_model()

@app.post("/process")
async def process_files(cover: UploadFile = File(...), secret: UploadFile = File(...)):
    try:
        cover_image = read_imagefile(cover.file)
        secret_image = read_imagefile(secret.file)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error reading images: " + str(e))
    
    try:
        encoded_cover, decoded_secret, difference = process_images(secret_image, cover_image, model)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Processing error: " + str(e))
    
    return {
        "encoded_cover": numpy_to_base64(encoded_cover),
        "decoded_secret": numpy_to_base64(decoded_secret),
        "difference": numpy_to_base64(difference)
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
