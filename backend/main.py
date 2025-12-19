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

#item management
items = []

class Item(BaseModel):
    name: str
    price: float
    purchasedBy: List[str] = []  #initially empty. suggest type is list of str

#get all items
@app.get("/items", response_model=List[Item]) #converts JSON to python object
def get_items():
    return items

#Front end sends in an item, and backend adds it to the items list and returns added item
@app.post("/items", response_model=Item)
def add_item(item: Item):
    items.append(item)
    return item

#delete an item by name
@app.delete("/items/{item_name}", response_model=dict)
def delete_item(item_name: str):
    global items
    for i in items:
        if i.name == item_name:
            items = [item for item in items if item.name != item_name]
            return {"message": f"Item '{item_name}' deleted."}
        else:
            print("Item not found")


#opt in to sharing an item

@app.put("/items/{item_name}", response_model=Item)
def update_item(item_name: str, friend: str):
    for i in items:
        if i.name == item_name and friend not in i.purchasedBy:
            i.purchasedBy.append(friend)
            return i
    raise HTTPException(status_code=404, detail="Item not found")

class UpdateSharedBy(BaseModel):
    purchasedBy: List[str]
# {"purchasedBy": [Alice, Bob]}
# Update sharedBy for a specific item
@app.patch("/items/{item_name}/shared-by", response_model=Item)
def update_shared_by(item_name: str, update: UpdateSharedBy):
    for item in items:
        if item.name == item_name:
            item.purchasedBy = update.purchasedBy
            return item
    raise HTTPException(status_code=404, detail="Item not found")

#user management
friends = []

class Friend(BaseModel):
    name: str

#get all friends
@app.get("/friends", response_model=List[Friend]) #converts JSON to python object
def get_friends():
    return friends #returns JSON to front-end

#in memory storage
@app.post("/friends", response_model=Friend)
def add_friend(friend: Friend):
    print("ADD FRIEND HIT:", friend)
    friends.append(friend)
    return friend