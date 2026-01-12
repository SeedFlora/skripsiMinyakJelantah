# JelantahKu - Testing & Verification Guide

## 🧪 Backend Testing

### 1. Server Health Check
```bash
# Pastikan server running di terminal
python run.py

# Di terminal lain, test health endpoint
curl http://localhost:5000/health

# Expected Response:
# {"status": "healthy", "message": "JelantahKu API is running"}
```

### 2. User Registration & Login
```bash
# Register new user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "081234567890",
    "address": "Jl. Test No. 123"
  }'

# Expected: 201 Created + access_token & refresh_token

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Expected: 200 OK + access_token
```

### 3. Container Creation
```bash
# Get access token from login response, then:
ACCESS_TOKEN="your_token_here"

curl -X POST http://localhost:5000/api/v1/containers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "device_id": "ESP32_001",
    "name": "Container Rumah",
    "capacity": 20.0,
    "height": 40.0,
    "diameter": 25.0,
    "address": "Jl. Test No. 123",
    "alert_threshold": 80.0
  }'

# Expected: 201 Created
```

### 4. IoT Data Reception
```bash
curl -X POST http://localhost:5000/api/v1/iot/data \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "ESP32_001",
    "volume": 10.5,
    "percentage": 52.5,
    "temperature": 28.3,
    "distance": 19.0,
    "wifi_strength": -65
  }'

# Expected: 200 OK
# Response: {"status": "success", "message": "Data received"}
```

---

## 📱 Mobile App Testing

### 1. Run Mobile App
```bash
cd mobile
npm install

# Terminal 1: Start Metro
npm start

# Terminal 2: Run on Android Emulator
npm run android

# Or scan QR code dengan Expo Go app
```

### 2. Test Login
1. Buka aplikasi
2. Email: `test@example.com`
3. Password: `password123`
4. Klik "Masuk"
5. ✅ Harus redirect ke Home screen

### 3. Test Dashboard
1. Di Home screen, harus melihat:
   - Total volume (dari completed transactions)
   - Total earnings
   - Daftar container dengan status
   - Widget container dengan progress bar

### 4. Test Container Management
1. Tab "Container"
2. Lihat daftar container
3. Klik container untuk detail
4. Lihat grafik dan riwayat sensor
5. Klik "Request Pickup" → isi form → submit

### 5. Test Navigation
```
Home → Containers → Container Detail → Back
Home → History → List transaksi
Home → Profile → Edit profile
Logout
```

### 6. Test Data Refresh
- Swipe down pada list untuk refresh
- Data harus update dari server
- Loading indicator harus muncul

---

## 🔌 IoT Device Testing

### 1. Serial Monitor Check
```
Expected output:
✓ "===== JelantahKu IoT Device ====="
✓ "Pins initialized"
✓ "Connecting to WiFi: YOUR_SSID"
✓ "WiFi connected!"
✓ "IP address: 192.168.x.x"

Then every 10 seconds:
✓ "===== Sensor Reading ====="
✓ "Distance: XX.XX cm"
✓ "Volume: XX.XX L"
✓ "Percentage: XX.X%"
✓ "Temperature: XX.X°C"
```

### 2. Sensor Reading Verification
```
Distance should be:
- 0-5 cm = Error (too close)
- 5-40 cm = Valid (container height 40cm)
- 40+ cm = Error (too far/empty)

Volume calculation:
- V = π × (d/2)² × h
- For d=25cm, h=40cm: V = π × 12.5² × h = 156.25π × h cm³
- Convert to liters: divide by 1000

Temperature:
- Should be between -55°C to +125°C
- Room temperature usually 25-30°C
```

### 3. Server Communication Check
```
Expected in Serial Monitor:
✓ "Sending data to server..."
✓ "URL: http://192.168.1.100:5000/api/v1/iot/data"
✓ "Payload: {...}"
✓ "HTTP Response code: 200"
✓ "Response: {"status": "success", ...}"

If error:
✗ HTTP Response code: -1
  → Check SERVER_URL
  → Check firewall
  → Check server is running
```

### 4. Display & LED Check
```
Expected on OLED:
- JelantahKu IoT v1.0
- Device: ESP32_001
- Status: ONLINE (if WiFi connected)
- Volume: XX.X L
- Level: XX%
- Temp: XX.XC
- Signal: -XX dBm
- Last: XX s ago

Expected LED colors:
- Green = Online & normal
- Yellow = Connecting to WiFi
- Red = Alert (container > 80%)
```

### 5. Alert System Check
```
When percentage >= 80%:
✓ Buzzer beeps 3 times
✓ LED turns red
✓ Serial shows "!!! ALERT: Container is XX% full !!!"

When drops below 80%:
✓ Buzzer stops
✓ LED back to green
✓ Serial shows "Alert cleared"
```

---

## 🔗 Integration Testing

### Test Flow: Mobile → Backend → IoT

