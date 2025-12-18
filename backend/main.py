from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import re

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/upload-receipt")
async def upload_receipt(file: UploadFile = File(...)):
    # Save uploaded file temporarily
    contents = await file.read()
    with open("temp.jpg", "wb") as f:
        f.write(contents)

    # TODO: Replace with actual OCR integration later
    extracted_text = "Milk 4.99\nChips 3.49\nTotal 8.48"

    # Parse items from text
    lines = extracted_text.split("\n")
    items = []
    for line in lines:
        match = re.search(r"(\d+\.\d{2})", line)
        if match:
            price = float(match.group(1))
            name = line[:match.start()].strip()
            items.append({"name": name, "price": price})

    # Return parsed items to frontend
    return {"items": items}
