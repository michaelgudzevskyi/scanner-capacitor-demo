// src/components/Scanner.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Button, Spinner, Modal } from 'react-bootstrap';
import { FaQrcode } from 'react-icons/fa';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

export interface ScannerProps {
  /** Called with the scanned string when a scan completes successfully */
  onScan: (code: string) => void;
  /** Called with an error message when something goes wrong */
  onError?: (error: string) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onScan, onError }) => {
  const [scanning, setScanning] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Cleanup if the component unmounts mid-scan
  useEffect(() => {
    return () => {
      if (scanning) {
        BarcodeScanner.showBackground();
        setScanning(false);
      }
    };
  }, [scanning]);

  const startScan = useCallback(async () => {
    try {
      setShowModal(true);

      // Web fallback: prompt for code
      if (Capacitor.getPlatform() === 'web') {
        const code = window.prompt('Enter scan code:');
        setShowModal(false);
        if (code) onScan(code.trim());
        return;
      }

      // Native: request camera permission
      const { granted } = await BarcodeScanner.checkPermission({ force: true });
      if (!granted) {
        setShowModal(false);
        onError?.('Camera permission denied');
        return;
      }

      setScanning(true);
      BarcodeScanner.hideBackground();

      // Show the scanning overlay
      setShowModal(true);
      const result = await BarcodeScanner.startScan();

      BarcodeScanner.showBackground();
      setScanning(false);
      setShowModal(false);

      if (result.hasContent) {
        onScan(result.content);
      }
    } catch (err: any) {
      BarcodeScanner.showBackground();
      setScanning(false);
      setShowModal(false);
      onError?.(err?.message ?? 'Scan failed');
    }
  }, [onScan, onError]);

  return (
    <>
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

      <Modal show={showModal} centered backdrop="static" keyboard={false}>
        <Modal.Body className="text-center py-4">
          <Spinner animation="border" role="status" className="mb-3" />
          <p className="mb-0">Point your camera at the QR code</p>
        </Modal.Body>
      </Modal>
    </>
  );
};

