import { MapPin, ExternalLink } from 'lucide-react';
import { GpsCoordinates } from '../types/metadata';

export const MapPreview = ({ gps }: { gps: GpsCoordinates }) => {
  const mapUrl = `https://www.openstreetmap.org/?mlat=${gps.latitude}&mlon=${gps.longitude}#map=15/${gps.latitude}/${gps.longitude}`;
  // Static embed via OSM iframe - no API key needed
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${gps.longitude - 0.01}%2C${gps.latitude - 0.01}%2C${gps.longitude + 0.01}%2C${gps.latitude + 0.01}&layer=mapnik&marker=${gps.latitude}%2C${gps.longitude}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
          <MapPin className="w-3.5 h-3.5" />
        </div>
        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
          GPS Location Found
        </p>
      </div>

      <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800">
        <iframe
          src={embedUrl}
          className="w-full h-full border-0"
          title="GPS location"
          loading="lazy"
        />
      </div>

      <div className="px-4 py-3 space-y-2">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-[10px] text-slate-400 font-semibold">Latitude</p>
            <p className="font-bold text-slate-800 dark:text-slate-200">
              {gps.latitude.toFixed(6)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold">
              Longitude
            </p>
            <p className="font-bold text-slate-800 dark:text-slate-200">
              {gps.longitude.toFixed(6)}
            </p>
          </div>
        </div>
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all"
        >
          Open in OpenStreetMap <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
