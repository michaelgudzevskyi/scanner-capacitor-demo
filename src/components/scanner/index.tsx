// src/components/Scanner.tsx
import React, { useState, useCallback } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { FaQrcode } from 'react-icons/fa';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

export interface ScannerProps {
  onScanStart?: () => void;
  onScanComplete?: () => void;
  onScan: (code: string) => void;
  onError?: (msg: string) => void;
}

export const Scanner: React.FC<ScannerProps> = ({
  onScanStart,
  onScanComplete,
  onScan,
  onError,
}) => {
  const [scanning, setScanning] = useState(false);

  const startScan = useCallback(async () => {
    onScanStart?.();
    setScanning(true);

    // Web fallback
    if (Capacitor.getPlatform() === 'web') {
      const code = prompt('Enter scan code:');
      setScanning(false);
      onScanComplete?.();
      if (code) onScan(code.trim());
      return;
    }

    try {
      const { granted } = await BarcodeScanner.checkPermission({ force: true });
      if (!granted) throw new Error('Camera permission denied');

      // **Hide the WebView background** so the native camera shows through
      await BarcodeScanner.hideBackground();

      const result = await BarcodeScanner.startScan();

      if (result.hasContent) onScan(result.content);
    } catch (err: any) {
      onError?.(err.message ?? 'Scan failed');
    } finally {
      // **Restore** after scan
      await BarcodeScanner.showBackground();
      setScanning(false);
      onScanComplete?.();
    }
  }, [onScanStart, onScanComplete, onScan, onError]);

  return (
    <Button
      variant="primary"
      onClick={startScan}
      disabled={scanning}
      className="d-flex align-items-center"
    >
      <FaQrcode className="me-2" />
      {scanning ? (
        <>
          <Spinner animation="border" size="sm" className="me-2" />
          Scanning…
        </>
      ) : (
        'Scan QR Code'
      )}
    </Button>
  );
};
