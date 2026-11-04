import React, { useEffect, useRef, useState } from "react";
import styles from "./BhavaVoiceCall.module.css";
import { warmupVoiceBackend } from "../utils/voiceBackendWarmup";

const WS_URL = import.meta.env.VITE_BHAVA_VOICE_WS_URL || "ws://localhost:5000/ws/voice";

/**
 * BhavaVoiceCall Component
 * Phone Call UI for voice chat (no text message bubbles).
 * Displays real-time state instructions:
 *  - 🟢 WHEN TO SPEAK (SPEAK NOW)
 *  - 🟡 WHEN TO WAIT (PLEASE WAIT)
 *  - 🟣 WHEN AI IS SPEAKING (AI IS SPEAKING)
 *  - 🔴 MUTED / IDLE
 */
export default function BhavaVoiceCall({ isOpen: propIsOpen, onClose: propOnClose }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = propIsOpen !== undefined ? propIsOpen : internalOpen;

  // Call States: 'IDLE' | 'SPEAK_NOW' | 'PLEASE_WAIT' | 'AI_SPEAKING' | 'MUTED'
  const [callState, setCallState] = useState("IDLE");
  const [callSeconds, setCallSeconds] = useState(0);
  const [activeAgent, setActiveAgent] = useState("Bhava:");
  const [wsConnected, setWsConnected] = useState(false);
  const [statusNote, setStatusNote] = useState("Click mic to start call");

  // Web API Refs
  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Audio Playback Queue
  const audioQueueRef = useRef([]);
  const isPlayingAudioRef = useRef(false);
  const currentAudioRef = useRef(null);
  const wasSpeakingRef = useRef(false);
  const silenceStartTimeRef = useRef(null);

  // Listen for custom trigger events (e.g. window.dispatchEvent(new CustomEvent("bhava:call:open")))
  useEffect(() => {
    const handleOpenCall = () => {
      warmupVoiceBackend();
      setInternalOpen(true);
    };
    window.addEventListener("bhava:call:open", handleOpenCall);
    window.addEventListener("guru:voice", handleOpenCall);
    return () => {
      window.removeEventListener("bhava:call:open", handleOpenCall);
      window.removeEventListener("guru:voice", handleOpenCall);
    };
  }, []);

  // Initialize WebSocket when call opens
  useEffect(() => {
    if (!isOpen) return;

    warmupVoiceBackend();
    initWebSocket();

    return () => {
      cleanupCall();
    };
  }, [isOpen]);

  // Call Timer Effect
  useEffect(() => {
    if (callState === "SPEAK_NOW" || callState === "PLEASE_WAIT" || callState === "AI_SPEAKING") {
      if (!timerIntervalRef.current) {
        timerIntervalRef.current = setInterval(() => {
          setCallSeconds((prev) => prev + 1);
        }, 1000);
      }
    } else if (callState === "IDLE") {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      setCallSeconds(0);
    }
  }, [callState]);

  const getFormattedWsUrl = () => {
    let envUrl = import.meta.env.VITE_BHAVA_VOICE_WS_URL || "wss://bhava-voice-agent.onrender.com/ws/voice";
    envUrl = envUrl.trim();
    if (envUrl.startsWith("http://")) {
      envUrl = envUrl.replace("http://", "ws://");
    } else if (envUrl.startsWith("https://")) {
      envUrl = envUrl.replace("https://", "wss://");
    } else if (!envUrl.startsWith("ws://") && !envUrl.startsWith("wss://")) {
      envUrl = `wss://${envUrl}`;
    }
    if (!envUrl.includes("/ws/voice")) {
      envUrl = envUrl.replace(/\/+$/, "") + "/ws/voice";
    }
    return envUrl;
  };

  const initWebSocket = () => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const targetUrl = getFormattedWsUrl();
      console.log("[BhavaVoiceCall] Connecting to WebSocket:", targetUrl);
      const ws = new WebSocket(targetUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsConnected(true);
        setStatusNote("Connected to Bhava: Voice Pipeline");
      };

      ws.onclose = () => {
        setWsConnected(false);
        setStatusNote("Disconnected — retrying...");
        setTimeout(() => {
          if (isOpen) initWebSocket();
        }, 4000);
      };

      ws.onerror = (err) => {
        console.error("[BhavaVoiceCall] WS Error:", err);
        setWsConnected(false);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleServerMessage(data);
        } catch (e) {
          console.error("[BhavaVoiceCall] Parse error:", e);
        }
      };
    } catch (err) {
      console.error("[BhavaVoiceCall] Connection failed:", err);
    }
  };

  const handleServerMessage = (data) => {
    switch (data.type) {
      case "vad_status":
        if (data.is_speech && callState === "SPEAK_NOW") {
          setStatusNote(`Speech detected (${Math.round(data.confidence * 100)}%)`);
        }
        break;

      case "stt_result":
        setCallState("PLEASE_WAIT");
        setStatusNote("Speech captured — consulting Bhava:...");
        break;

      case "agent_chunk":
        if (data.agent) {
          setActiveAgent(`${data.agent} (${data.role || "Guide"})`);
        }
        break;

      case "audio_start":
        setCallState("AI_SPEAKING");
        setStatusNote(`${data.agent || "Bhava:"} is speaking now...`);
        break;

      case "audio_chunk":
        enqueueAudioChunk(data.audio_b64, data.mime);
        break;

      case "audio_end":
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          setCallState("SPEAK_NOW");
          setStatusNote("AI finished — speak now!");
        } else {
          setCallState("MUTED");
          setStatusNote("AI finished — tap Mic to respond.");
        }
        break;

      case "interrupted":
        stopAudioPlayback();
        setCallState("MUTED");
        setStatusNote("Call turn interrupted.");
        break;

      case "error":
        setCallState("IDLE");
        setStatusNote(`Error: ${data.message}`);
        break;

      default:
        break;
    }
  };

  const getSupportedMimeType = () => {
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/ogg;codecs=opus",
      "audio/wav",
    ];
    for (const t of types) {
      if (window.MediaRecorder && MediaRecorder.isTypeSupported(t)) {
        return t;
      }
    }
    return "";
  };

  const toggleMic = async () => {
    if (callState === "SPEAK_NOW") {
      stopRecording();
      setCallState("MUTED");
      setStatusNote("Microphone paused.");
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      initWebSocket();
      setStatusNote("Reconnecting to voice server...");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false },
      });
      const mimeType = getSupportedMimeType();
      const options = mimeType ? { mimeType } : {};

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      wasSpeakingRef.current = false;
      silenceStartTimeRef.current = null;

      // Audio Analyser for PCM VAD & Canvas Waveform
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (stream) stream.getTracks().forEach((track) => track.stop());

        if (audioChunksRef.current.length > 0) {
          const completeBlob = new Blob(audioChunksRef.current, { type: mimeType || "audio/webm" });
          if (completeBlob.size > 500) {
            setCallState("PLEASE_WAIT");
            setStatusNote("Transcribing speech...");

            const reader = new FileReader();
            reader.onloadend = () => {
              const base64Data = reader.result.split(",")[1];
              if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(
                  JSON.stringify({
                    type: "audio_turn",
                    audio_b64: base64Data,
                    mime: mimeType || "audio/webm",
                  })
                );
              }
            };
            reader.readAsDataURL(completeBlob);
          }
        }
        audioChunksRef.current = [];
      };

      mediaRecorder.start(250);
      setCallState("SPEAK_NOW");
      setStatusNote("Listening... speak now into mic");
      drawVisualizer();
    } catch (err) {
      console.error("[BhavaVoiceCall] Mic Error:", err);
      setStatusNote("Microphone permission denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const enqueueAudioChunk = (base64Data, mimeType) => {
    const audioUrl = `data:${mimeType};base64,${base64Data}`;
    const audio = new Audio(audioUrl);
    audioQueueRef.current.push(audio);
    playNextAudioInQueue();
  };

  const playNextAudioInQueue = () => {
    if (isPlayingAudioRef.current || audioQueueRef.current.length === 0) return;

    isPlayingAudioRef.current = true;
    setCallState("AI_SPEAKING");
    const audio = audioQueueRef.current.shift();
    currentAudioRef.current = audio;

    audio.onended = () => {
      isPlayingAudioRef.current = false;
      currentAudioRef.current = null;
      if (audioQueueRef.current.length > 0) {
        playNextAudioInQueue();
      } else {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          setCallState("SPEAK_NOW");
        } else {
          setCallState("MUTED");
        }
      }
    };

    audio.onerror = () => {
      isPlayingAudioRef.current = false;
      currentAudioRef.current = null;
      playNextAudioInQueue();
    };

    audio.play().catch((e) => {
      console.error("Audio playback error:", e);
      isPlayingAudioRef.current = false;
    });
  };

  const stopAudioPlayback = () => {
    audioQueueRef.current = [];
    isPlayingAudioRef.current = false;
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch (e) {}
      currentAudioRef.current = null;
    }
  };

  const endCall = () => {
    stopAudioPlayback();
    stopRecording();
    setCallState("IDLE");
    setStatusNote("Call ended.");
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "stop" }));
    }
    setInternalOpen(false);
    if (propOnClose) propOnClose();
  };

  const cleanupCall = () => {
    stopAudioPlayback();
    stopRecording();
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    animFrameRef.current = requestAnimationFrame(drawVisualizer);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const analyser = analyserRef.current;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const avgVolume = sum / bufferLength;

    // VAD silence detection (800ms)
    if (avgVolume > 45) {
      wasSpeakingRef.current = true;
      silenceStartTimeRef.current = null;
    } else if (wasSpeakingRef.current) {
      if (!silenceStartTimeRef.current) {
        silenceStartTimeRef.current = Date.now();
      } else if (Date.now() - silenceStartTimeRef.current >= 800) {
        wasSpeakingRef.current = false;
        silenceStartTimeRef.current = null;
        stopRecording();
      }
    }

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const barWidth = (width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * height * 0.8;
      const gradient = ctx.createLinearGradient(0, height, 0, 0);

      if (callState === "SPEAK_NOW") {
        gradient.addColorStop(0, "#2ed573");
        gradient.addColorStop(1, "#00f2fe");
      } else if (callState === "AI_SPEAKING") {
        gradient.addColorStop(0, "#7f00ff");
        gradient.addColorStop(1, "#e100ff");
      } else {
        gradient.addColorStop(0, "#ffab00");
        gradient.addColorStop(1, "#ff4757");
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);
      x += barWidth;
    }
  };

  const formatTimer = (totalSecs) => {
    const m = String(Math.floor(totalSecs / 60)).padStart(2, "0");
    const s = String(totalSecs % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!isOpen) return null;

  // Render Instruction Banner Configs
  const getInstructionContent = () => {
    switch (callState) {
      case "SPEAK_NOW":
        return {
          themeClass: styles.stateSpeak,
          icon: "🗣️",
          badge: "YOUR TURN",
          title: "SPEAK NOW",
          sub: "Microphone active — speak clearly to Bhava:.",
        };
      case "PLEASE_WAIT":
        return {
          themeClass: styles.stateWait,
          icon: "⏳",
          badge: "AI THINKING",
          title: "PLEASE WAIT",
          sub: "Analyzing your words & formulating spiritual guidance...",
        };
      case "AI_SPEAKING":
        return {
          themeClass: styles.stateAiSpeaking,
          icon: "🔊",
          badge: "BHAGWATI IS SPEAKING",
          title: "AI IS SPEAKING",
          sub: "Please listen to the voice response...",
        };
      case "MUTED":
        return {
          themeClass: styles.stateMuted,
          icon: "🤫",
          badge: "CALL PAUSED",
          title: "MICROPHONE MUTED",
          sub: "Tap Mic button to resume conversation.",
        };
      case "IDLE":
      default:
        return {
          themeClass: styles.stateIdle,
          icon: "🎙️",
          badge: "LIVE VOICE CALL",
          title: "START VOICE CALL",
          sub: "Tap Mic to connect with Bhava: AI Guide.",
        };
    }
  };

  const instruction = getInstructionContent();

  return (
    <div className={styles.overlay}>
      {/* ── Realistic Mobile Phone Frame ── */}
      <div className={styles.phoneFrame}>
        
        {/* Dynamic Island / Notch Bar */}
        <div className={styles.phoneNotch}>
          <div className={styles.cameraLens} />
          <div className={styles.speakerGrille} />
        </div>

        {/* Phone Top Status Bar */}
        <div className={styles.phoneStatusBar}>
          <span className={styles.phoneTime}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <div className={styles.phoneStatusRight}>
            <span className={styles.hdBadge}>HD VOICE</span>
            <span className={styles.signalIcon}>📶</span>
            <span className={styles.batteryIcon}>🔋</span>
          </div>
        </div>

        {/* Close Overlay Button */}
        <button className={styles.closeBtn} onClick={endCall} aria-label="Close Call Screen">
          ✕
        </button>

        {/* ── 1. Hero Caller Profile Section ── */}
        <div className={styles.callerHero}>
          <div className={`${styles.avatarOrbWrapper} ${callState === "SPEAK_NOW" || callState === "AI_SPEAKING" ? styles.avatarPulse : ""}`}>
            <div className={styles.avatarGlowRing} />
            <div className={styles.avatarOrb}>🕉️</div>
          </div>
          <h2 className={styles.callerName}>Bhava:</h2>
          <p className={styles.callerRole}>{activeAgent}</p>
          <div className={styles.callTimerBadge}>{formatTimer(callSeconds)}</div>
        </div>

        {/* ── 2. Real-Time Instruction Banner (When to speak, when to wait, AI speaking) ── */}
        <div className={`${styles.instructionCard} ${instruction.themeClass}`}>
          <div className={styles.instructionIconWrapper}>
            <span className={styles.instructionIcon}>{instruction.icon}</span>
          </div>
          <div className={styles.instructionText}>
            <span className={styles.instructionBadge}>{instruction.badge}</span>
            <h3 className={styles.instructionTitle}>{instruction.title}</h3>
            <p className={styles.instructionSub}>{instruction.sub}</p>
          </div>
        </div>

        {/* ── 3. Audio Waveform Spectrum Canvas ── */}
        <div className={styles.visualizerContainer}>
          <canvas ref={canvasRef} className={styles.canvas} width={380} height={130} />
          <div className={styles.visualizerLabel}>{statusNote}</div>
        </div>

        {/* ── 4. Mobile Call Action Controls Bar (iOS/Android style) ── */}
        <div className={styles.phoneControlsBar}>
          <div className={styles.controlItem}>
            <button
              className={`${styles.circleBtn} ${styles.micBtn} ${callState === "MUTED" ? styles.isMuted : ""}`}
              onClick={toggleMic}
              aria-label="Mute or Unmute Microphone"
            >
              <span className="material-symbols-outlined">
                {callState === "SPEAK_NOW" ? "mic" : "mic_off"}
              </span>
            </button>
            <span className={styles.controlLabel}>
              {callState === "SPEAK_NOW" ? "Mute" : "Speak"}
            </span>
          </div>

          <div className={styles.controlItem}>
            <button className={`${styles.circleBtn} ${styles.endCallBtn}`} onClick={endCall} aria-label="End Call">
              <span className="material-symbols-outlined">call_end</span>
            </button>
            <span className={styles.controlLabel}>End Call</span>
          </div>
        </div>

      </div>
    </div>
  );
}
