
import { useState } from 'react';
import { 
  SidebarProvider,
  Sidebar, 
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle2, Shield } from 'lucide-react';
import VerificationProgress, { VerificationStep } from '@/components/VerificationProgress';
import VerificationStatus from '@/components/VerificationStatus';
import AadhaarVerification from '@/components/AadhaarVerification';
import PANVerification from '@/components/PANVerification';
import BankVerification from '@/components/BankVerification';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const Index = () => {
  // State for verification flow
  const [currentStep, setCurrentStep] = useState<VerificationStep>('aadhaar');
  const [completedSteps, setCompletedSteps] = useState<VerificationStep[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<{
    message: string;
    status: 'idle' | 'loading' | 'success' | 'error' | 'warning';
  }>({
    message: '',
    status: 'idle'
  });

  // State for verification data
  const [verificationData, setVerificationData] = useState({
    aadhaar: {
      verified: false,
      number: '',
      name: '',
      dob: '',
      gender: ''
    },
    pan: {
      verified: false,
      number: '',
      name: '',
      dob: ''
    },
    bank: {
      verified: false,
      accountNumber: '',
      ifsc: '',
      name: '',
      bankName: ''
    }
  });

  // Handle step completion
  const completeStep = (step: VerificationStep, data: any) => {
    // Update verification data
    setVerificationData(prev => ({
      ...prev,
      [step]: {
        ...prev[step],
        ...data,
        verified: true
      }
    }));

    // Mark step as completed
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step]);
    }

    // Set success message
    setVerificationStatus({
      message: `${step.charAt(0).toUpperCase() + step.slice(1)} verification successful!`,
      status: 'success'
    });
  };

  // Select verification type
  const selectVerificationType = (step: VerificationStep) => {
    setCurrentStep(step);
    // Reset status message when changing verification type
    setVerificationStatus({
      message: '',
      status: 'idle'
    });
  };

  // Check if all verifications are completed
  const isVerificationCompleted = completedSteps.length === 3;

  // Note about mock implementation
  const mockApiNote = (
    <Alert className="mb-4 bg-amber-50 border-amber-200">
      <Shield className="h-4 w-4 text-amber-500" />
      <AlertTitle>Mock Implementation</AlertTitle>
      <AlertDescription className="text-xs">
        This is a demonstration using mock APIs. For Aadhaar verification, any 6-digit OTP will work. 
        No actual SMS is sent to your registered mobile number.
      </AlertDescription>
    </Alert>
  );

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar variant="inset">
          <SidebarHeader className="border-b px-6 py-3">
            <h1 className="text-xl font-semibold text-foreground">KYC Verification</h1>
            <p className="text-sm text-muted-foreground">Complete your identity verification</p>
          </SidebarHeader>
          <SidebarContent className="px-6 py-4">
            <div className="space-y-6">
              <VerificationProgress 
                currentStep={currentStep} 
                completedSteps={completedSteps}
                onStepClick={selectVerificationType}
              />
              
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">Verification Steps:</h3>
                <ul className="space-y-1.5 text-sm">
                  <li 
                    className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => selectVerificationType('aadhaar')}
                  >
                    {completedSteps.includes('aadhaar') ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className={`h-4 w-4 rounded-full border ${currentStep === 'aadhaar' ? 'border-primary bg-primary/10' : 'border-gray-300'}`} />
                    )}
                    <span className={currentStep === 'aadhaar' ? 'font-medium' : ''}>Aadhaar Verification</span>
                  </li>
                  <li 
                    className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => selectVerificationType('pan')}
                  >
                    {completedSteps.includes('pan') ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className={`h-4 w-4 rounded-full border ${currentStep === 'pan' ? 'border-primary bg-primary/10' : 'border-gray-300'}`} />
                    )}
                    <span className={currentStep === 'pan' ? 'font-medium' : ''}>PAN Verification</span>
                  </li>
                  <li 
                    className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => selectVerificationType('bank')}
                  >
                    {completedSteps.includes('bank') ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className={`h-4 w-4 rounded-full border ${currentStep === 'bank' ? 'border-primary bg-primary/10' : 'border-gray-300'}`} />
                    )}
                    <span className={currentStep === 'bank' ? 'font-medium' : ''}>Bank Account Verification</span>
                  </li>
                </ul>
              </div>
            </div>
          </SidebarContent>
          <SidebarFooter className="border-t p-6">
            <p className="text-xs text-center text-muted-foreground">
              All data is securely processed and encrypted.
              <br />Powered by Gridlines API
            </p>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <div className="max-w-2xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold">KYC Verification</h1>
                <p className="text-muted-foreground mt-2">
                  {isVerificationCompleted 
                    ? 'All verification steps completed successfully!' 
                    : 'Complete all verification steps to validate your KYC'}
                </p>
              </div>

              {/* Mock API Notice */}
              {mockApiNote}

              {/* Verification Status Message */}
              {verificationStatus.message && (
                <VerificationStatus
                  status={verificationStatus.status}
                  message={verificationStatus.message}
                  className="mx-auto max-w-md"
                />
              )}

              {/* Verification Steps */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                {isVerificationCompleted ? (
                  <div className="text-center py-8 space-y-4">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                    <h2 className="text-xl font-semibold">Verification Complete!</h2>
                    <p className="text-muted-foreground">
                      Your identity has been successfully verified. Your KYC is now approved.
                    </p>
                    <Button className="mt-4">
                      Continue to Dashboard
                    </Button>
                  </div>
                ) : (
                  <>
                    {currentStep === 'aadhaar' && (
                      <AadhaarVerification
                        onComplete={(data) => completeStep('aadhaar', data)}
                        onStatusChange={setVerificationStatus}
                      />
                    )}

                    {currentStep === 'pan' && (
                      <PANVerification
                        onComplete={(data) => completeStep('pan', data)}
                        onStatusChange={setVerificationStatus}
                        aadhaarData={verificationData.aadhaar}
                      />
                    )}

                    {currentStep === 'bank' && (
                      <BankVerification
                        onComplete={(data) => completeStep('bank', data)}
                        onStatusChange={setVerificationStatus}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
