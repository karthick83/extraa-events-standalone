import { SfButton } from '@storefront-ui/react';
import Image from 'next/image';
import React from 'react'
import like from "../../public/icons/avatar.png";
import shop from "../../public/icons/shoping.png";
import Ticket from '../Tickets';
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation';



const ProductCard = ({item,index,onDealClick,onCartClick,onGiftClick,removeFromCart}) => {
  const navigate = useRouter();
  // const onClick=(id)=>{
  //   navigate.push(`/tickets/${  id}`)
  // } 
 
  return (
    <>
    
        {item?.length>0&&item?.map((item,index)=>(
          
        <div key={index} className="flex flex-col mb-12 md:mx-10 min-h-[500px]  sm:mx-6 m-2.5 relative border border-neutral-200 border-double h- rounded-md hover:shadow-xl p-2.5" >
        {/* {console.log(item,"item")} */}
              <div className='flex justify-end items-center absolute top-[25px] right-[20px]' >
                <Image src={like} alt="like" />
              </div>
              {item?.type == 1 ?
                <a
                  className=""
                  href={`/deals/${item?.id}`}
                  aria-label={item.name}
                >
                  <img src={item?.images} alt={item?.name}  className=" p-10 object-contain  rounded-t-md aspect-video min-w-[150px] min-h-[244px] rounded-lg" />
                </a> : item.type == 2 ? 
                  <a
                  className=""
                  href={`/tickets/${item?.id}`}
                  aria-label={item.name}
                >
                  <img src={item?.images} alt={item.name}  className=" p-10 object-contain  rounded-t-md aspect-video min-w-[150px] min-h-[244px] rounded-lg" />
                </a> 
                  
                :
                <a
                  className=""
                  href={`/giftcard/${item?.id}`}
                  aria-label={item.name}
                >
                  <img src={item?.images?.base||item?.images}  alt={"cart"} className="  p-10 object-contain  rounded-t-md aspect-video  min-h-[244px] rounded-lg" />
                </a>
              }
              {item.type == 1 ?
                <div className='absolute bottom-[20%] right-[12px]'>
                  {item?.qty > 0 ?
                    <div className='p-2 bg-[#3734a9] w-[60px] flex rounded-full items-center justify-between text-white font-bold cursor-pointer'>
                      <div className='text-2xl' onClick={(e) => {removeFromCart(e,item.id) }}>-</div>
                      <div className="text-xl">{item?.qty}</div>
                      <div className="text-2xl" onClick={(e) => {onCartClick(e, item.id) }}>+</div>
                    </div>
                    :
                    <Image  src={shop}  alt='cart' onClick={(e) => onCartClick(e,item.id)} />
                    
                  }
                </div> : ""
              }
              <div className=' border-r-4 absolute top-[25px] left-[10px] w-[114px] h-[34px] flex justify-center items-center bg-slate-200'>
                <p className='text-xs font-light text-black'>{item.category || `₹${item.minPrice}-₹${item.maxPrice}` || ""}</p>
              </div>
              <div className="flex flex-col items-start grow">
                <p className="font-medium typography-text-base pl-2">{item.brand}</p>
                {/* <p className="font-medium typography-text-base pt-4 pl-2">{dayjs(metadata?.eventStartDate)?.format('ddd, MMM D')}</p> */}
                <p className="mt-1 mb-4 font-normal typography-text-base text-neutral-700 pl-2 pr-16 min-h-[48px]">{item.name}</p>
                {item.type == 1 ? (
                  <div className='flex flex-row justify-center items-center w-full absolute pb-10 inset-x-0 bottom-0'>
                    <SfButton size="sm" variant="tertiary" onClick={(e) => { onDealClick(e, item?.product_variants[0]?.id, item?.product_variants[0]?.sale_price) }} className="relative  mt-auto bg-indigo-700 text-white w-[173px] h-[34px] text-base font-semibold">

                      Get Deal for {item.product_variants?.length > 0 && item.product_variants[0]?.sale_price || ""}
                    </SfButton>
                  </div>)
                  : item.type==2?
                  <div className='flex flex-row justify-center items-center w-full absolute pb-10 inset-x-0 bottom-0'>
                    <a  href={`/tickets/${item?.id}`}
                  aria-label={item?.name}>
                        <SfButton size="sm" variant="tertiary"  className="relative  mt-auto bg-indigo-700 text-white w-[173px] h-[34px] text-base font-semibold">

                          Tickets From {item.product_variants?.length > 0 && item.product_variants[0]?.sale_price || ""}
                        </SfButton>
                    </a>
                  </div>:""
                }
              </div>
            </div>
    ))}
    
    </>
  )
}

export default ProductCard