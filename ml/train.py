import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

def main():
    print("=== Mulai Proses Training AI Sales Prediction ===")
    
    # Resolusi path agar selalu relatif terhadap lokasi script ini berada
    # (Ini menjamin script bisa di-run dari mana saja tanpa error 'File Not Found')
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, 'data', 'sales_data.csv')
    model_path = os.path.join(base_dir, 'ml', 'model.joblib')
    encoder_path = os.path.join(base_dir, 'ml', 'label_encoder.joblib')
    
    print(f"[*] Membaca data dari: {data_path}")
    if not os.path.exists(data_path):
        print("[!] ERROR: Dataset CSV tidak ditemukan. Pastikan path sudah benar.")
        return
        
    df = pd.read_csv(data_path)
    
    # 1. Pilih kolom fitur (X) dan target (y)
    X = df[['jumlah_penjualan', 'harga', 'diskon']]
    y = df['status']
    
    # 2. Preprocessing Data
    # Mengubah target string ("Laris" / "Tidak") numerik (0 / 1) menggunakan LabelEncoder
    print("[*] Melakukan preprocessing (Label Encoding)...")
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    
    # 3. Split train dan test data (80% training, 20% testing)
    print("[*] Membagi data menjadi Training dan Testing set...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42
    )
    
    # 4. Inisiasi dan Training Model
    # Menggunakan Logistic Regression karena sangat cepat, efektif untuk binary classification, dan mudah dijelaskan saat interview
    print("[*] Memulai training model Logistic Regression...")
    model = LogisticRegression(max_iter=1000)
    model.fit(X_train, y_train)
    
    # 5. Evaluasi akurasi
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"[+] Training Selesai! Akurasi Model: {acc * 100:.2f}%")
    
    # 6. Menyimpan model dan label encoder menggunakan joblib
    print("[*] Menyimpan model klasifikasi dan label encoder...")
    joblib.dump(model, model_path)
    joblib.dump(le, encoder_path)
    print(f"[+] Model berhasil disimpan di: {model_path}")
    print(f"[+] Encoder berhasil disimpan di: {encoder_path}")

if __name__ == "__main__":
    main()
