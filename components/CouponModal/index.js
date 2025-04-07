"use client"
import { SfButton, SfIconChevronRight, SfIconClose, SfIconCloseSm, SfIconLocationOn, SfIconLocationOnFilled, SfIconShoppingCart, SfModal } from '@storefront-ui/react'
import Link from 'next/link'
import React, { useCallback, useId, useRef, useState } from 'react'
import copyIcon from "../../public/icons/copy.png";
import { CSSTransition } from 'react-transition-group';
import parse from "html-react-parser";
import QRCode from 'react-qr-code';
import dayjs from 'dayjs';
import NotificationManager from '../NotificationManager';
import Image from 'next/image';
import copy from "copy-to-clipboard";
import html2canvas from 'html2canvas-pro';
import downloadjs from "downloadjs";

const CouponModal = ({ isModal, openModel, closeModel, couponId }) => {

    const modalRef = useRef(null);
    const backdropRef = useRef(null);
    const headingId = useId();
    const descriptionId = useId();
    const [logoError, SetlogoError] = useState(false);

    const couponProducts = couponId;
    // console.log("couponProducts", couponId);
    function validURL(string) {
        let url;
        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }
        return url.protocol === "http:" || url.protocol === "https:";
    }

    const [copyCode, setCopyCode] = useState(false);

    const copyToCode = (e, codeCopy) => {
        e.stopPropagation();
        copy(codeCopy)
        setCopyCode(true);
        setTimeout(() => { setCopyCode(false) }, 3000)
        // console.log(codeCopy,"coupon.coupon_code");
    }

    const handleDownloadCoupon = useCallback(async () => {
        const coupon1 = document.querySelector("#coupon-dw");
        // console.log("coupon1", coupon1);
        const elementsToHide = document.querySelector('#download');
        // elementsToHide.forEach(element => {
        elementsToHide.style.display = 'none';
        // });
        const canvas = await html2canvas(coupon1, {
            useCORS: true,
            allowTaint: true,
        });
        //console.log("canvas", canvas);
        const dataURL = canvas.toDataURL("image/jpg");
        downloadjs(dataURL, "Extraa Coupon.jpg", "image/jpg");
        // console.log("dataURL", dataURL);
        // elementsToHide.forEach(element => {
        elementsToHide.style.display = 'flex';
        // });
    }, []);

    return (
        <>
            {/* <CSSTransition
                in={isModal}
                nodeRef={backdropRef}
                timeout={200}
                unmountOnExit
                classNames={{
                    enter: 'opacity-0',
                    enterDone: 'opacity-100 transition duration-200 ease-out',
                    exitActive: 'opacity-0 transition duration-200 ease-out',
                }}
            >
                <div ref={backdropRef} className="fixed inset-0 bg-neutral-700 bg-opacity-50 z-40" />
            </CSSTransition>

            <CSSTransition
                in={isModal}
                nodeRef={modalRef}
                timeout={200}
                unmountOnExit
                classNames={{
                    enter: 'translate-y-10 opacity-0',
                    enterDone: 'translate-y-0 opacity-100 transition duration-200 ease-out',
                    exitActive: 'translate-y-10 opacity-0 transition duration-200 ease-out',
                }}
            > */}

            {/* <SfModal open onClose={closeModel} ref={modalRef} as="section"
                    role="alertdialog"
                    aria-labelledby={headingId}
                    aria-describedby={descriptionId}
                    className="z-50 " style={{ backgroundColor: "transparent", border: "none" }} > */}
            <dialog id="my_modal_2" className="modal overflow-y-auto p-4">
                {/* couponTop */}
                <div id="coupon-dw">
                    <div className='flex flex-col  md:h-auto mt-4 rounded-3xl mb-4'  >
                        {/* logo Section */}
                        <div className='flex flex-col bg-[#fff] relative rounded-lg'>
                            <div className={`flex flex-col items-center justify-center text-white py-2 rounded-t-lg`}
                                style={{
                                    backgroundColor: couponProducts?.coupon?.expiry_date && dayjs(couponProducts?.coupon?.expiry_date).isAfter()
                                        && !couponProducts?.redeemed ? couponProducts?.coupon?.color : "grey"
                                }}
                            >
                                <div className="px-[2px] h-[120px] w-[120px] flex items-center justify-center rounded-xl">
                                    {!logoError ?
                                        <img
                                            src={couponProducts?.coupon?.brand_logo}
                                            onError={() => SetlogoError(true)}
                                            alt="brand logo"
                                            className={`w-auto h-auto max-h-[120px] max-w-[120px] object-contain p-1 rounded-xl`}
                                        />
                                        :
                                        <div className={`w-full rounded-xl bg-white bg-[${couponProducts?.coupon?.color}] h-full`}>
                                            <h4 className={`mt-8 text-base text-center`}>{couponProducts?.coupon?.brand_name}</h4>
                                        </div>
                                    }
                                </div>
                            </div>
                            <SfIconClose className='absolute right-2 top-1 cursor-pointer text-white' onClick={() => { document.getElementById('my_modal_2').close() }} />
                        </div>
                        {/* Desc Section */}
                        <div>
                            <div className='flex flex-col items-center justify-center pt-4 bg-[#f7f0f9]'>
                                <QRCode
                                    size={100}
                                    value={"#" + (couponProducts?.id * 121).toString(16).padStart(6, "0").toUpperCase()}
                                    viewBox={`0 0 256 256`}
                                />
                                <p className='mt-2 mb-1' style={{ marginTop: 2, marginBottom: 1 }}>
                                    #{(couponProducts?.id * 121).toString(16).padStart(6, "0").toUpperCase()}
                                </p>

                                <div className='inline-flex items-center justify-between bg-[#f0e2f9] rounded p-2 m-1 mb-2 w-[80%]'>
                                    <p className='uc-sb text-[#4F3084] text-sm pl-2' >
                                        {couponProducts?.coupon?.coupon_code}
                                        {/* </span> */}
                                    </p>
                                    {couponProducts?.coupon?.expiry_date &&
                                        dayjs(couponProducts?.coupon?.expiry_date).isAfter() &&
                                        !couponProducts.redeemed && (
                                            <>
                                                {!copyCode ?
                                                    <div>
                                                        <Image src={copyIcon} alt="copy" className="w-5 h-5 cursor-pointer " onClick={(e) => copyToCode(e, couponProducts.coupon.coupon_code)}
                                                        />
                                                    </div>
                                                    :
                                                    <NotificationManager message={"Copied To Clipboard"} alertType={1} />
                                                }
                                            </>
                                        )}
                                </div>
                            </div>
                        </div>
                        {/* -------------------------------- Brand name -----------------------------  */}
                        <div className='p-6 bg-[#ffff] rounded-b-lg'>
                            <h3 className='capitalize text-sm sb-regular'>
                                {couponProducts?.coupon?.brand_name}
                            </h3>
                            <h3 className='capitalize text-sm uc-sb '>
                                {couponProducts?.coupon?.industry_name}
                            </h3>
                            {/* ----------------------- Validity --------------------------------- */}
                            <p className='mt-2 text-sm'>
                                <span className='text-sm uc-regular text-[#7B7979]'>
                                    Valid till:{" "}
                                </span>
                                {couponProducts?.coupon?.expiry_date &&
                                    dayjs(couponProducts?.coupon?.expiry_date).format("DD MMM YYYY")}
                            </p>
                            {/* ------------------------------------ Offer title -------------------------- */}
                            <div className='mb-2 text-[#4f3084]'>
                                <h2 className='mt-1 uc-sb text-base'>
                                    {couponProducts?.coupon?.offer_title}
                                </h2>
                                {/* ----------------------- Offer Details --------------------------------- */}
                                <p className='capitalize text-base uc-sb'>
                                    {couponProducts?.coupon?.offer_subtitle}
                                </p>
                            </div>

                            <div className="divider"></div>

                            {/*----------------------  location --------------------------------- */}

                            {!validURL(couponProducts?.coupon?.location) && (
                                <div>
                                    <h4 className='inline-flex items-center' >
                                        <SfIconLocationOnFilled className='h-[16px] w-[16px] text-extraa-purple-btn' />
                                        Locations:
                                    </h4>
                                    <p className='break-all'>
                                        <span className='text-sm'>
                                            {couponProducts?.coupon?.location}
                                        </span>
                                    </p>
                                </div>
                            )}
                            {/* ------------------- Download and redeem Buttons ------------- */}

                            <div className='flex gap-3 mb-2 flex-wrap' id="download">
                                {validURL(couponProducts?.coupon?.location) && (
                                    <a href={couponProducts?.coupon?.location} target="_blank" rel="noreferrer">
                                        <SfButton className='h-auto rounded capitalize bg-[#421c4d] text-white'
                                            slotSuffix={<SfIconChevronRight />}
                                        >
                                            Redeem now
                                        </SfButton>
                                    </a>
                                )}
                                <SfButton className='bg-[#f6eef9] h-[40px] rounded !text-[#421C4D] border-2 border-[#421C4D] capitalize '
                                    onClick={handleDownloadCoupon}
                                //  slotSuffix={<SfIconDownload />}
                                >
                                    Download
                                </SfButton>
                            </div>
                        </div>
                    </div>

                    {/* CouponBottom */}
                    <div className='rounded-lg mt-4 bg-[#fff]'>
                        <div className='p-4 mt-2 ml-2 flex items-center justify-between w-full'>
                            <h2 style={{ fontSize: "1.2em" }}>Terms & Conditions</h2>
                            {!logoError ?
                                <img
                                    src={couponProducts?.coupon?.brand_logo}
                                    onError={() => SetlogoError(true)}
                                    alt="brand logo"
                                    className={`w-auto h-auto max-h-[75px] max-w-[75px] object-contain p-1 rounded-xl`}
                                />
                                :
                                <div className={`w-full rounded-xl bg-white bg-[${couponProducts?.coupon?.color}] h-full`}>
                                    <h4 className={`mt-8 text-base text-center`}>{couponProducts?.coupon?.brand_name}</h4>
                                </div>
                            }
                        </div>
                        <div style={{ border: `1px solid ${couponProducts?.coupon?.color}` }}>
                        </div>
                        {/* <div sx={{ display: "flex" }}> */}
                        <div className='flex flex-col p-4 pb-4'>
                            <div className="terms" >
                                {couponProducts && parse(couponProducts?.coupon?.terms.replace("<p>&nbsp;</p>", ""))}
                            </div>
                        </div>
                        {/* </div> */}
                    </div>
                </div>
            </dialog>
            {/* </SfModal> */}

            {/* </CSSTransition> */}
        </>
    )
}

export default CouponModal