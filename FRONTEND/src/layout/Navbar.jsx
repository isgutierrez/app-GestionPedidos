import React from "react";
import { FaShoppingCart } from 'react-icons/fa';
import Button from "../components/button/Button";

export const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img 
              src="src/assets/img/logo.png" 
              alt="Mr. FOOD" 
              className="h-20 w-auto" 
            />
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost"
              onClick={() => console.log('Ir a registro')}
            >
              Registrarse
            </Button>
            
            <Button 
              variant="primary"
              onClick={() => console.log('Ir a login')}
            >
              Iniciar sesión
            </Button>
            
            {/* Botón de carrito con contador */}
            <button 
              className="text-gray-700 hover:text-gray-900 relative transition-colors"
              onClick={() => console.log('Abrir carrito')}
            >
              <FaShoppingCart className="text-2xl" />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};