import { useEffect, useRef, useState } from 'react';

const PROMPTS = [
  "What's on your mind right now?",
  'How are you really feeling today?',
  "What's weighing on you, or lifting you up?",
  'Write freely — no one is judging.',
];

// Browser speech-to-text (free, on-device in supported browsers). Returns null if unsupported.
function getRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const r = new SR();
  r.continuous = true;
  r.interimResults = false;
  r.lang = 'en-US';
  return r;
}

// Downscale a chosen image to keep the upload small/fast, returning { base64, mimeType, preview }.
function processImage(file, maxDim = 1280) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve({
          base64: dataUrl.split(',')[1],
          mimeType: 'image/jpeg',
          preview: dataUrl,
        });
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function JournalForm({ onSubmit, loading }) {
  const [text, setText] = useState('');
  const [placeholder] = useState(() => PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  const [listening, setListening] = useState(false);
  const [image, setImage] = useState(null); // { base64, mimeType, preview }
  const recognitionRef = useRef(null);
  const fileRef = useRef(null);
  const supported = useRef(Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));

  useEffect(() => () => { try { recognitionRef.current?.stop(); } catch {} }, []);

  const toggleVoice = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const r = getRecognition();
    if (!r) return;
    recognitionRef.current = r;
    r.onresult = (e) => {
      let chunk = '';
      for (let i = e.resultIndex; i < e.results.length; i++) chunk += e.results[i][0].transcript;
      setText((prev) => (prev ? prev.trimEnd() + ' ' : '') + chunk.trim());
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    r.start();
    setListening(true);
  };

  const onPickImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const processed = await processImage(file);
      setImage(processed);
    } catch {
      // ignore unreadable file
    }
    e.target.value = ''; // allow re-selecting the same file
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    recognitionRef.current?.stop();
    const trimmed = text.trim();
    if (trimmed) {
      onSubmit({ text: trimmed });
    } else if (image) {
      onSubmit({ image: image.base64, mimeType: image.mimeType });
    }
  };

  const canSubmit = Boolean(text.trim() || image);

  return (
    <form className="card journal-form" onSubmit={handleSubmit}>
      <h2>Today's journal</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={image ? 'Photo ready — or type to override it…' : placeholder}
        rows={8}
        maxLength={4000}
      />

      {image && (
        <div className="img-preview">
          <img src={image.preview} alt="Journal page to analyze" />
          <div className="img-meta">
            <span>📷 Photo ready — MindEase will read your handwriting.</span>
            <button type="button" className="img-remove" onClick={() => setImage(null)}>Remove</button>
          </div>
        </div>
      )}

      <div className="form-row">
        <div className="form-left">
          <span className="count">{text.length}/4000</span>
          {supported.current && (
            <button
              type="button"
              className={`mic ${listening ? 'listening' : ''}`}
              onClick={toggleVoice}
              title={listening ? 'Stop voice input' : 'Speak your entry'}
            >
              {listening ? '⏹ Listening…' : '🎤 Speak'}
            </button>
          )}
          <button
            type="button"
            className="upload"
            onClick={() => fileRef.current?.click()}
            title="Upload a photo of your handwritten journal"
          >
            📷 Upload photo
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={onPickImage}
          />
        </div>
        <button type="submit" disabled={loading || !canSubmit}>
          {loading ? 'Reflecting…' : 'Reflect with MindEase'}
        </button>
      </div>
      <p className="privacy-note">
        🔒 Private by design — only your mood score and a short excerpt are stored to draw your
        trend. Photos are read once for transcription and not saved. MindEase is a supportive
        companion, not a substitute for professional care.
      </p>
    </form>
  );
}
