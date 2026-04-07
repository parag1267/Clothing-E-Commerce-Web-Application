import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
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
  console.log(wishlist);

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
  }

  const handleAllClear = () => {
    dispatch(clearWishlist())
  }

  return (
    <div className="bg-gray-100 px-4 md:px-8 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[16px] md:text-[22px] text-gray-600 font-semibold">
            My Wishlist ({wishlist?.length || 0} items)
          </h2>

          {wishlist?.length > 0 && (
            <button onClick={handleAllClear} className="text-sm md:text-base text-red-500 border border-red-500 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition">Clear All</button>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : wishlist?.length === 0 ? (
          <p className="text-center text-gray-500 min-h-screen flex justify-center">
            Your wishlist is empty
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">

            {wishlist.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition relative"
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.name}
                    className="w-full h-50 sm:h-58 md:h-66 object-cover rounded-t-lg"
                  />

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="p-1 md:p-2">
                  <h3 className="text-[12px] md:text-[14px] font-semibold line-clamp-1 border-b border-dashed border-gray-400 mb-1">
                    {product.name}
                  </h3>

                  <p className="text-gray-500 text-[12px] md:text-[14px] mb-1">
                    {product.fitType}
                  </p>

                  <p className="text-[12px] md:text-[14px] font-bold">
                    ₹ {product.price}
                  </p>
                </div>


                <button className="w-full border-t py-2 text-sm font-medium text-teal-600 hover:bg-gray-50" onClick={() => handleMoveToCart(product._id)}>
                  MOVE TO CART
                </button>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
};

export default WishList;
