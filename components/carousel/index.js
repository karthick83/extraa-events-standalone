import React from 'react';
import like from "@/public/icons/avatar.png";
import shopping from "@/public/icons/shoping.png";
import { SfButton } from '@storefront-ui/react';
import Image from 'next/image';

const ProductCarousel = ({ products, onCartClick, removeFromCart, onDealClick, part }) => {

  return (
    <div>


      {part == 1 ?
        <h2 className='rota-bold text-4xl  text-[#3635A6] text-center p-4 md:p-10'> OUR TOP DEALS</h2>
        :
        <h2 className='rota-bold text-4xl  text-[#3635A6] text-center p-4 md:p-10'> OUR TOP GIFT CARDS</h2>
      }
      <div className='relative'>
        {/* <p className=' bg-[#fab516] p-4 rota-bold rounded-3xl px-16 text-extraa-blue absolute top-1/2 left-1/2 text-6xl z-50 -translate-x-1/2  -translate-y-1/2'> Coming Soon</p> */}
        {/* <div className='absolute   bg-black opacity-30  w-full h-full z-30'></div> */}
        <div className=''>
          <swiper-container navigation="true" grab-cursor="true" pagination="true" slides-per-view="1" breakpoints='{"1024": {"slidesPerView": 4}, "768" : {"slidesPerView": 2}}'>
            {products?.length > 0 && products?.map(({ id, brand, name, type, category, images, product_variants, qty, minPrice
              , maxPrice
            }) => (
              <swiper-slide key={name}>
                <div className="flex flex-col mb-12 md:mx-10  sm:mx-6 m-2.5 min-h-[400px] relative border border-neutral-200 rounded-md hover:shadow-xl p-2.5">
                  <div className='flex justify-end items-center absolute top-[25px] right-[20px]'>
                    <Image src={like} alt="like" />
                  </div>
                  {part == 1 ?
                    <a
                      className=""
                      href={`/deals/${id}`}
                      aria-label={name}
                    >
                      <img src={images} alt={name || "undefined"} className=" p-10 object-contain  rounded-t-md aspect-video min-w-336px min-h-[244px] rounded-lg" />
                    </a> :
                    <a
                      className=""
                      href={`/giftcard/${id}`}
                      aria-label={name}
                    >
                      <img src={images?.small || images?.base} alt={name || "undefined"} className=" p-10 object-contain  rounded-t-md aspect-video min-w-336px min-h-[244px] rounded-lg" />
                    </a>
                  }
                  {/* {part == 1 ?
                    <div className='absolute bottom-[20%] right-[12px]'>
                      {qty > 0 ?
                        <div className='p-2 bg-[#3734a9] w-[60px] flex rounded-full items-center justify-between text-white font-bold cursor-pointer'>
                          <div className='text-2xl' onClick={(e) => { removeFromCart(e, id) }}>-</div>
                          <div className="text-xl">{qty}</div>
                          <div className="text-2xl" onClick={(e) => { onCartClick(e, id) }}>+</div>
                        </div>
                        :
                        <Image src={shopping} alt='shopping' onClick={(e) => onCartClick(e, id)} />
                      }
                    </div> : ""
                  } */}
                  <div className=' border-r-4 absolute top-[25px] left-[10px] w-[114px] h-[34px] flex justify-center items-center bg-slate-200'>
                    <p className='text-xs font-light text-black'>{category || `₹${minPrice}-₹${maxPrice}` || ""}</p>
                  </div>
                  <div className="flex flex-col items-start grow">
                    <p className="font-medium typography-text-base pl-2">{brand}</p>
                    <p className="mt-1 mb-4 font-normal typography-text-base text-neutral-700 pl-2 pr-16 min-h-[48px]">{name}</p>
                    {part == 1 ? (
                      <div className='flex flex-row justify-center items-center w-full pb-5 absolute inset-x-0 bottom-0'>
                        <SfButton size="sm" variant="tertiary" onClick={(e) => { onDealClick(e, product_variants[0]?.id, product_variants[0]?.sale_price) }} className="relative mt-auto bg-indigo-700 text-white w-[173px] h-[34px] text-base font-semibold">

                          Get Deal for {product_variants?.length > 0 && product_variants[0]?.sale_price || ""}
                        </SfButton>
                      </div>)
                      :
                      (
                        // <div className='flex flex-row justify-center items-center w-full p-4'>                   
                        //     <SfButton size="sm" variant="tertiary" onClick={(e) => { onDealClick(e, product_variants[0]?.id, product_variants[0]?.sale_price) }} className="relative mt-auto bg-indigo-700 text-white w-[173px] h-[34px] text-base font-semibold">

                        //       Get deal for ₹{minPrice} - {maxPrice}
                        //     </SfButton>
                        //   </div>
                        null
                      )
                    }
                  </div>
                </div>
              </swiper-slide>
            ))}
          </swiper-container>
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;
