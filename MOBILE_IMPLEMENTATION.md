# JelantahKu Mobile App - Maps & Education Implementation Complete ✅

## Overview

The JelantahKu application has been successfully refactored from an IoT-centric model to a Maps & Education-based platform. The application now helps users find waste oil collection centers using Google Maps and provides comprehensive educational content about waste oil recycling.

## Architecture

### Technology Stack

**Frontend:**
- React Native 0.73
- Expo SDK 50
- React Navigation 6.x
- Google Maps API (Maps Screen)
- Image Picker (Photo Reviews)

**Backend:**
- Python 3.10+
- Flask 3.0
- SQLAlchemy 2.0
- PostgreSQL/SQLite
- JWT Authentication

**APIs Used:**
- Google Maps API (Free tier: 25,000 requests/day)
- React Native Maps
- Expo Geolocation API

## Mobile App Screens

### 1. **MapsScreen** 📍
- **Purpose:** Interactive Google Maps showing waste oil collection centers
- **Features:**
  - Display all collection centers as map markers
  - User location tracking with GPS
  - Nearby location filtering (10km radius)
  - Location info card with name, address, hours, price
  - Direct WhatsApp contact button
  - Navigation to location details
- **Dependencies:** 
  - `react-native-maps`
  - `expo-location`
  - Geolocation API
- **API Calls:**
  - GET `/api/v1/locations` - All locations
  - GET `/api/v1/locations/nearby?lat=...&lng=...&radius=10` - Filtered by distance

### 2. **LocationDetailScreen** 📋
- **Purpose:** Display comprehensive information about a single collection center
- **Features:**
  - Interactive map with location marker
  - Full address, opening hours, price per liter
  - Certification details
  - Average rating with star display
  - Call, WhatsApp, and Google Maps navigation buttons
  - Reviews section showing user feedback and ratings
  - Add Review button (opens AddReviewScreen)
- **Dependencies:**
  - `react-native-maps`
  - `expo-linking` (for phone/WhatsApp/maps URLs)
- **API Calls:**
  - GET `/api/v1/locations/{id}` - Location details with avg rating
  - GET `/api/v1/locations/{id}/reviews` - Reviews for location

### 3. **TutorialScreen** 📚
- **Purpose:** Educational content about waste oil recycling
- **Features:**
  - 5 category tabs: Environment, Storage, Cooking, Recycling, Health
  - Tutorial list with title, description, read time
  - Tap to view full tutorial content
  - Category filtering with color coding
  - Smooth pagination
- **Dependencies:**
  - `react-native` Image component
  - Custom API integration
- **API Calls:**
  - GET `/api/v1/tutorials?page=1&limit=20` - All tutorials
  - GET `/api/v1/tutorials/category/{category}` - Filtered by category

### 4. **TutorialDetailScreen** 📖
- **Purpose:** Display full tutorial content with video
- **Features:**
  - Hero image at the top
  - Category badge with color coding
  - Full tutorial content with markdown/text
  - Video player (WebView)
  - Share and bookmark buttons
  - Related resources section
  - Professional typography and spacing
- **Dependencies:**
  - `react-native-webview` (for video embedding)
- **API Calls:**
  - GET `/api/v1/tutorials/{id}` - Full tutorial content

### 5. **AddReviewScreen** ⭐
- **Purpose:** Submit ratings and reviews for collection centers
- **Features:**
  - 5-star rating selector (visual and interactive)
  - Text area for review content (max 500 chars)
  - Photo upload from device
  - Image preview with remove option
  - Submit and cancel buttons
  - Form validation
  - Success/error alerts
- **Dependencies:**
  - `expo-image-picker` (for photo selection)
  - FormData for multipart upload
- **API Calls:**
  - POST `/api/v1/reviews` - Submit new review with auth

