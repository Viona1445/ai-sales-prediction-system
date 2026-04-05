import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { predictSalesAPI } from '../api/apiService';

function PredictionForm() {
  const [formPrediksi, setFormPrediksi] = useState({
    jumlah_penjualan: '',
    harga: '',
    diskon: ''
  });

  const [displayHarga, setDisplayHarga] = useState('');
  const [displayDiskon, setDisplayDiskon] = useState('');
  const [hasilPrediksi, setHasilPrediksi] = useState(null);

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
    const rawVal = val.replace(/[^0-9]/g, '');
    setFormPrediksi(prev => ({ ...prev, harga: rawVal ? Number(rawVal) : '' }));
  };

  const handleDiskonChange = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if(val !== '') {
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

  return (
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
  );
}

export default PredictionForm;
