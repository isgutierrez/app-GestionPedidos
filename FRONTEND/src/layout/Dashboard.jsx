import React, { useEffect, useMemo, useState } from 'react';
import CardItem from '../components/cardItems/CardItem';
import CategoryNav from './CategoryNav';
import { HeroSection } from './HeroSection';
import { Navbar } from './Navbar';
import api from '../services/api';
import comboPerroImage from '../assets/img/combo_perro.jpeg';
import comboPepitoImage from '../assets/img/combo_pepito.jpg';
import comboHamburguesaImage from '../assets/img/combo_hamburguesa.webp';
import ProductCustomizationPanel from '../components/productCustomization/ProductCustomizationPanel';
import { useCart } from '../context/CartContext';

const fallbackProductImage = comboPerroImage;

const DEFAULT_CATEGORY = 'Todos';

const API_BASE_URL =
  api?.defaults?.baseURL || import.meta.env.VITE_API_BASE_URL || '';

const API_ORIGIN = (() => {
  const fallbackOrigin =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:8080/';
  try {
    const url = new URL(API_BASE_URL || fallbackOrigin);
    return `${url.protocol}//${url.host}/`;
  } catch {
    return fallbackOrigin;
  }
})();

const getFileName = (value) =>
  value
    ?.toString()
    .trim()
    .split(/[\\/]/)
    .pop()
    ?.toLowerCase() ?? null;

const slugify = (value) =>
  value
    ?.toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]/g, '') ?? null;

const FILE_NAME_IMAGE_MAP = {
  'combo_perro.jpeg': comboPerroImage,
  'combo_pepito.jpg': comboPepitoImage,
  'combo_hamburguesa.webp': comboHamburguesaImage
};

const SLUG_IMAGE_MAP = {
  comboperro: comboPerroImage,
  combopepito: comboPepitoImage,
  combohamburguesa: comboHamburguesaImage,
  hamburguesasencilla: comboHamburguesaImage,
  hamburguesa: comboHamburguesaImage,
  pepito: comboPepitoImage,
  perro: comboPerroImage
};

const resolveLocalImage = (value) => {
  if (!value) return null;

  const fileName = getFileName(value);
  if (fileName && FILE_NAME_IMAGE_MAP[fileName]) {
    return FILE_NAME_IMAGE_MAP[fileName];
  }

  const slug = slugify(value);
  if (slug && SLUG_IMAGE_MAP[slug]) {
    return SLUG_IMAGE_MAP[slug];
  }

  return null;
};

const buildRemoteImageUrl = (value) => {
  if (!value) return null;
  const source = String(value);

  if (/^(https?:|data:|blob:)/i.test(source)) {
    return source;
  }

  try {
    return new URL(source, API_ORIGIN).toString();
  } catch {
    return null;
  }
};

const resolveProductImage = (item) => {
  const candidates = [
    item.image,
    item.imagen,
    item.urlImagen,
    item.foto,
    item.rutaImagen,
    item.nombre,
    item.title
  ];

  for (const value of candidates) {
    const localImage = resolveLocalImage(value);
    if (localImage) return localImage;
  }

  for (const value of candidates) {
    const remote = buildRemoteImageUrl(value);
    if (remote) return remote;
  }

  return fallbackProductImage;
};

export const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('productos', {
          signal: controller.signal
        });
        const data = response?.data;
        const items = Array.isArray(data) ? data : data?.content;
        setProducts(Array.isArray(items) ? items : []);
      } catch (err) {
        if (err.code !== 'ERR_CANCELED') {
          setError('No se pudieron cargar los productos. Intenta nuevamente.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, []);

  const normalizedProducts = useMemo(
    () =>
      products.map((item) => {
        const rawPrice =
          item.price ?? item.precio ?? item.valor ?? item.costo ?? 0;

        return {
          id:
            item.idProducto ??
            item.id ??
            item._id ??
            item.codigo ??
            item.uuid ??
            item.nombre ??
            Math.random().toString(36),
          category: item.category ?? item.categoria ?? item.tipo ?? DEFAULT_CATEGORY,
          title: item.title ?? item.nombre ?? 'Producto sin nombre',
          description:
            item.description ??
            item.descripcion ??
            item.detalle ??
            'Sin descripción disponible.',
          price: Number(rawPrice) || 0,
          image: resolveProductImage(item),
          discount:
            typeof item.discount !== 'undefined'
              ? Number(item.discount)
              : typeof item.descuento !== 'undefined'
              ? Number(item.descuento)
              : null
        };
      }),
    [products]
  );

  const categories = useMemo(() => {
    const values = new Set([DEFAULT_CATEGORY]);
    normalizedProducts.forEach((item) => {
      if (item.category) values.add(item.category);
    });
    return Array.from(values);
  }, [normalizedProducts]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === DEFAULT_CATEGORY) {
      return normalizedProducts;
    }
    return normalizedProducts.filter(
      (item) => item.category === activeCategory
    );
  }, [normalizedProducts, activeCategory]);

  const handleProductSelection = (product) => {
    setSelectedProduct(product);
  };

  const handleCustomizeAndAdd = ({ product, customization }) => {
    addItem({ product, customization });
    setSelectedProduct(null);
  };

  const handleClearSelection = () => setSelectedProduct(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroSection />

      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />

      <main className="max-w-7xl mx-auto px-4 py-10">
        {error && (
          <p className="mb-6 text-center text-sm text-red-600 font-medium">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Cargando productos...</p>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((item) => (
                <CardItem
                  key={item.id}
                  {...item}
                  onAddToCart={handleProductSelection}
                  buttonText="Agregar"
                  className="h-full"
                />
              ))}

              {!filteredProducts.length && (
                <p className="col-span-full text-center text-gray-500">
                  No hay productos para mostrar en esta categoría.
                </p>
              )}
            </div>

            <ProductCustomizationPanel
              key={selectedProduct?.id ?? 'customization-panel'}
              product={selectedProduct}
              onAddToCart={handleCustomizeAndAdd}
              onClearSelection={handleClearSelection}
            />
          </div>
        )}
      </main>
    </div>
  );
};
