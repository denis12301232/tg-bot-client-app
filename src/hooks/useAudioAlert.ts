export default function useAudioAlert(name: string) {
  const audio = new Audio(new URL(name, import.meta.url).href);

  function play() {
    audio.currentTime = 0;
    const playAttempt = setInterval(() => {
      audio
        .play()
        .then(() => clearInterval(playAttempt))
        .catch(console.error);
    }, 500);
  }

  return { audio, play };
}
