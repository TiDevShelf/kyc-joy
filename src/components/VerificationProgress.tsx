
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, CircleDot, Circle } from 'lucide-react';

export type VerificationStep = 'aadhaar' | 'pan' | 'bank';

interface VerificationProgressProps {
  currentStep: VerificationStep;
  completedSteps: VerificationStep[];
  className?: string;
  onStepClick?: (step: VerificationStep) => void;
}

const VerificationProgress: React.FC<VerificationProgressProps> = ({
  currentStep,
  completedSteps,
  className,
  onStepClick
}) => {
  const steps: { id: VerificationStep; label: string }[] = [
    { id: 'aadhaar', label: 'Aadhaar' },
    { id: 'pan', label: 'PAN' },
    { id: 'bank', label: 'Bank Account' }
  ];

  return (
    <div className={cn('w-full flex items-center justify-between', className)}>
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = currentStep === step.id;
        const isPending = !isCompleted && !isCurrent;
        
        // Determine the status indicator and styles
        const StepIcon = isCompleted 
          ? CheckCircle 
          : isCurrent ? CircleDot : Circle;
        
        const stepTextClass = cn(
          'text-sm font-medium transition-colors',
          isCompleted && 'text-kyc-blue',
          isCurrent && 'text-foreground',
          isPending && 'text-muted-foreground'
        );

        const iconClass = cn(
          'w-5 h-5 transition-colors',
          isCompleted && 'text-kyc-blue',
          isCurrent && 'text-kyc-blue',
          isPending && 'text-muted-foreground'
        );

        const stepClass = cn(
          'flex flex-col items-center gap-2 z-10',
          'transition-all duration-300',
          (isCompleted || isCurrent) && 'scale-105',
          onStepClick && 'cursor-pointer hover:opacity-80'
        );

        const handleClick = () => {
          if (onStepClick) {
            onStepClick(step.id);
          }
        };

        return (
          <React.Fragment key={step.id}>
            <div 
              className={stepClass} 
              onClick={handleClick}
            >
              <StepIcon className={iconClass} />
              <span className={stepTextClass}>{step.label}</span>
            </div>
            
            {/* Connector line between steps */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2 h-[2px] bg-muted relative">
                <div
                  className="absolute top-0 left-0 h-full bg-kyc-blue transition-all duration-300"
                  style={{ 
                    width: isCompleted ? '100%' : '0%' 
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default VerificationProgress;
