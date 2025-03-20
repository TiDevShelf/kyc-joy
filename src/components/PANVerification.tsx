
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import gridlinesApi from '@/services/gridlinesApi';

interface PANVerificationProps {
  onComplete: (data: any) => void;
  onStatusChange: (status: { message: string; status: 'idle' | 'loading' | 'success' | 'error' | 'warning' }) => void;
  aadhaarData: {
    verified: boolean;
    number: string;
    name: string;
    dob: string;
    gender: string;
  };
}

const PANVerification: React.FC<PANVerificationProps> = ({ 
  onComplete, 
  onStatusChange,
  aadhaarData 
}) => {
  const [panNumber, setPanNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Validation
  const isPanValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber);

  // Handle PAN input change
  const handlePanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toUpperCase();
    setPanNumber(value);
  };

  // Verify PAN
  const handleVerifyPAN = async () => {
    if (!isPanValid) return;
    
    setIsLoading(true);
    onStatusChange({ message: 'Verifying PAN...', status: 'loading' });

    try {
      // Pass Aadhaar number for cross-verification if available
      const response = await gridlinesApi.verifyPAN(panNumber, aadhaarData.verified ? aadhaarData.number : undefined);
      
      if (response.success) {
        onStatusChange({ message: 'PAN verified successfully!', status: 'success' });
        
        // Name match check between Aadhaar and PAN (simple example)
        const nameMatch = aadhaarData.verified && 
          aadhaarData.name.toLowerCase() === response.data.name.toLowerCase();
        
        if (aadhaarData.verified && !nameMatch) {
          onStatusChange({ 
            message: 'Warning: Name in PAN does not match with Aadhaar record', 
            status: 'warning' 
          });
        }
        
        // Pass verification data to parent
        onComplete({
          number: panNumber,
          ...response.data
        });
      } else {
        onStatusChange({ message: response.message || 'PAN verification failed', status: 'error' });
      }
    } catch (error) {
      console.error('Error verifying PAN:', error);
      onStatusChange({ message: 'Error verifying PAN. Please try again.', status: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">PAN Verification</h2>
        <p className="text-sm text-muted-foreground">
          Enter your 10-character PAN (Permanent Account Number) to verify.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pan-number">PAN Number</Label>
          <Input
            id="pan-number"
            placeholder="e.g., ABCDE1234F"
            value={panNumber}
            onChange={handlePanChange}
            maxLength={10}
            disabled={isLoading}
            className="uppercase"
          />
          <p className="text-xs text-muted-foreground">
            PAN format: 5 letters, followed by 4 numbers, ending with 1 letter.
          </p>
        </div>

        <Button 
          onClick={handleVerifyPAN} 
          disabled={!isPanValid || isLoading}
          className="w-full"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Verify PAN
        </Button>
      </div>
    </div>
  );
};

export default PANVerification;
