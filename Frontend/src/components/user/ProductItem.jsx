import { Heart } from 'lucide-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../features/products/productSlice';


const PRICE_RANGE = {
    "0-500": { minPrice: 0, maxPrice: 500 },
    "500-1000": { minPrice: 500, maxPrice: 1000 },
    "1000-2000": { minPrice: 1000, maxPrice: 2000 },
    "2000+": { minPrice: 2000, maxPrice: null },
};

const ProductItem = ({ category,
    selectedCategories,
    selectedPrice,
    selectedBrands,
    selectedSizes,
    selectedSort = "newest",
    search }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products, loading } = useSelector(state => state.products);

    // =========== Category, Price, Brands  ==========
    useEffect(() => {
        const subParams = selectedCategories?.length > 0
            ? selectedCategories.join(",")
            : undefined

        const brandsParam = selectedBrands?.length > 0
            ? selectedBrands.join(",")
            : undefined

        const sizesParam = selectedSizes?.length > 0
            ? selectedSizes.join(",")
            : undefined

        const priceFilter = selectedPrice ? PRICE_RANGE[selectedPrice] : {};

        //     dispatch(fetchProducts({
        //         category,
        //         sub: subParams,
        //         brands: brandsParam,
        //         sizes: sizesParam,
        //         sort: selectedSort,
        //         search,
        //         ...priceFilter
        //     }))
        // }, [dispatch, category, selectedCategories.join(","), selectedPrice, selectedBrands.join(","), selectedSizes.join(","), selectedSort, search])

        dispatch(fetchProducts({
            category,
            sub: subParams,
            brands: brandsParam,
            sizes: sizesParam,
            sort: selectedSort,
            search: subParams ? undefined : search,
            ...priceFilter
        }))
    }, [
        dispatch,
        category,
        JSON.stringify(selectedCategories),
        selectedPrice,
        JSON.stringify(selectedBrands),
        JSON.stringify(selectedSizes),
        selectedSort,
        search
    ]
    )

    if (loading) {
        return <p className="text-center py-10">Loading...</p>;
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 px-4 md:px-0 py-4 md:py-6">
            {products.map((item, index) => (
                <div key={item._id} className="group">
                    <div className="aspect-3/4 relative overflow-hidden group" onClick={() => navigate(`/product/${item._id}`, { state: item })}>
                        <img
                            src={item.images?.[0]?.url}
                            alt={item.name}
                            className="w-full h-full object-cover transition-all duration-500 group-hover:opacity-0 group-hover:scale-105" />

                        {item.images?.[1]?.url && (
                            <img
                                src={item.images?.[1]?.url}
                                alt={item.name}
                                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105" />
                        )}

                        <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow">
                            <Heart size={16} />
                        </div>
                    </div>

                    <div className="mt-2">
                        <h3 className='text-sm text-[#585c70] font-semibold truncate border-b border-dashed border-gray-400 pb-0.5'>
                            {item.name}
                        </h3>

                        <p className="text-sm text-[#737577] mt-1">
                            {item.subCategory?.name}
                        </p>

                        <p className="text-sm text-[#58595B] font-semibold mt-1">
                            ₹ {item.price}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ProductItem
