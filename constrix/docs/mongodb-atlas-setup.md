# MongoDB Atlas Production Setup

## 1. Create MongoDB Atlas Account
- Go to https://cloud.mongodb.com/
- Sign up for free account
- Create new project: "Constrix"

## 2. Create Database Cluster
- Choose "Build a Database" → "Shared" (Free)
- Provider: AWS
- Region: Choose closest to your users
- Cluster Name: "constrix-prod"

## 3. Configure Database Access
- Database Access → Add New Database User
- Username: `constrix-admin`
- Password: Generate secure password
- Database User Privileges: "Read and write to any database"

## 4. Configure Network Access
- Network Access → Add IP Address
- Add: `0.0.0.0/0` (Allow access from anywhere)
- Or add specific Railway/Render IP ranges

## 5. Get Connection String
- Clusters → Connect → "Connect your application"
- Driver: Node.js
- Copy connection string:
```
mongodb+srv://constrix-admin:<password>@constrix-prod.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## 6. Update Environment Variables
Replace in your production .env:
```
DATABASE_URL=mongodb+srv://constrix-admin:YOUR_PASSWORD@constrix-prod.xxxxx.mongodb.net/constrix?retryWrites=true&w=majority
```

## 7. Database Collections
The following collections will be auto-created:
- users
- habits  
- checkins
- milestones

## 8. Optional: MongoDB Compass
- Download MongoDB Compass for GUI management
- Connect using the same connection string