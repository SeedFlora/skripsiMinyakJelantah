# 🛢️ JelantahKu - Smart Used Cooking Oil Recycling Platform

[![React Native](https://img.shields.io/badge/React%20Native-0.73-blue.svg)](https://reactnative.dev/)
[![Python](https://img.shields.io/badge/Python-3.10+-green.svg)](https://python.org/)
[![ESP32](https://img.shields.io/badge/ESP32-IoT-orange.svg)](https://www.espressif.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Platform cerdas untuk mengumpulkan dan mendaur ulang minyak jelantah (used cooking oil) dengan teknologi IoT. Aplikasi ini menghubungkan rumah tangga, warung, dan restoran dengan pengepul minyak jelantah untuk diolah menjadi biodiesel.

![Architecture](docs/architecture.png)

## 📋 Table of Contents

- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Hardware Requirements (IoT)](#-hardware-requirements-iot)
- [Software Requirements](#-software-requirements)
- [Installation](#-installation)
- [API Documentation](#-api-documentation)
- [IoT Setup Guide](#-iot-setup-guide)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Mobile App (React Native)
- 🔐 User authentication (Login/Register)
- 📍 GPS location for pickup scheduling
- 📊 Dashboard volume minyak real-time
- 💰 Tracking pendapatan dari penjualan
- 🔔 Push notification ketika container penuh
- 📅 Scheduling pickup dengan pengepul
- 📈 Riwayat transaksi

### Backend API (Python Flask)
- RESTful API endpoints
- JWT Authentication
- Real-time data dari IoT sensors
- Database management
- Push notification service

### IoT Smart Container
- 📏 Monitoring volume minyak otomatis
- 🌡️ Sensor suhu untuk kualitas minyak
- 📶 WiFi connectivity
- ⚡ Low power consumption
- 🚨 Alert ketika container 80% penuh

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        JELANTAHKU SYSTEM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐   │
│  │   Mobile     │     │   Backend    │     │   IoT        │   │
│  │   App        │◄───►│   Server     │◄───►│   Device     │   │
│  │   (React     │     │   (Flask)    │     │   (ESP32)    │   │
│  │   Native)    │     │              │     │              │   │
│  └──────────────┘     └──────────────┘     └──────────────┘   │
│         │                    │                    │            │
│         │                    ▼                    │            │
│         │             ┌──────────────┐           │            │
│         │             │  PostgreSQL  │           │            │
│         │             │   Database   │           │            │
│         │             └──────────────┘           │            │
│         │                    │                    │            │
│         └────────────────────┼────────────────────┘            │
│                              ▼                                  │
│                    ┌──────────────────┐                        │
│                    │  Firebase Cloud  │                        │
│                    │  Messaging (FCM) │                        │
│                    └──────────────────┘                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 Hardware Requirements (IoT)

### Components List

| No | Component | Quantity | Description | Estimated Price (IDR) |
|----|-----------|----------|-------------|----------------------|
| 1 | ESP32 DevKit V1 | 1 | Microcontroller dengan WiFi & Bluetooth | Rp 75.000 |
| 2 | HC-SR04 Ultrasonic Sensor | 1 | Sensor jarak untuk mengukur level minyak | Rp 15.000 |
| 3 | DS18B20 Temperature Sensor | 1 | Sensor suhu waterproof | Rp 25.000 |
| 4 | OLED Display 0.96" I2C | 1 | Display untuk menampilkan status | Rp 35.000 |
| 5 | LED RGB | 1 | Indikator status (hijau/kuning/merah) | Rp 5.000 |
| 6 | Buzzer | 1 | Alarm ketika container penuh | Rp 5.000 |
| 7 | Resistor 4.7kΩ | 1 | Pull-up untuk DS18B20 | Rp 500 |
| 8 | Breadboard | 1 | Prototyping board | Rp 25.000 |
| 9 | Jumper Wires | 20 | Kabel penghubung | Rp 15.000 |
| 10 | Power Supply 5V 2A | 1 | Catu daya | Rp 25.000 |
| **Total** | | | | **Rp 225.500** |

### Wiring Diagram

```
                    ESP32 DevKit V1
                   ┌───────────────┐
                   │               │
    HC-SR04        │               │        DS18B20
   ┌───────┐       │               │       ┌───────┐
   │ VCC   │───────│ 5V            │       │ VCC   │──── 3.3V
   │ GND   │───────│ GND           │       │ GND   │──── GND
   │ TRIG  │───────│ GPIO 5        │       │ DATA  │──── GPIO 4 (+ 4.7kΩ pull-up)
   │ ECHO  │───────│ GPIO 18       │       └───────┘
   └───────┘       │               │
                   │               │        OLED I2C
                   │               │       ┌───────┐
    LED RGB        │               │       │ VCC   │──── 3.3V
   ┌───────┐       │               │       │ GND   │──── GND
   │ R     │───────│ GPIO 25       │       │ SDA   │──── GPIO 21
   │ G     │───────│ GPIO 26       │       │ SCL   │──── GPIO 22
   │ B     │───────│ GPIO 27       │       └───────┘
   │ GND   │───────│ GND           │
   └───────┘       │               │        Buzzer
                   │               │       ┌───────┐
                   │ GPIO 13       │───────│ +     │
                   │ GND           │───────│ -     │
                   │               │       └───────┘
                   └───────────────┘
```

### Sensor Specifications

#### 1. HC-SR04 Ultrasonic Sensor
- **Fungsi**: Mengukur jarak/level minyak dalam container
- **Range**: 2cm - 400cm
- **Akurasi**: ±3mm
- **Cara Kerja**: Mengirim gelombang ultrasonik dan mengukur waktu pantulan
- **Perhitungan Volume**:
  ```
  Jarak = (Waktu × Kecepatan Suara) / 2
  Level Minyak = Tinggi Container - Jarak
  Volume = Level × Luas Penampang Container
  ```

#### 2. DS18B20 Temperature Sensor
- **Fungsi**: Mengukur suhu minyak untuk monitoring kualitas
- **Range**: -55°C hingga +125°C
- **Akurasi**: ±0.5°C
- **Cara Kerja**: Digital sensor dengan protokol 1-Wire
- **Pentingnya**: Minyak jelantah yang disimpan terlalu lama atau di suhu tinggi akan menurun kualitasnya

## 💻 Software Requirements

### Development Tools
- Node.js v18+
- Python 3.10+
- Arduino IDE 2.0+
- VS Code
- Git

### Mobile App
- React Native 0.73+
- Expo SDK 50+
- React Navigation
- Axios
- AsyncStorage

### Backend
- Python 3.10+
- Flask 3.0+
- SQLAlchemy
- Flask-JWT-Extended
- PostgreSQL 15+

### IoT
- Arduino IDE
- ESP32 Board Package
- Required Libraries (lihat di folder `/iot`)

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/jelantahku.git
cd jelantahku
```

### 2. Backend Setup

```bash
# Masuk ke folder backend
cd backend

# Buat virtual environment
python -m venv venv

# Aktivasi virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
copy .env.example .env
# Edit .env dengan konfigurasi Anda

# Initialize database
flask db init
flask db migrate
flask db upgrade

# Jalankan server
flask run
```

### 3. Mobile App Setup

```bash
# Masuk ke folder mobile
cd mobile

# Install dependencies
npm install

# Jalankan aplikasi
npx expo start

# Scan QR code dengan Expo Go app
```

### 4. IoT Setup

1. Buka Arduino IDE
2. Install ESP32 board package
3. Install required libraries
4. Buka file `iot/jelantahku_iot/jelantahku_iot.ino`
5. Edit konfigurasi WiFi dan Server
6. Upload ke ESP32

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "081234567890",
  "address": "Jl. Contoh No. 123",
  "role": "user"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Containers

#### Get All Containers
```http
GET /containers
Authorization: Bearer <token>
```

#### Get Container by ID
```http
GET /containers/:id
Authorization: Bearer <token>
```

#### Update Container Data (IoT)
```http
POST /containers/:id/data
Content-Type: application/json

{
  "device_id": "ESP32_001",
  "volume": 15.5,
  "temperature": 28.3,
  "percentage": 75
}
```

### Transactions

#### Create Pickup Request
```http
POST /transactions/pickup
Authorization: Bearer <token>
Content-Type: application/json

{
  "container_id": 1,
  "scheduled_date": "2026-01-15",
  "notes": "Tolong hubungi sebelum datang"
}
```

#### Get Transaction History
```http
GET /transactions
Authorization: Bearer <token>
```

## 🔌 IoT Setup Guide

### Step 1: Install Arduino IDE
1. Download dari https://www.arduino.cc/en/software
2. Install dan buka Arduino IDE

### Step 2: Install ESP32 Board
1. File → Preferences
2. Additional Board Manager URLs:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
3. Tools → Board → Board Manager
4. Search "ESP32" dan install

### Step 3: Install Libraries
Sketch → Include Library → Manage Libraries

Install:
- `WiFi` (built-in)
- `HTTPClient` (built-in)
- `ArduinoJson` by Benoit Blanchon
- `OneWire` by Paul Stoffregen
- `DallasTemperature` by Miles Burton
- `Adafruit SSD1306` by Adafruit
- `Adafruit GFX Library` by Adafruit

### Step 4: Configure & Upload
1. Buka `iot/jelantahku_iot/jelantahku_iot.ino`
2. Edit WiFi credentials
3. Edit server URL
4. Select Board: "ESP32 Dev Module"
5. Select Port
6. Upload

## 📱 Screenshots

### Mobile App
| Home | Container Detail | History |
|------|------------------|---------|
| ![Home](docs/screenshots/home.png) | ![Detail](docs/screenshots/detail.png) | ![History](docs/screenshots/history.png) |

### IoT Device
| Prototype | OLED Display |
|-----------|--------------|
| ![Prototype](docs/screenshots/prototype.jpg) | ![OLED](docs/screenshots/oled.jpg) |

## 📁 Project Structure

```
jelantahku/
├── README.md
├── docs/
│   ├── architecture.png
│   └── screenshots/
├── backend/
│   ├── venv/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── requirements.txt
│   ├── .env.example
│   └── run.py
├── mobile/
│   ├── App.js
│   ├── package.json
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── navigation/
│   │   ├── services/
│   │   └── utils/
│   └── assets/
└── iot/
    ├── jelantahku_iot/
    │   └── jelantahku_iot.ino
    ├── wiring_diagram.png
    └── libraries.txt
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Shafira Ailah Azzahra** - *2602208271* - Mobile App & Backend
- **Partner Name** - *NIM* - IoT Development

## 🙏 Acknowledgments

- Binus University
- Pak Budi (Dosen Pembimbing)
- ESP32 Community
- React Native Community

---

⭐ **Star this repository if you find it helpful!**

📧 **Contact**: shafira.azzahra@binus.ac.id
