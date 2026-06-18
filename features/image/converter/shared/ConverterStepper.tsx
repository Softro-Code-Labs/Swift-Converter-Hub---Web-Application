import { Upload, Cpu, Download } from 'lucide-react';

interface StepData {
  title: string;
  desc: string;
}

interface ConverterStepperProps {
  headingTitle?: string;
  stepOne?: StepData;
  stepTwo?: StepData;
  stepThree?: StepData;
}

const STEP_ICONS = [Upload, Cpu, Download];
const STEP_COLORS = [
  {
    bg: 'bg-blue-100 dark:bg-blue-950/60',
    text: 'text-blue-600 dark:text-blue-400',
    num: 'bg-blue-600 text-white',
    connector: 'bg-blue-200 dark:bg-blue-900/50',
  },
  {
    bg: 'bg-purple-100 dark:bg-purple-950/60',
    text: 'text-purple-600 dark:text-purple-400',
    num: 'bg-purple-600 text-white',
    connector: 'bg-purple-200 dark:bg-purple-900/50',
  },
  {
    bg: 'bg-emerald-100 dark:bg-emerald-950/60',
    text: 'text-emerald-600 dark:text-emerald-400',
    num: 'bg-emerald-600 text-white',
    connector: '',
  },
];

export default function ConverterStepper({
  headingTitle = 'How it works',
  stepOne,
  stepTwo,
  stepThree,
}: ConverterStepperProps) {
  const steps = [
    {
      title: stepOne?.title || 'Upload files',
      desc:
        stepOne?.desc ||
        'Drag and drop or browse local files from your device.',
    },
    {
      title: stepTwo?.title || 'Browser processing',
      desc:
        stepTwo?.desc ||
        'Files are converted locally using WebAssembly — nothing uploaded.',
    },
    {
      title: stepThree?.title || 'Download instantly',
      desc:
        stepThree?.desc ||
        'Save files individually or as a grouped ZIP bundle.',
    },
  ];

  return (
    <section className="rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 p-6">
      <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
        <span className="w-1 h-4 rounded-full bg-blue-500 inline-block" />
        {headingTitle}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {/* Connector line — desktop only */}
        <div className="hidden md:block absolute top-5 left-[calc(16.67%+16px)] right-[calc(16.67%+16px)] h-px bg-slate-200 dark:bg-slate-700 z-0" />

        {steps.map((step, i) => {
          const Icon = STEP_ICONS[i];
          const color = STEP_COLORS[i];
          return (
            <div
              key={i}
              className="relative z-10 flex flex-col items-center text-center sm:flex-row sm:text-left md:flex-col md:text-center gap-4"
            >
              {/* Mobile connector */}
              {i < 2 && (
                <div className="md:hidden absolute left-5 top-10 w-px h-full bg-slate-200 dark:bg-slate-700 sm:hidden" />
              )}

              <div className="relative shrink-0">
                {/* Step number badge */}
                <div
                  className={`w-10 h-10 rounded-xl ${color.bg} ${color.text} flex items-center justify-center`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${color.num}`}
                >
                  {i + 1}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[180px] md:max-w-none mx-auto">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
