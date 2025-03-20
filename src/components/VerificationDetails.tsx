
import React from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VerificationDetailsProps {
  verificationData: {
    aadhaar: {
      verified: boolean;
      number: string;
      name: string;
      dob: string;
      gender: string;
    };
    pan: {
      verified: boolean;
      number: string;
      name: string;
      dob: string;
    };
    bank: {
      verified: boolean;
      accountNumber: string;
      ifsc: string;
      name: string;
      bankName: string;
    };
  };
  className?: string;
}

const VerificationDetails: React.FC<VerificationDetailsProps> = ({ 
  verificationData,
  className
}) => {
  const { aadhaar, pan, bank } = verificationData;
  
  // Format Aadhaar number to display as XXXX-XXXX-1234
  const formatAadhaarNumber = (number: string) => {
    if (!number || number.length !== 12) return number;
    return `XXXX-XXXX-${number.slice(8, 12)}`;
  };
  
  // Format account number to mask all but last 4 digits
  const formatAccountNumber = (number: string) => {
    if (!number || number.length < 4) return number;
    return `XXXXX${number.slice(-4)}`;
  };

  return (
    <div className={className}>
      {/* Aadhaar Details */}
      {aadhaar.verified && (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-md">Aadhaar Details</CardTitle>
              <Badge variant="outline" className="bg-kyc-success/10 text-kyc-success">
                Verified
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium w-1/3">Aadhaar Number</TableCell>
                  <TableCell>{formatAadhaarNumber(aadhaar.number)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Name</TableCell>
                  <TableCell>{aadhaar.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Date of Birth</TableCell>
                  <TableCell>{aadhaar.dob}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Gender</TableCell>
                  <TableCell>{aadhaar.gender === 'M' ? 'Male' : aadhaar.gender === 'F' ? 'Female' : aadhaar.gender}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* PAN Details */}
      {pan.verified && (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-md">PAN Details</CardTitle>
              <Badge variant="outline" className="bg-kyc-success/10 text-kyc-success">
                Verified
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium w-1/3">PAN Number</TableCell>
                  <TableCell>{pan.number}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Name</TableCell>
                  <TableCell>{pan.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Date of Birth</TableCell>
                  <TableCell>{pan.dob}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Bank Account Details */}
      {bank.verified && (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-md">Bank Account Details</CardTitle>
              <Badge variant="outline" className="bg-kyc-success/10 text-kyc-success">
                Verified
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium w-1/3">Account Number</TableCell>
                  <TableCell>{formatAccountNumber(bank.accountNumber)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">IFSC</TableCell>
                  <TableCell>{bank.ifsc}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Account Holder</TableCell>
                  <TableCell>{bank.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Bank Name</TableCell>
                  <TableCell>{bank.bankName}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {!aadhaar.verified && !pan.verified && !bank.verified && (
        <div className="text-center p-4 text-muted-foreground">
          No verification details available. Complete verification steps to view details.
        </div>
      )}
    </div>
  );
};

export default VerificationDetails;
