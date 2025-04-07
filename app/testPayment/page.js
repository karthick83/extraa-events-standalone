"use client"
import { SfButton, SfIconCheckCircle } from "@storefront-ui/react";
import OrderSummary from "@/components/orderSummary";
import { useRouter, useSearchParams } from "next/navigation";

export default function TestPaymentPage(params) {
    const route = useRouter();
    const searchParams = useSearchParams();
    const order = searchParams.get('order');
    // const totalAmt = typeof localStorage !== 'undefined' && JSON?.parse(localStorage?.getItem("totalPrice")) || 0
    const onSuccessClick = () => {

        route.push(`/redirect?order=${order}&trans=60`)
    }
    return (
        <>
            <div className="flex flex-col justify-center items-center min-h-screen">
                <p>Go to:</p>
                <SfButton variant="primary" style={{ background: "green" }} onClick={onSuccessClick}>
                    Payment Success
                </SfButton>

            </div>
        </>
    )
}