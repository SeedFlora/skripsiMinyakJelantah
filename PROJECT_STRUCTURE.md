# JelantahKu - Struktur Project

```
jelantahku/
│
├── README.md                 # Project overview
├── INSTALLATION.md           # Setup instructions
├── LICENSE                   # MIT License
│
├── backend/                  # Flask Backend Server
│   ├── app/
│   │   ├── __init__.py      # Application factory
│   │   ├── config.py        # Configuration settings
│   │   ├── models/          # Database models
│   │   │   ├── user.py
│   │   │   ├── container.py
│   │   │   ├── transaction.py
│   │   │   └── sensor_data.py
│   │   ├── routes/          # API endpoints
│   │   │   ├── auth.py
│   │   │   ├── containers.py
│   │   │   ├── transactions.py
│   │   │   ├── users.py
│   │   │   └── iot.py
│   │   └── services/        # Business logic
│   │       └── notification.py
│   ├── venv/                # Virtual environment (auto-generated)
│   ├── run.py              # Entry point
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Environment variables example
│   ├── setup.bat           # Windows setup script
│   └── setup.sh            # Linux/Mac setup script
│
├── mobile/                   # React Native Mobile App
│   ├── App.js              # Main app component
│   ├── app.json            # Expo configuration
│   ├── package.json         # NPM dependencies
│   ├── src/
│   │   ├── config/
│   │   │   └── api.js      # API configuration
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── navigation/
│   │   │   ├── RootNavigator.js
│   │   │   └── MainTabNavigator.js
│   │   ├── screens/
│   │   │   ├── auth/
│   │   │   │   ├── LoginScreen.js
│   │   │   │   └── RegisterScreen.js
│   │   │   └── main/
│   │   │       ├── HomeScreen.js
│   │   │       ├── ContainersScreen.js
│   │   │       ├── ContainerDetailScreen.js
│   │   │       ├── AddContainerScreen.js
│   │   │       ├── PickupRequestScreen.js
│   │   │       ├── HistoryScreen.js
│   │   │       └── ProfileScreen.js
│   │   ├── services/
│   │   │   └── api.js
│   │   └── utils/
│   └── assets/
│
├── iot/                      # ESP32 IoT Device
│   ├── jelantahku_iot/
│   │   └── jelantahku_iot.ino  # Main firmware
│   ├── SETUP_GUIDE.txt        # Detailed setup guide
│   ├── LIBRARIES.md           # Required libraries
│   ├── WIRING_DIAGRAM.md      # Hardware connections
│   └── README.md              # IoT documentation
│
└── docs/                      # Documentation
    ├── architecture.png
    ├── wiring_diagram.png
    ├── API.md
    └── screenshots/
```

## 📦 Key Files

### Backend
- `backend/run.py` - Start server with: `python run.py`
- `backend/app/__init__.py` - Flask app initialization
- `backend/app/config.py` - Configuration management
- `backend/requirements.txt` - Python packages

### Mobile
- `mobile/App.js` - Main entry point
- `mobile/src/config/api.js` - Change API URL here!
- `mobile/src/context/AuthContext.js` - Auth state management
- `mobile/package.json` - NPM dependencies

### IoT
- `iot/jelantahku_iot/jelantahku_iot.ino` - Arduino firmware
- `iot/SETUP_GUIDE.txt` - Step-by-step setup
- `iot/WIRING_DIAGRAM.md` - Hardware connections

## 🔧 Environment Variables

### Backend (.env)
```env
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=dev-secret-key
DATABASE_URL=sqlite:///jelantahku.db
JWT_SECRET_KEY=jwt-secret-key
```

### IoT (in jelantahku_iot.ino)
```cpp
const char* WIFI_SSID = "YOUR_WIFI";
const char* WIFI_PASSWORD = "PASSWORD";
const char* SERVER_URL = "http://192.168.1.100:5000/api/v1";
const char* DEVICE_ID = "ESP32_001";
```

## 📦 Dependencies

### Python
- Flask 3.0+
- SQLAlchemy 2.0+
- Flask-JWT-Extended
- python-dotenv

### Node.js
- React Native 0.73+
- @react-navigation
- axios
- expo

### Arduino
- ArduinoJson
- OneWire
- DallasTemperature
- Adafruit SSD1306

## 🚀 Quick Commands

### Backend
```bash
cd backend
python setup.py  # or setup.bat on Windows
source venv/bin/activate
python run.py
```

### Mobile
```bash
cd mobile
npm install
npm start
```

### IoT
Upload dengan Arduino IDE ke ESP32

## 📖 Further Reading

- [INSTALLATION.md](INSTALLATION.md) - Full setup guide
- [README.md](README.md) - Project overview
- [backend/](backend/) - Backend documentation
- [mobile/](mobile/) - Mobile app documentation
- [iot/](iot/) - IoT device documentation

---

Last Updated: January 2026
