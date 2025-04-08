
import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
  return (
    <Link to={`/?category=${category.slug}`} className="block">
      <div className="category-card h-44">
        <img 
          src={category.image} 
          alt={category.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-4 text-white">
            <h3 className="text-xl font-bold">{category.name}</h3>
            <p className="text-sm">{category.productCount} products</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
