declare module 'heic-convert' {
  interface ConvertOptions {
    buffer: ArrayBuffer;
    format: 'JPEG' | 'PNG';
    quality?: number;
  }

  interface EncodeOptions {
    width: number;
    height: number;
    data: Uint8ClampedArray;
    quality?: number;
  }

  function heicConvert(options: ConvertOptions): Promise<ArrayBuffer>;
  export function encode(options: EncodeOptions): Promise<ArrayBuffer>;

  export = heicConvert;
}
