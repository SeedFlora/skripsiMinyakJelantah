# JelantahKu - Development Setup Guide

## Project Overview

JelantahKu is a mobile application that helps users find waste oil (minyak jelantah) collection centers and provides educational content about waste oil recycling. The application uses Google Maps to locate nearby centers and includes a comprehensive tutorial system.

## Prerequisites

### System Requirements
- **OS:** Windows, macOS, or Linux
- **Node.js:** v18+ (for React Native & Expo)
- **Python:** 3.10+ (for backend)
- **Git:** Latest version
- **Android Studio** (for Android development) or **Xcode** (for iOS development)

### Accounts Required
- GitHub account (for cloning repository)
- Google Cloud Console account (for Google Maps API key)
- Google Play Console / Apple App Store Connect (for deployment)

## Repository Structure

```
minyak-jelantah/
├── backend/                    # Flask API server
│   ├── app/
│   │   ├── models/            # Database models (Location, Tutorial, Review)
│   │   ├── routes/            # API endpoints (locations, tutorials, reviews)
│   │   ├── services/          # Business logic
│   │   └── __init__.py        # Flask app initialization
│   ├── requirements.txt        # Python dependencies
│   └── app.py                 # Entry point
│
├── mobile/                     # React Native Expo app
│   ├── src/
│   │   ├── screens/
│   │   │   ├── main/          # Main screens (Maps, Tutorial, LocationDetail, etc.)
│   │   │   └── auth/          # Authentication screens
│   │   ├── navigation/        # Navigation configuration
│   │   ├── services/          # API client, utilities
│   │   └── assets/            # Images, icons
│   ├── package.json
│   ├── app.json
│   └── babel.config.js
│
├── README.md                  # Project overview
├── README_MAPS_EDUCATION.md   # Detailed architecture documentation
└── MOBILE_IMPLEMENTATION.md   # Mobile app implementation details
```

## Backend Setup

### 1. Clone Repository
```bash
git clone https://github.com/SeedFlora/skripsiMinyakJelantah.git
cd minyak-jelantah
```

### 2. Setup Python Virtual Environment
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Database
```bash
# Create database tables
python
>>> from app import db, create_app
>>> app = create_app()
>>> with app.app_context():
...     db.create_all()
>>> exit()
```

### 5. Run Backend Server
```bash
# Development server (auto-reload enabled)
python app.py

# Server runs on: http://localhost:5000
```

### Environment Variables
Create `.env` file in `backend/` directory:
```
FLASK_ENV=development
FLASK_DEBUG=True
DATABASE_URL=sqlite:///jelantahku.db
JWT_SECRET_KEY=your-secret-key-here
```

## Mobile App Setup

### 1. Navigate to Mobile Directory
```bash
cd mobile
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### 3. Install Required Packages
```bash
# Maps integration
npm install react-native-maps
npm install expo-location
npm install expo-image-picker
npm install react-native-webview
npm install axios
```

### 4. Update package.json
Verify these packages are installed:
```json
{
  "dependencies": {
    "react-native-maps": "^1.4.0",
    "expo-location": "~16.5.3",
    "expo-image-picker": "~14.7.1",
    "react-native-webview": "^13.8.2",
    "axios": "^1.6.2"
  }
}
```

### 5. Google Maps API Key Setup

#### For Android:
1. Get your app signing key SHA-1:
```bash
# In Android Studio:
# Build > Generate Signed Bundle/APK
# Or run:
./gradlew signingReport
```

2. Create Google Cloud project:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project
   - Enable "Maps SDK for Android"
   - Create API key with Android app restrictions

3. Add to `mobile/android/app/build.gradle`:
```gradle
<meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_API_KEY_HERE" />
```

#### For iOS:
1. Create API key in Google Cloud Console with iOS restrictions
2. Add to `mobile/ios/Runner/Info.plist`:
```xml
<key>com.google.ios.maps</key>
<string>YOUR_API_KEY_HERE</string>
```

### 6. Configure Backend URL
Create `mobile/.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api/v1
```

Or update `mobile/src/services/api.js`:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';
```

### 7. Run Mobile App
```bash
# Start Expo development server
expo start

# Or using npm
npm start

# Then choose:
# Press 'a' for Android emulator
# Press 'i' for iOS simulator
# Press 'w' for web browser
# Scan QR code with Expo Go app
```

## Development Workflow

### Backend Development
```bash
# Start development server
cd backend
source venv/bin/activate
python app.py

# Test API endpoints (using curl or Postman)
curl http://localhost:5000/api/v1/locations

# Run tests
pytest tests/

# Database migrations (if using Alembic)
alembic upgrade head
```

