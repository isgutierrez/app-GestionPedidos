import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from "../components/button/Button";
import { useCart } from "../context/CartContext";
import logo from '../assets/img/logo.png';

export const Navbar = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img 
              src={logo}
              alt="Mr. FOOD" 
              className="h-20 w-auto" 
            />
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost"
              onClick={() => navigate('/register')}
            >
              Registrarse
            </Button>
            
            <Button 
              variant="primary"
              onClick={() => navigate('/login')}
            >
              Iniciar sesión
            </Button>
            
            {/* Botón de carrito con contador */}
            <button 
              className="text-gray-700 hover:text-gray-900 relative transition-colors"
              onClick={() => navigate('/checkout')}
            >
              <FaShoppingCart className="text-2xl" />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {Math.min(totalItems, 99)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
