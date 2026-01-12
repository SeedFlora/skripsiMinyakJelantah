# JelantahKu Project - Installation Guide

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Arduino IDE 2.0+
- Git
- PostgreSQL 15+ (optional, SQLite for development)

---

## 📦 Backend Setup (Python Flask)

### 1. Windows Setup

```bash
cd backend

# Run setup script
setup.bat

# Or manually:
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

### 2. Linux/Mac Setup

```bash
cd backend

# Run setup script
bash setup.sh

# Or manually:
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

### 3. Configure Environment

Edit `backend/.env`:

```env
FLASK_APP=run.py
FLASK_ENV=development
FLASK_DEBUG=1
SECRET_KEY=your-secret-key-change-this
DATABASE_URL=sqlite:///jelantahku.db
JWT_SECRET_KEY=your-jwt-secret-key
```

### 4. Run Backend Server

```bash
# With venv activated
python run.py

# Server akan berjalan di http://localhost:5000
```

---

## 📱 Mobile App Setup (React Native)

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure API URL

Edit `mobile/src/config/api.js`:

```javascript
// Change this to your backend URL
export const API_BASE_URL = 'http://10.0.2.2:5000/api/v1';

// For physical device, use your computer IP:
// export const API_BASE_URL = 'http://192.168.1.100:5000/api/v1';
```

### 3. Run App (Android Emulator)

```bash
# Terminal 1: Start Metro bundler
npm start

# Terminal 2: Launch Android
npm run android

# Or scan QR code with Expo Go app
```

### 4. Run App (iOS)

```bash
npm run ios
```

### 5. Run on Physical Device

```bash
# Using Expo Go app:
npm start

# Scan QR code dengan Expo Go app (iOS/Android)
```

---

## 🔌 IoT Device Setup (ESP32)

### 1. Install Arduino IDE

Download dari: https://www.arduino.cc/en/software

### 2. Install ESP32 Board Package

1. File → Preferences
2. Tambahkan URL di "Additional Board Manager URLs":
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
3. Tools → Board → Board Manager
4. Search "ESP32" dan install

### 3. Install Required Libraries

Sketch → Include Library → Manage Libraries

Install:
- ArduinoJson
- OneWire
- DallasTemperature
- Adafruit SSD1306
- Adafruit GFX Library

Lihat `iot/LIBRARIES.md` untuk detail

### 4. Configure IoT Device

Edit `iot/jelantahku_iot/jelantahku_iot.ino`:

```cpp
// WiFi Credentials
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Server Configuration
const char* SERVER_URL = "http://192.168.1.100:5000/api/v1";
const char* DEVICE_ID = "ESP32_001";

// Container specifications
#define CONTAINER_HEIGHT_CM 40.0
#define CONTAINER_DIAMETER_CM 25.0
#define CONTAINER_CAPACITY_LITERS 20.0
```

### 5. Wiring

Lihat `iot/WIRING_DIAGRAM.md` untuk diagram kabel lengkap

### 6. Upload to ESP32

1. Connect ESP32 via USB
2. Tools → Board → "ESP32 Dev Module"
3. Tools → Port → Select COM port
4. Klik Upload (panah)
5. Lihat output di Tools → Serial Monitor (Baud: 115200)

---

## 📊 Verification

### Test Backend

```bash
# Check health endpoint
curl http://localhost:5000/health

# Response:
# {"status": "healthy", "message": "JelantahKu API is running"}
```

### Test IoT Connection

Lihat Serial Monitor (baud 115200):
- "WiFi connected!" = WiFi berhasil
- "Sending data to server..." = Device mengirim data
- "HTTP Response code: 200" = Server menerima data

### Test Mobile App

1. Login dengan akun test
2. Dashboard menampilkan container
3. Data refresh otomatis

---

## 🗄️ Database Setup

### PostgreSQL (Production)

```bash
# Create database
createdb jelantahku

# Edit .env
DATABASE_URL=postgresql://user:password@localhost:5432/jelantahku

# Run migrations
flask db upgrade
```

### SQLite (Development)

```bash
# Already configured, uses jelantahku.db
# No setup needed!
```

---

## 🚨 Troubleshooting

### Backend Won't Start

```bash
# 1. Check Python version
python --version

# 2. Recreate virtual environment
rm -rf venv
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Check port is not in use
# Change PORT in .env or kill process using port 5000
```

### Mobile App Can't Connect to Backend

```javascript
// 1. Check API_BASE_URL is correct
// 2. For emulator: use 10.0.2.2:5000
// 3. For physical device: use computer IP (192.168.x.x)
// 4. Ensure backend server is running
// 5. Check firewall allows port 5000
```

### IoT Device Can't Connect to WiFi

```cpp
// 1. Verify WiFi credentials in code
// 2. Check ESP32 is close to router
// 3. Ensure using 2.4GHz WiFi (not 5GHz)
// 4. Check Serial Monitor output
```

### IoT Device Can't Reach Server

```cpp
// 1. Verify SERVER_URL is correct
// 2. Check IP address of backend computer
// 3. Ping server from device terminal:
//    ping 192.168.1.100
// 4. Check firewall allows connections
```

---

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Get current user

### Containers
- `GET /api/v1/containers` - Get all containers
- `GET /api/v1/containers/:id` - Get container details
- `POST /api/v1/containers` - Create container
- `PUT /api/v1/containers/:id` - Update container
- `DELETE /api/v1/containers/:id` - Delete container

### Transactions
- `GET /api/v1/transactions` - Get all transactions
- `POST /api/v1/transactions/pickup` - Create pickup request
- `POST /api/v1/transactions/:id/accept` - Accept pickup
- `POST /api/v1/transactions/:id/complete` - Complete pickup
- `POST /api/v1/transactions/:id/rate` - Rate transaction

### IoT
- `POST /api/v1/iot/data` - Send sensor data
- `GET /api/v1/iot/config/:device_id` - Get device config
- `POST /api/v1/iot/ping` - Device health check

---

## 📝 Development Tips

### Git Workflow

```bash
# Clone repository
git clone https://github.com/yourusername/jelantahku.git
cd jelantahku

# Create feature branch
git checkout -b feature/feature-name

# Commit changes
git add .
git commit -m "Description of changes"

# Push to origin
git push origin feature/feature-name

# Create Pull Request on GitHub
```

### Code Standards

- Python: PEP 8 (use black formatter)
- JavaScript: Use ESLint
- Comments in English
- Commit messages should be descriptive

### Testing Backend

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app
```

---

## 📄 License

MIT License - See LICENSE file

## 👥 Contributors

- Shafira Ailah Azzahra (2602208271)
- Partner Name (NIM)

## 📧 Contact

Email: shafira.azzahra@binus.ac.id

---

## ✅ Checklist Sebelum Production

- [ ] Change all hardcoded credentials
- [ ] Set up proper database (PostgreSQL)
- [ ] Configure Firebase for push notifications
- [ ] Set up SSL/HTTPS
- [ ] Enable CORS properly
- [ ] Set proper JWT secret keys
- [ ] Set up monitoring/logging
- [ ] Test error handling
- [ ] Document API thoroughly
- [ ] Set up CI/CD pipeline

---

Happy coding! 🎉