### Mobile Development
```bash
# Start with live reload
npm start

# Clear cache if needed
npm start -- --reset-cache

# View logs
npm start -- --clear

# Hot reload is automatic
# Just save files in your editor
```

### Making API Calls
The mobile app uses Axios for API calls. Example:
```javascript
import api from '../../services/api';

// GET request
const response = await api.get('/locations/nearby', {
  params: {
    lat: -6.2088,
    lng: 106.8456,
    radius: 10
  }
});

// POST request with auth
const reviewResponse = await api.post('/reviews', {
  location_id: 1,
  rating: 5,
  review_text: 'Great location!'
}, {
  headers: {
    'Authorization': `Bearer ${authToken}`
  }
});
```

## Database Models

### Adding a New Location
```python
from app.models import Location

location = Location(
    name="UD Maju Jaya",
    address="Jl. Main Street No. 123",
    city="Jakarta",
    latitude=-6.2088,
    longitude=106.8456,
    phone="021-1234567",
    whatsapp="62812345678",
    opening_hours="09:00 - 17:00",
    price_per_liter=3000,
    certification="ISO-12345"
)
db.session.add(location)
db.session.commit()
```

### Adding a New Tutorial
```python
from app.models import Tutorial

tutorial = Tutorial(
    title="Proper Oil Storage",
    description="Learn how to safely store used cooking oil",
    category="storage",
    content="### Why Proper Storage Matters...",
    image_url="https://example.com/image.jpg",
    video_url="https://www.youtube.com/embed/VIDEO_ID",
    read_time=5,
    is_published=True
)
db.session.add(tutorial)
db.session.commit()
```

## Testing

### Backend Tests
```bash
cd backend
pytest tests/test_locations.py
pytest tests/test_tutorials.py
pytest tests/test_reviews.py
```

### Mobile Tests
```bash
cd mobile
npm test

# Or with coverage
npm test -- --coverage
```

### Manual Testing Checklist
- [ ] Maps loads and shows markers
- [ ] Location filtering works (10km radius)
- [ ] Review form submits successfully
- [ ] Tutorial content displays correctly
- [ ] Photo upload works
- [ ] WhatsApp button opens correctly
- [ ] Rating aggregation calculates correctly

## Debugging

### Backend Debugging
```python
# Use Flask debugger
from flask import Flask
app = Flask(__name__)
app.config['DEBUG'] = True

# Or use print statements
print(f"Debug: {variable_name}")

# Use Python debugger (pdb)
import pdb; pdb.set_trace()
```

### Mobile Debugging
```bash
# View console logs
npm start

# React Native debugger
npm install -g react-native-debugger

# Chrome DevTools
# Open: http://localhost:19000 while app is running
```

## Git Workflow

### Clone Repository
```bash
git clone https://github.com/SeedFlora/skripsiMinyakJelantah.git
cd minyak-jelantah
```

### Create Feature Branch
```bash
git checkout -b feature/maps-optimization
```

### Commit Changes
```bash
git add .
git commit -m "Add maps clustering feature"
```

### Push to GitHub
```bash
git push origin feature/maps-optimization
```

### Create Pull Request
- Go to GitHub repository
- Click "New Pull Request"
- Select your branch
- Add description
- Request review

## Deployment

### Backend Deployment
```bash
# Using Heroku
heroku create jelantahku-api
heroku config:set JWT_SECRET_KEY=your-secret
git push heroku main

# Using Docker
docker build -t jelantahku-api .
docker run -p 5000:5000 jelantahku-api
```

### Mobile Deployment
```bash
# Android
cd mobile/android
./gradlew build
# Then upload to Google Play Store

# iOS
cd mobile/ios
xcodebuild -workspace Runner.xcworkspace -scheme Runner -configuration Release
# Then upload to App Store Connect
```

## Troubleshooting

### Common Issues

**1. Google Maps not showing**
- Check API key is correctly configured
- Verify billing is enabled in Google Cloud
- Ensure Maps SDK is enabled for your project

**2. Location permission denied**
- Android: Grant location permission in app settings
- iOS: Enable location in Settings > Privacy > Location Services

**3. API connection error**
- Check backend is running: `curl http://localhost:5000/health`
- Verify API URL in mobile app configuration
- Check network connectivity

**4. Dependencies conflict**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or for Python
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**5. Database errors**
```bash
# Reset database (development only)
rm backend/instance/jelantahku.db
python -c "from app import db, create_app; app = create_app(); db.create_all()"
```

## Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Google Maps API Documentation](https://developers.google.com/maps)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)

## Support

For issues, questions, or suggestions:
1. Check existing GitHub Issues
2. Create a new Issue with detailed description
3. Contact project maintainer

## License

This project is licensed under MIT License. See LICENSE file for details.

---

**Last Updated:** 2024
**Version:** 1.0.0
