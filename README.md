# 🚀 PitchPilot - AI-Powered Pitch Deck Platform

PitchPilot is a comprehensive SaaS platform that helps startup founders create, design, and optimize pitch decks using AI technology. The platform provides tools for generating investor-ready presentations, tracking engagement analytics, and customizing content for different investor personas.

## ✨ Features

### 🎯 Core Features
- **AI-Powered Deck Builder**: Generate complete pitch decks in minutes
- **Investor Persona Targeting**: Customize content for specific investor types
- **Real-time Analytics**: Track deck views, engagement, and investor interactions
- **Smart Feedback**: AI-powered suggestions for clarity and impact
- **Template Library**: Access to proven pitch deck templates
- **Collaboration Tools**: Real-time editing with team members

### 🛠 Technical Features
- **Modern React Frontend**: Built with React 18, Tailwind CSS, and modern hooks
- **Node.js Backend**: Express server with JWT authentication
- **MongoDB Database**: Scalable document storage
- **AI Integration**: OpenAI API for content generation
- **Real-time Updates**: Socket.io for live collaboration
- **Responsive Design**: Mobile-first approach

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pitchpilot.git
   cd pitchpilot
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Setup**
   ```bash
   # Copy environment example
   cp .env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if local)
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGO_URI in .env
   ```

5. **Start Development Servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start separately:
   npm run server  # Backend on port 5000
   npm run client  # Frontend on port 3000
   ```

## 📁 Project Structure

```
pitchpilot/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   └── utils/        # Utility functions
│   └── public/           # Static assets
├── server/               # Node.js backend
│   ├── routes/          # API route handlers
│   ├── models/          # Mongoose models
│   ├── middleware/      # Custom middleware
│   ├── config/          # Configuration files
│   └── utils/           # Utility functions
├── docs/                # Documentation
└── README.md           # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/pitchpilot

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Payment Processing
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

## 🎨 Frontend Features

### Components
- **Layout**: Responsive sidebar navigation
- **Authentication**: Login/Register forms with validation
- **Dashboard**: Overview with analytics and quick actions
- **Deck Builder**: AI-powered presentation editor
- **Analytics**: Interactive charts and metrics
- **Templates**: Library of pitch deck templates

### Technologies
- **React 18**: Latest React features and hooks
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **React Query**: Server state management
- **Fabric.js**: Canvas-based presentation editor
- **Recharts**: Data visualization
- **Framer Motion**: Animations

## 🔌 Backend Features

### API Endpoints
- **Authentication**: `/api/auth/*`
- **Deck Management**: `/api/decks/*`
- **Analytics**: `/api/analytics/*`
- **Templates**: `/api/templates/*`
- **User Management**: `/api/users/*`

### Technologies
- **Express.js**: Web framework
- **MongoDB**: Document database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication tokens
- **OpenAI API**: AI content generation
- **Socket.io**: Real-time communication

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd client
npm run build
cd ..

# Start production server
npm start
```

### Docker Deployment
```bash
# Build Docker image
docker build -t pitchpilot .

# Run container
docker run -p 5000:5000 pitchpilot
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong JWT secret
- Configure MongoDB Atlas
- Set up SSL certificates
- Configure CDN for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.pitchpilot.com](https://docs.pitchpilot.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/pitchpilot/issues)
- **Email**: support@pitchpilot.com

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- Tailwind CSS for styling
- React team for the amazing framework
- MongoDB for database technology

---

**Built with ❤️ for startup founders everywhere** 