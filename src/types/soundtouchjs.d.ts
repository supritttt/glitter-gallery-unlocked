declare module "soundtouchjs" {
  export interface PlayEventDetail {
    timePlayed: number;
    formattedTimePlayed: string;
    percentagePlayed: number;
  }

  export class PitchShifter {
    constructor(
      context: AudioContext,
      buffer: AudioBuffer,
      bufferSize: number,
      onEnd?: () => void
    );
    tempo: number;
    rate: number;
    pitch: number;
    set pitchSemitones(semitones: number);
    percentagePlayed: number;
    readonly duration: number;
    readonly formattedDuration: string;
    readonly formattedTimePlayed: string;
    readonly node: AudioNode;
    connect(toNode: AudioNode): void;
    disconnect(): void;
    on(eventName: string, cb: (data?: PlayEventDetail) => void): void;
    off(eventName?: string): void;
  }

  export {
    AbstractFifoSamplePipe,
    RateTransposer,
    SimpleFilter,
    SoundTouch,
    Stretch,
    WebAudioBufferSource,
  } from "soundtouchjs";
}
