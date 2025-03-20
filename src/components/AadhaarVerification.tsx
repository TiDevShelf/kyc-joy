
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Loader2 } from 'lucide-react';
import gridlinesApi from '@/services/gridlinesApi';

interface AadhaarVerificationProps {
  onComplete: (data: any) => void;
  onStatusChange: (status: { message: string; status: 'idle' | 'loading' | 'success' | 'error' | 'warning' }) => void;
}

const AadhaarVerification: React.FC<AadhaarVerificationProps> = ({ onComplete, onStatusChange }) => {
  const [aadhaarNumber, setAadhaarNumber] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [txnId, setTxnId] = useState<string>('');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Validation
  const isAadhaarValid = aadhaarNumber.length === 12 && /^\d+$/.test(aadhaarNumber);
  const isOtpValid = otp.length === 6 && /^\d+$/.test(otp);

  // Handle Aadhaar input change
  const handleAadhaarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '').slice(0, 12);
    setAadhaarNumber(value);
  };

  // Generate OTP
  const handleGenerateOTP = async () => {
    if (!isAadhaarValid) return;
    
    setIsLoading(true);
    onStatusChange({ message: 'Sending OTP...', status: 'loading' });

    try {
      const response = await gridlinesApi.generateAadhaarOTP(aadhaarNumber);
      
      if (response.success) {
        setTxnId(response.txnId);
        setStep('otp');
        onStatusChange({ message: response.message, status: 'success' });
      } else {
        onStatusChange({ message: response.message || 'Failed to send OTP', status: 'error' });
      }
    } catch (error) {
      console.error('Error generating OTP:', error);
      onStatusChange({ message: 'Error sending OTP. Please try again.', status: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!isOtpValid) return;
    
    setIsLoading(true);
    onStatusChange({ message: 'Verifying OTP...', status: 'loading' });

    try {
      const response = await gridlinesApi.verifyAadhaarOTP(aadhaarNumber, otp, txnId);
      
      if (response.success) {
        onStatusChange({ message: 'Aadhaar verified successfully!', status: 'success' });
        // Pass verification data to parent
        onComplete({
          number: aadhaarNumber,
          ...response.data
        });
      } else {
        onStatusChange({ message: response.message || 'OTP verification failed', status: 'error' });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      onStatusChange({ message: 'Error verifying OTP. Please try again.', status: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Back to Aadhaar input
  const handleGoBack = () => {
    setStep('input');
    setOtp('');
    onStatusChange({ message: '', status: 'idle' });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">Aadhaar Verification</h2>
        <p className="text-sm text-muted-foreground">
          Enter your 12-digit Aadhaar number to verify your identity.
        </p>
      </div>

      {step === 'input' ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="aadhaar-number">Aadhaar Number</Label>
            <Input
              id="aadhaar-number"
              placeholder="Enter 12-digit Aadhaar number"
              value={aadhaarNumber}
              onChange={handleAadhaarChange}
              maxLength={12}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Enter your 12-digit Aadhaar number without spaces.
            </p>
          </div>

          <Button 
            onClick={handleGenerateOTP} 
            disabled={!isAadhaarValid || isLoading}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate OTP
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Enter OTP</Label>
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit OTP sent to your registered mobile number.
            </p>
            
            <div className="flex justify-center py-4">
              <InputOTP
                value={otp}
                onChange={setOtp}
                maxLength={6}
                disabled={isLoading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleGoBack}
              disabled={isLoading}
              className="flex-1"
            >
              Back
            </Button>
            <Button 
              onClick={handleVerifyOTP} 
              disabled={!isOtpValid || isLoading}
              className="flex-1"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AadhaarVerification;