#### Step 1: Create Container from Mobile
1. Open Mobile app
2. Tab "Container" → "+"
3. Device ID: ESP32_001
4. Name: Test Container
5. Klik "Tambah Container"
6. ✅ Container muncul di list

#### Step 2: IoT Sends Data
1. Serial Monitor harus show data every 10 seconds
2. Backend log harus show received data
3. Mobile app refresh → data update

#### Step 3: Request Pickup
1. Mobile: Container detail → "Request Pickup"
2. Price: 5000
3. Klik "Kirim Request"
4. ✅ Status berubah ke "Pending"

#### Step 4: Complete Flow
1. Backend: Check transaction created
2. Mobile: History tab → transaksi visible
3. Rate transaction (star & review)

---

## 🐛 Debugging Tips

### Backend Debug
```bash
# Enable debug mode
FLASK_DEBUG=1 python run.py

# Check logs for:
- SQLAlchemy queries
- API request/response
- Error tracebacks

# Test specific endpoint
curl -X GET http://localhost:5000/api/v1/containers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -v  # verbose mode
```

### Mobile Debug
```bash
# React Native debugging
- Press 'i' for iOS debugger
- Press 'a' for Android debugger
- Press 'd' for Expo DevTools

# Check logs
- Open browser: http://localhost:19002
- See console output
- Check Network tab
```

### IoT Debug
```
Serial Monitor (Baud 115200):
- Watch pin readings
- Check WiFi status
- Monitor HTTP responses

Common issues:
- "timeout" = WiFi disconnected
- "refused" = Server not running
- "Connection reset" = Firewall block
```

---

## 📊 Performance Checks

### Backend Performance
```bash
# Check response time
time curl http://localhost:5000/api/v1/containers \
  -H "Authorization: Bearer TOKEN"

# Expected: < 200ms (local)
```

### Mobile Performance
- App launch time: < 3 seconds
- Tab switch: < 1 second
- Data refresh: < 2 seconds

### IoT Performance
- Sensor read time: ~50ms
- Server upload time: ~100-500ms (WiFi dependent)
- Update interval: 10 seconds

---

## ✅ Full Test Checklist

### Backend
- [ ] Server starts without errors
- [ ] Health endpoint responds
- [ ] Register user works
- [ ] Login returns tokens
- [ ] Create container works
- [ ] Get containers returns data
- [ ] IoT data endpoint receives data
- [ ] Database queries work
- [ ] Errors are handled gracefully

### Mobile
- [ ] App starts
- [ ] Navigation works
- [ ] Login/Register forms work
- [ ] API calls work
- [ ] Data displays correctly
- [ ] Refresh pulls latest data
- [ ] Tab switching works
- [ ] Logout clears auth

### IoT
- [ ] Firmware uploads successfully
- [ ] WiFi connects
- [ ] Sensors initialize
- [ ] Serial Monitor shows data
- [ ] HTTP POST works
- [ ] OLED displays status
- [ ] LED indicators work
- [ ] Buzzer alerts trigger
- [ ] Data matches expected ranges

### Integration
- [ ] Mobile → Backend communication works
- [ ] Backend → IoT communication works
- [ ] Real-time updates work
- [ ] Full pickup flow works

---

## 📈 Load Testing

### Simulate Multiple Devices
```bash
# Send data from 5 "devices"
for i in {1..5}; do
  curl -X POST http://localhost:5000/api/v1/iot/data \
    -H "Content-Type: application/json" \
    -d "{
      \"device_id\": \"ESP32_00$i\",
      \"volume\": 10.5,
      \"percentage\": 52.5,
      \"temperature\": 28.3
    }" &
done
wait

# Expected: All requests successful (200 OK)
```

---

## 🎯 Final Verification Before Presentation

- [ ] Backend running & healthy
- [ ] Mobile app installed & runnable
- [ ] IoT firmware uploaded & uploading data
- [ ] All API endpoints working
- [ ] Mobile ↔ Backend communication verified
- [ ] IoT ↔ Backend communication verified
- [ ] Full end-to-end flow tested
- [ ] Error messages displayed properly
- [ ] Database persists data
- [ ] No console errors

---

## 📝 Test Report Template

```
TEST DATE: January 12, 2026
TESTER: [Your Name]

BACKEND: ✅ PASS / ❌ FAIL
- Server starts: ✅
- Health check: ✅
- Auth endpoints: ✅
- Container endpoints: ✅
- IoT endpoints: ✅

MOBILE: ✅ PASS / ❌ FAIL
- App launches: ✅
- Login works: ✅
- Dashboard displays: ✅
- Containers list: ✅
- Navigation: ✅

IoT: ✅ PASS / ❌ FAIL
- Firmware uploads: ✅
- WiFi connects: ✅
- Sensors work: ✅
- Data sent to server: ✅
- Display working: ✅

INTEGRATION: ✅ PASS / ❌ FAIL
- E2E flow: ✅
- Real-time updates: ✅

NOTES:
[Any issues or observations]

SIGNED: [Your Name]
```

---

Happy testing! 🧪🎉
