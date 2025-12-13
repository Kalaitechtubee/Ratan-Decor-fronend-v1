import React from 'react';
import { Button } from '../../../components/UI';

export default function ProductCard({ product }) {
  return (
    <div className="border rounded-md p-3">
      <img src={product?.thumbnail || product?.image} alt={product?.name} className="w-full h-40 object-cover rounded" />
      <div className="mt-3">
        <h3 className="text-sm font-semibold line-clamp-1">{product?.name}</h3>
        <p className="text-gray-600 text-sm">₹{product?.price}</p>
        <Button className="mt-2 w-full">Add to Cart</Button>
      </div>
    </div>
  );
}