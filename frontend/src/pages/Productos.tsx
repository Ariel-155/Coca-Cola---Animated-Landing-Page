import { useState, useEffect, useRef } from 'react';


import cocaOriginal from '../assets/Coca-Cola Sabor Original.png';
import cocaMenosAzucar from '../assets/Coca-Cola Sabor Original Menos Azúcar.png';
import cocaSinAzucar from '../assets/Coca-Cola Sin Azúcar.png';
import logoCompany from '../assets/logo-company.png';

import './Productos.css';

interface NutrientRow {
  nutrient: string;
  amount: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  nutrients: NutrientRow[];
  ingredients: string;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Coca-Cola Sabor Original',
    description: 'La bebida gaseosa favorita del mundo que se ha disfrutado desde 1886. Puedes encontrarla en presentaciones para cada ocasión.',
    image: cocaOriginal,
    nutrients: [
      { nutrient: 'Valor Energético', amount: '105 kcal' },
      { nutrient: 'Grasas Totales', amount: '0 g' },
      { nutrient: 'Sodio', amount: '25 mg' },
      { nutrient: 'Carbohidratos Totales', amount: '27 g' },
      { nutrient: 'Azúcares Totales', amount: '27 g' },
      { nutrient: 'Proteínas', amount: '0 g' },
    ],
    ingredients: 'Agua carbonatada, azúcares (jarabe de maíz de alta fructosa y/o sacarosa), colorante caramelo clase IV, acidulante (ácido fosfórico) y aromatizantes naturales (contiene cafeína).',
  },
  {
    id: 2,
    name: 'Coca-Cola Sabor Original Menos Azúcar',
    description: 'Disfruta del inconfundible sabor original de Coca-Cola pero con menos azúcar, en una variedad de presentaciones que se adaptan a cada estilo de vida.',
    image: cocaMenosAzucar,
    nutrients: [
      { nutrient: 'Valor Energético', amount: '50 kcal' },
      { nutrient: 'Grasas Totales', amount: '0 g' },
      { nutrient: 'Sodio', amount: '25 mg' },
      { nutrient: 'Carbohidratos Totales', amount: '12.5 g' },
      { nutrient: 'Azúcares Totales', amount: '12.5 g' },
      { nutrient: 'Proteínas', amount: '0 g' },
    ],
    ingredients: 'Agua carbonatada, azúcares (jarabe de maíz de alta fructosa y/o sacarosa), colorante caramelo clase IV, acidulante (ácido fosfórico), aromatizantes naturales (contiene cafeína) y edulcorantes (sucralosa y acesulfame de potasio).',
  },
  {
    id: 3,
    name: 'Coca-Cola Sin Azúcar',
    description: 'Disfruta del auténtico sabor de Coca-Cola, ahora sin azúcar, con la misma frescura inconfundible y el delicioso sabor que tanto te gusta.',
    image: cocaSinAzucar,
    nutrients: [
      { nutrient: 'Valor Energético', amount: '0 kcal' },
      { nutrient: 'Grasas Totales', amount: '0 g' },
      { nutrient: 'Sodio', amount: '30 mg' },
      { nutrient: 'Carbohidratos Totales', amount: '0 g' },
      { nutrient: 'Azúcares Totales', amount: '0 g' },
      { nutrient: 'Proteínas', amount: '0 g' },
    ],
    ingredients: 'Agua carbonatada, colorante caramelo clase IV, acidulantes (ácido fosfórico y citrato de sodio), aromatizantes naturales, edulcorantes (aspartame y acesulfame de potasio) y regulador de acidez (contiene cafeína y fenilalanina).',
  },
];

const COUNTRIES = ['Argentina', 'Brasil', 'Chile', 'Colombia', 'México', 'Perú'];

