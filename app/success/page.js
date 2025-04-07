"use client"
import { SfButton, SfIconCheckCircle } from "@storefront-ui/react";
import OrderSummary from "@/components/orderSummary";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
    // const route = useRouter()
    // const totalAmt = typeof localStorage !== 'undefined' && JSON?.parse(localStorage?.getItem("totalPrice")) || 0
    // const onHomeClick=()=>{
    //     localStorage.removeItem('cart')
    //     localStorage.removeItem('totalPrice')
    //    route.push('/')
    // }
    return (
        <>
            <div className="md:flex md:flex-cols justify-evenly items-center">
                sucess
                {/* <div className="text-center m-3 max-w-lg">
                    <SfIconCheckCircle className="w-auto h-[65px] mt-5 mb-1.5" />
                    <h2 className="text-sm font-semibold mb-3">Your Matcha is On The Way</h2>
                    <p className="text-xs mb-3 leading-5 max-w-3xl">Welcome to the Matcha family Our goal is to build a tea business that caters to
                        exacty to what you want. An email confoming you order has been sent to
                        hello@gmail.com (Also, because we love you, we've sent you a nice
                        surprises)</p>
                    <h3 className="text-sm font-semibold mb-3">Order HMT1033</h3>
                    <div className="mb-3">
                        <SfButton className="bg-extraa-blue text-xs" onClick={onHomeClick}>
                            Keep Shopping</SfButton>
                    </div>
                    <div>
                        <SfButton variant='secondary' className="text-xs">Print recept</SfButton>
                    </div>
                </div>
                <div className="px-3">
                    <OrderSummary
                    saleAmt={totalAmt?.amount || 200}
                    //  taxAmt={10 ||0}
                    //  DelvryAmt={10 ||0}
                    itemCount={totalAmt?.item || 1}
                    type={1}
                    />
                </div> */}
            </div>
        </>
    )
}