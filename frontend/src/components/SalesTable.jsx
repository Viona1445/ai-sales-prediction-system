import React, { useState } from 'react';

function SalesTable({ sales }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredSales = sales.filter(item => {
    if (!item) return false;
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
  );
}

export default SalesTable;
