# Scrum Poker - Planning & Estimation Tool

A modern, real-time planning poker application for agile teams to estimate user stories and tasks collaboratively. No database required - everything runs in the browser with real-time synchronization.

![Scrum Poker Interface](https://via.placeholder.com/800x400/667eea/ffffff?text=Scrum+Poker+Interface)

## ✨ Features

### 🎯 Core Functionality
- **Real-time Voting**: Instant updates as team members cast their votes
- **Multiple Voting Systems**: Fibonacci, T-Shirt sizes, Powers of 2, and more
- **Issue Management**: Add and manage user stories with descriptions and priorities
- **Visual Results**: Beautiful charts and statistics for voting results
- **Consensus Detection**: Automatic detection when team reaches agreement

### 🎨 User Experience
- **Clean Interface**: Modern, intuitive design focused on team engagement
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Engaging card animations and transitions
- **Real-time Progress**: Live voting progress and player status updates

### 👥 Team Collaboration
- **Room-based Sessions**: Join games with simple 6-character room codes
- **Player Roles**: Moderator controls and participant voting
- **Spectator Mode**: Allow observers without voting rights
- **Session History**: Track voting rounds and final estimates

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd scrum-poker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview
```

## 🎮 How to Use

### Creating a Game
1. Click "Create Game" on the home page
2. Enter your name as the moderator
3. Choose a voting system (optional)
4. Share the generated room code with your team

### Joining a Game
1. Click "Join Game" on the home page
2. Enter your name and the room code
3. Wait for the moderator to add issues

### Running a Voting Session
1. **Moderator**: Add an issue with title and description
2. **Moderator**: Click "Start Voting" to begin the round
3. **All Players**: Select your estimate using the voting cards
4. **Moderator**: Click "Reveal Votes" when everyone has voted
5. **Team**: Discuss results and set final estimate
6. **Moderator**: Start a new round or add the next issue

## 🛠️ Technical Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **State Management**: React hooks + Custom GameManager
- **Storage**: Browser localStorage

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

## 🎯 Key Features Explained

### Real-time Synchronization
The application uses a custom GameManager class that automatically synchronizes game state across all participants using browser storage and event listeners.

### Visual Results Dashboard
After votes are revealed, teams see:
- **Vote Distribution**: Visual bar chart of all votes
- **Statistics**: Average, median, and highest estimates
- **Consensus Indicator**: Clear indication if team agrees
- **Quick Actions**: Buttons to use common statistics as final estimate

### Responsive Design
The interface adapts to different screen sizes:
- **Desktop**: Full sidebar layout with all features visible
- **Tablet**: Responsive grid that stacks components efficiently
- **Mobile**: Touch-friendly cards and optimized voting interface

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── HomePage.tsx    # Landing page
│   ├── GameRoom.tsx    # Main game interface
│   ├── VotingCards.tsx # Card selection interface
│   ├── ResultsPanel.tsx # Results visualization
│   ├── PlayerList.tsx  # Player status sidebar
│   ├── IssuePanel.tsx  # Issue display and controls
│   └── GameHeader.tsx  # Header with room info
├── types/              # TypeScript interfaces
├── utils/              # Game logic and state management
└── index.css          # Global styles and animations
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Customizing Voting Systems
Add new voting systems by updating the `VOTING_SYSTEMS` object in `src/types/index.ts`:

```typescript
'custom': {
  name: 'Custom System',
  values: ['XS', 'S', 'M', 'L', 'XL', '?', '☕'],
  description: 'Your custom voting system'
}
```

## 🎨 Customization

### Styling
The application uses Tailwind CSS. Key color schemes:
- **Primary**: Blue gradient (`from-blue-500 to-purple-600`)
- **Success**: Green (`green-500`)
- **Warning**: Orange (`orange-500`)
- **Background**: Purple gradient (`from-blue-600 via-purple-600 to-blue-800`)

### Animations
Custom CSS animations include:
- Card hover effects with scale and shadow
- Pulse animations for selected cards
- Reveal animations for results
- Loading spinners and progress indicators

## 🐛 Troubleshooting

### Common Issues

1. **Room code not working**
   - Ensure the room code is exactly 6 characters
   - Check that the moderator's session is still active

2. **Votes not updating**
   - Refresh the page to resync with localStorage
   - Ensure JavaScript is enabled

3. **Layout issues on mobile**
   - Try refreshing the page
   - Ensure you're using a modern browser

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you have any questions or need support, please [open an issue](../../issues) on GitHub.

---

**Happy Planning! 🎯**
