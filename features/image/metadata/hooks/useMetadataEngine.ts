import { useState, useCallback } from 'react';
import { ImageMagick } from '@imagemagick/magick-wasm';
import {
  ImageMetadataResult,
  MetadataCategory,
  ExifField,
  GpsCoordinates,
  formatBytes,
} from '../types/metadata';
import toast from 'react-hot-toast';

// Friendly labels for common EXIF tags - ImageMagick exposes raw EXIF keys
// like "exif:Make", we map the most useful ones to readable labels.
const FRIENDLY_LABELS: Record<string, string> = {
  'exif:Make': 'Camera Make',
  'exif:Model': 'Camera Model',
  'exif:LensModel': 'Lens',
  'exif:DateTime': 'Date Taken',
  'exif:DateTimeOriginal': 'Date Original',
  'exif:ExposureTime': 'Exposure Time',
  'exif:FNumber': 'Aperture (f/)',
  'exif:ISOSpeedRatings': 'ISO',
  'exif:FocalLength': 'Focal Length',
  'exif:FocalLengthIn35mmFilm': 'Focal Length (35mm equiv)',
  'exif:Flash': 'Flash',
  'exif:WhiteBalance': 'White Balance',
  'exif:ExposureMode': 'Exposure Mode',
  'exif:MeteringMode': 'Metering Mode',
  'exif:Orientation': 'Orientation',
  'exif:Software': 'Software',
  'exif:Artist': 'Artist',
  'exif:Copyright': 'Copyright',
  'exif:ImageDescription': 'Description',
  'exif:ColorSpace': 'Color Space',
  'exif:GPSLatitude': 'GPS Latitude',
  'exif:GPSLongitude': 'GPS Longitude',
  'exif:GPSAltitude': 'GPS Altitude',
  'exif:GPSDateStamp': 'GPS Date',
  'exif:ExifVersion': 'EXIF Version',
  'exif:PixelXDimension': 'Pixel Width',
  'exif:PixelYDimension': 'Pixel Height',
};

const CAMERA_KEYS = [
  'exif:Make',
  'exif:Model',
  'exif:LensModel',
  'exif:Software',
];
const SHOOTING_KEYS = [
  'exif:ExposureTime',
  'exif:FNumber',
  'exif:ISOSpeedRatings',
  'exif:FocalLength',
  'exif:FocalLengthIn35mmFilm',
  'exif:Flash',
  'exif:WhiteBalance',
  'exif:ExposureMode',
  'exif:MeteringMode',
];
const DATE_KEYS = [
  'exif:DateTime',
  'exif:DateTimeOriginal',
  'exif:GPSDateStamp',
];
const FILE_KEYS = [
  'exif:Orientation',
  'exif:ColorSpace',
  'exif:PixelXDimension',
  'exif:PixelYDimension',
  'exif:ExifVersion',
];
const OWNER_KEYS = ['exif:Artist', 'exif:Copyright', 'exif:ImageDescription'];
const GPS_KEYS = ['exif:GPSLatitude', 'exif:GPSLongitude', 'exif:GPSAltitude'];

const dmsToDecimal = (dms: string, ref: string): number | null => {
  // EXIF GPS values often come as "DD/1, MM/1, SS/100" or decimal already
  try {
    const parts = dms.split(',').map((p) => {
      const [num, den] = p.trim().split('/').map(Number);
      return den ? num / den : num;
    });
    if (parts.length < 3) return parseFloat(dms) || null;
    const [deg, min, sec] = parts;
    let decimal = deg + min / 60 + sec / 3600;
    if (ref === 'S' || ref === 'W') decimal *= -1;
    return decimal;
  } catch {
    return null;
  }
};

export const useMetadataEngine = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ImageMetadataResult | null>(null);

  const extractMetadata = useCallback(async (file: File) => {
    setIsProcessing(true);
    setResult(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer.slice(0));

      await new Promise<void>((resolve, reject) => {
        try {
          ImageMagick.read(uint8Array, (image) => {
            const allAttributes: Record<string, string> = {};

            // ImageMagick exposes profile/attribute keys via getAttribute
            // We iterate over known relevant keys since the WASM build
            // doesn't expose a full attribute-list iterator in all versions
            const allKeys = Object.keys(FRIENDLY_LABELS);
            allKeys.forEach((key) => {
              try {
                const val = image.getAttribute(key);
                if (val && val.trim()) allAttributes[key] = val.trim();
              } catch {
                // attribute not present - skip
              }
            });

            const buildFields = (keys: string[]): ExifField[] =>
              keys
                .filter((k) => allAttributes[k])
                .map((k) => ({
                  key: k,
                  label: FRIENDLY_LABELS[k] ?? k,
                  value: allAttributes[k],
                }));

            const categories: MetadataCategory[] = [
              {
                id: 'camera',
                title: 'Camera',
                icon: 'camera',
                fields: buildFields(CAMERA_KEYS),
              },
              {
                id: 'shooting',
                title: 'Shooting Info',
                icon: 'aperture',
                fields: buildFields(SHOOTING_KEYS),
              },
              {
                id: 'date',
                title: 'Date & Time',
                icon: 'calendar',
                fields: buildFields(DATE_KEYS),
              },
              {
                id: 'file',
                title: 'File Info',
                icon: 'file',
                fields: buildFields(FILE_KEYS),
              },
              {
                id: 'owner',
                title: 'Ownership',
                icon: 'user',
                fields: buildFields(OWNER_KEYS),
              },
            ].filter((cat) => cat.fields.length > 0);

            // GPS extraction
            let gps: GpsCoordinates | null = null;
            const lat = allAttributes['exif:GPSLatitude'];
            const lon = allAttributes['exif:GPSLongitude'];
            const latRef = image.getAttribute('exif:GPSLatitudeRef') ?? 'N';
            const lonRef = image.getAttribute('exif:GPSLongitudeRef') ?? 'E';

            if (lat && lon) {
              const latitude = dmsToDecimal(lat, latRef);
              const longitude = dmsToDecimal(lon, lonRef);
              if (latitude !== null && longitude !== null) {
                const altStr = allAttributes['exif:GPSAltitude'];
                let altitude: number | undefined;
                if (altStr) {
                  const [num, den] = altStr.split('/').map(Number);
                  altitude = den ? num / den : num;
                }
                gps = { latitude, longitude, altitude };
              }
            }

            setResult({
              fileName: file.name,
              fileSize: formatBytes(file.size),
              dimensions: { width: image.width, height: image.height },
              format: image.format.toString(),
              categories,
              gps,
              hasExif: categories.length > 0,
              rawCount: Object.keys(allAttributes).length,
            });

            resolve();
          });
        } catch (err) {
          reject(err);
        }
      });

      toast.success('Metadata extracted!');
    } catch (err) {
      console.error('Metadata extraction failed:', err);
      toast.error('Could not read metadata from this file.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearResult = useCallback(() => setResult(null), []);

  return { isProcessing, result, extractMetadata, clearResult };
};
