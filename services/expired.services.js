import sendEmail from './email.service.js';
import db from '../models/index.js';

export const checkExpired = async () => {
  const today = new Date();

  const warningDate = new Date();
  warningDate.setDate(today.getDate() + 3); // H-3

  const barangList = await db.Barang.findAll();

  let warningItems = [];
  let expiredItems = [];

  for (const item of barangList) {
    const expired = new Date(item.expired_date);

    if (expired < today) {
      expiredItems.push(item);
    } else if (expired <= warningDate) {
      warningItems.push(item);
    }
  }

  // kalau tidak ada apa-apa → stop
  if (warningItems.length === 0 && expiredItems.length === 0) {
    console.log('Tidak ada barang perlu notif');
    return;
  }

  // 🧾 bikin HTML email
  let html = `
    <div style="font-family: Arial; padding: 20px;">
      <h2>📦 Notifikasi Barang</h2>
  `;

  // 🔴 expired
  if (expiredItems.length > 0) {
    html += `<h3 style="color:red;">❌ Barang Expired</h3><ul>`;
    expiredItems.forEach(item => {
      html += `<li><b>${item.nama_barang}</b> - ${item.expired_date}</li>`;
    });
    html += `</ul>`;
  }

  // 🟡 warning
  if (warningItems.length > 0) {
    html += `<h3 style="color:orange;">⚠️ Mendekati Expired</h3><ul>`;
    warningItems.forEach(item => {
      html += `<li><b>${item.nama_barang}</b> - ${item.expired_date}</li>`;
    });
    html += `</ul>`;
  }

  html += `
      <p>Segera cek dan lakukan tindakan ya 👍</p>
    </div>
  `;

  // 📧 kirim 1 email saja
  await sendEmail(
    'emailkamu@gmail.com',
    '📦 Notifikasi Barang Expired & Warning',
    html
  );

  console.log('Email summary terkirim!');
};