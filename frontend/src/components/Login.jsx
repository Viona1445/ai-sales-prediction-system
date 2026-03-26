import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginAPI } from '../api/apiService';

function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginAPI(username, password);
      // Simpan JWT Token
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);
      toast.success('Login Berhasil! Selamat Datang.');
      navigate('/');
    } catch (err) {
      toast.error('Kredensial tidak terdaftar. Gunakan admin / password123');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: '440px', padding: '48px', boxSizing: 'border-box' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          {/* Elemen Logo Buatan */}
          <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)', borderRadius: '18px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '28px', fontWeight: '800', boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.3)' }}>
            AI
          </div>
          <h2 className="title" style={{ marginBottom: '10px', color: '#0F172A', fontSize: '26px' }}>Login Aplikasi</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px' }}>Sistem Prediksi Penjualan & Stok.</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="input-group">
            <label style={{ fontSize: '13px' }}>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className="input-field"
              placeholder="Masukkan username Anda"
              style={{ fontSize: '16px', padding: '14px 16px' }}
              required
            />
          </div>
          
          <div className="input-group">
            <label style={{ fontSize: '14px', marginBottom: '8px', display: 'block', color: '#334155' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="input-field" 
                placeholder="Masukkan password admin..."
                style={{ width: '100%', paddingRight: '44px', boxSizing: 'border-box' }}
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                style={{ 
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8',
                  padding: 0, display: 'flex', alignItems: 'center'
                 }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', marginTop: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold' }} disabled={loading}>
            {loading ? 'Memvalidasi...' : 'Masuk Ke Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
