import React, { useMemo, useState } from 'react';
import CardItem from '../components/cardItems/CardItem';
import CategoryNav from './CategoryNav';
import { HeroSection } from './HeroSection';
import { Navbar } from './Navbar';

const CATEGORIES = [
  'Combos',
  'Hamburguesas',
  'Pepitos',
  'Perros',
  'Pizzas',
  'Sandwich',
  'Bebidas'
];

const PRODUCTS = [
  {
    id: 'combo-perro',
    category: 'Combos',
    title: 'Combo Perro',
    description: 'Perro + papas a la francesa + gaseosa mini.',
    price: 15000,
    image: 'src/assets/img/combo_perro.jpeg'
  },
  {
    id: 'combo-burguer',
    category: 'Combos',
    title: 'Combo Burguer',
    description: 'Hamburguesa sencilla + papas a la francesa + gaseosa mini.',
    price: 20000,
    image: 'src/assets/img/combo_hamburguesa.webp'
  },
  {
    id: 'combo-pepito',
    category: 'Combos',
    title: 'Combo Pepito',
    description: 'Pepito sencillo + papas a la francesa + gaseosa mini.',
    price: 25000,
    image: 'src/assets/img/combo_pepito.jpg'
  }
];

export const Dashboard = () => {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);

  const filteredProducts = useMemo(
    () => PRODUCTS.filter((item) => item.category === activeCategory),
    [activeCategory]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroSection />

      <CategoryNav
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((item) => (
            <CardItem
              key={item.id}
              {...item}
              onAddToCart={() => console.log('Agregado al carrito', item)}
              buttonText="Agregar"
              className="h-full"
            />
          ))}
        </div>
      </main>
    </div>
  );
};
