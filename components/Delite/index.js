"use client"

import Loader from "@/components/loader";
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import DotLoader from "../DotLoader";
import noData from "@/public/assets/noData.png";

import GetDeliteCoupons from "@/queries/GetDeliteCoupons";
import DeliteCard from "@/components/DeliteCard";

import Image from "next/image";
import GetSpaceById from "@/queries/GetSpacesById";
import Thumbs from "@/public/icons/Thumbs.gif"
import Coins from "@/public/icons/Coins.gif"
import logo from "@/public/icons/new_logo.png"
import { useSearchParams } from 'next/navigation'


const d = new Date();
const isoDate = d.toISOString();


const DeliteComponent = ({ space_id, token, user_id }) => {

    // console.log(token, "Token from deliteComponent");

    const [selectedCoupons, setSelectedCoupons] = useState([]);
    const [endScreen, setEndScreen] = useState(false);
    const [welcomeScreen, setWelcomeScreen] = useState(true);
    const [endLoading, setEndLoading] = useState(false);


    // >>>>>>>>>>>>  Get Space Query Call <<<<<<<<<<<<<<<<<<<<<<<<<<
    const { data: spaceData, loading: spaceLoading, error: spaceError } = useQuery(GetSpaceById, {
        variables: {
            id: space_id
        },
        context: { headers: { Authorization: `Bearer ${token}` } }
    });


    // Construct the "where" variable

    const city = spaceData?.spaces_by_pk?.location?.city;
    const industry = spaceData?.spaces_by_pk?.merchant_spaces[0]?.merchant?.industry;

    // >>>>>>>>>>>>  Delite Query Call <<<<<<<<<<<<<<<<<<<<<<<<<<
    const { data, loading, error } = useQuery(GetDeliteCoupons, {
        variables: {
            user_id: user_id,
            space_id: space_id,
            where: {
                "coupon_param": { "_or": [{ "location_json": { "_contains": { "city": city } } }, { "location_json": { "_contains": ["ALL"] } }] },
                "status": { "_eq": 1 },
                "expiry_date": {
                    "_gte": isoDate
                },
                "industry": { "_neq": industry }
            },
        },
        context: { headers: { Authorization: `Bearer ${token}` } }
    });

    //  >>>>>>>>>>>> Handle coupon selection <<<<<<<<<<<<<<<<<<<<
    const handleSelect = (id) => {
        const newSelectedCoupons = selectedCoupons;
        newSelectedCoupons?.includes(id) ? newSelectedCoupons.splice(newSelectedCoupons.indexOf(id), 1) : newSelectedCoupons?.length < 3 && newSelectedCoupons.push(id);
        // console.log(newSelectedCoupons);
        setSelectedCoupons([...newSelectedCoupons]);
    }



    //  >>>>>>>>>>>> Handle End Journey  <<<<<<<<<<<<<<<<<<<<

    const endApiCall = async (token, space_id, couponObj, outcome) => {
        try {
            const response = await fetch("https://bwcoajo4lu74l4xmsylksnjah40ejlck.lambda-url.ap-south-1.on.aws/ ", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: token, space_id: space_id, couponObj: couponObj, outcome: outcome })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log(responseData);
            return responseData;
        } catch (error) {
            console.error("Error making POST request:", error);
        }
    };


    const handleDone = async (couponsArray) => {
        setEndLoading(true);
        const couponObj = couponsArray?.map((coupon_id) => {
            return { coupon: { "id": coupon_id, "code_type": data?.coupons?.find(c => c.id === coupon_id)?.code_type } }
        })

        const outcome = couponsArray?.map((coupon_id) => {
            return data?.coupons?.find(c => c.id === coupon_id)
        })
        outcome.silverCoins = 50;

        const result = await endApiCall(token, space_id, couponObj, outcome);

        setEndScreen(true);
        setEndLoading(false);


    }

    return (
        <>

            <div className="flex lg:flex-nowrap justify-center items-center w-full min-h-[70vh]">
                <div className='w-full'>
                    {loading ? <Loader /> :

                        <div>

                            {welcomeScreen && <div className="bg-extraa-delite-bg">
                                <div className="h-screen flex flex-col items-center justify-center bg-[url('/icons/delite_bg.png')] md:bg-none bg-cover bg-right-top bg-no-repeat"  >
                                    <div className="flex justify-center mb-8">
                                        <Image src={logo} alt="extraa logo" />
                                    </div>
                                    <div className="flex justify-center rounded-full bg-[#481d66] w-44 h-44">
                                        <Image src={Thumbs} alt="thumbs up" />
                                    </div>
                                    <div className="text-white text-center uc-medium my-4">
                                        <p className="kalnia text-4xl">Thank You!</p>
                                        <p className="text-md  my-4 px-8">As a token of our appreciation, we&apos;re thrilled to offer you some exciting coupons</p>

                                    </div>
                                    <div className="mt-2">
                                        <button onClick={() => setWelcomeScreen(false)} className="btn btn-wide bg-extraa-yellow uc-sb text-lg border-none">Lets Go!</button>
                                    </div>
                                </div>
                            </div>}
                            <>
                                {endScreen ?
                                    <div className="bg-extraa-delite-bg">
                                        <div className="h-screen flex flex-col items-center justify-center bg-[url('/icons/delite_bg.png')] md:bg-none bg-cover bg-right-top bg-no-repeat"  >
                                            {/* <div className="flex justify-center">
                                                <Image src={Coins} className="max-w-[200px]" alt="extraa coins" />
                                            </div> */}
                                            <div className="flex justify-center">
                                                {selectedCoupons?.map((coupon_id) =>
                                                    <div key={coupon_id} className="ml-[-18px]" >
                                                        <img className="w-20 h-20 border-black border object-contain rounded-full" style={{ background: data?.coupons?.find(c => c.id === coupon_id)?.color }} src={data?.coupons?.find(c => c.id === coupon_id)?.brand_logo} alt={data?.coupons?.find(c => c.id === coupon_id)?.brand_name} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-white text-center uc-medium my-4">
                                                <p className="text-xl">03 Coupons</p>
                                                <p className="text-xl">& 50 Silver coins</p>
                                                <p className="text-sm">successfully added to your account </p>
                                            </div>
                                            <div className="mt-8">
                                                <a href="/my-coupons">
                                                    <button className="btn btn-wide bg-extraa-yellow uc-sb text-lg border-none">View Now</button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>


                                    : !welcomeScreen &&

                                    <>
                                        <div className="bg-white uc-sb fixed z-10 py-3 text-center w-full">
                                            <p className=" text-extraa-dark-purple text-lg">You can pick 3 coupons of your choice!</p>
                                        </div>
                                        {(error || !data?.coupons?.length > 0) && <div>
                                            <Image src={noData} alt="no data" />
                                        </div>}
                                        <div className="flex justify-center p-4 ">

                                            <div className="max-w-xl gap-3 md:gap-4 flex justify-around md:justify-center flex-wrap mt-16 mb-20 ">
                                                {data?.coupons.map((coupon) =>
                                                    <div onClick={() => handleSelect(coupon?.id)} key={coupon?.id}>
                                                        <DeliteCard
                                                            image={coupon?.brand_logo}
                                                            title={coupon?.offer_title}
                                                            subtitle={coupon?.offer_subtitle}
                                                            industry={coupon?.industry_name}
                                                            bgColor={coupon?.color}
                                                            brandName={coupon?.brand_name}
                                                            selected={selectedCoupons?.includes(coupon?.id)}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                        </div>
                                        <div className=" uc-sb fixed z-10 py-2 bg-white text-center w-full bottom-0">
                                            <p className=" mb-2 text-md">Selected {selectedCoupons?.length}</p>
                                            {selectedCoupons?.length >= 3 && <button disabled={endLoading} onClick={() => handleDone(selectedCoupons)} className="uc-bold btn btn-wide bg-extraa-yellow text-xl"> {endLoading ? <DotLoader /> : "Done"}</button>}
                                        </div>
                                    </>
                                }
                            </>
                        </div>
                    }
                </div>
            </div >

        </>
    );
};


export default DeliteComponent;
