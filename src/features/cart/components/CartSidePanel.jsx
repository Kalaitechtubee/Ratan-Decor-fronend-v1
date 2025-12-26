import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    XMarkIcon,
    ShoppingBagIcon,
    TrashIcon,
    PlusIcon,
    MinusIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { getProductImageUrl } from '../../../utils/imageUtils';

export default function CartSidePanel({ isOpen, onClose }) {
    const navigate = useNavigate();
    const {
        cart,
        updateCartItem,
        removeFromCart,
        cartLoading,
        getCartSummary
    } = useCart();

    const [updatingItems, setUpdatingItems] = useState(new Set());
    const [removingItems, setRemovingItems] = useState(new Set());

    const cartSummary = getCartSummary();

    // Animation variants
    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.3 }
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.3 }
        }
    };

    const panelVariants = {
        hidden: { x: '100%', opacity: 0.5 },
        visible: {
            x: 0,
            opacity: 1,
            transition: { type: 'spring', damping: 25, stiffness: 300 }
        },
        exit: {
            x: '100%',
            opacity: 0,
            transition: { duration: 0.3, ease: 'easeInOut' }
        }
    };

    const handleQuantityChange = async (cartItemId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) return;

        setUpdatingItems(prev => new Set(prev).add(cartItemId));
        try {
            await updateCartItem(cartItemId, newQuantity);
        } catch (error) {
            console.error('Failed to update quantity:', error);
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(cartItemId);
                return newSet;
            });
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        setRemovingItems(prev => new Set(prev).add(cartItemId));
        try {
            await removeFromCart(cartItemId);
        } catch (error) {
            console.error('Failed to remove item:', error);
        } finally {
            setRemovingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(cartItemId);
                return newSet;
            });
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price || 0);
    };

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    const handleViewCart = () => {
        onClose();
        navigate('/cart');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                        onClick={onClose}
                    />

                    {/* Side Panel */}
                    <motion.div
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-white shadow-2xl flex flex-col h-full"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                            <div className="flex items-center gap-2">
                                <ShoppingBagIcon className="w-6 h-6 text-[#ff4747]" />
                                <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">
                                    {cartSummary.itemCount}
                                </span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                                        <ShoppingBagIcon className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Your cart is empty</h3>
                                    <p className="text-gray-500 max-w-xs">
                                        Looks like you haven't added anything to your cart yet.
                                    </p>
                                    <button
                                        onClick={() => {
                                            onClose();
                                            navigate('/products');
                                        }}
                                        className="mt-4 px-6 py-2 bg-[#ff4747] text-white rounded-lg font-medium hover:bg-[#ff4747]/90 transition-colors"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                cart.map((item) => {
                                    const product = item.product || {};
                                    const price = item.itemCalculations?.unitPrice || product.price || 0;
                                    const itemTotal = item.itemCalculations?.totalAmount || (price * item.quantity);
                                    const isUpdating = updatingItems.has(item.id);
                                    const isRemoving = removingItems.has(item.id);

                                    return (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            className={`bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex gap-3 ${isRemoving ? 'opacity-50' : ''}`}
                                        >
                                            {/* Image */}
                                            <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                                                <img
                                                    src={getProductImageUrl(product)}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = 'https://placehold.co/100x100?text=No+Image';
                                                    }}
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start gap-2">
                                                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                                                            {product.name}
                                                        </h3>
                                                        <button
                                                            onClick={() => handleRemoveItem(item.id)}
                                                            disabled={isRemoving}
                                                            className="text-gray-400 hover:text-red-500 p-1 -mr-1 transition-colors flex-shrink-0"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    {product.category && (
                                                        <p className="text-xs text-gray-500 mt-0.5">{product.category.name}</p>
                                                    )}
                                                </div>

                                                <div className="flex items-end justify-between mt-2">
                                                    {/* Quantity Control */}
                                                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50/50">
                                                        <button
                                                            onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                                            disabled={item.quantity <= 1 || isUpdating}
                                                            className="p-1 px-2 hover:bg-gray-100 text-gray-600 disabled:opacity-30 transition-colors"
                                                        >
                                                            <MinusIcon className="w-3 h-3" />
                                                        </button>
                                                        <span className="text-sm font-medium w-6 text-center text-gray-900">
                                                            {isUpdating ? (
                                                                <div className="w-3 h-3 border-2 border-[#ff4747] border-t-transparent rounded-full animate-spin mx-auto" />
                                                            ) : item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                                            disabled={isUpdating}
                                                            className="p-1 px-2 hover:bg-gray-100 text-gray-600 disabled:opacity-30 transition-colors"
                                                        >
                                                            <PlusIcon className="w-3 h-3" />
                                                        </button>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-[#ff4747]">
                                                            {formatPrice(itemTotal)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="border-t border-gray-100 bg-white p-4 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-lg font-bold text-gray-900">
                                        <span>Total</span>
                                        <span className="text-[#ff4747]">{formatPrice(cartSummary.totalAmount)}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={handleViewCart}
                                        className="px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                                    >
                                        View Cart
                                    </button>
                                    <button
                                        onClick={handleCheckout}
                                        disabled={cartLoading}
                                        className="px-4 py-3 rounded-xl bg-[#ff4747] text-white font-semibold hover:bg-[#ff4747]/90 transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70"
                                    >
                                        {cartLoading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Checkout
                                                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
