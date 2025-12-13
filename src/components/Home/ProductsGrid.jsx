// ProductsGrid.jsx
import { motion } from 'framer-motion';
import Products from './Products';

const ProductsGrid = ({ products = [] }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-gray-600 font-poppins">No products available.</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Products product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductsGrid;
