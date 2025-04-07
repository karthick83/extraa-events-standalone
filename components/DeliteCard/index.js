"use client";
import { SfButton, SfInput, SfSelect } from '@storefront-ui/react';
import React, { useEffect, useState } from 'react'
import tickIcon from "@/public/icons/tick.png"
import Image from 'next/image';



const DeliteCard = ({ image, brandName, title, subtitle, expiry, industry, bgColor, selected }) => {

  // console.log(item, 'price');
  const [quantity, setQuantity] = useState(1);




  return (
    <>
      <div className='flex justify-center uc-sb h-full relative'>
        <div className="flex flex-col mb-5 w-[154px] h-auto shadow-lg relative rounded-xl border-[3px] border-white" style={selected ? { borderColor: "black" } : {}}>
          <div className=" p-4 rounded-t-lg flex justify-center" style={{ background: bgColor }}>
            <img src={image} alt={brandName || "coupon"} className=" w-auto h-[60px] object-contain " />
          </div>
          {selected && <Image src={tickIcon} width={76} alt='selected' className='absolute left-0 top-0' />}


          <div className="flex flex-col items-start  justify-between">

            <p className=" truncate max-w-[150px] mt-2 uc-bold text-[#1B1C1E] pl-4 pr-2 text-sm capitalize">{brandName?.toLowerCase()}</p>
            <p className="uc-regular text-[#9356C0] pl-4 pr-2 text-sm capitalize">{industry?.toLowerCase()}</p>
            <hr className='border border-t-black border-dashed w-full my-2' />
            <p className=" mt-1 mb-3  text-[#1B1C1E] text-700 pl-4 pr-2 text-xs"><span className='capitalize'>{title?.toLowerCase()}</span> {
              subtitle
            }
            </p>




          </div>
        </div>
      </div>
    </>
  )
}

export default DeliteCard