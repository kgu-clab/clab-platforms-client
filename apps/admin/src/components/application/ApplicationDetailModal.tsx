import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/common/Dialog';

import type { ApplicationListItem } from '@/api/application/api.model';

interface ApplicationDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ApplicationListItem | null;
}

const detailFields: { key: keyof ApplicationListItem; label: string }[] = [
  { key: 'birth', label: '생년월일' },
  { key: 'address', label: '주소' },
  { key: 'interests', label: '관심 분야' },
  { key: 'otherActivities', label: '기타 활동' },
  { key: 'githubUrl', label: 'GitHub URL' },
];

export function ApplicationDetailModal({ open, onOpenChange, item }: ApplicationDetailModalProps) {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item.name} 지원 상세</DialogTitle>
        </DialogHeader>
        <dl className="mt-4 space-y-4">
          {detailFields.map(({ key, label }) => {
            const value = item[key];
            const displayValue =
              typeof value === 'string' && value.startsWith('http') ? value : String(value ?? '-');

            return (
              <div key={key} className="border-b border-border pb-3 last:border-0">
                <dt className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wide">
                  {label}
                </dt>
                <dd className="text-sm">
                  {key === 'githubUrl' && displayValue !== '-' ? (
                    <a
                      href={displayValue}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {displayValue}
                    </a>
                  ) : (
                    <span className="whitespace-pre-wrap break-words">{displayValue}</span>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </DialogContent>
    </Dialog>
  );
}
