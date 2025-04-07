import { SfScrollable } from '@storefront-ui/react'
import React from 'react'

const SponserLogos = ({sponser_logos}) => {
  return (
    <>
         <h1 className="mb-2 text-center font-extrabold text-2xl text-gray-900">Sponsored By<span className="text-extraa-blue">.</span></h1>
      <swiper-container   autoplay="true" speed="100" delay="50" slides-per-view="2"  breakpoints='{"1024": {"slidesPerView": 4}, "768" : {"slidesPerView": 2}}' >
      {sponser_logos && sponser_logos?.map((coupon,index)=>(
      <swiper-slide key={index}  >
        <div  className="flex items-center h-full !">

                  <img className="object-fit w-full  p-3 dark:bg-white bg-white " src={coupon} alt="sponsor" />                  
           </div>  
      
        </swiper-slide>
        
     ))}
     
      </swiper-container>
    
     
    </>
  )
}

export default SponserLogos
