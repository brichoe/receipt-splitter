# Set up backend
cd backend
python3 -m venv venv  
source venv/bin/activate  
pip install -r requirements.txt  

**usage**  
uvicorn main:app --reload  


# Set up frontend
cd frontend  
npm install  
npm start  
