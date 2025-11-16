import { FaPlus, FaShoppingCart } from "react-icons/fa";
import Button from "../button/Button";

const CardItem = ({
  id,
  image,
  title,
  description,
  price,
  discount = null, // Descuento opcional
  onAddToCart,
  className = "",
  imageClassName = "",
  titleClassName = "",
  descriptionClassName = "",
  priceClassName = "",
  buttonClassName = "",
  buttonVariant = "primary",
  buttonSize = "md",
  showButton = true,
  buttonIcon = <FaPlus />,
  buttonText = null,
  badge = null, // Badge opcional (ej: "Nuevo", "Popular")
  currency = "$",
}) => {
  // Calcular precio con descuento si existe
  const finalPrice = discount ? price - (price * discount) / 100 : price;

  const handleClick = () => {
    if (onAddToCart) {
      onAddToCart({ id, title, description, price: finalPrice, image });
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group ${className}`}
    >
      {/* Imagen del producto */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={image}
          alt={title}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ${imageClassName}`}
        />

        {/* Badge opcional */}
        {badge && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            {badge}
          </span>
        )}

        {/* Etiqueta de descuento */}
        {discount && (
          <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            -{discount}%
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h4
          className={`text-xl font-bold text-gray-900 mb-2 line-clamp-1 ${titleClassName}`}
        >
          {title}
        </h4>
        <p
          className={`text-gray-600 text-sm mb-4 line-clamp-2 ${descriptionClassName}`}
        >
          {description}
        </p>

        {/* Precio y botón */}
        <div className="flex items-center justify-between">
          <div>
            {/* Precio con descuento */}
            {discount ? (
              <div className="flex flex-col">
                <span className="text-gray-400 line-through text-sm">
                  {currency}
                  {price.toLocaleString("es-CO")}
                </span>
                <span
                  className={`text-xl font-bold text-red-600 ${priceClassName}`}
                >
                  {currency}
                  {finalPrice.toLocaleString("es-CO")}
                </span>
              </div>
            ) : (
              <span
                className={`text-xl font-bold text-gray-900 ${priceClassName}`}
              >
                {currency}
                {price.toLocaleString("es-CO")}
              </span>
            )}
          </div>

          {/* Botón de acción */}
          {showButton &&
            (buttonText ? (
              <Button
                variant={buttonVariant}
                size={buttonSize}
                onClick={handleClick}
                icon={buttonIcon}
                className={buttonClassName}
              >
                {buttonText}
              </Button>
            ) : (
              <Button
                variant={buttonVariant}
                size={buttonSize}
                onClick={handleClick}
                icon={buttonIcon}
                className={`!p-3 ${buttonClassName}`}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default CardItem;