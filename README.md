# NearBy

NearBy is a location-based mobile application that helps users save their favorite stores, view store locations on Google Maps, and receive automatic push notifications when nearby. Whether you're exploring local cuisine or keeping track of your favorite coffee shops, NearBy makes your life more convenient.

## Project Structure

```
NearBy/
├── client/                 # React Native + Expo Frontend
├── server/                 # Node.js + Express Backend
└── README.md
```

## Tech Stack

- Frontend: React Native + Expo
- Backend: Node.js + Express
- Database: MongoDB
- Maps Service: Google Maps API
- Push Notifications: Expo Notifications

## Key Features

- Store Management: Add, delete, and view saved stores.
- Google Maps Integration: Display user's current location and store markers.
- Location-based Push Notifications: Automatic alerts when users are near saved stores.
- User Location Tracking: Real-time location updates with geofencing support.

## Development Environment Setup

### Frontend Setup

1. Install dependencies:
```bash
cd client
npm install
```

2. Configure environment variables:
- Add necessary API keys and database connection information to `.env`

3. Start development server:
```bash
npm start
```

### Backend Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Start development server:
```bash
npm run dev
```

## Environment Requirements

- Node.js >= 18
- MongoDB >= 6.0
- Expo CLI
- Google Maps API Key