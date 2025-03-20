
import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type VerificationStatusType = 'idle' | 'loading' | 'success' | 'error' | 'warning';

interface VerificationStatusProps {
  status: VerificationStatusType;
  message: string;
  className?: string;
}

const VerificationStatus: React.FC<VerificationStatusProps> = ({ 
  status, 
  message,
  className 
}) => {
  const iconMap = {
    idle: null,
    loading: <Loader2 className="h-5 w-5 animate-spin text-kyc-blue" />,
    success: <CheckCircle className="h-5 w-5 text-kyc-success" />,
    error: <XCircle className="h-5 w-5 text-kyc-error" />,
    warning: <AlertCircle className="h-5 w-5 text-kyc-warning" />
  };

  const bgColorMap = {
    idle: 'bg-transparent',
    loading: 'bg-kyc-blue/10',
    success: 'bg-kyc-success/10',
    error: 'bg-kyc-error/10',
    warning: 'bg-kyc-warning/10'
  };

  const textColorMap = {
    idle: 'text-secondary-foreground',
    loading: 'text-kyc-blue',
    success: 'text-kyc-success',
    error: 'text-kyc-error',
    warning: 'text-kyc-warning'
  };

  // If idle and no message, don't render anything
  if (status === 'idle' && !message) return null;

  return (
    <div 
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium animate-slide-up',
        bgColorMap[status],
        className
      )}
    >
      {iconMap[status]}
      <span className={textColorMap[status]}>{message}</span>
    </div>
  );
};

export default VerificationStatus;
