"use client";
import { useEffect, useId, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { SfModal, SfButton, SfLink } from '@storefront-ui/react'
import { adminToken, superadmin } from '@/app/page';
import { useApolloClient } from '@apollo/client';
import { UserSignUp } from '@/queries/UserUpdate';
import NotificationManager from '../NotificationManager';
import { usernameQuery } from '@/queries/GetUserDetails';
import OtpInput from 'react18-input-otp';
import DotLoader from '../DotLoader';
import { getOTP, verifyOTP } from '../../api/Otp';
import { whiteLableBrandData } from '@/common/whitelable';

const LoginModal = ({ openModal, closeModal, isModal, error, disableClickAway }) => {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    const client = useApolloClient();
    const modalRef = useRef(null);
    const backdropRef = useRef(null);
    const [newUser, setNewUser] = useState(false)
    const [login, SetLogin] = useState(false);
    const [usernameIsInvalid, setUsernameIsInvalid] = useState(false);
    const [phoneIsInvalid, setPhoneIsInvalid] = useState(false);
    const [emailValid, setEmailVaild] = useState(false);
    const [otpSent, SetOtpSent] = useState(false);
    const [otp, setOtp] = useState('')
    const [userDetails, SetUserDetails] = useState({});
    const [otpIsInvalid, setOtpIsInvalid] = useState(false)
    const [phoneErr, setPhError] = useState("The field cannot be empty")
    const [mailErr, setMailError] = useState("Invalid email id")
    const [terms, setTerms] = useState(false)
    const [termsErr, setTermsErr] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: ''
    });
    const [loader, setLoader] = useState(false)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (error) {
            SetLogin(true)
        }
    }, [error])

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value.replace(/\D/g, ""),
            }));
            if (value.length < 10) {
                setPhError("Invalid Phone Number")
                setPhoneIsInvalid(true)
            } else {
                setPhoneIsInvalid(false)
            }
        } else if (name === 'email') {
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
            if (!emailRegex.test(value)) {
                setEmailVaild(true)
            } else {
                setEmailVaild(false)
            }
        }
        else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
            setUsernameIsInvalid(value === '')
        }
    };

    const onEmailOtpClick = async (e) => {
        e.preventDefault();
        const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (formData?.phone.length > 9 && formData?.email?.match(validRegex)) {
            setEmailVaild(false)
            setUsernameIsInvalid(false)
            SetOtpSent(true)
            const result = await getOTP(formData?.phone, formData?.email)
            // const res= await PostAPI('https://6tgvrplkxbg2bif6vrv5gxdofe0wrver.lambda-url.ap-south-1.on.aws/', mailVariables)
            SetUserDetails({
                otp_id: result.insert_otp.id,
                user_id: result.user.id,
            });
            await client.mutate({
                mutation: UserSignUp,
                variables: {
                    id: result.user.id,
                    name: formData?.name,
                    gender: "",
                    age_range: "",
                    email: formData?.email
                },
                context: {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${superadmin}`,
                    },
                },
            });

        } else if (formData?.name === '') {
            setUsernameIsInvalid(true)
        } else if (formData?.phone.length <= 9) {
            setPhError("Invalid Phone Number")
            setPhoneIsInvalid(true)
        } else {
            setEmailVaild(true)
            setMailError('Invalid Email id')
        }
    }

    const onFormSubmit = async (e) => {
        setLoader(true)
        e.preventDefault()
        if (formData?.phone.length > 9) {
            const resp = await client.query({
                query: usernameQuery,
                variables: {
                    "_eq": formData?.phone
                },
                context: { headers: { Authorization: `Bearer ${superadmin}` } }
            })
            if (resp?.data?.users?.length > 0) {
                setPhError('')
                setPhoneIsInvalid(false)
                SetOtpSent(true)
                // console.log("old user");
            } else {
                // setPhoneIsInvalid(true)
                // setPhError('There is no user in this phone number')
                setNewUser(true)
                SetOtpSent(true)
                // console.log("new user");
            }
            const result = await getOTP(formData?.phone)
            SetUserDetails({
                otp_id: result.insert_otp.id,
                user_id: result.user.id,
            });
        } else {
            setPhoneIsInvalid(true)
        }
        setLoader(false)
    }

    function handleOtpChange(val) {
        setOtp(val);
        // SetOtpError(false);
        if (/^\d{4}$/.test(val)) {
            // console.log('valid', val);
            // SetOtpValid(true);
        } else {
            // console.log('in valid');
            setOtpIsInvalid(false);
        }
    }

    const onVerifyClick = async () => {
        // console.log(otp,'otp')
        setLoader(true)
        const { otp_id, user_id } = userDetails;
        const result = await verifyOTP(otp, otp_id, user_id);
        if (result?.status) {
            localStorage?.setItem("token", result.token);
            localStorage?.setItem("user_id", user_id);
            closeModal()
            setFormData({
                name: '',
                phone: ''
            })
            setOtp('')
            SetOtpSent(false)
            setVisible(true)
            if (typeof window !== "undefined") {
                window.location.reload()
            }
        } else {
            setOtpIsInvalid(true)
        }
        setLoader(false)
        setTimeout(() => setVisible(false), 5000)
    }

    const onNewRegClick = async () => {
        setLoader(true)
        const { otp_id, user_id } = userDetails;
        const result = await verifyOTP(otp, otp_id, user_id);
        if (result?.status && formData?.name !== '' && formData?.email !== '' && terms) {
            localStorage?.setItem("token", result.token);
            localStorage?.setItem("user_id", user_id);
            await client.mutate({
                mutation: UserSignUp,
                variables: {
                    id: user_id,
                    name: formData?.name,
                    gender: "",
                    age_range: "",
                    email: formData?.email
                },
                context: {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${superadmin}`,
                    },
                },
            });
            closeModal()
            setFormData({
                name: '',
                phone: ''
            })
            setOtp('')
            SetOtpSent(false)
            setVisible(true)
            if (typeof window !== "undefined") {
                window.location.reload()
            }
        } else {
            const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if (formData?.name === "") {
                setUsernameIsInvalid(true)
            } else if (!formData?.email?.match(validRegex)) {
                setEmailVaild(true)
            } else {
                setOtpIsInvalid(true)
            }
            if (!terms) {
                setTermsErr(true)
            }
        }
        setLoader(false)
        setTimeout(() => setVisible(false), 5000)
    }

    const onChecked = (e) => {
        setTerms(e.target.checked)
        if (e.target.checked) {
            setTermsErr(false)
        }
    }

    return (
        <>
            <CSSTransition
                in={isModal}
                nodeRef={backdropRef}
                timeout={200}
                unmountOnExit
                classNames={{
                    enter: 'opacity-0',
                    enterDone: 'opacity-100 transition duration-200 ease-out',
                    exitActive: 'opacity-0 transition duration-200 ease-out',
                }}
            >
                <div ref={backdropRef} className="fixed inset-0 bg-neutral-700 bg-opacity-50 z-40" />
            </CSSTransition>

            {/* Modal */}
            <CSSTransition
                in={isModal}
                nodeRef={modalRef}
                timeout={200}
                unmountOnExit
                classNames={{
                    enter: 'translate-y-10 opacity-0',
                    enterDone: 'translate-y-0 opacity-100 transition duration-200 ease-out',
                    exitActive: 'translate-y-10 opacity-0 transition duration-200 ease-out',
                }}
            >
                <SfModal
                    open
                    onClose={closeModal}
                    ref={modalRef}
                    as="div"
                    disableClickAway={disableClickAway || false}
                    // role="alertdialog"
                    // aria-labelledby={headingId}
                    // aria-describedby={descriptionId}
                    className="z-50 shadow-lg !p-0 !border-0"
                >
                    <div className='flex flex-row lg:min-w-[1029.38px] min-w-[320px] bg-[#ffff] max-w-[400px] rounded-md'>
                        {/* <section className='lg:w-[30%] lg:block hidden'>
                            <div className='lg:w-[30%] lg:block hidden'> */}
                        {/* <img
                                src="/assets/login_frame.png"
                                alt="extraa logo"
                                // height={80}
                                // style={{ paddingTop: 64, paddingBottom: 32 }}
                                className=' h-auto w-[267px]'
                            />
                             </div> 
                                                     </section> */}
                        <section className='lg:w-[70%] md:px-20 md:py-15 p-10 w-full '>
                            <div className='flex flex-col'>
                                {!login &&
                                    <>
                                        {!newUser &&
                                            <div>
                                                <img
                                                    src={whiteLableBrandData?.logo}
                                                    alt="cars&Bike logo"
                                                    // height={80}
                                                    // style={{ paddingTop: 64, paddingBottom: 32 }}
                                                    className='h-[140px] pb-[32px]'
                                                />
                                            </div>
                                        }
                                        {!otpSent &&
                                            <>
                                                <p className='uc-bold  text-extraa-purple-btn text-4xl'>Hello!</p>
                                                <label className="text-MFC-black text-[26px] font-normal uc-sb mb-10">Welcome to {whiteLableBrandData?.name}</label>
                                                <label>
                                                    <span className="typography-label-sm text-MFC-black font-medium uc-sb">Enter 10 digit Phone Number *</span>
                                                    {/* <div className='flex items-center gap-2 text-black'>
                                                        +91 */}
                                                    <input
                                                        value={formData?.phone}
                                                        invalid={phoneIsInvalid}
                                                        required
                                                        type='tel'
                                                        onInput={() => (formData?.phone ? setPhoneIsInvalid(false) : setPhoneIsInvalid(true))}
                                                        // onBlur={() => (formData?.phone ? setPhoneIsInvalid(false) : setPhoneIsInvalid(true))}
                                                        onChange={handleChange}
                                                        name='phone'
                                                        className='w-full border-2 rounded-md h-[40px] px-4 uc-sb bg-MFC-White text-MFC-black'
                                                        maxLength={10}
                                                    // pattern="[0-9]*"
                                                    />
                                                    {/* </div> */}
                                                    <div className='min-h-[25px]'>
                                                        {phoneIsInvalid && (
                                                            <p className="mt-0.5 text-red-700 typography-text-sm font-medium uc-sb">{phoneErr}</p>
                                                        )}
                                                    </div>
                                                </label>
                                                <SfButton id='phone' className='bg-extraa-purple-btn mt-2 w-24 uc-sb' onClick={onFormSubmit}>
                                                    {loader && <DotLoader />}
                                                    {!loader && <span className='text-Zoominfo-text-button '>Get OTP</span>}
                                                </SfButton>
                                            </>
                                        }
                                        {otpSent && !newUser &&
                                            <>
                                                <label className="text-MFC-black text-[16px] font-normal uc-sb">OTP Sent to</label>
                                                <label className="text-MFC-black text-[24px] font-normal uc-sb mb-10">{`${formData?.phone.substring(0, 2)}XXXXXX${formData?.phone.substring(8)}!`}</label>
                                                <label className="text-MFC-black text-[14px] font-normal uc-sb mb-2">Enter OTP</label>
                                                <OtpInput
                                                    inputStyle={{
                                                        height: 40,
                                                        width: 40,
                                                        border: '1px solid #E0E0E0',
                                                        marginRight: 15,
                                                        background: "#f7f3f8",
                                                        borderRadius: 5
                                                    }
                                                    }
                                                    numInputs={4}
                                                    onChange={(value) => handleOtpChange(value)}
                                                    isInputNum={true}
                                                    shouldAutoFocus
                                                    value={otp}
                                                    // separator={<span> --- </span>}
                                                    separateAfter={1}
                                                />
                                                <SfButton id='phone' className='bg-extraa-purple-btn mt-4 w-36 uc-sb' onClick={onVerifyClick}>
                                                    {loader && <DotLoader />}
                                                    {!loader && <span className='text-Zoominfo-text-button' >Verify OTP</span>}
                                                </SfButton>
                                                {otpIsInvalid && <p className="mt-2 text-red-600">OTP does not match!</p>}
                                                <p className='text-[12px] mt-8 text-MFC-black '>Didn’t receive OTP?</p>
                                                <p className='text-[12px] text-MFC-black underline' onClick={onFormSubmit}>Send Again</p>
                                            </>
                                        }
                                        {otpSent && newUser &&
                                            <>
                                                <label className="text-MFC-black text-[16px] font-normal uc-sb mb-2">Please enter your details to register with us</label>
                                                <label className='flex items-start w-full flex-col'>
                                                    <span className="typography-label-sm font-medium w-full uc-sb">Enter Full Name *</span>
                                                    <input
                                                        value={formData?.name}
                                                        invalid={usernameIsInvalid}
                                                        required
                                                        // onInput={() => (formData?.name ? setUsernameIsInvalid(false) : setUsernameIsInvalid(true))}
                                                        // onBlur={() => (formData?.name ? setUsernameIsInvalid(false) : setUsernameIsInvalid(true))}
                                                        onChange={handleChange}
                                                        name='name'
                                                        className='w-full border-2 rounded-md h-[40px] px-4 uc-sb'
                                                    />
                                                    <div className='min-h-[25px]'>
                                                        {usernameIsInvalid && (
                                                            <p className="mt-0.5 text-red-700 typography-text-sm font-medium uc-sb">The field cannot be empty</p>
                                                        )}
                                                    </div>
                                                </label>
                                                <label>
                                                    <span className="typography-label-sm font-medium uc-sb">Enter Email Id *</span>
                                                    {/* <div className='flex items-center gap-2 text-black'>
                                                        +91 */}
                                                    <input
                                                        value={formData?.email}
                                                        invalid={emailValid}
                                                        required
                                                        type='email'
                                                        // onInput={() => (formData?.email ? setEmailVaild(false) : setEmailVaild(true))}
                                                        // onBlur={() => (formData?.phone ? setPhoneIsInvalid(false) : setPhoneIsInvalid(true))}
                                                        onChange={handleChange}
                                                        name='email'
                                                        className='w-full border-2 rounded-md h-[40px] px-4 uc-sb'
                                                    // pattern="[0-9]*"
                                                    />
                                                    {/* </div> */}
                                                    <div className='min-h-[25px]'>
                                                        {emailValid && (
                                                            <p className="mt-0.5 text-red-700 typography-text-sm font-medium uc-sb">{mailErr}</p>
                                                        )}
                                                    </div>
                                                </label>
                                                <label className="text-black text-[14px] font-normal uc-sb mb-2">Enter OTP</label>
                                                <OtpInput
                                                    inputStyle={{
                                                        height: 40,
                                                        width: 40,
                                                        border: '1px solid #E0E0E0',
                                                        marginRight: 15,
                                                        background: "#f7f3f8",
                                                        borderRadius: 5
                                                    }
                                                    }
                                                    numInputs={4}
                                                    onChange={(value) => handleOtpChange(value)}
                                                    isInputNum={true}
                                                    shouldAutoFocus
                                                    value={otp}
                                                    // separator={<span> --- </span>}
                                                    separateAfter={1}
                                                />
                                                {otpIsInvalid && <p className="mt-2 text-red-600 uc-sb">OTP does not match!</p>}
                                                <div className='flex flex-row gap-2 mt-4'>
                                                    <input type="checkbox" className="checkbox checkbox-sm" onChange={(e) => { onChecked(e) }} checked={terms} />
                                                    <p className="text-[12px] text-[#616161] font-normal uc-sb mb-2">I agree to <SfLink className="text-[12px] text-[#616161] font-normal uc-sb mb-2 underline" href="/terms">terms & Conditions</SfLink>
                                                    </p>
                                                </div>
                                                {termsErr && <p className="mt-2 text-red-600 uc-sb">Please accept the terms and conditions to continue</p>}
                                                <SfButton id='phone' className='bg-[#FEC447] mt-2 w-36 uc-sb' onClick={onNewRegClick}>
                                                    {loader && <DotLoader />}
                                                    {!loader && <span className='text-black' >Verify OTP</span>}
                                                </SfButton>
                                                <p className='text-[12px] text-[#00171F] '>Didn’t receive OTP?</p>
                                                <p className='text-[12px] text-[#9356C0] underline' onClick={onFormSubmit}>Send Again</p>
                                            </>
                                        }
                                    </>
                                }
                            </div>

                        </section>
                    </div>
                </SfModal >
            </CSSTransition >
            {visible && <NotificationManager message={'Logged in sucessfully'} alertType={1} />}
        </>
    )
}

export default LoginModal;