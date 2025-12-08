import { useEffect, useMemo, useState } from 'react';
import Button from '../button/Button';

const GENERAL_MEAT_OPTIONS = [
  { value: 'res', label: 'Res' },
  { value: 'pollo', label: 'Pollo' },
  { value: 'cerdo', label: 'Cerdo' },
  { value: 'chorizo', label: 'Chorizo' }
];

const HOT_DOG_MEAT_OPTIONS = [
  { value: 'salchicha', label: 'Salchicha' },
  { value: 'chorizo', label: 'Chorizo' }
];

const SAUCE_OPTIONS = [
  { value: 'tomate', label: 'Tomate' },
  { value: 'mayonesa', label: 'Mayonesa' },
  { value: 'pina', label: 'Piña' },
  { value: 'mostaza', label: 'Mostaza' },
  { value: 'casa', label: 'De la casa' },
  { value: 'rosada', label: 'Rosada' }
];

const EXTRA_OPTIONS = [
  { value: 'tocineta', label: 'Tocineta' },
  { value: 'cebolla', label: 'Cebolla caramelizada' },
  { value: 'maicitos', label: 'Maicitos' },
  { value: 'tomate', label: 'Tomate' },
  { value: 'aguacate', label: 'Aguacate' },
  { value: 'ripio', label: 'Ripio de papa' },
  { value: 'queso', label: 'Queso mozzarella' }
];

const ADDITION_OPTIONS = [
  { value: 'tocineta-extra', label: 'Tocineta' },
  { value: 'champinones', label: 'Champiñones' },
  { value: 'maicitos-extra', label: 'Maicitos' },
  { value: 'pina-calada', label: 'Piña calada' },
  { value: 'salsa-casa', label: 'Salsa de la casa' },
  { value: 'papas', label: 'Porción de papas fritas' },
  { value: 'carne', label: 'Porción de carne' }
];

const OptionChip = ({
  type = 'radio',
  label,
  value,
  checked,
  onChange,
  name
}) => {
  const indicatorClasses = checked
    ? 'border-red-600'
    : 'border-gray-300 group-hover:border-red-300';

  return (
    <label
      className={`group flex w-full flex-wrap items-start gap-3 px-4 py-2 rounded-2xl border cursor-pointer transition-all ${
        checked
          ? 'border-red-600 bg-red-50 text-red-700 shadow-sm'
          : 'border-gray-200 text-gray-600 hover:border-red-300'
      }`}
    >
      <span
        className={`w-4 h-4 border-2 rounded-full flex items-center justify-center ${indicatorClasses}`}
      >
        {checked && <span className="w-2 h-2 rounded-full bg-red-600" />}
      </span>
      <input
        type={type}
        name={name}
        className="sr-only"
        checked={checked}
        onChange={() => onChange(value)}
      />
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
};

const ProductCustomizationPanel = ({
  product,
  onAddToCart,
  onClearSelection
}) => {
  const [selectedMeat, setSelectedMeat] = useState(
    GENERAL_MEAT_OPTIONS[0].value
  );
  const [selectedSauce, setSelectedSauce] = useState(SAUCE_OPTIONS[4].value);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [selectedAdditions, setSelectedAdditions] = useState([]);

  const isHotDogProduct = useMemo(() => {
    const text = `${product?.category ?? ''} ${product?.title ?? ''}`.toLowerCase();
    return text.includes('perro');
  }, [product]);

  const meatOptions = isHotDogProduct
    ? HOT_DOG_MEAT_OPTIONS
    : GENERAL_MEAT_OPTIONS;

  useEffect(() => {
    setSelectedMeat(meatOptions[0]?.value ?? null);
    setSelectedSauce(SAUCE_OPTIONS[4].value);
    setSelectedExtras([]);
    setSelectedAdditions([]);
  }, [product?.id, meatOptions]);

  const toggleValue = (setter) => (value) =>
    setter((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );

  const handleSubmit = () => {
    if (!product) return;
    onAddToCart?.({
      product,
      customization: {
        meat: selectedMeat,
        sauce: selectedSauce,
        extras: selectedExtras,
        additions: selectedAdditions
      }
    });
  };

  const summaryPrice = useMemo(() => {
    const base = Number(product?.price ?? 0);
    const additionsCost = selectedAdditions.length * 3000;
    const extrasCost = selectedExtras.length * 1500;
    return base + additionsCost + extrasCost;
  }, [product, selectedAdditions.length, selectedExtras.length]);

  if (!product) {
    return (
      <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-8 text-center text-gray-500 shadow-inner">
        <p className="text-lg font-medium">
          Selecciona un producto para personalizarlo y añadirlo al carrito.
        </p>
        <p className="text-sm mt-2">
          Aquí podrás elegir tipo de carne, salsas y adicionales tal como en el
          diseño de referencia.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border-2 border-blue-200 shadow-xl p-6 lg:sticky lg:top-28">
      <div className="flex items-start gap-4 border-b border-gray-100 pb-4 mb-5">
        <img
          src={product.image}
          alt={product.title}
          className="w-20 h-20 rounded-2xl object-cover shadow-md"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                {product.category ?? 'Producto'}
              </p>
              <h3 className="text-lg font-bold text-gray-900">
                {product.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {product.description}
              </p>
            </div>
            <button
              type="button"
              onClick={onClearSelection}
              className="text-xs font-medium text-gray-400 hover:text-red-500 transition"
            >
              Cerrar
            </button>
          </div>
          <p className="text-xl font-semibold text-red-600 mt-2">
            {product.currency ?? '$'}
            {summaryPrice.toLocaleString('es-CO')}
          </p>
        </div>
      </div>

      <section className="space-y-5">
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Selecciona un tipo de carne:
          </p>
          <div className="grid grid-cols-2 gap-3">
            {meatOptions.map((option) => (
              <OptionChip
                key={option.value}
                label={option.label}
                value={option.value}
                type="radio"
                name="meat"
                checked={selectedMeat === option.value}
                onChange={setSelectedMeat}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Selecciona los adicionales:
          </p>
          <div className="grid grid-cols-2 gap-3">
            {EXTRA_OPTIONS.map((option) => (
              <OptionChip
                key={option.value}
                label={option.label}
                value={option.value}
                type="checkbox"
                checked={selectedExtras.includes(option.value)}
                onChange={toggleValue(setSelectedExtras)}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Selecciona las salsas:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {SAUCE_OPTIONS.map((option) => (
                <OptionChip
                  key={option.value}
                  label={option.label}
                  value={option.value}
                  type="radio"
                  name="sauces"
                  checked={selectedSauce === option.value}
                  onChange={setSelectedSauce}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              ¿Desea alguna adición?
            </p>
            <div className="grid grid-cols-2 gap-3">
              {ADDITION_OPTIONS.map((option) => (
                <OptionChip
                  key={option.value}
                  label={option.label}
                  value={option.value}
                  type="checkbox"
                  checked={selectedAdditions.includes(option.value)}
                  onChange={toggleValue(setSelectedAdditions)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Button
        fullWidth
        className="mt-6"
        onClick={handleSubmit}
        icon={null}
      >
        Añadir al carrito
      </Button>
    </div>
  );
};

export default ProductCustomizationPanel;