### 6. **MainTabNavigator** 🔄
- **Updated Navigation Structure:**
  - **Tab 1:** Home (Dashboard)
  - **Tab 2:** Maps (Collection Centers) - includes LocationDetail, AddReview
  - **Tab 3:** Learn (Tutorial) - includes TutorialDetail
  - **Tab 4:** History (Transaction history)
  - **Tab 5:** Profile (User profile)

## Backend API Endpoints

### Locations Endpoints
```
GET    /api/v1/locations              - List all locations (paginated)
GET    /api/v1/locations/nearby       - Find nearby by lat/lng/radius
GET    /api/v1/locations/{id}         - Get location details with avg rating
GET    /api/v1/locations/{id}/reviews - Get reviews for location
```

### Tutorials Endpoints
```
GET    /api/v1/tutorials              - List all tutorials (paginated)
GET    /api/v1/tutorials/{id}         - Get tutorial details
GET    /api/v1/tutorials/category/{cat} - Filter by category
POST   /api/v1/tutorials              - Create tutorial (admin)
```

### Reviews Endpoints
```
POST   /api/v1/reviews                - Submit new review (auth required)
GET    /api/v1/reviews/location/{id}  - Get reviews for location
DELETE /api/v1/reviews/{id}           - Delete own review (auth required)
```

## Database Models

### Location Model
```python
- id: Integer (Primary Key)
- name: String (e.g., "UD Maju Jaya")
- address: String
- city: String
- latitude: Float
- longitude: Float
- phone: String
- whatsapp: String
- opening_hours: String (e.g., "09:00 - 17:00")
- closing_day: String (e.g., "Sunday")
- price_per_liter: Integer (Rp)
- certification: String (e.g., "ISO 12345")
- image_url: String
- created_at: DateTime
```

### Tutorial Model
```python
- id: Integer (Primary Key)
- title: String
- description: String
- category: String (enum: environment, storage, cooking, recycling, health)
- content: Text (full markdown/HTML)
- image_url: String
- video_url: String (YouTube embed URL)
- read_time: Integer (minutes)
- is_published: Boolean
- created_at: DateTime
```

### Review Model
```python
- id: Integer (Primary Key)
- user_id: Integer (Foreign Key to User)
- location_id: Integer (Foreign Key to Location)
- rating: Integer (1-5 stars)
- review_text: Text
- image_url: String (optional photo)
- created_at: DateTime
```

## Installation & Setup

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### 2. Mobile App Setup
```bash
cd mobile
npm install
# or
yarn install

# Install Google Maps for React Native
npm install react-native-maps
npm install expo-location
npm install expo-image-picker
npm install react-native-webview

# Start the app
expo start
# or
npm start
```

### 3. Google Maps API Key Setup

1. Create a project in Google Cloud Console
2. Enable Maps SDK for Android & iOS
3. Create API key with restrictions:
   - Android: Add app signing key
   - iOS: No restrictions
4. Add to environment:
   - **Android:** android/app/build.gradle
   - **iOS:** ios/Podfile or Info.plist
5. Create `.env` file:
   ```
   GOOGLE_MAPS_API_KEY=YOUR_API_KEY
   ```

## Key Features

### 🗺️ Maps Integration
- Interactive Google Maps showing all collection centers
- User location with permission handling
- Nearby location search (10km radius using Haversine formula)
- Direct routing to Google Maps navigation
- WhatsApp integration for instant contact

### 📚 Educational Content
- 5 tutorial categories (Environment, Storage, Cooking, Recycling, Health)
- Video embedding support (YouTube)
- Markdown content support for rich formatting
- Read time estimation for each tutorial
- Category-based filtering

### ⭐ Ratings & Reviews System
- 5-star rating system
- User photo uploads
- Review text with character limit
- Average rating calculation
- Review history for locations

### 📍 Location Discovery
- Real-time price tracking per liter
- Opening hours and closing days
- Certification display
- Contact information (phone & WhatsApp)
- Image gallery per location

## Constants & Defaults

