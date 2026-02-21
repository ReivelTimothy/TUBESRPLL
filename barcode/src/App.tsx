// barcode/src/App.tsx
import { QRCodeSVG } from 'qrcode.react';

function App() {
  // ID Kantor ini yang nanti akan divalidasi oleh HP Karyawan
  const officeId = "KANTOR-PUSAT-01";

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>SISTEM ABSENSI DIGITAL</h1>
      <p style={styles.subtitle}>Silahkan scan QR Code di bawah untuk Check-in</p>
      
      <div style={styles.qrWrapper}>
        <QRCodeSVG 
          value={officeId} 
          size={300}
          level={"H"} // High error correction agar mudah di-scan
          includeMargin={true}
        />
      </div>

      <div style={styles.infoBox}>
        <p>📍 Lokasi: <strong>Kantor Pusat</strong></p>
        <p>🌐 Network: <strong>Wi-Fi Kantor (Hotspot)</strong></p>
      </div>

      <footer style={styles.footer}>
        {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </footer>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Arial, sans-serif',
  },
  title: { color: '#1a73e8', marginBottom: '10px' },
  subtitle: { color: '#5f6368', marginBottom: '30px' },
  qrWrapper: {
    padding: '20px',
    background: '#fff',
    borderRadius: '20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  },
  infoBox: {
    marginTop: '30px',
    textAlign: 'center' as 'center',
    color: '#3c4043',
  },
  footer: {
    position: 'absolute' as 'absolute',
    bottom: '20px',
    color: '#9aa0a6',
  }
};

export default App;