# BoardingBook Roommate Finder

This workspace now contains a working starter implementation of the Smart Boarding Booking System roommate module.

## What is included

- `backend/` - Node.js + Express API with MongoDB models, JWT auth middleware, roommate profile matching, invitations, groups, room lookup, and group booking validation.
- `app/` - React Native app scaffold for Android using Expo, React Navigation, Axios, and AsyncStorage.

## Core flow

1. Student opens the app and pastes a valid JWT token from the auth module.
2. Student creates or updates a roommate profile.
3. Student searches for compatible roommates and sends invitations.
4. Invitations are accepted or rejected.
5. A roommate group is formed and the leader can request a room booking.
6. Booking validation checks group size against room capacity before creating the booking request.

## Backend setup

1. Go to `backend/`.
2. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
3. Install dependencies and run the server.

```bash
cd backend
npm install
npm run dev
```

## App setup

1. Go to `app/`.
2. Copy `.env.example` to `.env` and set `API_BASE_URL` to your deployed backend URL.
3. Install dependencies and start Expo.

```bash
cd app
npm install
npm run android
```

## Deployment notes

- Deploy the backend to Render or Railway.
- Store `MONGO_URI` and `JWT_SECRET` as environment variables in the platform settings.
- Point the mobile app at the live backend URL, not `localhost`.

## Important API endpoints

- `POST /api/roommate/profile`
- `GET /api/roommate/profile/me`
- `GET /api/roommate/search`
- `POST /api/roommate/invite`
- `GET /api/roommate/invitations`
- `PUT /api/roommate/invite/:id/accept`
- `PUT /api/roommate/invite/:id/reject`
- `GET /api/roommate/group/my`
- `DELETE /api/roommate/group/leave`
- `GET /api/rooms`
- `POST /api/bookings`

## Viva talking points

- Matching is based on budget overlap, location, sleep habits, study habits, cleanliness, and shared interests.
- Invitations move through `pending -> accepted/rejected`.
- A user is tied to one roommate profile and one active group at a time through `roommateProfileId` and `groupId`.
- Room bookings validate that group size does not exceed room capacity.
