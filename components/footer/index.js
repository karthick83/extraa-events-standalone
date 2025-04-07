
import { whiteLableBrandData } from "@/common/whitelable";
import { SfButton, SfLink, SfIconCall, SfIconLocationOnFilled, SfIconEmail } from "@storefront-ui/react"
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();

    return (
        <>
            {!pathname.includes('/delite') &&
                <div className="uc-sb pb-8 ">
                    {/* <div className="md:px-4 p-4 border-solid border-y-[2px] flex justify-center h-8"> */}
                    {/* <img className="max-w-[160px]" src="https://merchants.extraa.in/assets/logos/extraa-logo.png" alt="logo" /> */}
                    {/* </div> */}
                    <div className="flex justify-center mt-4">
                        <img className=' object-contain sm:min-w-[60px] h-[40px] md:h-[40px]' src={whiteLableBrandData?.logo} alt="Logo" />
                    </div>
                    <div className="flex justify-center md:gap-8 gap-4 md:flex-row flex-col items-center md:mt-6 mt-8">
                        <SfLink target="_blank" variant="primary" href={whiteLableBrandData?.about_us}>
                            About Us
                        </SfLink>
                        {/* <SfLink target="_blank" variant="primary" href="https://extraa.in/contact/">
                            Contact
                        </SfLink> */}
                        <SfLink variant="primary" href="/terms">
                            Terms & Conditions
                        </SfLink>
                        <SfLink variant="primary" href="/privacy">
                            Privacy Policy
                        </SfLink>
                        {/* <SfLink variant="primary" href="/refund">
                            Refund Policy
                        </SfLink> */}
                    </div>
                    <div className="flex justify-center uc-sb my-6 px-8">
                        <p>The delivery of the all physical products will be done between 7 to 45 working days.</p>
                    </div>
                    <div className="flex justify-center md:gap-8  md:flex-row flex-col items-center md:mt-6 mt-10">
                        <div className="md:px-4 p-2 flex items-center gap-1 ">
                            <SfIconCall size="sm" />
                            <p>+91 7305012123</p>
                        </div>
                        <div className="md:px-4 p-2 flex items-center gap-1 ">
                           <SfIconEmail size="sm" />
                            <p>sales@extraa.in</p> 
                        </div>
                        <div className="md:px-4 p-2 flex items-center  gap-1">
                            <SfIconLocationOnFilled size="sm" />
                            <p>{whiteLableBrandData?.legalName}<br />
                               {whiteLableBrandData?.address_line1}<br/>
                               {whiteLableBrandData?.address_line2}<br/>
                            </p>
                        </div>

                    </div>

                </div>
            }
        </>
    )

}