import { Heart } from 'lucide-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, fetchTabs, setActiveTab } from '../../features/products/productSlice';
import { useNavigate } from 'react-router-dom';

const ProductList = ({category}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { tabs, products, activeTab, loading } = useSelector((state) => state.products);

    useEffect(() => {
        if(!category) return;
        dispatch(fetchTabs(category));
        dispatch(fetchProducts({tab: "trending",category}));
    }, [category,dispatch])

    const handleTabClick = (tab) => {
        dispatch(setActiveTab(tab.slug));
        dispatch(fetchProducts({ tab: tab.slug, category}));
    }
    return (
        <section className="py-8 md:py-12 bg-white">
            <div className="sticky top-16 z-40 bg-white px-2 md:px-6">
                <div className='flex gap-3 overflow-x-auto py-2 md:py-4 scrollbar-hide'>
                    {tabs.map((tab) => (
                        <button key={tab.slug} onClick={() => handleTabClick(tab)} className={`px-3 py-1.5 rounded-xl text-sm whitespace-nowrap border transition ${activeTab === tab.slug ? "bg-black text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
                            {tab.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 px-2 md:px-6">
                {products.map((item, index) => (
                    <div key={item._id} className="group">
                        <div className="aspect-3/4 relative overflow-hidden group" onClick={() => navigate(`/product/${item._id}`,{state: item})}>
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
        </section>
    )
}

export default ProductList
