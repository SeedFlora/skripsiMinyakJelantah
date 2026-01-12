# IoT Device - Required Arduino Libraries

## Install Instructions

Copy-paste library names into Arduino IDE:
Tools → Manage Libraries

### Required Libraries:

1. **ArduinoJson** (v7.0.0 or higher)
   - Creator: Benoit Blanchon
   - Purpose: JSON parsing for API communication
   - Install: Sketch → Include Library → Manage Libraries → search "ArduinoJson"

2. **OneWire** (2.3.7 or higher)
   - Creator: Paul Stoffregen
   - Purpose: Protocol untuk DS18B20 temperature sensor
   - Install: Sketch → Include Library → Manage Libraries → search "OneWire"

3. **DallasTemperature** (3.9.0 or higher)
   - Creator: Miles Burton
   - Purpose: Read DS18B20 temperature sensor
   - Install: Sketch → Include Library → Manage Libraries → search "DallasTemperature"

4. **Adafruit SSD1306** (2.5.7 or higher)
   - Creator: Adafruit
   - Purpose: OLED display driver
   - Install: Sketch → Include Library → Manage Libraries → search "Adafruit SSD1306"

5. **Adafruit GFX Library** (1.11.5 or higher)
   - Creator: Adafruit
   - Purpose: Graphics library untuk OLED
   - Install: Sketch → Include Library → Manage Libraries → search "Adafruit GFX"

### Built-in Libraries (No installation needed):
- WiFi.h
- HTTPClient.h
- Wire.h

## Verification

Setelah install, cek di:
Sketch → Include Library

Semua library harus terlihat di daftar.

## Troubleshooting

If library tidak ditemukan:
1. Restart Arduino IDE
2. Tools → Board → Boards Manager
3. Install "esp32" package jika belum
4. Try installing library again
