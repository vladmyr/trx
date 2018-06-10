import AudioStreamManager from "./AudioStremManager";

const audioStreamManager = AudioStreamManager.GetInstance();

audioStreamManager.start(11, 8);
setTimeout(() => {
  audioStreamManager.stop()
}, 5000);

console.log(AudioStreamManager.GetDevices());

