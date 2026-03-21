import navbard from '../assets/img/navbar.png'

export const HeroSection = () => {
  return (
    <div className="relative bg-black overflow-hidden">
      {/* Imagen de fondo completa */}
      <img
        src={navbard}
        alt="Mr. FOOD - Delicious food"
        className="w-full h-full object-cover"
      />
    </div>
  );
};
