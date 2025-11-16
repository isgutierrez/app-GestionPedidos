const CategoryNav = ({ categories = [], activeCategory, onChange }) => {
  return (
    <div className="bg-white border-b sticky top-20 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center gap-8 overflow-x-auto py-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onChange?.(category)}
              className={`whitespace-nowrap font-medium transition-all pb-2 ${
                activeCategory === category
                  ? "text-gray-900 border-b-2 border-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;