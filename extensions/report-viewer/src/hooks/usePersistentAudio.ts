import { useEffect, useState } from "react";
import notificationSound from "@/assets/notification.mp3";

const usePersistentAudio = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    if (audioContext) {
      console.log("AudioContext is already registered");
      return;
    }

    const context = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
    setAudioContext(context);
    console.log("AudioContext registered successfully");

    const resumeAudioContext = () => {
      if (context.state === "suspended") {
        context.resume().catch((error: unknown) => {
          console.error("Failed to resume AudioContext:", error);
        });
      }
    };

    // Register user interactions to resume the audio context
    document.addEventListener("click", resumeAudioContext);
    document.addEventListener("scroll", resumeAudioContext);

    return () => {
      document.removeEventListener("click", resumeAudioContext);
      document.removeEventListener("scroll", resumeAudioContext);
    };
  }, [audioContext]);

  const playNotificationSound = async () => {
    if (!audioContext) {
      console.error("AudioContext is not initialized");
      return;
    }

    try {
      const response = await fetch(notificationSound);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    } catch (error) {
      console.error("Audio playback failed:", error);
      if (audioContext.state === "suspended") {
        audioContext.resume().catch(resumeError => {
          console.error("Failed to resume AudioContext after playback error:", resumeError);
        });
      }
    }
  };

  return playNotificationSound;
};

export default usePersistentAudio;
