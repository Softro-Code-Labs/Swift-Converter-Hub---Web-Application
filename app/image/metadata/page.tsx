import { Metadata } from 'next';
import { FileSearch, MapPin, Camera, Shield } from 'lucide-react';
import MetadataTool from '@/features/image/metadata/components';
import {
  InfoCardGrid,
  TechnicalNote,
  FaqAccordion,
  ToolPageHeader,
} from '@/features/image/shared/components/page-sections';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
  faqPageJsonLd,
} from '@/components/seo/JsonLd';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/image/metadata',
  title: 'EXIF Viewer - See Photo Metadata & GPS Location',
  description:
    'View EXIF data in photos: camera, lens, ISO, shutter speed, date taken and GPS location on a map. Export to JSON. Free and private - nothing is uploaded.',
  keywords: [
    'exif viewer online',
    'photo metadata viewer',
    'image exif extractor free',
    'view jpeg exif data',
    'browser based exif reader',
    'online image metadata extractor',
    'gps location from photo',
    'check photo gps data',
    'remove exif data online',
    'photo location metadata viewer',
    'camera settings from photo',
    'jpeg exif data extractor',
  ],
});

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
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Image Studio', path: '/image' },
            { name: 'EXIF Metadata Viewer', path: '/image/metadata' },
          ]),
          softwareApplicationJsonLd({
            name: 'EXIF Metadata Viewer',
            description:
              'View camera settings, GPS location, and embedded metadata from your photos, entirely in your browser.',
            path: '/image/metadata',
            category: 'MultimediaApplication',
          }),
          faqPageJsonLd(METADATA_FAQS),
        ]}
      />
      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Image Studio', path: '/image' },
          { name: 'EXIF Metadata Viewer', path: '/image/metadata' },
        ]}
        title={'EXIF Metadata Viewer'}
        description={
          "See exactly what's hidden in your photos - camera model, exposure settings, date taken, and GPS location - without uploading anything anywhere."
        }
        features={FEATURES}
      />

      <div className="@container px-5 py-6 sm:px-8 sm:py-8">
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
