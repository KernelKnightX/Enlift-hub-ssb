import { useEffect, useState } from 'react';
import { FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { PsychTestModuleConfig } from '@/data/psychTestModules';
import { setPsychBriefingAck } from '@/lib/psychBriefingStorage';

type Props = {
  module: PsychTestModuleConfig;
  open: boolean;
  onClose: () => void;
};

type Section = { title: string; lines: string[] };

function buildSections(module: PsychTestModuleConfig): Section[] {
  return [
    {
      title: 'Important notice',
      lines: [module.noticeLead],
    },
    {
      title: 'During the test',
      lines: module.rules,
    },
    {
      title: 'Guidance for candidates',
      lines: [module.tip, ...module.keyPoints.slice(0, 2)],
    },
  ];
}

export function PsychInstructionsDialog({ module, open, onClose }: Props) {
  const sections = buildSections(module);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (open) setStep(0);
  }, [open, module.id]);

  const section = sections[step];
  const last = step >= sections.length - 1;

  const closeAndAck = () => {
    setPsychBriefingAck(module.id);
    setStep(0);
    onClose();
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) closeAndAck();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[min(92dvh,640px)] flex-col gap-0 overflow-hidden border-slate-200 p-0 sm:max-w-lg">
        <div className="h-1 shrink-0" style={{ background: module.primary }} />
        <DialogHeader className="space-y-1 border-b border-slate-100 px-4 pb-3 pt-4 text-left">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 shrink-0 text-slate-600" />
              <div>
                <DialogTitle className="text-base font-semibold text-slate-900">
                  {module.code} — Test instructions
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-600">{module.title}</DialogDescription>
              </div>
            </div>
            <button
              type="button"
              onClick={closeAndAck}
              className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-[11px] font-medium text-slate-500">
            Section {step + 1} of {sections.length}
          </p>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">{section.title}</h3>
          <ul className="space-y-2 text-sm leading-relaxed text-slate-700">
            {section.lines.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            {module.setStatChips.map((chip) => (
              <span
                key={chip.label}
                className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700"
              >
                {chip.label}: {chip.value}
              </span>
            ))}
          </div>
        </div>

        <DialogFooter className="flex-row gap-2 border-t border-slate-100 bg-slate-50/80 px-4 py-3 sm:justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
          >
            Previous
          </Button>
          <Button
            type="button"
            size="sm"
            className="text-white"
            style={{ background: module.primary }}
            onClick={() => {
              if (last) closeAndAck();
              else setStep((s) => s + 1);
            }}
          >
            {last ? 'I have read the instructions' : 'Next section'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
