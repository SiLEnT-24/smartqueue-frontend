let audioContext;

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) throw new Error('Sound alerts are not supported by this browser.');
  audioContext ||= new AudioContextClass();
  return audioContext;
}

export async function enableSoundAlerts() {
  const context = getAudioContext();
  await context.resume();
  playTone(context);
}

export async function unlockSoundAlerts() {
  await getAudioContext().resume();
}

export function playSoundAlert() {
  if (audioContext?.state === 'running') playTone(audioContext);
}

function playTone(context) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;

  oscillator.frequency.value = 880;
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.35);
}
