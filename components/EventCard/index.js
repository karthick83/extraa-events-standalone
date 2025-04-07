import dayjs from "dayjs";
import { useRouter } from "next/navigation";



export const EventCard = (props) => {
    const router = useRouter();
    const {
        name = "ProductCard",
        metadata = {
            "fee": 45,
            "feeType": "FLAT",
            "commission": 4,
            "eventVenue": "Coastal Grand Hotels and Resorts, OMR",
            "eventEndDate": "2024-03-24T19:00",
            "commissionType": "PERCENT",
            "eventStartDate": "2024-03-24T09:00"
        },
        slug = "/slug",
        imageSrc = "https://wixplosives.github.io/codux-assets-storage/add-panel/image-placeholder.jpg",
        price = 2000 } = props;
    return (
        <div className="flex flex-col justify-between w-72 min-h-[420px] shadow-md uc-sb">
            {/* <div className="flex justify-center"> */}
            <a href={`/tickets/${slug}`} className="flex justify-center" > <img className="rounded-t-lg max-h-[200px] w-full object-cover object-top" src={imageSrc} alt={name} /> </a>
            {/* </div> */}
            <div className="px-4 py-2">
                {metadata?.eventStartDate && <p className="text-xs text-extraa-blue uc-regular">{dayjs(metadata?.eventStartDate).isValid() ? dayjs(metadata?.eventStartDate).format('ddd, DD MMM YYYY | HH:mm A') : ""}</p>}
                <p className="text-sm my-2 ">{name}</p>
                <p className="text-xs my-2 uc-regular">{metadata?.eventVenue}</p>
            </div>
            <div className="px-4 pb-4">
                <hr className="my-2" />
                <p className="mb-4 mt-2 text-sm ">
                    <span className="text-gray-800 ">₹{price} Onwards</span>
                </p>
                <button onClick={() => slug && router.push(`/tickets/${slug}`)} className="w-full rounded-md bg-extraa-dark-purple text-white px-4 py-2 text-sm uc-bold ">
                    Book Now
                </button>
            </div>
        </div>
    );
};
