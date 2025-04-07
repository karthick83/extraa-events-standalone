import { useState } from "react";
import { TextBoxName } from "./FormFields";
import { SfButton, SfLoaderCircular } from "@storefront-ui/react";
import { getOTP, verifyOTP } from "@/api/Otp";
import { UserSignUp } from "@/queries/UserUpdate";
import { superadmin, user_token } from "@/app/page";
import { useRouter } from "next/navigation";
import { client } from "@/app/layout";

const NormalForm = ({ link }) => {
    const route = useRouter()
    const [formvalues, setFormValues] = useState({
        username: "",
        email: '',
        phone: "",
        otp: ''
    })
    const [userDetails, SetUserDetails] = useState({});
    const [otpSent, SetOtpSent] = useState(false);
    const [error, setError] = useState('')
    const [loader, setLoader] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (e.target.name === 'phone') {
            setFormValues((prevData) => ({
                ...prevData,
                [name]: value.replace(/\D/g, ""),
            }));
        } else {
            setFormValues((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    }

    const onFormSubmit = async (e) => {
        e.preventDefault()
        if (formvalues?.phone?.length > 9) {
            console.log(formvalues, 'values');
            if (!user_token) {
                SetOtpSent(true)
                const result = await getOTP(formvalues?.phone)
                // const res= await PostAPI('https://6tgvrplkxbg2bif6vrv5gxdofe0wrver.lambda-url.ap-south-1.on.aws/', mailVariables)
                SetUserDetails({
                    otp_id: result.insert_otp.id,
                    user_id: result.user.id,
                });
                await client.mutate({
                    mutation: UserSignUp,
                    variables: {
                        id: result.user.id,
                        name: formvalues?.username,
                        gender: "",
                        age_range: "",
                        email: formvalues?.email
                    },
                    context: {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${superadmin}`,
                        },
                    },
                });
            } else {
                localStorage.setItem('attendee_details', JSON.stringify(formvalues))
                route.push(link)
            }
            setError('')
        } else {
            setError('invalid phone number')
        }
    }

    const onVerifyClick = async () => {
        setLoader(true)
        const { otp_id, user_id } = userDetails;
        const result = await verifyOTP(formvalues?.otp, otp_id, user_id);
        if (result?.status) {
            setError('')
            localStorage?.setItem("token", result.token);
            localStorage?.setItem("user_id", user_id);
            route.push(link)
        } else {
            setError('invalid otp')
        }
        setLoader(false)
    }

    return (
        <div>
            {!otpSent ?
                <>
                    <p >Billing Details</p>
                    <form onSubmit={onFormSubmit} className="form">
                        {TextBoxName("username", "Full Name", true, formvalues?.username, handleChange, "text")}
                        {TextBoxName("email", "Email Id", true, formvalues?.email, handleChange, "email")}
                        {TextBoxName("phone", "Phone Number (without +91) ", true, formvalues?.phone, handleChange, "tel", 10, error)}
                       {!user_token && <p className="my-2 text-black">Otp will sent to the Phone Number to validate the user</p>}
                       <div className="flex w-full justify-center mt-4">
                        <SfButton className='bg-purple-800 mt-2' type='submit'>Register</SfButton>
                        </div>
                    </form>
                </>
                :
                <div>
                    {TextBoxName("otp", "Please Enter your OTP", true, formvalues?.otp, handleChange, "tel", 4, error)}
                    <div className="flex w-full justify-center mt-4">
                    <SfButton className='bg-purple-800 mt-2' onClick={onVerifyClick}>
                        {loader ? <SfLoaderCircular className='text-yellow-500' size="xs" /> : "Verify"}
                    </SfButton>
                    </div>
                </div>
            }
        </div>
    )
}

export default NormalForm;