import React from 'react';

const CategorySpotlight = () => {
  return (
    <div className="bg-gray-100 w-full py-20 mt-5border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          
          <div className="lg:max-w-xl">
            <span className="text-primary font-bold text-xs tracking-widest uppercase mb-4 block">
              Related Products
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 font-title leading-[1.1] uppercase tracking-tight">
              The Best Interior Solutions <br /> For Your Space
            </h2>
          </div>

          <div className="lg:max-w-md">
            <p className="text-gray-600 font-poppins text-base leading-relaxed">
              The key to great design is capturing the spirit of the client and the
              essence of the space. Decorating is like music — harmony is what we
              constantly strive for.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CategorySpotlight;
