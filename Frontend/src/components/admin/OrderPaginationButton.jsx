import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import ReactPaginate from 'react-paginate'

const OrderPaginationButton = () => {
    const paginationVariants = {
        hidden: {
            opacity : 0,
            y : 200
        },

        visible: {
            opacity : 1,
            y : 0,
            transition : {
                type : "spring",
                stiffness: 260,
                damping : 20,
                furation : 2
            }
        }
    }
    return (
        <motion.div variants={paginationVariants} initial="hidden" animate="visible">
            <ReactPaginate
                breakLabel={<span className='mr-4'>...</span>}
                nextLabel={
                    <span className='w-10 h-10 flex items-center justify-center bg-green-600 hover:bg-green-700 transition text-white rounded-lg'>
                        <ChevronRight style={{color: "white"}} size={18} />
                    </span>
                }
                // onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={20}
                previousLabel={
                    <span className='w-10 h-10 flex items-center justify-center bg-green-600 hover:bg-green-700 transition text-white rounded-lg'>
                        <ChevronLeft style={{color: "white"}} size={18} />
                    </span>
                }
                containerClassName='flex items-center justify-center mt-4 gap-4'
                pageClassName='block border border-green-300 hover:bg-green-100 text-green-700 w-10 h-10 flex items-center justify-center rounded-full font-medium hover:shadow transition'
                renderOnZeroPageCount={null}
                activeClassName='bg-green-600 text-white border-green-600'

            />
        </motion.div>
    )
}

export default OrderPaginationButton
