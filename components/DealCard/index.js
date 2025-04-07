import { useRouter } from "next/navigation";
import dayjs from "dayjs";



export const DealCard = (props) => {
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
        <div className="flex flex-col items-center cursor-pointer relative" onClick={() => router?.push(slug)}>
            <div className="flex flex-col justify-between rounded-lg w-[18rem] min-h-[300px] shadow-md uc-sb" style={{ background: `url(${imageSrc})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center center" }}>
                <div className="flex justify-center h-[200px]">
                </div>
                {brandLogo &&
                    <div className="bg-white w-16 h-16 rounded-full flex justify-center z-10 items-center absolute top-44 ml-2 shadow-xl">
                        <img className="w-12 h-12 object-contain p-1" src={brandLogo} alt={brand} />
                    </div>
                }
                <div className=" pt-2 bg-[rgba(255,255,255,0.75)] backdrop-blur-sm mx-2 rounded-lg mb-2">
                    <div className="px-4">
                        <p className="text-center text-lg mt-8 text-extraa-dark-purple uc-bold">{brand}</p>
                        <p className="text-center min-h-[40px] mx-4 text-sm my-b">{name}</p>
                    </div>
                    {metadata?.offerAmount && <p className="text-center mx-4 mt-1 mb-4 "><span className="uc-regular">Get </span><span className="bg-extraa-yellow text-lg p-1 rounded-lg">{metadata?.offerAmount}{metadata?.offerType === 'PERCENT' ? "% off" : metadata?.offerType === 'FLAT' ? "₹ off" : ""} </span>  </p>}
                    {metadata?.expiry && dayjs(metadata?.expiry)?.isValid() ? <p className="text-center rounded-b-lg p-1 text-xs bg-white ">Valid till {dayjs(metadata?.expiry).format('DD MMM YYYY')}</p> : ""}
                </div>

            </div>
            <button onClick={() => router?.push(slug)} className="w-[18rem] my-4 rounded-md bg-extraa-purple-btn text-Zoominfo-text-button  text-sm uc-bold ">
                <div className="flex justify-between">
                    <p className="text-center px-4  py-2">Get it for ₹{price}</p>
                    <div className="flex bg-extraa-dark-purple items-center px-4 py-2 rounded-r-md">
                        <img src={"https://storage.extraa.in/files/silver-coins-new2.png"} alt="" className="h-[24px]" />
                        <p className="ml-2 text-extraa-purple-btn">{price} coins</p>
                    </div>
                </div>
            </button>
        </div>
    );
};