export default function Productos() {
  const [search, setSearch] = useState('');
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [locationOpen, setLocationOpen] = useState(false);
  const productRefs = useRef<(HTMLElement | null)[]>([]);

  const filtered = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Scroll to top button
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Intersection observer for fade-in
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('productos-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    productRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [filtered]);

  return (
    <div className="productos-page">
      {/* Search */}
      <div className="productos-contenedor-buscador">
        <input
          type="text"
          id="productos-buscador"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {filtered.length === 0 && (
          <div className="productos-no-resultados">No se encontraron productos.</div>
        )}
      </div>

      {/* Products Grid */}
      <div className="productos-contenedor">
        {filtered.map((product, i) => (
          <article
            key={product.id}
            className="productos-producto productos-fade-in"
            ref={(el) => { productRefs.current[i] = el; }}
          >
            <div className="productos-producto-img">
              <img
                src={product.image}
                alt={product.name}
                className="productos-botella-img productos-visible"
              />
            </div>
            <div className="productos-producto-info">
              <div>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
              </div>
              <button
                className="productos-btn-info"
                onClick={() => setModalProduct(product)}
              >
                Ver Información Nutricional
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Modal */}
      {modalProduct && (
        <div
          className="productos-modal productos-modal-show"
          onClick={(e) => { if (e.target === e.currentTarget) setModalProduct(null); }}
        >
          <div className="productos-modal-content">
            <span
              className="productos-cerrar-modal"
              onClick={() => setModalProduct(null)}
            >
              &times;
            </span>
            <h2>Detalles del Producto</h2>
            <div className="productos-modal-body">
              <table>
                <thead>
                  <tr>
                    <th>Nutriente (Porción 250ml)</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {modalProduct.nutrients.map((n) => (
                    <tr key={n.nutrient}>
                      <td>{n.nutrient}</td>
                      <td>{n.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="productos-lista-ingredientes">
                <h3>Ingredientes:</h3>
                <p>{modalProduct.ingredients}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scroll to top button */}
      <button className="productos-btn-top" onClick={scrollToTop}>↑</button>

      {/* Footer */}
      <footer className="productos-site-footer">
        <div className="productos-footer-container">
          <div className="productos-footer-top">
            <img src={logoCompany} alt="The Coca-Cola Company" className="productos-footer-logo" />
            <div className="productos-footer-region-container" style={{ position: 'relative' }}>
              <div
                className="productos-footer-region"
                onClick={() => setLocationOpen(!locationOpen)}
                style={{ cursor: 'pointer' }}
              >
                <span>📍 Perú</span>
              </div>
              <div className={`productos-location-dropdown ${locationOpen ? 'productos-dropdown-show' : ''}`}>
                <div className="productos-dropdown-header">
                  <h4>Select Your Location</h4>
                  <span onClick={() => setLocationOpen(false)} style={{ cursor: 'pointer' }}>×</span>
                </div>
                <div className="productos-dropdown-content">
                  {COUNTRIES.map(c => (
                    <a key={c} href="#">{c}{c === 'Perú' ? ' ✓' : ''}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="productos-footer-main">
            <div className="productos-footer-col">
              <h4>SOBRE NOSOTROS</h4>
              <a href="#">Nuestra empresa</a>
              <a href="#">Centro de medios</a>
              <a href="#">Nuestra historia</a>
            </div>
            <div className="productos-footer-col">
              <h4>¿NECESITAS AYUDA?</h4>
              <a href="#">Mapa del sitio</a>
              <a href="#">Contacto</a>
            </div>
            <div className="productos-footer-col">
              <h4>LEGAL</h4>
              <a href="#">Términos de uso</a>
              <a href="#">Aviso de privacidad</a>
            </div>
            <div className="productos-footer-social">
              <a href="https://www.facebook.com/CocaCola" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://www.instagram.com/cocacola" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
              </a>
              <a href="https://www.youtube.com/user/cocacola" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/the-coca-cola-company" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>

          <div className="productos-footer-bottom">
            <p>&copy; 2026 The Coca-Cola Company. Reservados todos los derechos.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
