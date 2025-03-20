
// Gridlines API service for KYC verification

// Base API URL
const API_BASE_URL = 'https://api.gridlines.io';

// Endpoints
const ENDPOINTS = {
  // Aadhaar endpoints
  GENERATE_AADHAAR_OTP: '/aadhaar-api/boson/generate-otp',
  VERIFY_AADHAAR_OTP: '/aadhaar-api/boson/verify-otp',
  
  // PAN endpoints
  VERIFY_PAN: '/pan-api/boson/verify',
  
  // Bank account endpoints
  VERIFY_BANK_ACCOUNT: '/bank-api/boson/verify',
};

// Mock API response function (for development)
const mockApiResponse = async (endpoint: string, data: any) => {
  console.log(`Mock API call to ${endpoint}`, data);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return mocked responses based on endpoint
  switch (endpoint) {
    case ENDPOINTS.GENERATE_AADHAAR_OTP:
      // Simulate OTP sent success
      if (data.aadhaar.length === 12) {
        return { 
          success: true, 
          txnId: 'mock-txn-' + Math.floor(Math.random() * 10000),
          message: 'OTP sent successfully to registered mobile number' 
        };
      }
      return { success: false, message: 'Invalid Aadhaar number' };
      
    case ENDPOINTS.VERIFY_AADHAAR_OTP:
      // Simple logic: accept OTP if it's 6 digits
      if (data.otp.length === 6) {
        return { 
          success: true,
          data: {
            name: 'John Doe',
            gender: 'M',
            dob: '15-08-1990',
            address: '123 Main St, Mumbai, India'
          },
          message: 'Aadhaar verified successfully' 
        };
      }
      return { success: false, message: 'Invalid OTP' };
      
    case ENDPOINTS.VERIFY_PAN:
      // Simple logic: accept PAN if it's valid format
      if (/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.pan)) {
        return { 
          success: true,
          data: {
            name: 'John Doe',
            dob: '15-08-1990',
            panStatus: 'ACTIVE'
          },
          message: 'PAN verified successfully' 
        };
      }
      return { success: false, message: 'Invalid PAN' };
      
    case ENDPOINTS.VERIFY_BANK_ACCOUNT:
      // Simple logic: accept if account number is 8+ digits and IFSC is valid format
      if (data.accountNumber.length >= 8 && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.ifsc)) {
        return { 
          success: true,
          data: {
            accountHolderName: 'John Doe',
            bankName: 'State Bank of India',
            accountType: 'Savings'
          },
          message: 'Bank account verified successfully' 
        };
      }
      return { success: false, message: 'Invalid bank account details' };
      
    default:
      return { success: false, message: 'Unknown endpoint' };
  }
};

// Gridlines API service
const gridlinesApi = {
  // Aadhaar verification APIs
  generateAadhaarOTP: async (aadhaar: string) => {
    // In a real implementation, you would use fetch or axios to call the actual API
    // For this example, we'll use the mock API
    return await mockApiResponse(ENDPOINTS.GENERATE_AADHAAR_OTP, { aadhaar });
  },
  
  verifyAadhaarOTP: async (aadhaar: string, otp: string, txnId: string) => {
    return await mockApiResponse(ENDPOINTS.VERIFY_AADHAAR_OTP, { aadhaar, otp, txnId });
  },
  
  // PAN verification API
  verifyPAN: async (pan: string, aadhaar?: string) => {
    return await mockApiResponse(ENDPOINTS.VERIFY_PAN, { pan, aadhaar });
  },
  
  // Bank account verification API
  verifyBankAccount: async (accountNumber: string, ifsc: string) => {
    return await mockApiResponse(ENDPOINTS.VERIFY_BANK_ACCOUNT, { accountNumber, ifsc });
  }
};

export default gridlinesApi;
