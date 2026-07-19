# Speech-to-Text Web Application

A responsive web application that converts real-time speech into text using the browser's built-in **Web Speech API**. Built with plain HTML, CSS, and JavaScript — no frameworks, no paid APIs.

## Features

- Start / Stop voice recording with a single button
- Real-time speech-to-text transcription
- Live status indicator ("Listening..." / idle)
- Copy transcribed text to clipboard
- Clear transcribed text
- Error handling for unsupported browsers and microphone permission denial

## Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla) — Web Speech API (`SpeechRecognition`)

## Browser Support

This app requires the **SpeechRecognition** interface of the Web Speech API, which is currently only fully supported in **Chromium-based browsers with Google's speech backend enabled**:

- ✅ Google Chrome
- ✅ Microsoft Edge
- ❌ Brave (does not implement the SpeechRecognition service)
- ❌ Firefox (no support)
- ❌ Safari (limited/no support)

**Please use Google Chrome or Microsoft Edge to run and test this application.**

## Setup Instructions

1. Clone or download this repository:
   ```bash
   git clone <your-repo-url>
   cd speech-to-text
   ```
2. Open the project folder in VS Code (or any editor).
3. Open `index.html` using **Live Server**, or run a simple local server:
   ```bash
   python3 -m http.server 5500
   ```
4. Open the app in **Google Chrome** or **Microsoft Edge**:
   ```
   http://localhost:5500
   ```
5. Click **Start Recording**, allow microphone access when prompted, and start speaking.

## File Structure

```
speech-to-text/
├── index.html      # App structure
├── style.css        # Styling
├── script.js         # Speech-to-Text logic (Web Speech API)
└── README.md
```

## How to Use

1. Click the red **Start Recording** button.
2. Allow microphone permission when the browser prompts you.
3. Speak — your words appear in the text box in real time.
4. Click **Stop Recording** (same button) to end the session.
5. Use **Copy Text** to copy the transcript to your clipboard.
6. Use **Clear Text** to reset the text box.

## Notes

- No paid APIs, authentication, or database are used, per project constraints.
- The app relies entirely on the browser's native SpeechRecognition service, which requires an active internet connection.s