### Tutorial Categories
```javascript
const CATEGORIES = [
  { id: 'environment', label: '🌍 Environment', color: '#4CAF50' },
  { id: 'storage', label: '🏠 Storage', color: '#2196F3' },
  { id: 'cooking', label: '🍳 Cooking', color: '#FF9800' },
  { id: 'recycling', label: '♻️ Recycling', color: '#9C27B0' },
  { id: 'health', label: '❤️ Health', color: '#F44336' }
];
```

### Map Region
```javascript
const DEFAULT_REGION = {
  latitude: -6.2088,      // Jakarta center
  longitude: 106.8456,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
};

const NEARBY_RADIUS = 10;  // km
```

## Error Handling

- **Location Permission Denied:** Graceful fallback to map center
- **API Failures:** User-friendly error messages with retry options
- **Network Issues:** Offline detection and cache management
- **Invalid Form Data:** Field-level validation with helpful error messages
- **Authentication:** JWT token refresh on 401 response

## Testing Checklist

- [ ] Google Maps displays correctly with markers
- [ ] User location tracking works (with permission)
- [ ] Nearby location search filters by 10km radius
- [ ] Location detail page loads with all information
- [ ] Reviews load and display correctly
- [ ] Add review form validates input
- [ ] Photo upload works in reviews
- [ ] Tutorial list shows categories correctly
- [ ] Tutorial detail page displays content and video
- [ ] WhatsApp links open with pre-filled message
- [ ] Call button opens phone dialer
- [ ] Navigation to Google Maps directions works
- [ ] All tabs navigation works smoothly
- [ ] Pull-to-refresh updates data

## Recent Changes

### Commit: `45bc27e`
**Complete mobile implementation: Add Maps, Tutorial, LocationDetail, AddReview screens**

**Files Added:**
- `mobile/src/screens/main/MapsScreen.js` (272 lines)
- `mobile/src/screens/main/LocationDetailScreen.js` (285 lines)
- `mobile/src/screens/main/TutorialScreen.js` (175 lines)
- `mobile/src/screens/main/TutorialDetailScreen.js` (315 lines)
- `mobile/src/screens/main/AddReviewScreen.js` (280 lines)

**Files Modified:**
- `mobile/src/navigation/MainTabNavigator.js` - Updated with new screens
- `mobile/package.json` - Added react-native-maps, react-native-webview, expo-image-picker
- `mobile/app.json` - Added Android/iOS permissions for location, camera, photo library

## Next Steps

1. **Environment Variables**
   - Set up `.env` file with Google Maps API key
   - Configure backend API endpoint URL

2. **Backend Data Population**
   - Add seed data for locations (collection centers)
   - Add tutorial content for each category
   - Import existing reviews if migrating from old system

3. **Testing & Deployment**
   - Run full integration tests
   - Test on physical Android/iOS devices
   - Deploy to Google Play Store & App Store

4. **Analytics & Monitoring**
   - Set up Google Analytics
   - Monitor API usage and performance
   - Track user engagement with tutorials

5. **Future Enhancements**
   - Offline map caching
   - Push notifications for new tutorials
   - User favorites/bookmarks
   - Price history tracking
   - Advanced search filters
   - Multi-language support

## Performance Considerations

- Maps data is paginated (20 items default)
- Tutorial images are compressed on upload
- Reviews are lazy-loaded when scrolling
- Location detail queries include aggregate rating calculation
- Nearby search uses efficient Haversine approximation

## Security Measures

- JWT authentication for review submissions
- User can only delete own reviews
- API keys stored in environment variables
- Phone/WhatsApp numbers validated before use
- Image uploads have file size limits
- CORS configured on backend

## Support & Documentation

For detailed backend documentation, see: [README_MAPS_EDUCATION.md](README_MAPS_EDUCATION.md)

For API endpoint specifications and testing, refer to backend route files:
- `backend/app/routes/locations.py`
- `backend/app/routes/tutorials.py`
- `backend/app/routes/reviews.py`

---

**Last Updated:** 2024
**Project Status:** ✅ Complete - Ready for Testing & Deployment
