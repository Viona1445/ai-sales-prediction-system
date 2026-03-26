import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getSalesAPI, predictSalesAPI } from '../api/apiService';

function Dashboard({ setToken }) {
  const [sales, setSales] = useState([]);
  
  // Raw integer values for the API
  const [formPrediksi, setFormPrediksi] = useState({
    jumlah_penjualan: '',
    harga: '',
    diskon: ''
  });

  // Display values for nicely formatted inputs
  const [displayHarga, setDisplayHarga] = useState('');
  const [displayDiskon, setDisplayDiskon] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [hasilPrediksi, setHasilPrediksi] = useState(null);
  
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

  const formatRupiah = (value) => {
    const numberString = value.replace(/[^,\d]/g, '').toString();
    const split = numberString.split(',');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      const separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }
    
    rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
    return rupiah ? 'Rp ' + rupiah : '';
  };

  const handleHargaChange = (e) => {
    const val = e.target.value;
    const formatted = formatRupiah(val);
    setDisplayHarga(formatted);
    // extract digits for raw numerical state
    const rawVal = val.replace(/[^0-9]/g, '');
    setFormPrediksi(prev => ({ ...prev, harga: rawVal ? Number(rawVal) : '' }));
  };

  const handleDiskonChange = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if(val !== '') {
        // Enforce max 100%
        if(Number(val) > 100) val = '100';
        setDisplayDiskon(val + '%');
    } else {
        setDisplayDiskon('');
    }
    setFormPrediksi(prev => ({ ...prev, diskon: val ? Number(val) : '' }));
  };

  const handleChange = (e) => {
    setFormPrediksi({ ...formPrediksi, [e.target.name]: Number(e.target.value) });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('AI sedang mengkalkulasi prediksi...');
    try {
      const data = await predictSalesAPI({
        jumlah_penjualan: Number(formPrediksi.jumlah_penjualan),
        harga: Number(formPrediksi.harga),
        diskon: Number(formPrediksi.diskon)
      });
      setHasilPrediksi(data.status_prediksi);
      toast.success('Prediksi selesai!', { id: loadingToast });
    } catch (err) {
      toast.error("Sistem terkendala. Pastikan backend aktif.", { id: loadingToast });
    }
  };

  const handleReset = () => {
    setFormPrediksi({
      jumlah_penjualan: '',
      harga: '',
      diskon: ''
    });
    setDisplayHarga('');
    setDisplayDiskon('');
    setHasilPrediksi(null);
    toast.success('Form telah dikosongkan kembali.');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    toast.success('Anda berhasil keluar sesi.');
    navigate('/login');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Kembali ke halaman 1 setiap pencarian berubah
  };

  const filteredSales = sales.filter(item => {
    if (!item) return false; // Safeguard if row is fully empty
    const term = searchTerm.toLowerCase();
    return (
      (item.product_name && item.product_name.toString().toLowerCase().includes(term)) ||
      (item.product_id && item.product_id.toString().toLowerCase().includes(term)) ||
      (item.status && item.status.toString().toLowerCase().includes(term)) || 
      (item.jumlah_penjualan != null && item.jumlah_penjualan.toString().includes(term)) ||
      (item.harga != null && item.harga.toString().includes(term)) ||
      (item.diskon != null && item.diskon.toString().includes(term))
    );
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const currentData = filteredSales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
        
        {/* TABEL SALES DATA */}
        <div className="card fade-in" style={{ animationDelay: '0.1s', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#1E293B' }}>Riwayat Data Tersimpan</h3>
            <div style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '8px 16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'all 0.2s', width: '250px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px' }}>
                <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                placeholder="Cari ID, Produk, atau Status..." 
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', width: '100%', color: '#0F172A' }}
              />
            </div>
          </div>
          <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Produk</th>
                  <th>Jumlah</th>
                  <th>Harga</th>
                  <th>Diskon</th>
                  <th>Status Produk</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? currentData.map((item, i) => (
                  <tr key={i}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{item.product_id || '-'}</td>
                    <td style={{ fontWeight: 600, color: '#0F172A' }}>{item.product_name || '-'}</td>
                    <td style={{ fontWeight: 500 }}>{item.jumlah_penjualan != null ? item.jumlah_penjualan : '-'}</td>
                    <td>Rp {item.harga != null ? Number(item.harga).toLocaleString('id-ID') : '0'}</td>
                    <td>{item.diskon != null ? item.diskon : '0'}%</td>
                    <td>
                      <span className={`badge ${item.status === 'Laris' ? 'badge-success' : 'badge-danger'}`}>
                         {item.status || '-'}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '60px 40px', color: 'var(--text-muted)' }}>
                      {sales.length === 0 ? 'Memuat data sumber...' : 'Pencarian tidak menemukan hasil.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Controls Paginasi */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', fontSize: '13px', color: '#64748B' }}>
            <div>
              Menampilkan <span style={{ fontWeight: 600, color: '#1E293B' }}>{filteredSales.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredSales.length)}</span> dari total <strong>{filteredSales.length}</strong> data
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                title="Halaman Sebelumnya"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 10px', border: '1px solid #E2E8F0', borderRadius: '6px', background: currentPage === 1 ? '#F8FAFC' : 'white', color: currentPage === 1 ? '#CBD5E1' : '#64748B', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button 
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                title="Halaman Selanjutnya"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 10px', border: '1px solid #E2E8F0', borderRadius: '6px', background: (currentPage === totalPages || totalPages === 0) ? '#F8FAFC' : 'white', color: (currentPage === totalPages || totalPages === 0) ? '#CBD5E1' : '#64748B', cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* FORM PREDIKSI */}
        <div className="card fade-in" style={{ animationDelay: '0.2s', background: 'linear-gradient(145deg, #ffffff 0%, #F8FAFC 100%)' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
             <h3 style={{ margin: 0, fontSize: '19px' }}>Simulasi Prediksi Produk</h3>
             <button 
               type="button" 
               onClick={handleReset} 
               disabled={formPrediksi.jumlah_penjualan === '' && formPrediksi.harga === '' && formPrediksi.diskon === ''}
               title="Kosongkan Form"
               style={{ 
                 display: 'flex', alignItems: 'center', gap: '8px', 
                 background: (formPrediksi.jumlah_penjualan === '' && formPrediksi.harga === '' && formPrediksi.diskon === '') ? 'transparent' : '#F1F5F9', 
                 border: (formPrediksi.jumlah_penjualan === '' && formPrediksi.harga === '' && formPrediksi.diskon === '') ? '1px solid transparent' : '1px solid #E2E8F0', 
                 borderRadius: '8px',
                 padding: '8px 14px', 
                 color: (formPrediksi.jumlah_penjualan === '' && formPrediksi.harga === '' && formPrediksi.diskon === '') ? '#CBD5E1' : '#475569', 
                 cursor: (formPrediksi.jumlah_penjualan === '' && formPrediksi.harga === '' && formPrediksi.diskon === '') ? 'not-allowed' : 'pointer', 
                 fontSize: '13px', fontWeight: 600, transition: 'all 0.2s'
               }}
             >
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
               </svg>
               Mulai Ulang
             </button>
           </div>
           <p style={{ margin: '0 0 24px 0', fontSize: '15px', color: 'var(--text-muted)' }}>
             Masukkan indikasi angka untuk melihat proyeksi dari Machine Learning.
           </p>
           
           <form onSubmit={handlePredict} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
             
             <div className="input-group">
               <label style={{ fontSize: '13px' }}>Angka Penjualan (Qty)</label>
               <input 
                 type="number" 
                 name="jumlah_penjualan" 
                 value={formPrediksi.jumlah_penjualan} 
                 onChange={handleChange} 
                 className="input-field" 
                 placeholder="Contoh: 150"
                 style={{ fontSize: '16px', padding: '14px 16px' }}
                 required
               />
             </div>
             
             <div className="input-group">
               <label style={{ fontSize: '13px' }}>Harga Jual (Rp)</label>
               <input 
                 type="text" 
                 name="display_harga" 
                 value={displayHarga} 
                 onChange={handleHargaChange} 
                 className="input-field" 
                 placeholder="Rp 0"
                 style={{ fontSize: '16px', padding: '14px 16px' }}
                 required
               />
             </div>
             
             <div className="input-group">
               <label style={{ fontSize: '13px' }}>Diskon / Potongan (%)</label>
               <input 
                 type="text" 
                 name="display_diskon" 
                 value={displayDiskon} 
                 onChange={handleDiskonChange} 
                 className="input-field" 
                 placeholder="0%"
                 style={{ fontSize: '16px', padding: '14px 16px' }}
                 required
               />
             </div>
             
             <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', fontSize: '16px', padding: '16px', fontWeight: 'bold' }}>
               Konfirmasi Prediksi Sistem
             </button>
           </form>
           
           {hasilPrediksi && (
             <div className="fade-in" style={{ 
                marginTop: '30px', 
                padding: '20px', 
                backgroundColor: hasilPrediksi === 'Laris' ? '#F0FDF4' : '#FEF2F2', 
                border: '1px solid',
                borderColor: hasilPrediksi === 'Laris' ? '#BBF7D0' : '#FECACA', 
                borderRadius: '8px' 
             }}>
                <p style={{ 
                  margin: '0 0 5px 0', 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  color: hasilPrediksi === 'Laris' ? '#166534' : '#991B1B', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em' 
                }}>
                  Kesimpulan Status Penjualan
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '15px', color: hasilPrediksi === 'Laris' ? '#15803D' : '#B91C1C' }}>Peluang Pasar Sistem:</span>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: hasilPrediksi === 'Laris' ? '#16A34A' : '#DC2626' }}>"{hasilPrediksi}"</span>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
