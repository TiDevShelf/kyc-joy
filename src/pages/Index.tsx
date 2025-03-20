
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
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import VerificationProgress, { VerificationStep } from '@/components/VerificationProgress';
import VerificationStatus from '@/components/VerificationStatus';
import AadhaarVerification from '@/components/AadhaarVerification';
import PANVerification from '@/components/PANVerification';
import BankVerification from '@/components/BankVerification';

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

    // Move to next step after a short delay
    setTimeout(() => {
      moveToNextStep();
    }, 1000);
  };

  // Move to the next step
  const moveToNextStep = () => {
    if (currentStep === 'aadhaar') {
      setCurrentStep('pan');
    } else if (currentStep === 'pan') {
      setCurrentStep('bank');
    }
    // Reset status message when moving to next step
    setVerificationStatus({
      message: '',
      status: 'idle'
    });
  };

  // Move to the previous step
  const moveToPreviousStep = () => {
    if (currentStep === 'pan') {
      setCurrentStep('aadhaar');
    } else if (currentStep === 'bank') {
      setCurrentStep('pan');
    }
    // Reset status message when moving to prev step
    setVerificationStatus({
      message: '',
      status: 'idle'
    });
  };

  // Check if current flow is completed
  const isVerificationCompleted = completedSteps.length === 3;

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
              />
              
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">Verification Steps:</h3>
                <ul className="space-y-1.5 text-sm">
                  <li className="flex items-center gap-2">
                    {completedSteps.includes('aadhaar') ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-gray-300" />
                    )}
                    <span>Aadhaar Verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {completedSteps.includes('pan') ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-gray-300" />
                    )}
                    <span>PAN Verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {completedSteps.includes('bank') ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-gray-300" />
                    )}
                    <span>Bank Account Verification</span>
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
                    : 'Please complete the following verification steps'}
                </p>
              </div>

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
                      Your identity has been successfully verified.
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

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                      <Button 
                        variant="outline" 
                        onClick={moveToPreviousStep}
                        disabled={currentStep === 'aadhaar'}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      
                      <Button 
                        onClick={moveToNextStep}
                        disabled={
                          (currentStep === 'aadhaar' && !completedSteps.includes('aadhaar')) ||
                          (currentStep === 'pan' && !completedSteps.includes('pan')) ||
                          currentStep === 'bank'
                        }
                      >
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
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
