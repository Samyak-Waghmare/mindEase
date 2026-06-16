# 🌿 MindEase

**A Gamified AI Journaling Companion built for the ML Empowerment Build Challenge.**

## 🎯 Project Title
**MindEase**

## 📖 Project Description

### Problem Statement
Journaling is a proven way to improve mental health, but many people—especially students and young professionals—find it clinical, tedious, or hard to stick with daily. Furthermore, generic apps rarely combine meaningful self-reflection, practical coping tools, and a safety net when users are in distress.

### Solution Overview
**MindEase** transforms journaling into a highly engaging, gamified experience. It uses Google Gemini AI to analyze your journal entries and offer warm reflections, while rewarding you with "Mind Coins" for building healthy habits. It’s a completely private space where taking care of your mental health feels less like a chore and more like a rewarding game.

### Key Features
- **🎮 Gamified Economy & "My Sprout"**: Earn "Mind Coins" by completing journal entries and box-breathing exercises. Watch your virtual companion ("My Sprout") evolve from a tiny seed into a magical tree as you level up!
- **🤖 AI Mood Analysis**: Write, speak, or upload a photo of your physical journal. Google Gemini processes the entry, detects your mood, calculates a wellbeing score (1–10), and offers personalized psychological coping techniques.
- **📷 Multimodal Input**: Support for text, voice-to-text, and image transcription via Gemini Vision.
- **🫁 Interactive Box-Breathing**: A dedicated, fully animated 4-4-4-4 breathing exercise that helps regulate the nervous system (and earns you coins!).
- **📊 Insights Dashboard**: Track your historical mood trends, journaling streaks, and total entries on a beautifully charted dashboard.
- **🆘 Deterministic Crisis Safety**: Safety is never left solely to the AI. A deterministic keyword-matching layer runs on every entry. If distress or crisis is detected, it instantly flags the entry and displays verified international emergency helplines.

### Technologies Used
- **Frontend**: React (Vite), CSS (Custom Gamified Arcade Theme with Pastel Colors & 3D elements), Chart.js
- **Backend**: Node.js, Express.js, Custom File-based JSON Datastore
- **Artificial Intelligence**: Google Gemini API (`gemini-2.0-flash` with multimodal vision support)

### Target Users
Students, young professionals, and anyone who wants to improve their mental wellbeing but struggles with building a consistent, daily journaling habit.

---

## 📸 Project Files (Screenshots)
*(Please see the Devpost gallery for full screenshots including the Gamified Dashboard, "My Sprout" evolution tab, and AI Analysis results!)*

## 🔗 Project Link / Repository
[MindEase GitHub Repository](https://github.com/Samyak-Waghmare/mindease)  
[Live Demo (Vercel)](https://mind-ease-theta-navy.vercel.app/)

## 👥 Team Details
- **Samyak Waghmare** - Frontend Development, UI/UX Design, and Gamification Integration.
- **Jayesh Waghmare** - Backend Development, Google Gemini AI Integration, and Safety/Database Architecture.

---

## 💻 Run it locally

```bash
# Install dependencies for both frontend and backend
npm install
npm run install:all

# Add your free Gemini API key to the backend:
# Edit backend/.env -> GEMINI_API_KEY=your_key

# Start the development server
npm run dev
```

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:3002

*Note: Without a Gemini key, the app gracefully falls back to a built-in heuristic analyzer so you can still test the UI and gamification!*

---

## ⚠️ Important Note
MindEase is a supportive journaling tool, **not** a medical device, diagnosis, or emergency service. If you or someone you know is in crisis, please contact a helpline or local emergency services immediately.
