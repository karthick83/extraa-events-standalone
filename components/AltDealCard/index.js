import { useRouter } from "next/navigation";
import dayjs from "dayjs";



export const AltDealCard = (props) => {
    const router = useRouter();

    const {
        name = "ProductCard",
        brand = "brandName",
        imageSrc = "https://wixplosives.github.io/codux-assets-storage/add-panel/image-placeholder.jpg",
        brandLogo = 'https://wixplosives.github.io/codux-assets-storage/add-panel/image-placeholder.jpg',
        price = 2000,
        slug = '/slug',
        metadata = {
            "offerType": "PERCENT",
            "offerAmount": "40",
            "expiry": "2024-08-2024"
        }

    } = props;


    return (
        <div className="flex flex-col items-center">
            <div>
                {brandLogo &&
                    <div>
                        <div className="bg-white w-16 h-16 rounded-full flex justify-center items-center top-0 absolute  ml-2 shadow-xl">
                            <img className="w-12 h-12 object-contain p-1" src={brandLogo} alt={brand} />
                        </div>

                    </div>
                }
                <div className="flex flex-col justify-between rounded-lg max-w-[18rem] min-h-[200px] shadow-md uc-sb bg-extraa-card-bg mt-6" >
                    {metadata?.expiry && dayjs(metadata?.expiry)?.isValid() ? <p className="text-right p-2 uc-regular  text-xs ">Valid till {dayjs(metadata?.expiry).format('DD MMM YYYY')}</p> : ""}

                    <div className=" pt-2 mx-2 rounded-lg mb-2 mt-4">
                        <div className="px-4">
                            <p className=" text-sm  text-extraa-dark-purple uc-bold">{brand}</p>
                            <p className=" kalnia text-lg my-4 min-h-[56]">{name}</p>
                        </div>
                        {metadata?.offerAmount && <p className=" mx-4 mt-1 "><span className="uc-regular">Upto </span><span className=" text-lg p-1 uc-bold">{metadata?.offerAmount}{metadata?.offerType === 'PERCENT' ? "%" : "₹"} off</span>  </p>}
                    </div>
                    <div className="flex justify-end">
                        <button onClick={() => router?.push(slug)} className=" rounded-tl-lg rounded-br-lg bg-extraa-purple-btn text-white px-4 py-2 text-sm ">
                            Get Deal for ₹{price}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
