# WellSky Scrum Poker - Internal Planning Tool

A modern, real-time planning poker application designed specifically for WellSky teams to estimate user stories and tasks collaboratively. Features WellSky branding and optimized for internal team use.

![WellSky Scrum Poker](https://via.placeholder.com/800x400/0066cc/ffffff?text=WellSky+Scrum+Poker)

## ✨ Features

### 🎯 WellSky-Optimized Features
- **Real-time Voting**: Instant Socket.IO-powered updates as team members cast their votes
- **Multiple Voting Systems**: Fibonacci, T-Shirt sizes, Powers of 2, and more
- **WellSky Branding**: Official WellSky logo and corporate styling
- **Internal Team Tool**: Designed specifically for WellSky development teams
- **Issue Management**: Add and manage user stories with descriptions and priorities
- **Visual Results**: Beautiful charts and statistics for voting results
- **Consensus Detection**: Automatic detection when team reaches agreement

### 🎨 User Experience
- **Clean Interface**: Modern, intuitive design focused on team engagement
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Engaging card animations and transitions
- **Real-time Progress**: Live voting progress and player status updates

### 👥 Team Collaboration
- **Room-based Sessions**: Create sessions with shareable links
- **Real-time Socket.IO**: Live collaboration with instant updates
- **Player Roles**: Moderator controls and participant voting
- **Session Management**: Easy session creation and team joining

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ashutoshsingh-wellsky/wellsky-poker-app.git
   cd wellsky-poker-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Start Socket.IO server** (in another terminal)
   ```bash
   cd server && npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview
```

## 🎮 How to Use

### Creating a Session
1. Enter your name as the organizer
2. Choose a voting system (Fibonacci recommended)
3. Click "Create Session & Get Link"
4. Share the generated link with your WellSky team members

### Running a Voting Session
1. **Organizer**: Add an issue with title and description
2. **Organizer**: Start voting round
3. **All Players**: Select your estimate using the voting cards
4. **Organizer**: Reveal votes when everyone has voted
5. **Team**: Discuss results and set final estimate
6. **Organizer**: Move to next issue or end session

## 🛠️ Technical Stack

- **Frontend**: React 18 with TypeScript
- **Backend**: Node.js with Socket.IO for real-time features
- **Styling**: Tailwind CSS with WellSky branding
- **Build Tool**: Vite
- **Icons**: Lucide React
- **State Management**: React hooks + Socket.IO GameManager
- **Deployment**: Vercel-ready with production configuration

## 🚀 Deployment Options

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically - Vercel will detect the Vite configuration
3. For the Socket.IO server, deploy to Railway, Render, or Heroku

### Manual Deployment
```bash
npm run build
# Deploy the `dist` folder to your hosting provider
```

## 📊 Voting Systems

| System | Values | Best For |
|--------|--------|----------|
| **Fibonacci** | 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89 | Traditional story points |
| **Modified Fibonacci** | 0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100 | Extended range estimation |
| **T-Shirt Sizes** | XS, S, M, L, XL, XXL | Relative sizing |
| **Powers of 2** | 1, 2, 4, 8, 16, 32, 64 | Technical complexity |
| **Linear** | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 | Simple linear scale |

All systems include special cards:
- **?** - Need more information
- **☕** - Need a break

## � WellSky Integration

This tool is specifically designed for WellSky's internal development teams:
- **Corporate Branding**: Official WellSky logo and styling
- **Internal Use**: Optimized for WellSky team workflows
- **Agile Planning**: Supports WellSky's agile development processes
- **Team Collaboration**: Real-time features for distributed teams

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── HomePage.tsx    # WellSky-branded landing page
│   ├── GameRoom.tsx    # Main game interface
│   ├── VotingCards.tsx # Card selection interface
│   ├── ResultsPanel.tsx # Results visualization
│   ├── PlayerList.tsx  # Player status sidebar
│   ├── IssuePanel.tsx  # Issue display and controls
│   └── GameHeader.tsx  # Header with room info
├── types/              # TypeScript interfaces
├── utils/              # Game logic and Socket.IO management
└── index.css          # Global styles and animations
server/
├── server.js           # Socket.IO server
└── package.json        # Server dependencies
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 WellSky Branding

The application features:
- **Official WellSky Logo**: Displayed prominently on the homepage
- **Corporate Colors**: WellSky blue and professional gradients
- **Internal Tool Messaging**: Clear indication this is for WellSky internal use
- **Professional Design**: Clean, corporate-appropriate interface

## 📝 License

This project is developed for WellSky internal use.

## 🤝 Contributing

For WellSky team members:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support or questions, please contact the WellSky development team or [open an issue](../../issues) on GitHub.

---

**Ready for WellSky Teams! 🏢**
