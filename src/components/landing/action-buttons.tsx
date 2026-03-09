'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, FileText } from 'lucide-react';

interface ActionButtonsProps {
  onChatClick: () => void;
  onResumeDownload: () => void;
  className?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onChatClick,
  onResumeDownload,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row",
        className
      )}
    >
      <Button
        onClick={onChatClick}
        size="lg"
        className="group transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: 'var(--ai-gradient)',
          color: '#ffffff',
        }}
      >
        Explore my work
        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Button>
      <Button onClick={onResumeDownload} size="lg" variant="outline" className="card-hover">
        <FileText className="mr-1 h-4 w-4" />
        Open resume
      </Button>
    </div>
  );
};

export default ActionButtons;