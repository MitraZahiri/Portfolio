# Mitra Zahiri — Digital Museum (3D FPS Virtual Portfolio)

> **Sébastien Lempens** atmosferinden ilham alan, birinci şahıs (FPS) kamerası ile gezilebilen, karanlık ve minimalist 3D sanal müze portfolyosu.
> WebGL, Three.js, PointerLockControls ve GSAP mimarisiyle inşa edilmiştir.

---

## 🏛️ Mimari ve Atmosfer Özellikleri

- **Karanlık Minimalizm**: Derin siyah zemin (`#050505`) ve sonsuzluk hissi veren üstel sis (`THREE.FogExp2`).
- **Yansıtıcı Islak Zemin**: Spot ışıklarını ve tabloları yansıtan, düşük pürüzlülüklü ve yüksek metalikliğe sahip cilalı cam/beton zemin.
- **FPS Gezinti Mekaniği**: `W-A-S-D` tuşları, sürtünmeli ivmelenme (momentum/damping) ve gerçekçi yürüme kafa sarsıntısı (head bobbing).
- **Çarpışma Tespiti (Collision)**: Duvarların ve sergi bloklarının içinden geçilmesini önleyen dinamik sınır denetimi (`BoundingBox`).
- **Raycaster & GSAP Etkileşimi**: Kullanıcı merkezdeki nişangahla bir esere baktığında ekranın sol alt köşesinde beliren zarif HTML bilgi kartı.
- **Dramatik Aydınlatma**: Her bir eserin üzerine yukarıdan vuran konik `SpotLight` spot ışıkları ve havada süzülen altın toz partikülleri.

---

## 🎨 Sergilenen Eserler / Projeler

1. **RĀY OS**: AI Destekli Cep Boy Koku Tarayıcı (Gömülü Donanım, C++, ESP32, TinyML)
2. **PooSHoo**: Akıllı Fiziksel Cihaz ve Flutter Mobil Uygulaması (Flutter, Dart, BLE, IoT)
3. **İdeal Bilişim**: Kurumsal Kimlik ve Özgün Logo Tasarımı (Illustrator, Vektör Marka Mimarisi)
4. **Yel Değirmeni**: Modern Kurumsal Logo Tasarımı (Tipografi, Geometrik Minimalizm)
5. **Karekök Yayınları**: TYT, AYT ve LGS Soru Bankası Kapak Tasarımları (Yayıncılık & Büyük Ölçekli Baskı)

---

## 🎮 Kontroller

| Tuş | Eylem |
| :--- | :--- |
| **W / Yukarı Ok** | İleri Yürü |
| **S / Aşağı Ok** | Geri Yürü |
| **A / Sol Ok** | Sola Adımla (Strafe) |
| **D / Sağ Ok** | Sağa Adımla (Strafe) |
| **Fare** | 360° Etrafa Bak |
| **ESC** | Fare İmlecini Serbest Bırak |

---

## 📁 Proje Dosya Yapısı

```
├── index.html       # HTML yapısı, Google Fonts, CDN importmap, HUD & bilgi kartı
├── style.css        # Awwwards-tier lüks karanlık tema ve HUD stilleri
├── main.js          # Three.js sahnesi, FPS kamera, fizik, çarpışma ve GSAP etkileşimi
├── .gitignore       # React/Node.js için optimize edilmiş kurallar
└── package.json     # Proje bağımlılıkları ve Vite yapılandırması
```

---

## 🖼️ Kendi Görsellerinizi Ekleme (TODO Rehberi)

`main.js` içerisindeki `EXHIBITS_DATA` dizisinde her eser için `imageUrl` alanı ayrılmıştır. Görsel eklemek için:

```javascript
// Örnek:
{
  id: 'ray-os',
  title: 'RĀY OS',
  // ...
  imageUrl: './public/assets/ray-os.jpg', // TODO: Buraya görsel yolunu yazın
}
```

Görsel atanmadığında sistem otomatik olarak yüksek çözünürlüklü prosedürel sanatsal tuval grafiklerini üretip görüntüler.

---

## 🚀 Hızlı Başlangıç

### Geliştirme Sunucusu:
```bash
npm run dev
```
Tarayıcınızda `http://localhost:5173` adresine gidin.

### Üretim (Build):
```bash
npm run build
```

---

## 👤 Küratör & Geliştirici

- **Mitra Zahiri**: [github.com/MitraZahiri](https://github.com/MitraZahiri)
- **Depo**: [github.com/MitraZahiri/Portfolio](https://github.com/MitraZahiri/Portfolio)
