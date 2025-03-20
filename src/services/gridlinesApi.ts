
// API service for Gridlines integration

// Types for API requests and responses
export interface AadhaarOtpRequest {
  aadhaar: string;
}

export interface AadhaarOtpResponse {
  success: boolean;
  message: string;
  data?: {
    client_id: string;
  };
  error?: string;
}

export interface AadhaarVerifyOtpRequest {
  client_id: string;
  otp: string;
}

export interface AadhaarVerifyOtpResponse {
  success: boolean;
  message: string;
  data?: {
    aadhaar_last_4: string;
    client_id: string;
    full_name: string;
    gender: string;
    dob: string;
  };
  error?: string;
}

export interface PanVerificationRequest {
  pan: string;
}

export interface PanVerificationResponse {
  success: boolean;
  message: string;
  data?: {
    pan: string;
    full_name: string;
    aadhaar_seeding_status: string;
  };
  error?: string;
}

export interface BankVerificationRequest {
  account_number: string;
  ifsc: string;
}

export interface BankVerificationResponse {
  success: boolean;
  message: string;
  data?: {
    account_number: string;
    ifsc: string;
    bank_name: string;
    account_holder_name: string;
    branch: string;
  };
  error?: string;
}

// Gridlines API base URL
const GRIDLINES_API_BASE_URL = 'https://api.gridlines.io';

/**
 * Generate OTP for Aadhaar verification
 */
export const generateAadhaarOtp = async (aadhaar: string): Promise<AadhaarOtpResponse> => {
  try {
    // For development/demo purposes, we'll mock the API response
    // In production, this would be a real API call
    console.log('Generating OTP for Aadhaar:', aadhaar);
    
    // Mock successful response
    return {
      success: true,
      message: 'OTP sent successfully',
      data: {
        client_id: 'mock-client-id-12345'
      }
    };
    
    // Actual implementation would be:
    /*
    const response = await fetch(`${GRIDLINES_API_BASE_URL}/aadhaar-api/boson/generate-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GRIDLINES_API_KEY}`
      },
      body: JSON.stringify({ aadhaar })
    });
    
    return await response.json();
    */
  } catch (error) {
    console.error('Error generating OTP:', error);
    return {
      success: false,
      message: 'Failed to generate OTP',
      error: 'Network or server error'
    };
  }
};

/**
 * Verify Aadhaar OTP
 */
export const verifyAadhaarOtp = async (client_id: string, otp: string): Promise<AadhaarVerifyOtpResponse> => {
  try {
    // For development/demo purposes, we'll mock the API response
    console.log('Verifying OTP:', otp, 'for client_id:', client_id);
    
    // Check if OTP is 123456 for demo purposes
    if (otp === '123456') {
      return {
        success: true,
        message: 'OTP verified successfully',
        data: {
          aadhaar_last_4: '1234',
          client_id,
          full_name: 'John Doe',
          gender: 'M',
          dob: '1990-01-01'
        }
      };
    } else {
      return {
        success: false,
        message: 'Invalid OTP',
        error: 'The OTP entered is incorrect'
      };
    }
    
    // Actual implementation would be:
    /*
    const response = await fetch(`${GRIDLINES_API_BASE_URL}/aadhaar-api/boson/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GRIDLINES_API_KEY}`
      },
      body: JSON.stringify({ client_id, otp })
    });
    
    return await response.json();
    */
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return {
      success: false,
      message: 'Failed to verify OTP',
      error: 'Network or server error'
    };
  }
};

/**
 * Verify PAN
 */
export const verifyPan = async (pan: string): Promise<PanVerificationResponse> => {
  try {
    // For development/demo purposes, we'll mock the API response
    console.log('Verifying PAN:', pan);
    
    // Check if PAN is ABCDE1234F for demo purposes
    if (/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
      return {
        success: true,
        message: 'PAN verified successfully',
        data: {
          pan,
          full_name: 'John Doe',
          aadhaar_seeding_status: 'Y'
        }
      };
    } else {
      return {
        success: false,
        message: 'Invalid PAN',
        error: 'The PAN entered is incorrect'
      };
    }
    
    // Actual implementation would be:
    /*
    const response = await fetch(`${GRIDLINES_API_BASE_URL}/pan-api/v1/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GRIDLINES_API_KEY}`
      },
      body: JSON.stringify({ pan })
    });
    
    return await response.json();
    */
  } catch (error) {
    console.error('Error verifying PAN:', error);
    return {
      success: false,
      message: 'Failed to verify PAN',
      error: 'Network or server error'
    };
  }
};

/**
 * Verify Bank Account
 */
export const verifyBankAccount = async (account_number: string, ifsc: string): Promise<BankVerificationResponse> => {
  try {
    // For development/demo purposes, we'll mock the API response
    console.log('Verifying Bank Account:', account_number, 'with IFSC:', ifsc);
    
    // Mock successful response for valid IFSC format
    if (/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
      return {
        success: true,
        message: 'Bank account verified successfully',
        data: {
          account_number,
          ifsc,
          bank_name: 'MOCK BANK',
          account_holder_name: 'John Doe',
          branch: 'Main Branch'
        }
      };
    } else {
      return {
        success: false,
        message: 'Invalid IFSC code',
        error: 'The IFSC code entered is incorrect'
      };
    }
    
    // Actual implementation would be:
    /*
    const response = await fetch(`${GRIDLINES_API_BASE_URL}/bank-api/v1/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GRIDLINES_API_KEY}`
      },
      body: JSON.stringify({ account_number, ifsc })
    });
    
    return await response.json();
    */
  } catch (error) {
    console.error('Error verifying bank account:', error);
    return {
      success: false,
      message: 'Failed to verify bank account',
      error: 'Network or server error'
    };
  }
};
