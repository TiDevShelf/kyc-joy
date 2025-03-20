
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import gridlinesApi from '@/services/gridlinesApi';

interface BankVerificationProps {
  onComplete: (data: any) => void;
  onStatusChange: (status: { message: string; status: 'idle' | 'loading' | 'success' | 'error' | 'warning' }) => void;
}

const BankVerification: React.FC<BankVerificationProps> = ({ 
  onComplete, 
  onStatusChange 
}) => {
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [ifsc, setIfsc] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Validation
  const isAccountNumberValid = accountNumber.length >= 8 && /^\d+$/.test(accountNumber);
  const isIFSCValid = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
  const isFormValid = isAccountNumberValid && isIFSCValid;

  // Handle input changes
  const handleAccountNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) { // Only allow digits
      setAccountNumber(value);
    }
  };

  const handleIFSCChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toUpperCase();
    setIfsc(value);
  };

  // Verify Bank Account
  const handleVerifyBank = async () => {
    if (!isFormValid) return;
    
    setIsLoading(true);
    onStatusChange({ message: 'Verifying bank account...', status: 'loading' });

    try {
      const response = await gridlinesApi.verifyBankAccount(accountNumber, ifsc);
      
      if (response.success) {
        onStatusChange({ message: 'Bank account verified successfully!', status: 'success' });
        
        // Pass verification data to parent
        onComplete({
          accountNumber,
          ifsc,
          ...response.data
        });
      } else {
        onStatusChange({ message: response.message || 'Bank account verification failed', status: 'error' });
      }
    } catch (error) {
      console.error('Error verifying bank account:', error);
      onStatusChange({ message: 'Error verifying bank account. Please try again.', status: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">Bank Account Verification</h2>
        <p className="text-sm text-muted-foreground">
          Enter your bank account details to verify.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="account-number">Account Number</Label>
          <Input
            id="account-number"
            placeholder="e.g., 12345678901234"
            value={accountNumber}
            onChange={handleAccountNumberChange}
            disabled={isLoading}
          />
          {accountNumber && !isAccountNumberValid && (
            <p className="text-xs text-red-500">
              Please enter a valid account number (minimum 8 digits).
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ifsc">IFSC Code</Label>
          <Input
            id="ifsc"
            placeholder="e.g., SBIN0123456"
            value={ifsc}
            onChange={handleIFSCChange}
            maxLength={11}
            className="uppercase"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            IFSC format: 4 letters, followed by 0, ending with 6 alphanumeric characters.
          </p>
          {ifsc && !isIFSCValid && (
            <p className="text-xs text-red-500">
              Please enter a valid IFSC code (e.g., SBIN0123456).
            </p>
          )}
        </div>

        <Button 
          onClick={handleVerifyBank} 
          disabled={!isFormValid || isLoading}
          className="w-full"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Verify Bank Account
        </Button>
      </div>
    </div>
  );
};

export default BankVerification;
