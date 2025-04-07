"use client"
import { adminToken, user_token } from "@/app/page";
import QuantitySelector from "@/components/QuantitySelector";
import { GetProductsBySlug } from "@/queries/GetProducts";
import { useQuery } from "@apollo/client";
import { SfButton, SfIconArrowBack, SfIconArrowForward } from "@storefront-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import Loading from "../../loading";
import { useState } from "react";
import TicketHead from "@/common/TicketHead";
import NotificationManager from "@/components/NotificationManager";

const Bookingpage = ({ params }) => {
    const route = useRouter()
    const { data, loading } = useQuery(GetProductsBySlug, { variables: { slug: params?.ticketSlug }, context: { headers: { Authorization: `Bearer ${adminToken}` } } });
    const product = data?.products && data?.products[0]
    // console.log(data, 'params');
    const [count, setCount] = useState([])
    const [selDate, setSelDate] = useState('');
    const [error, setError] = useState({ msg: '', visible: false })
    const survey = []
    if (product?.product_variants) {
        product?.product_variants?.forEach(item => {
            if (item?.survey && JSON.stringify(item?.survey) !== "{}") {
                survey.push(item.survey)
            }
        })
    }
    // console.log(survey, 'survey');
    const onProceedClick = () => {
        // console.log(count, 'cart');
        if (count?.length > 0) {
            count[0].date = selDate;
        }
        localStorage.setItem('cart_items', JSON.stringify(count))
        let totalQuantity = 0;
        count?.forEach(item => {
            totalQuantity += item?.quantity;
        });
        if (count?.length > 0 && totalQuantity > 0 && !product?.metadata?.eventStartDate && selDate !== '') {
            if (user_token && survey?.length === 0) {
                route.push(`/tickets/${params?.ticketSlug}/checkout`)
            } else {
                route.push(`/tickets/${params?.ticketSlug}/attendees`)
            }
        } else if (count?.length > 0 && totalQuantity > 0 && product?.metadata?.eventStartDate) {
            if (user_token && survey?.length === 0) {
                route.push(`/tickets/${params?.ticketSlug}/checkout`)
            } else {
                route.push(`/tickets/${params?.ticketSlug}/attendees`)
            }
        } else if (!product?.metadata?.eventStartDate && selDate === '') {

            setError({ visible: true, msg: "Please pick any date for tickets" })
        } else {
            setError({ visible: true, msg: "Please add at least one ticket." })
        }
        // setTimeout(setError({visible:false,...error}), 5000)

    }

    const handleQuantity = (quan, type) => {
        const newtype = { ...type, date: selDate };
        newtype.quantity = quan
        newtype.metadata = product?.metadata
        if (count?.length > 0) {
            const index = count.findIndex((item) => { return item.id === newtype.id })
            if (index !== -1) {
                count[index] = newtype;
            } else {
                count.push(newtype);
            }
        } else {
            count.push(newtype);
        }
        setCount([...count])
        // console.log(newtype, quan, 'values', count)
    }

    const onBackButtonClick = () => {
        route.back(`/tickets/${params?.ticketSlug}`)
    }

    const onChangeDate = (e) => {
        setSelDate(dayjs(e.target.value).format('YYYY-MM-DD'))
    };

    return (
        <>
            {!loading ?
                <div className="m-6">
                    <div>
                        <TicketHead product={product} toggleBack={onBackButtonClick} />
                        <div className="flex flex-col items-center uc-regular">
                            {!product?.metadata?.eventStartDate &&
                                <div className="flex flex-col mt-4 gap-2">
                                    <p className="text-lg">Pick date</p>
                                    <input type="date" placeholder="pick here" className="input input-bordered input-warning w-full max-w-xs" onChange={onChangeDate} />
                                </div>
                            }
                            {product?.product_variants?.map((x) => (
                                <div className="max-w-lg w-full" key={x?.id}>
                                    <div className="flex flex-row gap-2 mb-4 p-2 justify-between items-center">
                                        <div className="flex flex-col ">
                                            <p>{x?.attributes?.Type}</p>
                                            <div className="flex flex-row gap-2 ">
                                                {x?.reg_price &&
                                                    <p className="align-bottom  line-through text-xl text-red-400 font-semibold">₹{x?.reg_price}</p>
                                                }
                                                <p className="align-bottom text-xl text-green-800 font-bold">₹{x?.sale_price || 0}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row gap-2">
                                            <QuantitySelector quantity={handleQuantity} type={x} maxi={product?.metadata?.maxQuantity} />
                                        </div>
                                    </div>
                                    <hr className="divide-y"></hr>
                                </div>
                            ))}
                            <SfButton slotSuffix={<SfIconArrowForward />}
                                variant="primary"
                                className="bg-extraa-blue text-white w-48 mt-4"
                                onClick={onProceedClick}
                            >
                                Proceed
                            </SfButton>
                        </div>
                    </div>
                </div>
                :
                <Loading />
            }
            {error?.visible && <NotificationManager alertType={0} message={error?.msg} />}
        </>
    )
}

export default Bookingpage;