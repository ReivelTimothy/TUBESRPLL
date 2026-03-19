export const ipCheckMiddleware = (req: any, res: any, next: any) => {
  const ALLOWED_PREFIX = "114.122";
  
  // Mengambil IP user (menangani proxy jika menggunakan ngrok/load balancer)
  const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "";

  if (!userIp.includes(ALLOWED_PREFIX)) {
    return res.status(403).json({ 
      message: `Akses ditolak. IP Anda (${userIp}) tidak terdaftar dalam jaringan kantor.` 
    });
  }

  next();
};