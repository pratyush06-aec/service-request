# Stellar Soroban Service Request System

<p align="center">
  <img src="./my-stellar-app/src/assets/logo.png" width="300" alt="Service Request Logo">
</p>

![Stellar](https://img.shields.io/badge/Stellar-Soroban-black?style=for-the-badge&logo=stellar) ![React](https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react) ![Vite](https://img.shields.io/badge/Vite-5.0-purple?style=for-the-badge&logo=vite) ![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?style=for-the-badge&logo=greensock)

A next-generation decentralized application (dApp) built on the Stellar network using Soroban Smart Contracts. This interface enables users to seamlessly create work orders, accept and submit deliverables, and manage final on-chain approvals with zero centralized infrastructure.

CONTRACT_ID = "CCBJ3A4NVK3IAUR2C36F2LKMC7A5QFSAARE6ZY2ZB7TFJDM7FQ4WCWQF"

## 📸 Visual Tour

### Application Flow & Demonstration
![Demo Recording](./assets/demo_recording.webp)

### Landing Page
![Landing Page](./assets/landing_page.png)

### Main Dashboard & Request Creation
![Main Dashboard](./assets/dashboard_main.png)

## 🌟 Key Features

- **Decentralized Service Escrow**: Create non-custodial work requests with an attached XLM/Stroops budget safely locked by the smart contract.
- **Provider Workflow**: Decentralized mechanism for service providers to pick up open requests and submit comprehensive deliverables upon task completion.
- **On-chain Approvals**: Requesters retain sovereign authority—able to approve or reject the work through purely cryptographic signatures.
- **Flawless UI/UX**: The UI ditches generic templates for a custom, glassmorphic layout powered by the robust GreenSock Animation Platform (**GSAP**) providing immersive 3D tilting and rapid micro-animations.
- **Intelligent Error Handling**: Opaque Soroban VM collision errors are intercepted during the RPC Simulation phase and presented as beautifully styled, actionable alerts—delivering a frustration-free UX.

## 🚀 Getting Started

Follow these instructions to run the Service Request dApp locally.

### 1. Prerequisites
- **Node.js**: Ensure you have Node `v18+` or newer installed.
- **Freighter Wallet**: Install the [Freighter browser extension](https://freighter.app/) and enable "Testnet" mode in settings.

### 2. Installation
Clone the repository and install the dependencies inside the `my-stellar-app` directory:

```bash
git clone https://github.com/your-username/service-request.git
cd service-request
cd my-stellar-app
npm install
```

### 3. Run the Development Server
Fire up the Vite hot-reloading dev server:

```bash
npm run dev
```

Visit the `localhost` URL printed in your terminal (typically `http://localhost:5173`).

### 4. Constructing for Production
To build your project:
```bash
npm run build
```
This runs the Vite compiler to produce hyper-optimized, minified vanilla assets inside the `/dist` output directory.

## 🏗 System Architecture

<img src="./my-stellar-app/src/assets/diagram-export-2-4-2026-11_59_10-pm.png" height="1000" width="90%" alt="system architecture logo">

Our dApp follows a perfectly decoupled, 5-layer decentralized architecture:

1. **User Layer**: The entry point where users visually interact with the platform natively through their Client Browser.
2. **Frontend Layer**: 
    - A localized React Single Page Application (SPA), primarily modeled around `App.jsx`.
    - Handles **State & Navigation** locally for instantaneous DOM transitions entirely devoid of server routing delays.
    - Utilizes a localized **GSAP + 3D Transform Engine** to interpret UI Events and deliver an immersive, polished component experience.
    - Features smart **Output Panel** state management that beautifully renders query structures and outputs accurately.
3. **Wallet Layer**: Operates as a cryptographic bridge, executing Wallet Auth Requests securely through the **Freighter Wallet** application to prompt biometric/password confirmation, generating Signed XDR Transactions payload drops.
4. **Integration Layer** (`lib/stellar.js`): The orchestrator that manages all RPC interaction pipelines.
    - **Write Operations**: Actions like `createRequest`, `acceptRequest`, `submitWork`, and `approveWork` compile user intent into XDR, attaching fees and simulation footprints, before routing to the network.
    - **Read Operations**: Polling triggers like `getRequest` simulate read-only execution runs against the blockchain to fetch the most cutting-edge block state.
    - **Error Translation Layer**: Built-in regex listeners catching `sim.error` HostError footprints, actively parsing VM exceptions into beautifully mapped validation prompts (e.g., stopping `seq1` ID collisions).
5. **Blockchain Layer (Stellar Testnet)**: Final decentralized execution layer. Global nodes validate the transaction against the compiled **Service Request Smart Contract** which securely locks budgets, maintains order ledgers securely, and finalizes mutations.

## 📂 Project Structure

```
service-request/
├── my-stellar-app/              # Core UI and Logic directory
│   ├── src/                     # React application sources
│   │   ├── LandingPage.jsx      # High-fidelity entrance page
│   │   ├── App.jsx              # Mission control SPA router
│   │   ├── App.css              # Global custom CSS design system
│   │   └── assets/              # Architecture diagram & visual embeddings
│   ├── lib/                     # Soroban RPC Bridge
│   │   └── stellar.js           # Integration mapping and exception parsing limits
│   ├── package.json             # NPM metadata and scripts
│   └── vite.config.js           # Module configuration and Github pages base mapping
```

## 📜 License
MIT License
