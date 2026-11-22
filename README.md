# 🧠 AlgoHint AI

**Get the next hint — not the answer.**

AlgoHint helps you solve coding problems step by step. It uses Gemini Nano on your device and Gemini in the cloud when needed.

![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firebase%20AI%20%2B%20Firestore-ffca28?logo=firebase&logoColor=black)

## ✨ What you can do

- 💡 **Concept Nudge** — Get a clue about the pattern or data structure.
- ⏱️ **Complexity Check** — Check time and space complexity.
- 🛡️ **Edge Case Guard** — Find bugs and tricky test cases.
- 🚀 **Cloud Post-Mortem** — Get a full review and five harder test cases.
- 📜 **Recent Activity** — Reopen or delete your saved hints.
- 💾 **Draft Saving** — Keep your code while you refresh or close the page.
- 🌐 **Offline Mode** — Turn off cloud help and use Gemini Nano only.

## 🚀 Getting started

### Requirements

- Node.js 20.19+ or 22.12+
- npm
- A Firebase project
- A supported browser for Gemini Nano

### Install

```bash
npm install
npm run dev
```

Open the local address shown by Vite.

## 🔥 Firebase setup

Create a `.env` file in the project folder:

```dotenv
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Optional
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

Turn on these Firebase features:

- ✅ Firebase AI Logic
- ✅ Anonymous Authentication
- ✅ Cloud Firestore

Restart Vite after changing `.env`.

## 🎮 How to use it

1. Paste your code or problem statement.
2. Pick a hint button.
3. Read the Coach Output.
4. Use **Cloud Post-Mortem** for a deeper review.
5. Open or delete older hints in Recent Activity.

## 🤖 How hints work

| Mode                 | What it does                                      |
| -------------------- | ------------------------------------------------- |
| 🧩 Hybrid Mode       | Uses Gemini Nano first, then the cloud if needed. |
| 📴 Offline Mode      | Uses Gemini Nano only.                            |
| ☁️ Cloud Post-Mortem | Uses cloud Gemini for deeper review.              |

Cloud hints need internet. Offline hints need a browser that supports Gemini Nano.

## 💾 Saved data

- Your unfinished text is saved in your browser.
- Hints can be saved in Firebase Firestore.
- Saved hints stay available after reconnecting.
- You can reopen or delete saved hints.

Only submit code or text that you are allowed to share.

## 📂 Project folders

```text
src/
├── app/
├── components/
├── config/
├── hooks/
├── services/
└── utils/
```

## 🛠️ Commands

| Command           | Use               |
| ----------------- | ----------------- |
| `npm run dev`     | Start the app     |
| `npm run build`   | Build the app     |
| `npm run preview` | Preview the build |
| `npm run lint`    | Check the code    |
| `npm test`        | Run tests         |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Add your feature and commit your changes
4. Push to your branch and submit a pull request (PR)

## 👤 Author

Made with 💻 and ☕ by [@udham2511]("https://www.github.com/udham2511")
