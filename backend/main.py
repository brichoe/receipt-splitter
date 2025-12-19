from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import re
from pydantic import BaseModel
from typing import List

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
    print("file received")
    # Save uploaded file temporarily
    contents = await file.read()
    with open("temp.jpg", "wb") as f:
        f.write(contents)

    # TODO: Replace with actual OCR integration later
    extracted_text = "Milk 4.99\nChips 3.49\nTotal 8.48"

    items = parse_receipt_text(extracted_text)
    # Return parsed items to frontend
    return {"items": items}

def parse_receipt_text(text: str):
    lines = text.split("\n")
    items = []
    for line in lines:
        match = re.search(r"(\d+\.\d{2})", line)
        if match:
            price = float(match.group(1))
            name = line[:match.start()].strip()
            items.append({"name": name, "price": price})
    return items


#user management
friends = []

class Friend(BaseModel):
    name: str

#get all friends
@app.get("/friends", response_model=List[Friend])
def get_friends():
    return friends

#in memory storage
@app.post("/friends", response_model=Friend)
def add_friend(friend: Friend):
    print("ADD FRIEND HIT:", friend)
    friends.append(friend)
    return friend