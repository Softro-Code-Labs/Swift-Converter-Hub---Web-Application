import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import Link from 'next/link';
import { FileSearch, MapPin, Camera, Shield } from 'lucide-react';
import MetadataTool from '@/features/image/metadata/components';
import {
  InfoCardGrid,
  TechnicalNote,
  FaqAccordion,
} from '@/features/image/shared/components/page-sections';

export const metadata: Metadata = {
  title: 'EXIF Metadata Viewer',
  description:
    'View camera settings, GPS location, and embedded metadata from your photos. See exposure, lens, and date info without uploading anything anywhere.',
  keywords: [
    // Original core viewing & extraction keywords
    'exif viewer online',
    'photo metadata viewer',
    'image exif extractor free',
    'view jpeg exif data',
    'browser based exif reader',
    'online image metadata extractor',

    // GPS & location tracking keywords
    'gps location from photo',
    'check photo gps data',
    'extract coordinates from image',
    'find map location of picture',
    'photo geolocation finder free',

    // Camera & photography mechanics
    'camera settings viewer online',
    'read camera data from photo',
    'view shutter speed and iso online',
    'lens information lookup tool',
    'check original photo capture date',

    // Security, privacy, & utility tags
    'remove or view exif metadata',
    'free exif data tool',
    'no upload photo metadata reader',
    'secure private exif analyzer',

    // Long-tail file format targets
    'raw file metadata viewer online',
    'read tiff exif tags browser',
    'png chunk metadata analyzer',
    'heic metadata viewer online',
    'webp image profile reader',
    'dng file camera settings lookup',

    // Digital forensics, security, & OSINT markers
    'osint photo investigator online',
    'check if image has hidden tracking',
    'photo forensic analyzer free',
    'image profile inspector browser',
    'verify image modification date',
    'detect edited photo metadata',

    // Advanced photography attributes
    'view focal length from image online',
    'check aperture settings of photo',
    'read exposure bias from exif tag',
    'flash firing status photo viewer',
    'camera sensor serial number finder',
    'color space profile srgb checker',
    'icc profile extractor online',

    // Software & Device specific tracking queries
    'view lightroom metadata online',
    'iphone photo details inspector',
    'check android picture resolution info',
    'photoshop metadata tag parser',
    'view drone image altitude coordinates',

    // Client-side and engineering properties
    'pure javascript exif reader tool',
    'client side metadata parser html5',
    'zero tracking image header analyzer',
    'local file binary stream inspector',
    'wasm accelerated exif decoder browser',
  ],
  alternates: { canonical: `${SITE_URL}/image/metadata` },
  openGraph: {
    title: 'EXIF Metadata Viewer - Free Online Photo Info Tool | Image Studio',
    description:
      'See camera, GPS and exposure data hidden in your photos, fully private.',
    url: `${SITE_URL}/image/metadata`,
    type: 'website',
  },
};

const FEATURES = [
  {
    icon: Camera,
    label: 'Camera details',
    desc: 'Make, model, lens & settings',
  },
  { icon: MapPin, label: 'GPS location', desc: 'Map preview with coordinates' },
  {
    icon: FileSearch,
    label: 'Full EXIF dump',
    desc: 'Export raw data as JSON',
  },
  {
    icon: Shield,
    label: '100% private',
    desc: 'Files never leave your browser',
  },
];

const WHY_CHECK = [
  {
    title: 'Privacy check',
    desc: 'See if GPS location is embedded before sharing online.',
  },
  {
    title: 'Photo credit',
    desc: 'Verify camera settings and copyright info for portfolios.',
  },
  {
    title: 'Troubleshooting',
    desc: 'Check capture settings to understand exposure issues.',
  },
];

const DATA_CATEGORIES = [
  { title: 'Camera', desc: 'Make, model, lens, firmware/software version' },
  {
    title: 'Shooting settings',
    desc: 'Aperture, shutter speed, ISO, focal length, flash, white balance',
  },
  { title: 'Date & time', desc: 'Original capture date, GPS timestamp' },
  {
    title: 'Location',
    desc: 'GPS latitude, longitude, altitude with map preview',
  },
  {
    title: 'File info',
    desc: 'Pixel dimensions, color space, orientation, EXIF version',
  },
  { title: 'Ownership', desc: 'Artist name, copyright notice, description' },
];

const METADATA_FAQS = [
  {
    q: 'Why does my photo show "No EXIF metadata found"?',
    a: 'This usually means the photo was edited, screenshotted, or downloaded from a platform (like Instagram or WhatsApp) that strips metadata for privacy reasons before serving the file. PNG and GIF files also rarely carry EXIF data even straight from a camera.',
  },
  {
    q: 'Does this tool remove or edit the metadata?',
    a: "No - this is a read-only viewer. It extracts and displays the metadata already in your file but doesn't modify, store, or remove anything from the original.",
  },
  {
    q: 'Is my GPS location data sent anywhere?',
    a: 'No. The map preview uses a free OpenStreetMap embed that only receives the coordinates needed to render the map tile - your photo itself is never uploaded or transmitted.',
  },
  {
    q: "Why doesn't my screenshot have any metadata?",
    a: "Screenshots are typically generated fresh by the OS without camera EXIF data, since there's no physical camera or lens involved in capturing them.",
  },
  {
    q: 'Can I export the metadata for record-keeping?',
    a: 'Yes - click "Export JSON" to download all extracted fields as a structured JSON file you can archive or process elsewhere.',
  },
];

export default function MetadataPage() {
  return (
    <div className="space-y-0">
      <div className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800">
        <nav className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 mb-5">
          <Link
            href="/"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Home
          </Link>
          <span>›</span>
          <Link
            href="/image"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Image Studio
          </Link>
          <span>›</span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            EXIF Metadata Viewer
          </span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 text-xs font-black">
              METADATA
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              EXIF Metadata Viewer
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              See exactly what&apos;s hidden in your photos - camera model, exposure
              settings, date taken, and GPS location - without uploading
              anything anywhere.
            </p>
          </div>

          <div className="hidden sm:grid grid-cols-2 gap-2 shrink-0">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400"
              >
                <Icon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <MetadataTool />
      </div>

      <InfoCardGrid
        title="Why check your photo's metadata?"
        accentColor="bg-blue-500"
        columns="grid-cols-1 sm:grid-cols-3"
        variant="plain"
        cards={WHY_CHECK}
      />

      <InfoCardGrid
        title="What we can read from your photo"
        accentColor="bg-cyan-500"
        columns="grid-cols-1 sm:grid-cols-2"
        cards={DATA_CATEGORIES}
      />

      <TechnicalNote
        title="How GPS coordinates are decoded"
        accentColor="bg-emerald-500"
        paragraphs={[
          'Cameras store GPS data in a degrees/minutes/seconds (DMS) format inside the EXIF block - not as plain decimal coordinates. This tool converts that raw DMS data into standard decimal latitude and longitude, then renders it on an OpenStreetMap preview so you can see exactly where the photo was taken at a glance, without leaving the page.',
        ]}
      />

      <FaqAccordion
        title="Frequently asked questions"
        accentColor="bg-blue-500"
        items={METADATA_FAQS}
      />
    </div>
  );
}
