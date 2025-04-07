"use client"

import { GetOrderById } from "@/queries/GetOrders";
import { useQuery } from "@apollo/client";
import { SfButton, SfChip, SfDropdown, SfIconCalendarToday, SfIconLocationOn, SfIconSchedule, SfLink, useDisclosure } from "@storefront-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";
import QRCode from "react-qr-code";
import dayjs from "dayjs";
import LoginModal from "@/components/LoginModal";
import { decode } from "@yag/id-hash";
import OrderDetailsCoupon from "@/components/OrderDetailsCoupon";
import { superadmin } from "@/app/page";
import SponserLogos from "../SponserLogos";
import Link from "next/link";



// param.dealsId
const TicketsOrderDetails = ({ params, orderId, orderDetails, loading }) => {
    // console.log(params);
    const token = superadmin;

    const coupon_id = orderDetails?.order_products[0].product_variant?.product?.coupon_id
    const sponser_logos = orderDetails?.order_products[0].product_variant?.product.metadata?.sponsorImages
    // console.log(orderDetails, "brand");
    const user_coupons = orderDetails?.order_products[0]?.product_variant?.qr?.qr_coupons;
    // console.log(user_coupons,"UserCoupon");
    const [eventDetails, setEventDetails] = useState(null);

    const { isOpen: isModal, open: modalOpen, close: modalClose } = useDisclosure({ initialValue: false });


    useEffect(() => {
        if (orderDetails?.hasOwnProperty("order_products")) {
            // Iterate through each order product
            for (const orderProduct of orderDetails.order_products) {

                // Check if "product_variant" key exists and its "type" is equal to 2
                if (
                    orderProduct?.hasOwnProperty("product_variant") &&
                    orderProduct?.product_variant?.hasOwnProperty("product") &&
                    orderProduct?.product_variant?.product?.hasOwnProperty("type") &&
                    orderProduct?.product_variant?.product?.type === 2

                ) {
                    setEventDetails(orderProduct);

                }
            }
        }
    }, [orderDetails]);


    return (
        <>
            {token ?
                (loading ? <div className="flex justify-center items-center min-h-[80vh]"> <Loader /></div>
                    :
                    <div className="p-5  ">
                        {sponser_logos &&
                            <SponserLogos
                                sponser_logos={sponser_logos}
                            />
                        }
                        {orderDetails &&
                            <div className="w-full  ">

                                <div className="container max-w-[600px] mx-auto ">

                                    <>
                                        <h2 className="text-3xl font-extrabold text-center mb-5 text-extraa-black"> Order Details</h2>

                                        <div className="flex w-full md:flex-row justify-between items-center bg-[#f1f1f1] rounded-t-3xl ">

                                            <div className=" my-8 ml-6 ">
                                                {/* <p className="text-sm">Placed on: {dayjs(orderDetails?.created_at)?.format('DD MMM YYYY')}</p> */}
                                                {orderDetails?.discount_code &&
                                                    <p className="text-sm"> Code used: {orderDetails?.discount_code}</p>
                                                }
                                                <p className="text-sm">Order ID: <span className="uc-sb">#{orderDetails?.id}</span></p>
                                                {orderDetails?.order_transactions?.length > 0 &&
                                                    <p className="text-sm">Transaction ID:
                                                        {orderDetails?.order_transactions?.map((t) => <span className="uc-sb" key={t?.id}> #{t?.id} </span>)}
                                                    </p>
                                                }
                                                {eventDetails &&
                                                    <>
                                                        <h3 className="text-l mt-4 font-bold"> Event Details</h3>
                                                        <p className="text-sm"><SfIconCalendarToday size="xs" /> {eventDetails && eventDetails?.product_variant?.product?.metadata?.eventStartDate && dayjs(eventDetails?.product_variant?.product?.metadata?.eventStartDate)?.format('ddd, D MMM YYYY') || dayjs(orderDetails?.metadata?.entry_date)?.format('ddd, D MMM YYYY')}</p>
                                                        {eventDetails && eventDetails?.product_variant?.product?.metadata?.eventStartDate && <p className="text-sm"><SfIconSchedule size="xs" /> {dayjs(eventDetails?.product_variant?.product?.metadata?.eventStartDate)?.format('h:mm A')}</p>}
                                                        <p className="text-sm"><SfIconLocationOn size="xs" /> {eventDetails && eventDetails?.product_variant?.product?.metadata?.eventVenue}</p>
                                                    </>
                                                }
                                            </div>
                                            {eventDetails &&
                                                <img key={orderDetails?.order_products[0].id}
                                                    src={orderDetails?.order_products[0]?.product_variant?.product?.brand_logo || orderDetails?.order_products[0]?.product_variant?.product?.images}
                                                    alt={orderDetails?.order_products[0].product_variant?.product?.name}
                                                    className="object-contain max-w-[200px]  aspect-video px-8 my-4 bg-transparent"
                                                />
                                            }


                                        </div>


                                        {/*Coupon Table  */}
                                        {coupon_id && orderDetails?.order_products.length > 0 && (

                                            <div className="pb-12  ">


                                                <table className="min-w-full bg-[#f1f1f1] rounded-b-3xl ">
                                                    <thead>
                                                        <tr className="border-b">

                                                        </tr>
                                                    </thead>
                                                    <tbody className="" >
                                                        {orderDetails?.order_products.map((item, index) => {

                                                            return (
                                                                <tr className='border-b-2  border-dashed border-black' key={item.id}  >

                                                                    <td >
                                                                        <p className="text-center w-full font-semibold mt-2">Coupon #{index + 1}</p>
                                                                        <div className='flex flex-col items-center justify-center align-middle my-4 rounded  '>

                                                                            <div className="!bg-transparent pl-4 pr-8">
                                                                                <img
                                                                                    src={item?.product_variant?.product?.brand_logo}
                                                                                    alt={item?.product_variant?.product?.name}
                                                                                    className="object-contain max-w-[200px]  aspect-video px-8 "
                                                                                ></img>

                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className=" max-w-[180px] relative overflow-hidden">
                                                                        <p className='font-semibold text-sm md:text-lg '>
                                                                            {item.product_variant?.product?.name}
                                                                        </p>
                                                                        {item.product_variant?.attributes && Object.keys(item.product_variant?.attributes)?.map((pv_key) => {
                                                                            return (
                                                                                <small className="font-bold text-lg" key={pv_key}>{pv_key}: {item.product_variant?.attributes[pv_key]}</small>
                                                                            )
                                                                        })} <br />
                                                                        <small className="text-center font-semibold text-sm">Qty: {item?.quantity}</small>


                                                                    </td>

                                                                </tr>
                                                            )
                                                        })}
                                                        <tr className="">{ }
                                                            <td className="py-8 px-2 text-center font-extrabold text-xl text-extraa-black ">Order Total:</td>
                                                            <td className="py-2 px-2 text-center font-medium text-2xl">₹{orderDetails?.amount}</td>
                                                            <td className="py-2 px-2 text-center "></td>
                                                            {/* <td className="py-2 px-2 text-center"></td> */}

                                                        </tr>

                                                    </tbody>

                                                </table>
                                                <div className="flex justify-center">
                                                    <Link href='/my-coupons'>
                                                        <SfButton size="sm" className="mt-4 bg-extraa-blue ">View Coupon(s)</SfButton>
                                                    </Link>
                                                </div>
                                            </div>
                                        )
                                        }


                                        {/* Tickets Table */}
                                        {!coupon_id && orderDetails?.order_products.length > 0 && (

                                            <div className="pb-12  ">


                                                <table className="min-w-full bg-[#f1f1f1] rounded-b-3xl ">
                                                    <thead>
                                                        <tr className="border-b">

                                                        </tr>
                                                    </thead>
                                                    <tbody className="" >
                                                        {orderDetails?.order_products.map((item, index) => {
                                                            let redeemed =
                                                                item?.quantity == item?.redeemed_orders_aggregate?.aggregate?.sum?.quantity;
                                                            return (
                                                                <tr className='border-b-2  border-dashed border-black' key={item.id}  >

                                                                    <td >
                                                                        <p className="text-center w-full font-semibold mt-2">Ticket #{index + 1}</p>
                                                                        <div className='flex flex-col items-center justify-center align-middle my-4 rounded  '>
                                                                            {orderDetails.order_status === "SUCCESS" || orderDetails.order_status === "PAYMENT_SUCCESS" ? (
                                                                                <div className="!bg-transparent pl-4 pr-8">
                                                                                    <QRCode
                                                                                        fgColor="#000000"
                                                                                        bgColor="transparent"
                                                                                        size={256}
                                                                                        style={{ height: "auto", maxWidth: "100px", width: "100%" }}
                                                                                        value={`EV${(item?.id * 1221).toString(16).toUpperCase()}`}
                                                                                        viewBox={`0 0 256 256`}
                                                                                    />
                                                                                    <p className="text-center">#EV{(item?.id * 1221).toString(16).toUpperCase()}</p>
                                                                                </div>
                                                                            ) : (
                                                                                <div style={{ width: "150px", textAlign: "center" }}>
                                                                                    <p style={{ color: "red", fontWeight: 700 }}>{orderDetails.order_status}</p>
                                                                                    <p style={{ fontSize: "12px", color: "black" }}>Contact Organizer For Further Details</p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                    <td className=" max-w-[180px] relative overflow-hidden">
                                                                        <p className='font-semibold text-[14px] max-w-[100px]'>
                                                                            {item.product_variant?.product?.name}
                                                                        </p>
                                                                        {item.product_variant?.attributes && Object.keys(item.product_variant?.attributes)?.map((pv_key) => {
                                                                            return (
                                                                                <small className="font-semibold text-sm" key={pv_key}>{pv_key}: {item.product_variant?.attributes[pv_key]}</small>
                                                                            )
                                                                        })} <br />
                                                                        <small className="text-center font-semibold text-sm">Qty: {item?.quantity}</small>
                                                                        {redeemed &&
                                                                            <div class="absolute right-3 top-0  h-16 w-16">
                                                                                <div
                                                                                    class=" bg-green-700 absolute transform rotate-[55deg] text-center text-xs text-white font-semibold py-1 left-[-34px] top-[32px] w-[170px]">
                                                                                    Redeemed
                                                                                </div>
                                                                            </div>}

                                                                    </td>

                                                                </tr>
                                                            )
                                                        })}
                                                        <tr className="">{ }
                                                            <td className="py-8 px-2 text-center font-extrabold text-xl text-extraa-black ">Order Total:</td>
                                                            <td className="py-2 px-2 text-center font-medium text-2xl">₹{orderDetails?.amount}</td>
                                                            <td className="py-2 px-2 text-center "></td>
                                                            {/* <td className="py-2 px-2 text-center"></td> */}

                                                        </tr>

                                                    </tbody>
                                                </table>


                                            </div>
                                        )
                                        }
                                    </>

                                </div>
                            </div>
                        }

                        {user_coupons && user_coupons.length > 0 && <OrderDetailsCoupon
                            user_coupons={user_coupons}
                        />}
                    </div>
                )
                :
                <LoginModal openModal={modalOpen} closeModal={modalClose} isModal={isModal} error={true} />
            }
        </>
    );
}
export default TicketsOrderDetails;