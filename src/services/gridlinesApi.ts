
// Gridlines API service for KYC verification

// Base API URL
const API_BASE_URL = 'https://api.gridlines.io';

const API_KEY = "DZ464XpS1TSBy8h7dBl3qcViWcCWIt13";

// Endpoints
const ENDPOINTS = {
  // Aadhaar endpoints
  GENERATE_AADHAAR_OTP: '/aadhaar-api/boson/generate-otp',
  VERIFY_AADHAAR_OTP: '/aadhaar-api/boson/submit-otp',
  
  // PAN endpoints
  VERIFY_PAN: '/pan-api/fetch-detailed',
  
  // Bank account endpoints
  VERIFY_BANK_ACCOUNT: '/bank-api/verify',
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

const makeApiRequest = async (endpoint: string, data: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
        'X-Auth-Type': 'API-Key',
        Accept: 'application/json'
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'API request failed');
    }
    return result;
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error);
    return { success: false, message: error.message };
  }
};

const gridlinesApi = {
  generateAadhaarOTP: async (aadhaar_number: string, consent: string) => {
    return await makeApiRequest(ENDPOINTS.GENERATE_AADHAAR_OTP, { aadhaar_number, consent });
  },
  
  verifyAadhaarOTP: async (otp: string, transaction_id: string, shareCode: string) => {
    return await makeApiRequest(ENDPOINTS.VERIFY_AADHAAR_OTP, { otp, transaction_id, shareCode });
  },
  
  verifyPAN: async (pan_number: string, aadhaar_number?: string) => {
    return await makeApiRequest(ENDPOINTS.VERIFY_PAN, { pan_number, aadhaar_number });
  },
  
  verifyBankAccount: async (accountNumber: string, ifsc: string) => {
    return await makeApiRequest(ENDPOINTS.VERIFY_BANK_ACCOUNT, { accountNumber, ifsc });
  }
};

export default gridlinesApi;
