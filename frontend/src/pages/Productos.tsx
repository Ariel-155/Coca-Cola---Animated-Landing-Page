import { useState, useEffect, useRef } from 'react';


import cocaOriginal from '../assets/Coca-Cola Sabor Original.png';
import cocaMenosAzucar from '../assets/Coca-Cola Sabor Original Menos Azúcar.png';
import cocaSinAzucar from '../assets/Coca-Cola Sin Azúcar.png';
import spriteImg from '../assets/sprite.png';
import fantaOrangeImg from '../assets/fanta_orange.png';
import fantaGrapeImg from '../assets/fanta_grape.png';
import poweradeBlueImg from '../assets/powerade_blue.png';
import poweradeRedImg from '../assets/powerade_red.png';
import aquariusImg from '../assets/aquarius.png';

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
  {
    id: 4,
    name: 'Sprite',
    description: 'La bebida transparente con un refrescante e intenso sabor a lima-limón que quita tu sed al instante.',
    image: spriteImg,
    nutrients: [
      { nutrient: 'Valor Energético', amount: '40 kcal' },
      { nutrient: 'Grasas Totales', amount: '0 g' },
      { nutrient: 'Sodio', amount: '20 mg' },
      { nutrient: 'Carbohidratos Totales', amount: '10 g' },
      { nutrient: 'Azúcares Totales', amount: '10 g' },
      { nutrient: 'Proteínas', amount: '0 g' },
    ],
    ingredients: 'Agua carbonatada, azúcares, acidulante (ácido cítrico), saborizantes naturales a lima y limón, y regulador de acidez (citrato de sodio).',
  },
  {
    id: 5,
    name: 'Fanta Naranja',
    description: 'Bebida gaseosa sabor a naranja con un sabor divertido y vibrante, ideal para disfrutar con amigos.',
    image: fantaOrangeImg, 
    nutrients: [
      { nutrient: 'Valor Energético', amount: '55 kcal' },
      { nutrient: 'Grasas Totales', amount: '0 g' },
      { nutrient: 'Sodio', amount: '15 mg' },
      { nutrient: 'Carbohidratos Totales', amount: '14 g' },
      { nutrient: 'Azúcares Totales', amount: '14 g' },
      { nutrient: 'Proteínas', amount: '0 g' },
    ],
    ingredients: 'Agua carbonatada, azúcares, jugo de naranja, acidulante (ácido cítrico), saborizantes naturales, conservante (benzoato de sodio) y colorantes artificiales.',
  },
  {
    id: 6,
    name: 'Fanta Uva',
    description: 'El clásico y atrevido sabor a uva en una bebida gaseosa refrescante y dulce, perfecta para darle color a tu día.',
    image: fantaGrapeImg,
    nutrients: [
      { nutrient: 'Valor Energético', amount: '52 kcal' },
      { nutrient: 'Grasas Totales', amount: '0 g' },
      { nutrient: 'Sodio', amount: '10 mg' },
      { nutrient: 'Carbohidratos Totales', amount: '13 g' },
      { nutrient: 'Azúcares Totales', amount: '13 g' },
      { nutrient: 'Proteínas', amount: '0 g' },
    ],
    ingredients: 'Agua carbonatada, azúcares, acidulante (ácido cítrico), saborizantes artificiales a uva, conservante (benzoato de sodio) y colorantes artificiales.',
  },
  {
    id: 7,
    name: 'Powerade Mountain Blast',
    description: 'Bebida deportiva formulada con el sistema ION4 que ayuda a reponer 4 de los electrolitos que pierdes al sudar.',
    image: poweradeBlueImg,
    nutrients: [
      { nutrient: 'Valor Energético', amount: '24 kcal' },
      { nutrient: 'Grasas Totales', amount: '0 g' },
      { nutrient: 'Sodio', amount: '40 mg' },
      { nutrient: 'Potasio', amount: '12 mg' },
      { nutrient: 'Carbohidratos Totales', amount: '6 g' },
      { nutrient: 'Azúcares Totales', amount: '6 g' },
    ],
    ingredients: 'Agua, azúcares, acidulante (ácido cítrico), cloruro de sodio, citrato de potasio, saborizantes naturales, cloruro de magnesio, cloruro de calcio y colorante azul.',
  },
  {
    id: 8,
    name: 'Powerade Fruit Punch',
    description: 'Recarga tu energía con el delicioso sabor a ponche de frutas y recupera los electrolitos perdidos durante la actividad física.',
    image: poweradeRedImg,
    nutrients: [
      { nutrient: 'Valor Energético', amount: '24 kcal' },
      { nutrient: 'Grasas Totales', amount: '0 g' },
      { nutrient: 'Sodio', amount: '40 mg' },
      { nutrient: 'Potasio', amount: '12 mg' },
      { nutrient: 'Carbohidratos Totales', amount: '6 g' },
      { nutrient: 'Azúcares Totales', amount: '6 g' },
    ],
    ingredients: 'Agua, azúcares, acidulante (ácido cítrico), cloruro de sodio, citrato de potasio, saborizantes naturales a frutas, cloruro de magnesio y colorante rojo.',
  },
  {
    id: 9,
    name: 'Aquarius Pera',
    description: 'Agua saborizada sin gas, ligera y refrescante, con un toque suave a pera y vitaminas esenciales.',
    image: aquariusImg,
    nutrients: [
      { nutrient: 'Valor Energético', amount: '18 kcal' },
      { nutrient: 'Grasas Totales', amount: '0 g' },
      { nutrient: 'Sodio', amount: '15 mg' },
      { nutrient: 'Carbohidratos Totales', amount: '4.5 g' },
      { nutrient: 'Azúcares Totales', amount: '4.5 g' },
      { nutrient: 'Vitamina B3', amount: '15% VD' },
    ],
    ingredients: 'Agua, azúcares, jugo de pera, acidulante (ácido cítrico), saborizantes naturales, conservante (sorbato de potasio) y vitaminas (B3, B5, B6).',
  },
];

export default function Productos() {
  const [search, setSearch] = useState('');
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
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

    </div>
  );
}
