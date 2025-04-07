"use client";
import { SfButton, SfInput, SfSelect } from '@storefront-ui/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { WithSSR, useCart } from '../Cart/cart';
import NotificationManager from '../NotificationManager';



const GiftCardCard = ({ slug, name, minPrice, maxPrice, images, brandName, price, item, notification, toggleNotification }) => {

  // console.log(item, 'price');
  const [currentDenom, setCurrentDenom] = useState(0);
  const [denomError, setDenomError] = useState('');
  const [quantity, setQuantity] = useState(1);

  const denom = price?.denominations?.length > 0 && price?.denominations;
  const cart = WithSSR(useCart, (state) => state);

  useEffect(() => {
    setCurrentDenom(denom[0]);
  }, [denom]);

  const onAddToCart = () => {
    const { cartItems } = cart;
    if (currentDenom > 0) {
      setDenomError('')
      const cartQuantity = Array.isArray(cartItems) && cartItems?.reduce((acc, item) => acc + (item?.quantity), 0);
      if (cartQuantity < 10) {
        // commented and added by yuvanesh for adding the item to cart without checking quantity
        // const productSeletedVariant = { ...product, price: quantity * currentDenom || denom[0], denomination: currentDenom || denom[0] };
        const productSeletedVariant = { ...item, price: currentDenom, denomination: currentDenom || denom[0] };

        for (let i = 0; i < quantity; i++) {
          cart?.addToCart({ ...productSeletedVariant, productId: productSeletedVariant.product_id * currentDenom || denom[0] });
        }
        const currentNotifications = notification;
        toggleNotification([...currentNotifications, quantity])
      } else {
        const currentNotifications = notification;
        toggleNotification([...currentNotifications, -1])
      }

    } else {
      setDenomError('Enter amount to proceed')
    }
  }

  const onDeChange = (e) => {
    if (parseInt(e?.target?.value) >= price?.min && parseInt(e?.target?.value) <= price?.max) {
      setCurrentDenom(e?.target?.value)
      setDenomError('')
    } else {
      setCurrentDenom(0)
      setDenomError(`Amount between ${price?.min} to ${price?.max}`)
    }
  }

  return (
    <>
      <div className='flex justify-center uc-sb  '>
        <div className="flex flex-col mb-5 w-[243px] h-auto rounded-md shadow-lg relative">
          <a
            className=""
            href={`/giftcard/${slug}`}
            aria-label={name}
          >
            <img src={item?.extraa_images?.length > 0 && item?.extraa_images[0] || images?.small || images?.mobile} alt={name || "giftcard"} className=" w-full max-h-[108.92px]  rounded-t-lg " />
          </a>


          <div className="flex flex-col items-start  justify-between">
            <div className='absolute right-0 top-[92px] w-auto px-3 rounded-tl-lg h-[17px] flex justify-center items-center bg-black/[.5]'>
              <p className='text-[10px] font-bold text-white'>{`₹${minPrice} - ₹${maxPrice}` || ""}</p>
            </div>
            <p className=" mt-2 uc-regular text-[#9356C0] pl-4 pr-2 text-sm">{item?.extraa_categories?.length > 0 && item?.extraa_categories[0] || ''}</p>
            <p className=" mt-2 uc-regular text-600 text-[#1B1C1E] pl-4 pr-2 text-sm">{brandName}</p>
            <p className="truncate max-w-[243px] mt-1 font-normal typography-text-sm text-[#1B1C1E] text-700 pl-4 pr-2 text-l">{name}</p>
            {/* <p className="mb-2 mt-1 font-normal typography-text-sm text-[#1B1C1E]/[.7] text-700 pl-4 pr-2 text-l">10% off</p> */}
            <div className='mb-3 mt-4 flex justify-between items-center pl-4 pr-2 w-full'>
              {price?.denominations?.length > 0 &&
                <SfSelect placeholder="-- Select --" size="base" className="w-[145px]"
                  onChange={(e) => setCurrentDenom(e?.target?.value)}
                >
                  {price?.denominations?.map((option) => (
                    <option value={option} key={option}>
                      INR {option}
                    </option>
                  ))}
                </SfSelect>
              }
              {price?.denominations?.length === 0 &&
                <div className='flex flex-col'>
                  <SfInput
                    className='h-[40px]'
                    slotPrefix={"INR"}
                    size="md"
                    placeholder={`Amount`}
                    aria-label="Label size sm"
                    onChange={onDeChange}
                    invalid={denomError?.length > 0}
                  />
                  {denomError?.length > 0 && <p className="text-xs text-red-500 font-medium mt-0.5 ">{denomError}</p>}
                </div>
              }
              <SfSelect placeholder="-- Select --" size="base" className="w-[60px]"
                onChange={(e) => setQuantity(e?.target?.value)}
              >
                {/* {price?.denominations?.map((option) => ( */}
                <option value={1}>{1}</option>
                <option value={2}>{2}</option>
                <option value={3}>{3}</option>
                <option value={4}>{4}</option>
                {/* ))} */}
              </SfSelect>
            </div>
            <div className='flex flex-row justify-center items-center w-full pb-5  inset-x-0 bottom-0'>
              <SfButton size="sm" variant="tertiary" as="a"
                className="relative mt-auto cursor-pointer bg-extraa-purple-btn text-Zoominfo-text-button w-[90%] h-[36px] text-base font-semibold"
                onClick={onAddToCart}
              >
                Add to cart
                {/* Get it from ₹{minPrice || ""} */}
              </SfButton>
            </div>


          </div>
        </div>
      </div>
    </>
  )
}

export default GiftCardCard