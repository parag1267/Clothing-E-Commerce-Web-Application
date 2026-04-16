import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Heart, ShoppingBag } from "lucide-react";
import {
  clearWishlist,
  getWishlist,
  moveToCart,
  removeFromWishlist,
} from "../../features/wishlist/wishlistSlice";
import { useNavigate } from "react-router-dom";

const WishList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wishlist, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleMoveToCart = async (productId) => {
    try {
      await dispatch(moveToCart(productId)).unwrap();
      navigate("/cart");
    } catch (error) {
      console.log("Move to Cart error:", error);
    }
  };

  const handleAllClear = () => {
    dispatch(clearWishlist());
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-28 gap-4">
      <div className="bg-white shadow-xl rounded-2xl px-16 py-12 flex flex-col items-center gap-4">
        <div className="bg-gray-200 p-6 rounded-full shadow-sm">
          <Heart size={40} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700">Your wishlist is empty</h3>
        <p className="text-sm text-gray-400">Save items you love and find them here anytime.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-2 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-700 transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );

  const ProductCard = ({ product }) => {
    const hasDiscount =
      product.discountPercentage > 0 ||
      (product.discountPrice && product.discountPrice < product.price);
    const displayPrice = hasDiscount ? product.discountPrice : product.price;
    const originalPrice = hasDiscount ? product.price : null;

    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">

        {/* Image */}
        <div className="relative aspect-3/4 overflow-hidden">
          <img
            src={product.images?.[0]?.url}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />

          {/* Discount Badge */}
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
              ₹{Math.round(originalPrice - displayPrice)} OFF
            </span>
          )}

          {/* Remove Button */}
          <button
            onClick={() => handleRemove(product._id)}
            className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow hover:bg-red-50 hover:text-red-500 transition"
          >
            <X size={14} />
          </button>
        </div>

        {/* Info */}
        <div className="px-3 pt-3 pb-2 flex flex-col gap-0.5 flex-1">
          <h3 className="text-sm font-semibold text-gray-800 truncate border-b border-dashed border-gray-200 pb-1">
            {product.name}
          </h3>

          <p className="text-xs text-gray-400 mt-1">{product.fitType || product.subCategory?.name}</p>

          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm font-bold text-gray-900">₹{Math.round(displayPrice)}</p>
            {originalPrice && (
              <p className="text-xs text-gray-400 line-through">₹{Math.round(originalPrice)}</p>
            )}
          </div>
        </div>

        {/* Move to Cart */}
        <button
          onClick={() => handleMoveToCart(product._id)}
          className="flex items-center justify-center gap-2 w-full py-2.5 border-t border-gray-100 text-xs font-semibold text-gray-700 hover:bg-gray-900 hover:text-white transition-colors duration-200"
        >
          <ShoppingBag size={14} />
          MOVE TO CART
        </button>

      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-8 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
              My Wishlist
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {wishlist?.length || 0} {wishlist?.length === 1 ? "item" : "items"} saved
            </p>
          </div>

          {wishlist?.length > 0 && (
            <button
              onClick={handleAllClear}
              className="text-sm text-red-500 border border-red-200 px-4 py-2 rounded-full hover:bg-red-500 hover:text-white hover:border-red-500 transition"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-3/4 bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : wishlist?.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default WishList;