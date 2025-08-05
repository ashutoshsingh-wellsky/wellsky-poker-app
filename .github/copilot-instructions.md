<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Scrum Poker Application Instructions

This is a React-based planning poker application with the following key features:

## Architecture
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **State Management**: Local state with React hooks and a custom GameManager class
- **Storage**: Browser localStorage (no database required)
- **Build Tool**: Vite

## Key Components
- `HomePage`: Landing page for creating/joining games
- `GameRoom`: Main game interface
- `VotingCards`: Interactive voting interface with different card systems
- `ResultsPanel`: Real-time results visualization with statistics
- `PlayerList`: Live player status and voting progress
- `IssuePanel`: Issue management and voting controls

## Game Flow
1. Create or join a game session with room code
2. Add issues to estimate
3. Start voting rounds
4. Players select estimates using cards
5. Reveal results with statistics and consensus indicators
6. Set final estimates and move to next issue

## Voting Systems Supported
- Fibonacci (0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ?, ☕)
- Modified Fibonacci
- T-Shirt Sizes (XS, S, M, L, XL, XXL)
- Powers of 2
- Linear (1-10)

## Design Principles
- Clean, modern UI with engaging animations
- Real-time updates using game manager pattern
- Responsive design for mobile and desktop
- Visual feedback for voting progress and results
- Consensus detection and statistical analysis

When working on this codebase:
- Use TypeScript interfaces for type safety
- Follow React best practices with functional components and hooks
- Maintain the existing design patterns and component structure
- Use Tailwind CSS classes for styling
- Ensure responsive design across all components
