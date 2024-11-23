declare module 'fluent-ffmpeg' {
  import { Stream } from 'stream';

  interface FfmpegCommand {
    input(input: string | Stream): FfmpegCommand;
    addInput(input: string | Stream): FfmpegCommand;
    output(output: string | Stream): FfmpegCommand;
    outputFormat(format: string): FfmpegCommand;
    outputOptions(options: string[]): FfmpegCommand;
    videoFilters(filters: string[]): FfmpegCommand;
    complexFilter(filters: string[]): FfmpegCommand;
    videoBitrate(bitrate: string): FfmpegCommand;
    audioBitrate(bitrate: string): FfmpegCommand;
    setStartTime(time: number): FfmpegCommand;
    setDuration(duration: number): FfmpegCommand;
    on(event: 'start' | 'progress' | 'end' | 'error', callback: (err?: Error) => void): FfmpegCommand;
    save(output: string): void;
  }

  interface FfprobeStream {
    codec_type?: string;
    width?: number;
    height?: number;
    r_frame_rate?: string;
  }

  interface FfprobeFormat {
    duration?: number;
    format_name?: string;
    bit_rate?: string;
  }

  interface FfprobeData {
    streams: FfprobeStream[];
    format: FfprobeFormat;
  }

  interface Ffmpeg {
    (input?: string | Stream): FfmpegCommand;
    ffprobe(file: string, callback: (err: Error | null, data: FfprobeData) => void): void;
  }

  const ffmpeg: Ffmpeg;
  export = ffmpeg;
}