import { SfAccordionItem, SfButton } from "@storefront-ui/react";
import Barcode from "react-barcode";
import Loader from "../loader";
import { useApolloClient } from "@apollo/client";
import { useEffect, useState } from "react";
import axios from "axios";
import { AES, enc } from "crypto-js";
import dayjs from "dayjs";
import Link from "next/link";

const GiftCardOrderDetails = ({ params, orderDetails, orderId, loading }) => {
    const client = useApolloClient()
    // console.log('giftcards');
    const [giftOrderDetails, setGiftOrderDetails] = useState()
    const [giftCardDetails, setGiftCardDetails] = useState()
    const [couponProducts, setCouponProducts] = useState([]);
    const [refetchDetails, setRefetchDetails] = useState(0);

    const [opened, setOpened] = useState([]);

    const isOpen = (id) => opened.includes(id);

    const handleToggle = (id) => (open) => {
        if (open) {
            setOpened((current) => [...current, id]);
        } else {
            setOpened((current) => current.filter((item) => item !== id));
        }
    };

    const statusBG = {
        'PROCESSING': 'bg-amber-500',
        'COMPLETE': 'bg-green-500',
        'CANCELED': 'bg-red-500'
    }

    // console.log(orderId)
    // const { data, loading } = useQuery(GetOrderById, { variables: { id: orderId }, context: { headers: { Authorization: `Bearer ${token}` } } });
    // const orderDetails = data?.orders_by_pk;

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


    // Get Gift ORDER DETAILS ====================================
    useEffect(() => {
        let giftOrderData;
        const couponProducts = orderDetails?.order_products?.filter(product =>
            !product?.giftcard_id
        );
        // console.log(couponProducts, "coPor", orderDetails);
        setCouponProducts(couponProducts);
        async function fetchGiftOrderDetails() {
            try {
                // console.log(orderDetails?.card_details, 'carddetails')
                let interval = 1; // Initial interval in seconds
                let elapsedTime = 0;
                // while (elapsedTime <= 168) {
                //     console.log(elapsedTime);
                //     // Make a POST request using Axios
                //     const response = await axios.get(`https://gapi.extraa.in/get-order/${orderDetails?.q_id || orderDetails?.amz_id}`);
                //     setGiftOrderDetails(response.data);
                //     giftOrderData = response.data;
                //     if (giftOrderData?.status != 'PROCESSING' || giftOrderData?.statusLabel != 'Processing') {
                //         setRefetchDetails(2);
                //         break

                //     }
                //     await delay(interval * 1000);
                //     elapsedTime += interval;
                //     interval += 5;
                // }
                if (Array.isArray(orderDetails?.card_details)) {
                    const bytes = AES.decrypt(orderDetails?.card_details[0], "20aserasecretkey24");
                    const decryptedData = JSON.parse(bytes.toString(enc.Utf8));
                    setGiftCardDetails(decryptedData);
                    // console.log(decryptedData, 'giftcard');
                }
                if (giftOrderData?.status === 'COMPLETE' && !orderDetails?.card_details) {
                    fetchGiftCardDetails();

                }
            } catch (error) {
                // Handle errors
                console.error('Error creating order:', error);
            }
        }
        async function fetchGiftCardDetails() {
            try {
                // Make a POST request using Axios
                const response = await axios.get(`https://gapi.extraa.in/get-card/${orderDetails?.q_id}`);
                const responseEncrypted = AES.encrypt(
                    JSON.stringify(response?.data),
                    "20aserasecretkey24"
                ).toString();
                const orderCardResp = await UseOrderUpdate({ id: orderDetails?.id, set: { "card_details": [responseEncrypted] } }, client);
                setGiftCardDetails(response.data);
            } catch (error) {
                // Handle errors
                console.error('Error creating order:', error);
            }
        }
        if ((orderDetails?.q_id || orderDetails?.amz_id) && !giftOrderDetails) {
            fetchGiftOrderDetails();
        }
    }, [orderDetails, refetchDetails]);


    // console.log(giftOrderDetails, "GIFT ORDER");
    // console.log(giftCardDetails, "GIFT CARD");


    const handleCancel = async () => {
        const productQuantity = Array.isArray(giftCardDetails?.cards) && giftCardDetails?.cards?.length;

        const giftVars = {

            "syncOnly": productQuantity <= 4,
            "deliveryMode": 'API',
            "address": {
                "firstname": giftOrderDetails?.address?.name,
                "email": giftOrderDetails?.address?.email,
                "telephone": giftOrderDetails?.address?.telephone,
                "country": "IN",
                "postcode": giftOrderDetails?.address?.postcode || '600017',
                "billToThis": true
            },
            "payments": [
                {
                    "code": "svc",
                    "amount": giftOrderDetails?.payments[0]?.amount,
                    "poNumber": giftOrderDetails?.payments[0]?.poNumber
                }
            ],
            "products": Array.isArray(orderDetails?.order_products) && orderDetails?.order_products?.filter(item => item?.giftcard_denom && item?.sku).map((i) => {
                return {
                    "sku": i?.sku,
                    "price": i?.giftcard_denom,
                    "qty": i?.quantity,
                    "currency": 356,
                    "giftMessage": ""
                }
            }),
            "refno": giftOrderDetails?.refno
        }
        console.log(giftVars);
        try {
            const revResponse = await axios.post('https://gapi.extraa.in/reverse-order/', giftVars);
            console.log(revResponse?.data);
            const updateOrderItems = {
                id: parseInt(orderDetails?.order_transactions[0]?.id),
                order_id: parseInt(orderDetails?.id),
                status: 'ORDER FAILED',
            }
            const response = await UsePaymentOrder(updateOrderItems, client);
            console.log(response);
            setRefetchDetails(1);
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <>

            {loading ? <div className="h-[80vh] flex justify-center items-center">  <Loader /></div>
                :
                <div className="z-auto">
                    {orderDetails &&
                        <div className="w-full">

                            <div className="container max-w-[600px] mx-auto mt-8 shadow-lg shadow-gray-400 rounded-3xl">


                                <div className="flex w-full md:flex-row justify-between items-center">
                                    <div className=" my-4 ml-6 ">
                                        <h2 className="text-xl font-bold my-2 text-MFC-black text-center"> Order Details</h2>
                                        {/* <p className="text-sm">Placed on: {dayjs(orderDetails?.created_at)?.format('DD MMM YYYY')}</p> */}
                                        {orderDetails?.discount_code &&
                                            <p className="text-sm"> Code used: {orderDetails?.discount_code}</p>
                                        }
                                        {orderDetails?.q_id &&
                                            <p className="text-sm"> Gift card Order ID: {giftOrderDetails?.orderId}</p>
                                        }
                                        <p className="text-lg text-MFC-black text">Order ID:<span className="text-MFC-black text-lg"> #{orderDetails?.id}</span></p>
                                        {orderDetails?.order_transactions && orderDetails?.order_transactions?.length > 0 &&
                                            <p className="text-lg text-MFC-black">Transaction ID:
                                                <span className="text-MFC-black">{orderDetails?.order_transactions?.map((t) => <span key={t?.id}> #{t?.id} </span>)}</span>
                                            </p>
                                        }
                                        {giftOrderDetails?.statusLabel &&
                                            <p className="text-MFC-black">
                                                Status: <span className={`text-xs items-center whitespace-nowrap rounded-lg py-1 px-3 font-sans font-bold  text-white ${statusBG[giftOrderDetails?.status]}`}>{giftOrderDetails?.statusLabel}</span>
                                            </p>
                                        }



                                        {giftOrderDetails?.status === 'PROCESSING' && giftOrderDetails?.statusLabel === 'Processing' && <p className="text-sm mt-4 text-MFC-black"> Your order is being processed, Please wait... <br /> Your Card details will be available soon



                                            {/* <SfButton size="sm" style={{ background: 'purple' }} onClick={() => setRefetchDetails(refetchDetails + 1)}>Click here</SfButton> */}
                                        </p>}

                                        {giftOrderDetails?.cancel?.allowed && false &&
                                            <SfButton onClick={handleCancel} variant="tertiary" className="mt-2 !pl-0 text-red-600 underline " size="sm" >Cancel Order</SfButton>
                                        }

                                    </div>

                                </div>


                                {orderDetails?.order_products && orderDetails?.order_products?.length > 0 && (

                                    <div className="pb-12 pt-8">


                                        <table className="min-w-full ">
                                            <thead>
                                                <tr className="border-b">

                                                </tr>
                                            </thead>
                                            <tbody >
                                                {giftCardDetails?.cards && Array.isArray(giftCardDetails?.cards) && giftCardDetails?.cards?.length > 0 &&
                                                    giftCardDetails?.cards.map((item) => (

                                                        <tr className='border-b-2' key={item.cardId}  >
                                                            <td >
                                                                <div className='flex flex-col items-center justify-center align-middle my-4 rounded '>

                                                                    <img
                                                                        src={giftCardDetails?.products[item?.sku]?.images?.small}
                                                                        alt={item?.name}
                                                                        className="object-contain max-w-[200px]  aspect-video px-8 "
                                                                    ></img>


                                                                    {item?.amount && <p> <small className="text-MFC-black"> Amount:<strong> <span className="text-MFC-black">₹{item?.amount}</span></strong></small></p>}
                                                                    {item?.barcode && <div className="max-w-[300px]"><Barcode value={item?.barcode} height={64} width={1} fontSize={12} /></div>}

                                                                </div>
                                                            </td>


                                                            <td className="max-w-[180px]" >
                                                                <p className='text-MFC-black'>
                                                                    {item?.productName}
                                                                </p>

                                                                {item?.cardNumber && <p> <small>{item?.labels?.cardNumber}: {item?.cardNumber || 'Card No'}</small></p>}
                                                                {item?.cardPin && <SfAccordionItem
                                                                    summary={<small className="pt-2 font-medium underline hover:bg-neutral-100 active:neutral-100">{isOpen(item?.cardNumber) ? `Hide ${item?.labels?.cardPin || "PIN"}` : `View ${item?.labels?.cardPin || "PIN"}`}</small>}
                                                                    onToggle={handleToggle(item?.cardNumber)}
                                                                    open={isOpen(item?.cardNumber)}
                                                                >
                                                                    <p> <small> {item?.labels?.cardPin || "PIN"}: {item?.cardPin}</small></p>
                                                                </SfAccordionItem>}

                                                                {item?.validity && <p> <small>{item?.labels?.validity || "Validity"}: {item?.validity && dayjs(item?.validity).isValid && dayjs(item?.validity).format('DD MMM YYYY')}</small></p>}
                                                                {item?.activationUrl && <p> <a href={item?.activationUrl} className="underline  hover:bg-neutral-100" target="_blank"> Activate your card</a></p>}
                                                                {item?.activationCode && <p> <small> Activation Code: {item?.activationCode} </small></p>}

                                                            </td>
                                                            <td> </td>

                                                        </tr>
                                                    ))
                                                }
                                                {giftCardDetails?.amz_details?.cards && Array.isArray(giftCardDetails?.amz_details?.cards) && giftCardDetails?.amz_details?.cards?.length > 0 &&
                                                    giftCardDetails?.amz_details?.cards.map((item) => (

                                                        <tr className='border-b-2' key={item.cardId}  >
                                                            <td >
                                                                <div className='flex flex-col items-center justify-center align-middle my-4 rounded '>

                                                                    <img
                                                                       src={giftCardDetails?.amz_details?.products[item?.sku]?.images?.small}
                                                                        alt={item?.name}
                                                                        className="object-contain max-w-[200px]  aspect-video px-8 "
                                                                    ></img>


                                                                    {item?.amount && <p> <small> Amount:<strong> ₹{item?.amount}</strong></small></p>}
                                                                    {item?.barcode && <div className="max-w-[300px]"><Barcode value={item?.barcode} height={64} width={1} fontSize={12} /></div>}

                                                                </div>
                                                            </td>


                                                            <td className="max-w-[180px]" >
                                                                <p className='text-MFC-black'>
                                                                    {item?.productName}
                                                                </p>

                                                                {item?.cardNumber && <p> <small>{item?.labels?.cardNumber}: {item?.cardNumber || 'Card No'}</small></p>}
                                                                {item?.cardPin && <SfAccordionItem
                                                                    summary={<small className="pt-2 font-medium underline hover:bg-neutral-100 active:neutral-100">{isOpen(item?.cardNumber) ? `Hide ${item?.labels?.cardPin || "PIN"}` : `View ${item?.labels?.cardPin || "PIN"}`}</small>}
                                                                    onToggle={handleToggle(item?.cardNumber)}
                                                                    open={isOpen(item?.cardNumber)}
                                                                >
                                                                    <p> <small> {item?.labels?.cardPin || "PIN"}: {item?.cardPin}</small></p>
                                                                </SfAccordionItem>}

                                                                {item?.validity && <p> <small>{item?.labels?.validity || "Validity"}: {item?.validity && dayjs(item?.validity).isValid && dayjs(item?.validity).format('DD MMM YYYY')}</small></p>}
                                                                {item?.activationUrl && <p> <a href={item?.activationUrl} className="underline  hover:bg-neutral-100" target="_blank"> Activate your card</a></p>}
                                                                {item?.activationCode && <p> <small> Activation Code: {item?.activationCode} </small></p>}

                                                            </td>
                                                            <td> </td>

                                                        </tr>
                                                    ))
                                                }
                                                {couponProducts && couponProducts?.map((item, index) => (
                                                    <tr className='border-b-2' key={item.id}  >
                                                        <td >
                                                            <div className='flex flex-col items-center justify-center align-middle my-4 rounded '>

                                                                <img
                                                                    src={item.product_variant?.product?.images || giftOrderDetails?.products[index]?.image?.small}
                                                                    alt={item.product_variant?.product?.name}
                                                                    className="object-contain max-w-[200px]  aspect-video px-8 "
                                                                ></img>
                                                                {<p><small className="text-MFC-black">Amount: <span className="text-MFC-black">₹{item?.product_variant?.sale_price}</span></small></p>}

                                                                {item.product_variant?.attributes && Object.keys(item.product_variant?.attributes)?.map((pv_key) => {
                                                                    return (
                                                                        <small className="text-MFC-black" key={pv_key}>{pv_key}: <span className="text-MFC-black">{item.product_variant?.attributes[pv_key]}</span></small>
                                                                    )
                                                                })}

                                                            </div>
                                                        </td>

                                                        <td className=" max-w-[180px]">
                                                            <p className='text-MFC-black text-md'>
                                                                {item.product_variant?.product?.name || giftOrderDetails?.products[index]?.name}
                                                            </p>
                                                            <small className="text-center text-MFC-black text-md">Qty: <span className="text-MFC-black text-md">{item?.quantity}</span></small>

                                                            {item.product_variant?.product?.type === 1 &&
                                                                <div className="">
                                                                    <Link href='/my-coupons'>
                                                                        <SfButton size="sm" className="mt-4 bg-extraa-blue ">View Coupon</SfButton>
                                                                    </Link>
                                                                </div>
                                                            }
                                                            {item.product_variant?.product?.type === 4 &&
                                                                <div className="text-md text-MFC-black">
                                                                    {console.log(item.product_variant?.product, 'pro')}
                                                                    Shipping status: <span className="text-MFC-black text-md">{orderDetails?.shipping_status}</span>
                                                                </div>
                                                            }
                                                        </td>
                                                        <td></td>

                                                    </tr>
                                                ))}
                                                <tr className="border-b">

                                                    <td className="py-8 px-2 text-center text-MFC-black text-2xl ">Order Total Paid:</td>
                                                    <td className="py-2 px-2 text-center font-medium text-2xl text-MFC-black">₹{orderDetails?.amount}</td>
                                                    <td className="py-2 px-2 text-center"></td>
                                                    {/* <td className="py-2 px-2 text-center"></td> */}

                                                </tr>

                                            </tbody>
                                        </table>


                                    </div>
                                )
                                }

                            </div>
                        </div>
                    }
                </div>
            }


        </>
    );
}

export default GiftCardOrderDetails;