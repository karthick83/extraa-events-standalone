"use client"

import { adminToken } from "@/app/page";
import { GetProductsBySlug } from "@/queries/GetProducts";
import { useQuery } from "@apollo/client";
import { useCart, WithSSR } from "@/components/Cart/cart";

import { SfButton, SfChip, SfDropdown, useDisclosure, SfIconSchedule, SfIconLocationOn } from "@storefront-ui/react";

import { useEffect, useState, useRef } from "react";
import parse from 'html-react-parser';
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import Loader from "@/components/loader";
import NotificationManager from "@/components/NotificationManager";
import notFound from "public/assets/notFound.png";
import Image from "next/image";
// param.dealsId
const TicketDetails = ({ params }) => {
    const { data, loading } = useQuery(GetProductsBySlug, { variables: { slug: params?.ticketSlug }, context: { headers: { Authorization: `Bearer ${adminToken}` } } });
    // console.log(data?.products);
    const route = useRouter()
    const cardDetails = data?.products[0]
    //  console.log(cardDetails?.name);
    const [product, setProduct] = useState({})
    const [selectedVariant, setSelectedVariant] = useState({});
    // console.log(product);
    useEffect(() => {
        const final = cardDetails && { ...cardDetails }
        setSelectedVariant(final?.product_variants[0]);
        setProduct(final);
    }, [cardDetails])

    const cart = WithSSR(useCart, (state) => state);

    const [quantity, setQuantity] = useState(1);
    const [notifications, setNotification] = useState([])
    // console.log(selectedVariant, 'select');

    const onAddToCart = () => {
        localStorage?.removeItem('attendee_details')
        if (product?.id === 1433 || product?.id === 1434) {
            localStorage.setItem('cart_items', JSON.stringify([{ ...selectedVariant, quantity: 1 }]))
            route.push(`/tickets/${params?.ticketSlug}/attendees`)
        } else {
            route.push(`/tickets/${params?.ticketSlug}/bookings`)
        }
        // const productSeletedVariant = { ...product, product_variants: [{ ...selectedVariant }] }

        // for (let i = 0; i < quantity; i++) {
        //     cart?.addToCart({ ...productSeletedVariant, productId: varId });

        // }
        // const currentNotifications = notifications;
        // setNotification([...currentNotifications, quantity])
    }

    const onBuyClick = (id, varId) => {
        // const index = cartitems.length > 0 && cartitems.findIndex(x => x?.product_variants?.length > 0 && x?.product_variants[0]?.id === varId)
        const productSeletedVariant = { ...product, product_variants: [{ ...selectedVariant }] }


        for (let i = 0; i < quantity; i++) {
            cart?.addToCart({ ...productSeletedVariant, productId: varId });

        }
        // console.log(productSeletedVariant);
        // console.log(id, varId);
        route.push('/cart')
    }

    const variantChange = (key, value, e) => {
        let newAttributes = JSON.parse(JSON.stringify(selectedVariant?.attributes));
        newAttributes[key] = value;
        const allVariants = product?.product_variants;
        const newVariant = allVariants.find((e) => JSON.stringify(e.attributes) === JSON.stringify(newAttributes));
        setSelectedVariant({ ...newVariant });

        // console.log(newVariant, 'variant');
    }
    return (
        <>

            {loading ? <div className="min-h-[80vh] flex justify-center items-center"><Loader /></div>
                :
                <div className="z-auto uc-sb">
                    <div className="fixed w-full top-24 z-10">
                        {notifications?.length > 0 &&
                            notifications.map((n, index) =>
                                <NotificationManager key={index} message={`${product?.name} x ${n} added to cart`} alertType={1} offset={1} />
                            )
                        }
                    </div>

                    {cardDetails?.name ?
                        <div className="lg:flex flex-row p-8 ">
                            {/* *************** GiftCard image ****************** */}
                            <section className="w-full  mt-12">
                                <div className="flex flex-wrap gap-4 lg:gap-6 lg:flex-nowrap justify-center md:sticky top-12 ">

                                    <div class=" h-auto mx-4 max-w-lg overflow-hidden rounded-3xl drop-shadow-2xl bg-white p-5 border-2">

                                        <img class="rounded-lg object-contain max-h-[500px] "
                                            src={product?.images}
                                            alt={product?.name}
                                        />

                                    </div>
                                </div>

                            </section>
                            <section className="w-full h-fit md:ml-2 " >
                                {/* *************** dealsCard Details ****************** */}
                                <div className="flex flex-col mx-[2px] mt-10 h-fit ">
                                    <p className="text-lg md:text-2xl font-semibold text-black first-line mb-2">{product?.name}</p>
                                    {/* <SfChip size="sm" className="w-fit bg-extraa-blue text-white mb-2">{product?.brand}</SfChip> */}
                                    {/* <p className="text-sm italic font-semibold">Valid till : 31-10-2023</p> */}
                                    {product?.metadata?.eventStartDate &&
                                        <p className="text-l font-medium my-1">
                                            <SfIconSchedule /> {product?.metadata?.eventStartDate && dayjs(product?.metadata?.eventStartDate)?.format('ddd MMM D, h:mm A')}
                                            {product?.metadata?.eventEndDate &&
                                                <>
                                                    {dayjs(product?.metadata?.eventEndDate).isValid && dayjs(product?.metadata?.eventEndDate)?.day === dayjs(product?.metadata?.eventStartDate)?.day ?
                                                        dayjs(product?.metadata?.eventEndDate)?.format('- h:mm A') : dayjs(product?.metadata?.eventEndDate)?.format('- ddd MMM D, h:mm A')}
                                                </>
                                            }
                                        </p>
                                    }
                                    <p className="text-l font-medium my-1"> <SfIconLocationOn /> {product?.metadata?.eventVenue}</p>

                                    {/* <form className="mt-4 variant-form">
                                        {
                                            product?.product_variants?.length > 1 && Object.keys(product?.product_variants[0]?.attributes).map((pvkey) => {
                                                return (

                                                    <div key={pvkey}>
                                                        <p className="mb-4 font-semibold">  {pvkey}:    </p>

                                                        {product?.product_variants?.map((pv, index) => (
                                                            <span key={pv?.id} className="inline-flex">

                                                                <input defaultChecked={index === 0} className="!max-h-[30px]" onClick={() => variantChange(pvkey, pv?.attributes[pvkey])} name={pvkey} id={pv?.attributes[pvkey]} type="radio" key={pv?.attributes} />
                                                                <label className="text-xs font-medium md:text-sm" htmlFor={pv?.attributes[pvkey]} > {pv?.attributes[pvkey]} </label>
                                                            </ span>
                                                        ))}
                                                    </div >

                                                )

                                            })
                                        }
                                    </form> */}
                                    {/* <p> {JSON.stringify(selectedVariant)} </p> */}
                                    <div className="flex flex-row align-bottom mt-2">

                                        <p className="text-xl font-semibold tracking-wide my-4 align-bottom">Amount:
                                        </p>
                                        {selectedVariant?.reg_price &&
                                            <p className="my-4 mx-2  align-bottom  line-through text-xl text-red-400 font-semibold">₹{selectedVariant?.reg_price}</p>
                                        }
                                        <p className="my-4 mx-1 align-bottom text-xl text-green-800 font-bold">₹{selectedVariant?.sale_price || 0} <span>/- onwards</span></p>

                                    </div>

                                    <div className="flex items-center justify-start mt-4">
                                        {/* <button
                                            className="bg-extraa-blue text-white w-8 h-8 mr-2 rounded-full"
                                            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                                        >
                                            -
                                        </button>
                                        {quantity}
                                        <button
                                            className="bg-extraa-blue text-white w-8 h-8 ml-2 rounded-full"
                                            onClick={() => quantity < 10 && setQuantity(quantity + 1)}
                                        >
                                            +
                                        </button> */}
                                        <button className="bg-extraa-dark-purple text-white w-[300px] h-10 rounded-lg px-2  " onClick={() => onAddToCart()}> Book Now</button>
                                        {/* <button className="text-extraa-blue bg-white w-fit h-8 rounded-lg px-2 ml-4 border-extraa-blue border-[1px]" onClick={() => onBuyClick(product?.id, selectedVariant?.id)}> Buy now</button> */}
                                    </div>
                                    <div>
                                        <p className="mt-8 ">Description </p>
                                        <div className="mt-2 text-sm uc-regular">
                                            {product?.description && parse(product?.description)}
                                        </div>
                                    </div>
                                    {product?.terms &&
                                        <div>
                                            <p className="mt-4 ">Terms and Conditions </p>
                                            <div className="terms uc-regular">
                                                {product?.terms && parse(product?.terms) || ''}
                                            </div>
                                        </div>
                                    }



                                </div>
                            </section>

                        </div> :
                        <div className="lg:flex p-8 justify-center max-h-screen">
                            <Image src={notFound} className="p-10 object-contain"></Image>
                            {/* <p className="text-red-600 font-bold text-2xl text-center">Bad Request 404 Error!</p> */}
                        </div>
                    }
                </div>
            }
        </>
    );
}
export default TicketDetails;