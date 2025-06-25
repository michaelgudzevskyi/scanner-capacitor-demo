// src/App.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { Navbar, Container, Alert, Card, Row, Col } from 'react-bootstrap';
import { FaTimesCircle } from 'react-icons/fa';
import { Scanner } from './components';

export interface Product {
  id: string;
  name: string;
  description: string;
}
const products: Product[] = [
  { id: 'PD2001', name: 'iPhone 15 Pro', description: 'Apple flagship…' },
  { id: 'PD2002', name: 'Samsung Galaxy S24', description: 'Samsung flagship…' },
  { id: 'PD2003', name: 'Google Pixel 8', description: 'Google’s pure Android…' },
];

export const App: React.FC = () => {
  const [selected, setSelected] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = useCallback((code: string) => {
    const prod = products.find((p) => p.id === code);
    setSelected(prod || null);
    setError(prod ? '' : `No product for code "${code}"`);
  }, []);

  const resultCard = useMemo(() => {
    if (!selected) return null;
    return (
      <Card className="shadow mx-auto my-4" style={{ maxWidth: 500 }}>
        <Row className="g-0">
          <Col className="p-4">
            <Card.Body>
              <Card.Title>{selected.name}</Card.Title>
              <Card.Text>{selected.description}</Card.Text>
              <Card.Text>
                <small className="text-muted">ID: {selected.id}</small>
              </Card.Text>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    );
  }, [selected]);

  // If scanning, render nothing so the native camera UI is fully visible:
  if (isScanning) return null;

  return (
    <>
      <Navbar
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 3rem)' }}
        bg="white"
        expand="md"
        className="shadow-sm"
      >
        <Container>
          <Navbar.Brand className="fw-bold text-primary">
            Xfinity Products
          </Navbar.Brand>
          <div className="ms-auto">
            <Scanner
              onScanStart={() => setIsScanning(true)}
              onScanComplete={() => setIsScanning(false)}
              onScan={handleScan}
              onError={setError}
            />
          </div>
        </Container>
      </Navbar>
3
      <Container className="py-5">
        {error && (
          <Alert
            variant="danger"
            onClose={() => setError('')}
            dismissible
            className="d-flex align-items-center"
          >
            <FaTimesCircle className="me-2" /> {error}
          </Alert>
        )}
        {resultCard || (
          <div className="d-flex flex-column align-items-center mt-5 text-secondary">
            <h4>Select a product</h4>
            <p>Tap "Scan QR Code" to view details.</p>
            <Scanner
              onScanStart={() => setIsScanning(true)}
              onScanComplete={() => setIsScanning(false)}
              onScan={handleScan}
              onError={setError}
            />
          </div>
        )}
      </Container>
    </>
  );
};

export default App;
