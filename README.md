# AI Sales Prediction System

> **Tugas Technical Test**  
> **Dikembangkan oleh:** Viona Asya Arinda  
> **Posisi:** Kandidat Staff FullStack Developer (Goodeva Technology)  

Sistem ini adalah mini AI Sales Prediction System yang dibangun menggunakan:
- **Frontend**: React JS (menggunakan Vite)
- **Backend**: Python FastAPI
- **Machine Learning**: Scikit-learn (Logistic Regression), Pandas, Numpy
- **Authentication**: JWT Dummy User

## Demo Video
https://drive.google.com/drive/folders/17mmcqL80xKBqgyFZbh68CRLHk_dSRRai

## UI Preview

### Login
<img width="1907" height="974" alt="Screenshot 2026-03-26 at 16 05 04" src="https://github.com/user-attachments/assets/82b1c32e-7cac-46c2-b3e7-1eb63011e1a9" />

### Dashboard
<img width="1910" height="981" alt="Screenshot 2026-03-26 at 16 05 29" src="https://github.com/user-attachments/assets/3128f2c5-64f5-4b5d-9a13-f150b4423f7e" />

### Prediction
<img width="1912" height="974" alt="Screenshot 2026-03-26 at 16 05 55" src="https://github.com/user-attachments/assets/862da4fe-35cc-452c-8598-8bda88393077" />

### API (Swagger)
<img width="1907" height="980" alt="Screenshot 2026-03-26 at 16 06 27" src="https://github.com/user-attachments/assets/9124a8aa-8e2a-4956-957a-e45c43d7bd6d" />

## 1. System Design & Arsitektur Singkat

**Diagram Arsitektur**
```text
[ React JS Frontend ]  <-- (REST API / JSON) -->  [ FastAPI Backend ]
       |                                                 |
(Menerima Input &                          (Validasi, Otentikasi JWT,
 Menampilkan Hasil)                         Logika Bisnis & Routing API)
                                                         |
                                       +-----------------+-----------------+
                                       |                                   |
                                       v                                   v
                          [ Data Source (CSV) ]               [ Machine Learning ]
                        (sales_data.csv dibaca               (Load model.pkl & encoder
                         saat endpoint GET /sales)            untuk inferensi POST /predict)
```

**Alur Data:**
1. **Frontend (React)** menerima input kredensial (saat login) atau parameter data produk (saat simulasi prediksi) dari pengguna.
2. **Backend (FastAPI)** bertindak sebagai pusat kendali (*controller*) yang menengahi jalannya informasi. Backend memvalidasi *request*, menerbitkan kredensial JWT, dan merutekan komunikasi. Untuk memuat tabel, Backend akan membaca data historis langsung dari `data/sales_data.csv`.
3. Pada saat endpoint `/predict` dipanggil, Backend di belakang layar memuat instansi model prediktif `.joblib`/`.pkl` yang sebelumnya telah dilatih oleh bagian **Machine Learning**, mengekstrak hasil (Laris / Tidak), dan mengarahkan kembali probabilitas itu ke Frontend UI.

## 2. Design Decision & Asumsi

- **Backend Stack**: Digunakan **FastAPI** daripada Flask karena memiliki dukungan bawaan untuk *asynchronous routing* dan validasi otomatis melalui **Pydantic**, yang sangat cocok untuk menjembatani sistem AI modern.
- **Machine Learning**: Digunakan algoritma **Logistic Regression** karena persoalan ini tergolong pada *binary classification* linier sederhana ("Laris" vs "Tidak"). Model ini cepat dalam proses *training*, ringan disimpan secara *persistence*, dan sifat matematis distribusinya tidak *over-engineered* untuk dimensi dataset yang tidak terlalu masif.
- **Otentikasi**: Implementasi *Protected Route* menggunakan **JSON Web Token (JWT)** karena arsitekturnya yang tak berkondisi (*stateless*). Untuk skala tes ini, pengguna diasumsikan bertipe data mati (*hardcoded/dummy*) dengan *credentials* baku.
- **UI/UX Decision**: Dibangun menggunakan *Vanilla CSS* canggih ketimbang *framework* Tailwind. Ini menunjukkan kompetensi dasar fundamental DOM dan CSS murni, sekaligus menghasilkan UI berefek *Glassmorphism* yang profesional setaraf SaaS (*Software as a Service*).

## Struktur Folder

```
ai-sales-prediction-system/
├── data/
│   └── sales_data.csv        # Dummy dataset
├── ml/
│   ├── train.py              # Script training ML
│   ├── requirements.txt      # Dependensi ML
│   └── model.pkl             # Model terlatih
├── backend/
│   ├── main.py               # FastAPI backend
│   ├── auth.py               # JWT Dummy Auth 
│   └── requirements.txt      # Dependensi backend
└── frontend/                 # Aplikasi React Vite
    ├── src/
    ├── package.json
    └── ...
```

## Prasyarat
Pastikan Anda sudah menginstal:
- Python 3.9+ 
- Node.js 18+

---

## Cara menjalankan project

### 1. Train model
```bash
cd ml
pip install -r requirements.txt
python train.py
```

### 2. Jalankan backend
```bash
cd ../backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

### 3. Jalankan frontend
```bash
cd ../frontend
npm install
npm run dev
```

---

## Cara Menggunakan Aplikasi

1. Buka browser dan arahkan ke alamat URL frontend (misal `http://localhost:5173`).
2. Login dengan kredensial dummy berikut:
   - **Username**: `admin`
   - **Password**: `password123`
3. Setelah login, Anda akan masuk ke halaman Dashboard yang berisi dua fitur:
   - **Data Sales CSV**: Memuat tabel berisi history dummy penjualan.
   - **Prediksi Status Produk**: Masukkan parameter `Jumlah`, `Harga`, dan `Diskon`, lalu klik `Prediksi AI` untuk memprediksi apakah status penjualan produk berdasarkan nilai-nilai tersebut akan "Laris" atau "Tidak".
