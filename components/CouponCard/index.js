'use client'
import dayjs from "dayjs";
import { useState } from "react";
import copyIcon from "../../public/icons/copy.png";
import Image from "next/image";
import NotificationManager from "../NotificationManager";
import { SfIconOpenInNew } from "@storefront-ui/react";
import copy from "copy-to-clipboard";

const CouponCard = ({ couponsItems, handleClick }) => {
    const { coupon } = couponsItems
    const [logoError, SetlogoError] = useState(false);
    // console.log(couponsItems, 'items');
    const [copyCode, setCopyCode] = useState(false);

    const copyToCode = (e, codeCopy) => {
        e.stopPropagation();
        copy(codeCopy)
        setCopyCode(true);
        setTimeout(() => { setCopyCode(false) }, 3000)
        // console.log("coupon.coupon_code");
    }

    let newCoupon = false;
    const today = dayjs().format("MM/DD/YYYY");
    const couponnew = dayjs(couponsItems.created_at).format("MM/DD/YYYY");
    if (today === couponnew) {
        newCoupon = true;
    }

    function validURL(string) {
        let url;
        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }
        return url.protocol === "http:" || url.protocol === "https:";
    }

    return (
        <div key={couponsItems?.id} onClick={() => {
            coupon?.expiry_date &&
            dayjs(coupon?.expiry_date).isAfter() &&
            !couponsItems?.redeemed  &&
            handleClick(couponsItems)
        }}>
            <div className="flex flex-col rounded-xl bg-white text-[rgba(0, 0, 0, 0.87)] mx-8 w-[260px] relative shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <div className={`flex flex-col items-center justify-center text-white py-2 rounded-t-xl`}
                    style={{
                        backgroundColor: coupon?.expiry_date && dayjs(coupon?.expiry_date).isAfter()
                            && !couponsItems?.redeemed ? coupon?.color : "grey"
                    }}
                >
                    <div className="w-[100px] h-[80px] px-[2px] flex items-center justify-center rounded-xl">
                        {!logoError ?
                            <img
                                src={coupon.brand_logo}
                                onError={() => SetlogoError(true)}
                                alt="brand logo"
                                className={`w-full h-full object-contain p-1 rounded-xl`}
                            />
                            :
                            <div className={`w-full rounded-xl bg-white bg-[${coupon?.color}] h-full`}>
                                <h4 className={`mt-8 text-base text-center`}>{coupon?.brand_name}</h4>
                            </div>
                        }
                        {newCoupon && !couponsItems?.redeemed && (
                            <span className="absolute top-[10px] right-[10px] bg-[#FF0000] text-xs rounded-md text-white p-1 ">
                                New
                            </span>
                        )}
                    </div>
                </div>
                <div className="p-3 ">
                    {/* ----------------------- Offer Details --------------------------------- */}
                    <div className="bg-[#F6EEF9] p-3 rounded uc-regular mt-1">
                        <h2 className="text-base uc-sb">
                            {coupon.offer_title && coupon.offer_title.length > 60
                                ? `${coupon.offer_title.substring(0, 60)}...`
                                : coupon.offer_title}
                        </h2>
                        <p className="capitalize text-sm uc-regular">
                            {coupon.offer_subtitle && coupon.offer_subtitle.length > 40
                                ? `${coupon.offer_subtitle.substring(0, 40)}...`
                                : coupon.offer_subtitle}
                        </p>
                    </div>
                    {/* ------------------------------------------ Brand Name and Industry ------------------------------------ */}
                    <div className="flex flex-row justify-between uc-regular">
                        <h3 className="capitalize text-sm ml-3 mt-3 text-[#767778]">
                            {coupon.brand_name}{" "}
                            <span                >
                                {" "}
                                |{" "}
                            </span>{" "}
                            {coupon.industry_name.replace("and", "&")}
                        </h3>
                    </div>
                    {/* ----------------------- Validity --------------------------------- */}
                    <p className="mt-2 mb-1 ml-3 text-sm text-[#767778]">
                        {coupon.expiry_date &&
                            dayjs(coupon.expiry_date).isAfter() &&
                            !couponsItems.redeemed ? (
                            <span>
                                Valid till:{" "}
                                <span style={{ fontFamily: "rota-black" }}>
                                    {dayjs(coupon.expiry_date).format("DD MMM YYYY")}
                                </span>
                            </span>
                        ) : couponsItems.redeemed ? (
                            <span
                                style={{ background: "green", padding: 8, color: "white" }}
                            >
                                {" "}
                                Redeemed
                            </span>
                        ) : (
                            <span style={{ background: "red", padding: 8, color: "white" }}>
                                {" "}
                                Expired
                            </span>
                        )}
                    </p>
                    <div className="divider"></div>
                    <div className="flex flex-row mt-4 justify-between items-center gap-2">
                        <div className="inline-flex items-center justify-between bg-[#F6EEF9] rounded p-2 w-full">
                            <p className="text-[#4F3084] text-xs uc-sb pl-2">
                                {coupon.coupon_code}
                                {/* </span> */}
                            </p>
                            {coupon.expiry_date &&
                                dayjs(coupon.expiry_date).isAfter() &&
                                !couponsItems.redeemed && (
                                    <>
                                        {!copyCode ?
                                            <div>
                                                <Image src={copyIcon} alt="copy" className="w-5 h-5 " onClick={(e) => copyToCode(e, couponsItems.coupon.coupon_code)}
                                                />
                                            </div>
                                            :
                                            <NotificationManager message={"Copied To Clipboard"} alertType={1} />
                                        }
                                    </>
                                )}
                        </div>
                        {validURL(coupon.location) && (
                            <div className="bg-[#F6EEF9] rounded p-1"                            >
                                <a href={coupon.location} target="_blank" rel="noreferrer">
                                    <SfIconOpenInNew />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CouponCard;