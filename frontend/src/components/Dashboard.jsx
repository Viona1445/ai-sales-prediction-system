import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getSalesAPI } from '../api/apiService';
import SalesTable from './SalesTable';
import PredictionForm from './PredictionForm';

function Dashboard({ setToken }) {
  const [sales, setSales] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const data = await getSalesAPI();
        setSales(data);
      } catch (err) {
        if(err.response?.status === 404) toast.error("Data sales CSV belum tersedia di Backend");
      }
    };
    fetchSales();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    toast.success('Anda berhasil keluar sesi.');
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '50px 20px' }}>
      <div className="header-container fade-in" style={{ backgroundColor: 'white', padding: '24px 32px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', border: '1px solid #E2E8F0', alignItems: 'center' }}>
        <div>
          <h2 className="title" style={{ color: '#047857' }}>Sistem Dashboard AI</h2>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '15px' }}>Analitik Prediksi Penjualan & Performa Stok</p>
        </div>
        <button className="btn btn-danger" onClick={handleLogout} style={{ padding: '10px 24px', borderRadius: '12px', fontWeight: 'bold' }}>Keluar Dari Sesi</button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        {/* Komponen Tabel Data Terpisah */}
        <SalesTable sales={sales} />

        {/* Komponen Form Prediksi Terpisah */}
        <PredictionForm />
      </div>
    </div>
  );
}

export default Dashboard;
