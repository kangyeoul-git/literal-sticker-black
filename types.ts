export enum AppState {
  INTRO = 'INTRO',
  IDLE = 'IDLE',
  COUNTDOWN = 'COUNTDOWN',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface GeneratedImage {
  original: string; // Base64
  processed: string; // Base64
}

export type TimerCount = 3 | 2 | 1 | 0;