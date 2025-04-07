"use client";
import { SfButton, SfInput, SfSelect } from '@storefront-ui/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { WithSSR, useCart } from '../Cart/cart';
import NotificationManager from '../NotificationManager';



const GoodiesCard = ({ item, notification, toggleNotification }) => {

    // console.log(item, 'price')

    const cart = WithSSR(useCart, (state) => state);

    const onAddToCart = () => {
        const { cartItems } = cart;
        const cartQuantity = Array.isArray(cartItems) && cartItems?.reduce((acc, item) => acc + (item?.quantity), 0);
        if (cartQuantity < 10) {
            // commented and added by yuvanesh for adding the item to cart without checking quantity
            // const productSeletedVariant = { ...product, price: quantity * currentDenom || denom[0], denomination: currentDenom || denom[0] };
            const productSeletedVariant = { ...item, product_variants: [item?.product_variants[0]] };

            for (let i = 0; i < 1; i++) {
                cart?.addToCart({ ...productSeletedVariant, productId: productSeletedVariant?.id });
            }
            const currentNotifications = notification;
            toggleNotification([...currentNotifications, 1])
        } else {
            const currentNotifications = notification;
            toggleNotification([...currentNotifications, -1])
        }
    }

    return (
        <>
            <div className='flex justify-center uc-sb  '>
                <div className="flex flex-col mb-5 w-[243px] h-auto rounded-t-lg border-2 border-MFC-White relative shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
                    <a
                        className=""
                        href={`/goodies/${item?.slug}`}
                        aria-label={item?.name}
                    >
                        <img src={item?.images} alt={item?.name || "goodies"} className=" w-full max-h-[138.92px] object-contain p-3 rounded-t-lg z-0" />
                    </a>
                    <div className="flex flex-col items-start  justify-between  ">
                        <p className=" mt-2 uc-regular text-500 text-MFC-black pl-4 pr-2 text-xs">{item?.brand}</p>
                        <p className="truncate max-w-[243px] mt-1 font-normal typography-text-sm text-MFC-black text-700 pl-4 pr-2 text-l">{item?.name}</p>
                        <p className=" mt-2 uc-regular text-MFC-black text-[11px] pl-4 pr-2 ">{item?.category || ''}</p>
                        <div className="border-t-[1px] border-[#aeafaf] mt-4 mx-4 w-[205px]"></div>
                        <p className="truncate max-w-[243px] mt-1 font-normal typography-text-sm text-MFC-black text-700 pl-4 pr-2 text-l my-2">₹{item?.product_variants?.length > 0 && item?.product_variants[0]?.sale_price || 0}</p>
                        <div className='flex flex-row justify-center items-center w-full pb-5  inset-x-0 bottom-0'>
                            <SfButton size="sm" variant="tertiary" as="a"
                                className="mt-auto bg-extraa-purple-btn text-Zoominfo-text-button w-[90%] h-[36px] text-base font-semibold cursor-pointer"
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

export default GoodiesCard