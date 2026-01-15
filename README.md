A blockchain-based system for issuing, storing, and verifying academic certificates in a secure and tamper-proof manner.

This project allows educational institutions to issue certificates on the blockchain, students to access their academic records, and third parties to verify certificates using QR codes or certificate hashes without requiring authentication.
--------------------------------
🚀 Features
👨‍💼 Admin

Create and manage student records

Issue certificates and report cards

Upload certificate PDF, grade report PDF, and student photo

Hash documents and store verification data on blockchain

Generate QR codes for issued certificates
--------------------------------
👨‍🎓 Student

Secure login

View personal academic records

Access issued certificate details

Share QR code or certificate hash for verification
---------------------------
🔍 Verifier (Public Access)

Verify certificates using:

Certificate hash

QR code (file upload or camera scan)

View verified details:

Student name

Roll number

Department

Graduation year

Issue date

Download certificate PDF, report card PDF, and view student photo
------------------------
🧱 System Architecture

Frontend: React + TypeScript

Backend: Node.js + Express + TypeScript

Database: MongoDB

Blockchain: Ethereum (Sepolia testnet)

Smart Contracts: Solidity

File Handling: Multer + SHA-256 hashing

Verification: QR code + blockchain hash lookup
--------------------------
🔐 Security Model

Role-based access control (Admin / Student)

Blockchain write operations restricted to admin wallet

Verifiers do not require authentication

Documents are never stored on-chain — only hashes are stored

Tamper-proof verification using blockchain immutability
-----------------------
⚙️ Environment Setup
Prerequisites

Node.js (v18+)

MongoDB

MetaMask

Sepolia ETH (testnet)

Alchemy / Infura API key
------------------------
Backend Setup
cd srms-backend
npm install
npm run dev
------------------------

Create .env:

MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret
PRIVATE_KEY=admin_wallet_private_key
SEPOLIA_RPC_URL=your_rpc_url
CONTRACT_ADDRESS=deployed_contract_address
-------------------------
Smart Contracts
cd srms-contracts
npx hardhat compile
npx hardhat deploy --network sepolia
--------------------------
Frontend
cd srms-frontend
npm install
npm run dev
--------------------------
🧪 Verification Flow

1.Admin issues certificate

2.System generates:
-Document hashes
-Blockchain transaction
-QR code

3.Verifier:
Uploads QR image or enters certificate hash

4.System:
-Fetches blockchain data
-Confirms authenticity
-Displays verified certificate details
-----------------------------
📊 Use Case Overview

Admin issues certificate → blockchain

Student accesses records → frontend

Verifier validates certificate → public verification page
