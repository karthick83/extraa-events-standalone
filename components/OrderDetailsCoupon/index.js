import { SfScrollable } from '@storefront-ui/react'
import { Dayjs } from 'dayjs'
import moment from 'moment'
import Link from 'next/link'
import React from 'react'

const OrderDetailsCoupon = (user_coupons) => {
  // console.log(user_coupons.user_coupons);
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };
  return (
    <>
           
            <h1 className="mb-5 text-center font-extrabold text-5xl dark:text-white text-gray-900">Enjoy Exclusive <span className="text-extraa-blue">Deals.</span></h1>
      <div className='flex justify-center px-5'>
      <SfScrollable style={{ '!&::WebkitScrollbar': { width: 0, height: 0 } }} className=" max-w-[360px] md:max-w-[600px]  snap-x snap-mandatory " drag={true} buttonsPlacement={"none"}>
      {user_coupons&&user_coupons?.user_coupons?.map((coupon,index)=>(
      <section key={index} className='mb-5 cursor-pointer' >
        <div  className="mx-auto flex justify-center gap-3">
            <Link href='/my-coupons'>
            <article  className=" min-w-[145px] rounded-xl max-w-[150px] bg-white p-3 shadow-lg hover:shadow-xl">
              <a >
                <div className="relative flex items-end overflow-hidden rounded-xl">                
                  <img className=' object-fill w-full h-20' src={coupon.coupon.brand_logo} alt="Hotel Photo" />                  
                </div>

                <div className="mt-1 p-2 ">
                  <p className="text-black font-semibold mt-1 text-sm h-20 overflow-hidden">{truncateText(coupon?.coupon.offer_title,50)}</p>                 
                </div>
              </a>
            </article>
            </Link>
        </div>
      </section>
     ))}
      </SfScrollable>
      </div>
      
    </>
  )
}

export default OrderDetailsCoupon