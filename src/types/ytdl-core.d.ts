declare module "ytdl-core" {
  import { Readable } from "stream";

  interface VideoFormat {
    itag: number;
    url: string;
    mimeType?: string;
    bitrate?: number;
    audioBitrate?: number;
    width?: number;
    height?: number;
    lastModified: string;
    contentLength: string;
    quality: string;
    qualityLabel?: string;
    projectionType: string;
    averageBitrate: number;
    audioQuality?: string;
    approxDurationMs: string;
    audioSampleRate?: string;
    audioChannels?: number;
    container: string;
    hasVideo: boolean;
    hasAudio: boolean;
    codecs: string;
    videoCodec?: string;
    audioCodec?: string;
  }

  interface VideoDetails {
    videoId: string;
    title: string;
    description: string;
    lengthSeconds: string;
    author: {
      id: string;
      name: string;
      user: string;
      channel_url: string;
      user_url: string;
      subscriber_count: number;
      verified: boolean;
    };
    thumbnails: {
      url: string;
      width: number;
      height: number;
    }[];
    video_url: string;
    storyboards: any[];
    chapters: any[];
    likes: number;
    dislikes: number;
    age_restricted: boolean;
    video_url: string;
    channel_url: string;
    publishDate: string;
    uploadDate: string;
    keywords: string[];
    viewCount: number;
    category: string;
    isLiveContent: boolean;
    isPrivate: boolean;
    isUnpluggedCorpus: boolean;
    availableCountries: string[];
  }

  interface VideoInfo {
    formats: VideoFormat[];
    videoDetails: VideoDetails;
  }

  interface DownloadOptions {
    quality?: string | number;
    filter?: string | ((format: VideoFormat) => boolean);
    format?: VideoFormat;
    range?: {
      start?: number;
      end?: number;
    };
    begin?: string | number | Date;
    liveBuffer?: number;
    requestOptions?: any;
    highWaterMark?: number;
    dlChunkSize?: number;
    IPv6Block?: string;
  }

  interface validateURLOptions {
    loose?: boolean;
  }

  interface getInfoOptions {
    requestOptions?: any;
    lang?: string;
  }

  interface chooseFormatOptions {
    quality?: string | number;
    filter?: string | ((format: VideoFormat) => boolean);
    format?: VideoFormat;
  }

  function validateURL(url: string, options?: validateURLOptions): boolean;
  function getURLVideoID(url: string, options?: validateURLOptions): string;
  function getInfo(url: string, options?: getInfoOptions): Promise<VideoInfo>;
  function downloadFromInfo(info: VideoInfo, options?: DownloadOptions): Readable;
  function chooseFormat(formats: VideoFormat[], options?: chooseFormatOptions): VideoFormat;
  function filterFormats(formats: VideoFormat[], filter: string | ((format: VideoFormat) => boolean)): VideoFormat[];
  
  function download(url: string, options?: DownloadOptions): Readable;

  export {
    validateURL,
    getURLVideoID,
    getInfo,
    downloadFromInfo,
    chooseFormat,
    filterFormats,
    download,
    VideoFormat,
    VideoDetails,
    VideoInfo,
    DownloadOptions,
  };

  export default download;
}