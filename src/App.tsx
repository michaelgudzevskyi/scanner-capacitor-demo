import React, { useState, useCallback, useMemo } from "react";
import { Navbar, Container, Alert, Card, Row, Col } from "react-bootstrap";
import { FaTimesCircle } from "react-icons/fa";
import { Scanner } from "./components";

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

const faceProducts: Product[] = [
  {
    id: 'PD2001',
    name: 'iPhone 15 Pro',
    description: 'Apple flagship with A17 Pro chip and triple‑lens camera.',
  },
  {
    id: 'PD2002',
    name: 'Samsung Galaxy S24',
    description: 'Samsung flagship with Snapdragon 8 Gen 3 for Galaxy.',
  },
  {
    id: 'PD2003',
    name: 'Google Pixel 8',
    description: 'Google’s pure Android phone with Tensor G3 chipset.',
  },
];

export const App: React.FC = () => {
  const [selected, setSelected] = useState<Product | null>(null);
  const [error, setError] = useState<string>("");

  const handleScan = useCallback((code: string) => {
    const product = faceProducts.find((p) => p.id === code);
    if (product) {
      setSelected(product);
      setError("");
    } else {
      setSelected(null);
      setError(`No product found for code "${code}"`);
    }
  }, []);

  const resultCard = useMemo(() => {
    if (!selected) return null;
    return (
      <Card className="shadow mx-auto my-4" style={{ maxWidth: 500 }}>
        <Row className="g-0">
          <Col md={12} className="p-4">
            <Card.Body>
              <Card.Title className="d-flex align-items-center">
                {selected.name}
              </Card.Title>
              <Card.Text className="mt-3">{selected.description}</Card.Text>
              <Card.Text>
                <small className="text-muted">ID: {selected.id}</small>
              </Card.Text>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    );
  }, [selected]);

  return (
    <>
      <Navbar bg="white" expand="md" className="shadow-sm">
        <Container>
          <Navbar.Brand className="fw-bold text-primary">
            Xfinity Products
          </Navbar.Brand>
          <div className="ms-auto">
            <Scanner onScan={handleScan} onError={setError} />
          </div>
        </Container>
      </Navbar>

      <Container className="py-5">
        {error && (
          <Alert
            variant="danger"
            onClose={() => setError("")}
            dismissible
            className="d-flex align-items-center"
          >
            <FaTimesCircle className="me-2" /> {error}
          </Alert>
        )}

        {resultCard || (
          <div className="d-flex flex-column align-items-center mt-5 text-secondary">
            <h4>Select a product</h4>
            <p>Tap "Scan QR Code" to view product details.</p>
            <div className="mt-3">
              <Scanner onScan={handleScan} onError={setError} />
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

export default App;
