/**
 * JelantahKu IoT Device Firmware
 * ESP32 Smart Container Monitoring System
 * 
 * Sensors:
 * - HC-SR04 Ultrasonic (untuk mengukur level minyak)
 * - DS18B20 Temperature (untuk monitoring suhu)
 * - RGB LED (status indicator)
 * - Buzzer (alert)
 * - OLED Display (status display)
 */

// ===== LIBRARY INCLUDES =====
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Adafruit_SSD1306.h>
#include <Wire.h>

// ===== CONFIGURATION =====
// WiFi Credentials
const char* WIFI_SSID = "YOUR_WIFI_SSID";        // Ganti dengan SSID WiFi Anda
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD"; // Ganti dengan password WiFi

// Server Configuration
const char* SERVER_URL = "http://192.168.1.100:5000/api/v1"; // Ganti dengan IP server Anda
const char* DEVICE_ID = "ESP32_001";  // Unique device identifier

// ===== PIN DEFINITIONS =====
#define ULTRASONIC_TRIG_PIN 5   // GPIO 5
#define ULTRASONIC_ECHO_PIN 18  // GPIO 18
#define TEMP_SENSOR_PIN 4       // GPIO 4 (OneWire)
#define LED_RED_PIN 25          // GPIO 25
#define LED_GREEN_PIN 26        // GPIO 26
#define LED_BLUE_PIN 27         // GPIO 27
#define BUZZER_PIN 13           // GPIO 13
#define OLED_SDA_PIN 21         // GPIO 21 (I2C)
#define OLED_SCL_PIN 22         // GPIO 22 (I2C)

// ===== CONSTANTS =====
#define CONTAINER_HEIGHT_CM 40.0     // Tinggi container (cm)
#define CONTAINER_DIAMETER_CM 25.0   // Diameter container (cm)
#define CONTAINER_CAPACITY_LITERS 20.0 // Kapasitas total (liter)
#define ALERT_THRESHOLD 80.0         // Alert pada 80% penuh

#define OLED_ADDRESS 0x3C
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define LOOP_DELAY 10000  // Update setiap 10 detik

// ===== GLOBAL VARIABLES =====
OneWire oneWire(TEMP_SENSOR_PIN);
DallasTemperature tempSensor(&oneWire);
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

struct SensorData {
  float volume;        // Volume dalam liter
  float percentage;    // Persentase penuh
  float temperature;   // Suhu dalam Celsius
  float distance;      // Jarak sensor dalam cm
  float wifiStrength;  // Kekuatan WiFi (-100 to 0 dBm)
};

SensorData sensorData;
bool isConnected = false;
unsigned long lastUpdate = 0;
bool alertActive = false;

// ===== SETUP =====
void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n===== JelantahKu IoT Device =====");
  Serial.println("Initializing...");
  
  // Initialize pins
  initializePins();
  
  // Initialize OLED
  if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDRESS)) {
    Serial.println("SSD1306 allocation failed");
  } else {
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    displayMessage("JelantahKu", "Initializing...");
  }
  
  // Initialize temperature sensor
  tempSensor.begin();
  
  // Connect to WiFi
  connectToWiFi();
  
  Serial.println("Setup complete!");
  delay(2000);
}

// ===== MAIN LOOP =====
void loop() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    connectToWiFi();
  }
  
  // Read sensors
  readSensors();
  
  // Update display
  updateDisplay();
  
  // Send data to server (if connected)
  if (isConnected) {
    sendDataToServer();
  } else {
    Serial.println("Not connected to WiFi");
  }
  
  // Check alert condition
  checkAlertCondition();
  
  // Wait before next reading
  delay(LOOP_DELAY);
}

// ===== INITIALIZATION FUNCTIONS =====
void initializePins() {
  // Ultrasonic sensor pins
  pinMode(ULTRASONIC_TRIG_PIN, OUTPUT);
  pinMode(ULTRASONIC_ECHO_PIN, INPUT);
  
  // RGB LED pins
  pinMode(LED_RED_PIN, OUTPUT);
  pinMode(LED_GREEN_PIN, OUTPUT);
  pinMode(LED_BLUE_PIN, OUTPUT);
  
  // Buzzer
  pinMode(BUZZER_PIN, OUTPUT);
  
  // Set initial state
  digitalWrite(ULTRASONIC_TRIG_PIN, LOW);
  setLEDColor(0, 255, 0); // Green (starting)
  digitalWrite(BUZZER_PIN, LOW);
  
  Serial.println("Pins initialized");
}

void connectToWiFi() {
  Serial.println("\nConnecting to WiFi: " + String(WIFI_SSID));
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    isConnected = true;
    Serial.println("\nWiFi connected!");
    Serial.println("IP address: " + WiFi.localIP().toString());
    setLEDColor(0, 255, 0); // Green = connected
    displayMessage("WiFi Connected", WiFi.localIP().toString().c_str());
  } else {
    isConnected = false;
    Serial.println("\nFailed to connect to WiFi");
    setLEDColor(255, 165, 0); // Orange = warning
    displayMessage("WiFi Failed", "Retrying...");
  }
}

