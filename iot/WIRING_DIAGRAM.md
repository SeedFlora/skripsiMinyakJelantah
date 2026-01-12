# JelantahKu IoT Device - Wiring Diagram

## HC-SR04 Ultrasonic Sensor Pinout
```
    +-----------+
    |  HC-SR04  |
    +-----------+
    | VCC  GND  |
    | TRIG ECHO |
    +-----------+
    
VCC  → ESP32 5V (atau Power Supply 5V)
GND  → ESP32 GND
TRIG → ESP32 GPIO 5 (D5)
ECHO → ESP32 GPIO 18 (D18)
```

## DS18B20 Temperature Sensor Pinout
```
    +----------+
    | DS18B20  | (Top view)
    +----------+
    |1  2  3  |
    
1 (GND)   → ESP32 GND
2 (DQ)    → ESP32 GPIO 4 (D4) + 4.7kΩ pull-up to 3.3V
3 (VCC)   → ESP32 3.3V
```

## RGB LED Pinout
```
      +---------+
      | RGB LED |
      +---------+
      |R G B GND|
      
R (Red)     → ESP32 GPIO 25 (D25) via 220Ω resistor
G (Green)   → ESP32 GPIO 26 (D26) via 220Ω resistor
B (Blue)    → ESP32 GPIO 27 (D27) via 220Ω resistor
GND (Anode) → ESP32 GND
```

## Buzzer Pinout
```
    +-------+
    |BUZZER |
    +-------+
    |+  -  |
    
+ (Positive) → ESP32 GPIO 13 (D13)
- (Negative) → ESP32 GND
```

## OLED SSD1306 I2C Display Pinout
```
    +-------+
    | OLED  | 
    +-------+
    |VCC GND|
    |SDA SCL|
    
VCC → ESP32 3.3V
GND → ESP32 GND
SDA → ESP32 GPIO 21 (D21)
SCL → ESP32 GPIO 22 (D22)
```

## Complete Wiring Table

| Component | Pin | ESP32 GPIO | Notes |
|-----------|-----|-----------|-------|
| HC-SR04 TRIG | VCC | 5V | Power ultrasonic |
| HC-SR04 TRIG | GND | GND | Ground |
| HC-SR04 TRIG | TRIG | GPIO 5 | Trigger pin |
| HC-SR04 ECHO | ECHO | GPIO 18 | Echo pin |
| DS18B20 | VCC | 3.3V | Power temp sensor |
| DS18B20 | GND | GND | Ground |
| DS18B20 | DQ | GPIO 4 | Data with pull-up |
| RGB LED | R | GPIO 25 | With 220Ω resistor |
| RGB LED | G | GPIO 26 | With 220Ω resistor |
| RGB LED | B | GPIO 27 | With 220Ω resistor |
| RGB LED | GND | GND | Common cathode |
| Buzzer | + | GPIO 13 | Positive |
| Buzzer | - | GND | Negative (ground) |
| OLED | VCC | 3.3V | Power display |
| OLED | GND | GND | Ground |
| OLED | SDA | GPIO 21 | I2C data |
| OLED | SCL | GPIO 22 | I2C clock |

## Fritzing Diagram Text

```
ESP32 Board:
┌──────────────────────────┐
│      ESP32 DevKit        │
│                          │
│ EN   RX TX  GND 3.3V 5V  │
│ 36   35 34  33  32  D4   │ ← DS18B20 DQ
│ 39   14 27  26  25  D5   │ ← LED B, G, R (27, 26, 25), TRIG (5)
│ D35  12 13  23  19  18   │ ← GPIO 13 Buzzer, GPIO 18 ECHO
│ RX   D2 D3  D21 D22 D19  │ ← OLED SDA (21), SCL (22)
│ TX   D15 04 05  SG  8    │
│ GND  GND GND GND GND GND │
│                          │
│ D13 → Buzzer             │
│ D25 → LED Red            │
│ D26 → LED Green          │
│ D27 → LED Blue           │
│ D5  → Ultrasonic TRIG    │
│ D18 → Ultrasonic ECHO    │
│ D4  → DS18B20 + pull-up  │
│ D21 → OLED SDA           │
│ D22 → OLED SCL           │
└──────────────────────────┘
```

## Breadboard Layout (Simple View)

```
Power Row:
┌─────────────────────────────────┐
│ 3.3V  GND  5V  GND              │
├─────────────────────────────────┤

HC-SR04 (Top section):
│ VCC(5V)  GND  TRIG(D5)  ECHO(D18)
├─────────────────────────────────┤

DS18B20 (with 4.7kΩ pull-up):
│ VCC(3.3V)  GND  DQ(D4)──[4.7k]──3.3V
├─────────────────────────────────┤

RGB LED:
│ R(D25)──[220Ω]──●
│ G(D26)──[220Ω]──●
│ B(D27)──[220Ω]──●
│ GND──────────────●
├─────────────────────────────────┤

Buzzer:
│ D13──[Buzzer]──GND
├─────────────────────────────────┤

OLED I2C (connect via I2C):
│ VCC(3.3V)  GND  SDA(D21)  SCL(D22)
└─────────────────────────────────┘
```

## Component Specifications Reference

### HC-SR04 Ultrasonic Sensor
- Operating Voltage: 5V DC
- Operating Current: ~15mA
- Frequency: 40kHz
- Max Range: 400cm (4m)
- Min Range: 2cm
- Accuracy: ±3mm
- Trigger input: 10µs pulse

### DS18B20 Temperature Sensor
- Operating Voltage: 3.3V - 5V
- Temperature Range: -55°C to +125°C
- Accuracy: ±0.5°C
- Protocol: 1-Wire (Dallas)
- Pull-up resistor: 4.7kΩ

### RGB LED
- Forward Voltage: R:1.8V, G:3.2V, B:3.2V
- Max Current: 20mA per channel
- Recommended resistor: 220Ω (for 3.3V logic)

### 0.96" OLED Display SSD1306
- Voltage: 3.3V
- Interface: I2C
- Default Address: 0x3C (or 0x3D)
- Resolution: 128x64 pixels

### Active Buzzer
- Operating Voltage: 5V DC
- Operating Current: ~30mA
- Frequency: 2.5kHz
- Sound pressure: 85dB

## Safety Notes

1. ⚠️ Never connect 5V directly to ESP32 GPIO pins (max 3.3V)
2. ⚠️ Always use current-limiting resistors for LEDs
3. ⚠️ Use 4.7kΩ pull-up resistor for DS18B20
4. ⚠️ Make sure all grounds are connected
5. ✓ Double-check all connections before powering
6. ✓ Use separate power supply if current exceeds USB limit
