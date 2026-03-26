# AI Sales Prediction System

> **Tugas Technical Test**  
> **Dikembangkan oleh:** Viona Asya Arinda  
> **Posisi:** Kandidat Staff FullStack Developer (Goodeva Technology)  

Sistem ini adalah mini AI Sales Prediction System yang dibangun menggunakan:
- **Frontend**: React JS (menggunakan Vite)
- **Backend**: Python FastAPI
- **Machine Learning**: Scikit-learn (Logistic Regression), Pandas, Numpy
- **Authentication**: JWT Dummy User

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

## Langkah 1: Training Model Machine Learning

1. Buka terminal dan masuk ke root folder project `ai-sales-prediction-system`.
2. Buat virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependensi ML:
   ```bash
   pip install -r ml/requirements.txt
   ```
4. Jalankan script training:
   ```bash
   python ml/train.py
   ```
   *Script ini akan membaca `data/sales_data.csv` dan menghasilkan file `ml/model.pkl`.*

---

## Langkah 2: Menjalankan Backend FastAPI

1. Masih di terminal yang sama (didalam virtual environment aktif):
   ```bash
   pip install -r backend/requirements.txt
   ```
2. Jalankan server FastAPI menggunakan `uvicorn`:
   ```bash
   uvicorn backend.main:app --reload
   ```
   *Backend akan berjalan di `http://localhost:8000`.*
3. (Opsional) Buka `http://localhost:8000/docs` untuk mengunjungi dokumentasi API interaktif dari Swagger.

---

## Langkah 3: Menjalankan Frontend React

1. Buka tab/jendela terminal baru.
2. Masuk ke folder `frontend`:
   ```bash
   cd frontend
   ```
3. Install dependensi NPM:
   ```bash
   npm install
   ```
4. Jalankan Vite development server:
   ```bash
   npm run dev
   ```
   *Frontend akan berjalan di address yang tertera di terminal (contoh `http://localhost:5173`).*

---

## Cara Menggunakan Aplikasi

1. Buka browser dan arahkan ke alamat URL frontend (misal `http://localhost:5173`).
2. Login dengan kredensial dummy berikut:
   - **Username**: `admin`
   - **Password**: `password123`
3. Setelah login, Anda akan masuk ke halaman Dashboard yang berisi dua fitur:
   - **Data Sales CSV**: Memuat tabel berisi history dummy penjualan.
   - **Prediksi Status Produk**: Masukkan parameter `Jumlah`, `Harga`, dan `Diskon`, lalu klik `Prediksi AI` untuk memprediksi apakah status penjualan produk berdasarkan nilai-nilai tersebut akan "Laris" atau "Tidak".
