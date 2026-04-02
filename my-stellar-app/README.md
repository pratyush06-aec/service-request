# Service Request System

A decentralized application built on Stellar Soroban that enables users to create work orders, accept jobs, submit deliverables, and manage approvals entirely on-chain.

## Features

- **Decentralized Service Requests**: Create non-custodial work orders with attached budgets.
- **Provider Workflow**: Service providers can pick up open requests and submit comprehensive work notes upon completion.
- **On-chain Approval System**: Requesters have the final say, accepting or rejecting with defined reasons.
- **Stellar Wallet Integration**: Connect seamlessly using the Freighter browser extension.
- **Premium 3D UI**: fluid, GSAP-powered interface that makes utilizing smart contracts an elegant experience.

## Tech Stack

- **Frontend**: React.js, Vite
- **Styling & Animations**: Modern CSS, GSAP (GreenSock Animation Platform) for immersive 3D/micro-animations
- **Blockchain**: Stellar SDK, Soroban RPC, Freighter API

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Make sure you have the [Freighter Wallet](https://freighter.app/) extension installed in your browser.

## Project Structure

- `/src/App.jsx` - Main application logic and workflow dashboard
- `/src/App.css` - UI Design System and Styling
- `/lib/stellar.js` - On-chain interaction utilities

## License

MIT