// ===== SENSOR READING FUNCTIONS =====
void readSensors() {
  // Read ultrasonic distance
  float distance = readUltrasonicDistance();
  
  // Calculate volume from distance
  float level = CONTAINER_HEIGHT_CM - distance;  // Level dari bawah
  float volume = calculateVolume(level);
  float percentage = (volume / CONTAINER_CAPACITY_LITERS) * 100.0;
  
  // Clamp values
  if (volume < 0) volume = 0;
  if (volume > CONTAINER_CAPACITY_LITERS) volume = CONTAINER_CAPACITY_LITERS;
  if (percentage > 100) percentage = 100;
  
  // Read temperature
  tempSensor.requestTemperatures();
  float temperature = tempSensor.getTempCByIndex(0);
  
  // Get WiFi strength
  float wifiStrength = WiFi.RSSI();
  
  // Store data
  sensorData.volume = volume;
  sensorData.percentage = percentage;
  sensorData.temperature = temperature;
  sensorData.distance = distance;
  sensorData.wifiStrength = wifiStrength;
  
  // Debug output
  Serial.println("\n===== Sensor Reading =====");
  Serial.println("Distance: " + String(distance, 2) + " cm");
  Serial.println("Volume: " + String(volume, 2) + " L");
  Serial.println("Percentage: " + String(percentage, 1) + "%");
  Serial.println("Temperature: " + String(temperature, 1) + "°C");
  Serial.println("WiFi Signal: " + String(wifiStrength) + " dBm");
}

float readUltrasonicDistance() {
  // Send ultrasonic pulse
  digitalWrite(ULTRASONIC_TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(ULTRASONIC_TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(ULTRASONIC_TRIG_PIN, LOW);
  
  // Read echo
  long duration = pulseIn(ULTRASONIC_ECHO_PIN, HIGH, 30000);
  
  // Calculate distance (speed of sound = 343 m/s = 0.0343 cm/µs)
  float distance = (duration * 0.0343) / 2;
  
  return distance;
}

float calculateVolume(float levelCm) {
  /**
   * Volume cylindrical tank:
   * V = π * r² * h
   * r = diameter / 2 = 25 / 2 = 12.5 cm
   * V = π * 12.5² * level = π * 156.25 * level (cm³)
   * V (liters) = (π * 156.25 * level) / 1000
   */
  float radius = CONTAINER_DIAMETER_CM / 2.0;
  float volumeCm3 = PI * radius * radius * levelCm;
  float volumeLiters = volumeCm3 / 1000.0;  // Convert cm³ to liters
  
  return volumeLiters;
}

// ===== DISPLAY FUNCTIONS =====
void updateDisplay() {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  
  // Title
  display.setCursor(0, 0);
  display.println("JelantahKu IoT v1.0");
  display.println("Device: " + String(DEVICE_ID));
  display.println("---");
  
  // Status
  display.print("Status: ");
  if (isConnected) {
    display.println("ONLINE");
  } else {
    display.println("OFFLINE");
  }
  
  // Volume and Percentage
  display.print("Volume: ");
  display.print(sensorData.volume, 1);
  display.println(" L");
  
  display.print("Level: ");
  display.print(sensorData.percentage, 0);
  display.println("%");
  
  // Temperature
  display.print("Temp: ");
  display.print(sensorData.temperature, 1);
  display.println("C");
  
  // WiFi signal
  display.print("Signal: ");
  display.print(sensorData.wifiStrength);
  display.println(" dBm");
  
  // Last update
  display.print("Last: ");
  display.print((millis() - lastUpdate) / 1000);
  display.println("s ago");
  
  display.display();
}

void displayMessage(const char* line1, const char* line2) {
  display.clearDisplay();
  display.setTextSize(2);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 10);
  display.println(line1);
  
  display.setTextSize(1);
  display.setCursor(0, 35);
  display.println(line2);
  
  display.display();
}

// ===== COMMUNICATION FUNCTIONS =====
void sendDataToServer() {
  if (!isConnected) return;
  
  HTTPClient http;
  String url = String(SERVER_URL) + "/iot/data";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  // Create JSON payload
  DynamicJsonDocument doc(256);
  doc["device_id"] = DEVICE_ID;
  doc["volume"] = sensorData.volume;
  doc["percentage"] = sensorData.percentage;
  doc["temperature"] = sensorData.temperature;
  doc["distance"] = sensorData.distance;
  doc["wifi_strength"] = (int)sensorData.wifiStrength;
  
  String payload;
  serializeJson(doc, payload);
  
  Serial.println("Sending data to server...");
  Serial.println("URL: " + url);
  Serial.println("Payload: " + payload);
  
  int httpResponseCode = http.POST(payload);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("HTTP Response code: " + String(httpResponseCode));
    Serial.println("Response: " + response);
    lastUpdate = millis();
  } else {
    Serial.println("Error on sending request: " + String(httpResponseCode));
  }
  
  http.end();
}

// ===== ALERT FUNCTIONS =====
void checkAlertCondition() {
  if (sensorData.percentage >= ALERT_THRESHOLD) {
    if (!alertActive) {
      // Activate alert
      alertActive = true;
      Serial.println("\n!!! ALERT: Container is " + String(sensorData.percentage, 0) + "% full !!!");
      
      // Red LED
      setLEDColor(255, 0, 0);
      
      // Beep buzzer
      buzzAlert();
    }
  } else {
    if (alertActive) {
      // Deactivate alert
      alertActive = false;
      Serial.println("Alert cleared");
      
      // Green LED
      setLEDColor(0, 255, 0);
      
      // Stop buzzer
      digitalWrite(BUZZER_PIN, LOW);
    }
  }
}

void buzzAlert() {
  for (int i = 0; i < 3; i++) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(200);
    digitalWrite(BUZZER_PIN, LOW);
    delay(200);
  }
}

// ===== LED CONTROL =====
void setLEDColor(uint8_t red, uint8_t green, uint8_t blue) {
  analogWrite(LED_RED_PIN, red);
  analogWrite(LED_GREEN_PIN, green);
  analogWrite(LED_BLUE_PIN, blue);
}

// ===== END OF FIRMWARE =====
