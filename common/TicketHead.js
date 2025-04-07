import { SfIconArrowBack } from "@storefront-ui/react";
import dayjs from "dayjs";

const TicketHead = ({ product, toggleBack }) => {

    return (
        <>
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex flex-row gap-4">
                    {/* <div className="bg-[#CBD5E0] rounded-full shadow-md h-[26px]" onClick={() => route.push(link)}> */}
                    <SfIconArrowBack onClick={toggleBack} />
                    {/* </div> */}
                    <div className="flex flex-row items-center justify-center gap-2 w-full ">
                        {/* <div className=""> */}
                        <img
                            className="object-contain"
                            src={product?.images}
                            alt={product?.name}
                            style={{ height: 100, width: 100 }}
                        />
                        {/* </div> */}
                        <div className="flex flex-col items-centerS">
                            <p className="font-bold text-base">{product?.name}</p>
                            {product?.metadata?.eventVenue && product?.metadata?.eventStartDate && <p className="text-sm">{product?.metadata?.eventStartDate && dayjs(product?.metadata?.eventStartDate)?.format('ddd MMM D, h:mm A')} | {product?.metadata?.eventVenue}</p>}
                        </div>
                    </div>
                </div>
            </div>
            <hr className="divide-y"></hr>
        </>
    )
}

export default TicketHead;