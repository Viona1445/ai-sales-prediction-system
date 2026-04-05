import os
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

from auth import DUMMY_USER, create_access_token

app = FastAPI(title="AI Sales Prediction API")

# Setup CORS (untuk React nantinya)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model dan path ke dataset
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "ml", "model.joblib")
ENCODER_PATH = os.path.join(BASE_DIR, "ml", "label_encoder.joblib")
DATA_PATH = os.path.join(BASE_DIR, "data", "sales_data.csv")

# Memuat model & encoder sekali sewaktu aplikasi backend berjalan
try:
    model = joblib.load(MODEL_PATH)
    encoder = joblib.load(ENCODER_PATH)
    print("Model ML dan Encoder berhasil diload!")
except Exception as e:
    model = None
    encoder = None
    print(f"Gagal memuat model/encoder: {e}")

# Pydantic schemas (validasi request body)
class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class PredictRequest(BaseModel):
    jumlah_penjualan: int
    harga: float
    diskon: float

class PredictResponse(BaseModel):
    status_prediksi: str

@app.post("/login", response_model=Token)
def login(req: LoginRequest):
    if req.username == DUMMY_USER["username"] and req.password == DUMMY_USER["password"]:
        access_token = create_access_token(data={"sub": req.username})
        return {"access_token": access_token, "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Invalid username or password")

@app.get("/sales", response_model=List[Dict[str, Any]])
def get_sales():
    if not os.path.exists(DATA_PATH):
        raise HTTPException(status_code=404, detail="Data sales_data.csv tidak ditemukan")
    
    # Load csv ke dataframe
    df = pd.read_csv(DATA_PATH)
    # Konversi pandas dataframe ke list of dictionary (json array) secara native
    return df.to_dict(orient="records")

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    if model is None:
        raise HTTPException(status_code=500, detail="Model ML gagal diload, cek server backend anda.")
    
    # Memformat request menjadi pandas dataframe yang sesuai dengan skema training
    input_data = pd.DataFrame([{
        "jumlah_penjualan": req.jumlah_penjualan,
        "harga": req.harga,
        "diskon": req.diskon
    }])
    
    try:
        # Array output prediction numerik, kita ambil index ke 0 lalu convert balik jadi string aslinya ("Laris") via Encoder
        pred_numeric = model.predict(input_data)[0]
        prediction_label = encoder.inverse_transform([pred_numeric])[0]
        return {"status_prediksi": str(prediction_label)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saat inferensi model: {str(e)}")
