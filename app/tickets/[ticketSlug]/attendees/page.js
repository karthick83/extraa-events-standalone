"use client";
import { adminToken, user_token } from "@/app/page";
import TicketHead from "@/common/TicketHead";
import { GetProductsBySlug } from "@/queries/GetProducts";
import { useQuery } from "@apollo/client";
import Loading from "../../loading";
import { TextBox } from "@/components/TextBox";
import { CheckBox, DropDown, InputTextLong, RadioList, TextBoxs } from "@/common/FormFields";
import { SfButton, useDisclosure } from "@storefront-ui/react";
import { createRef, useCallback, useEffect, useRef, useState } from "react";
import AlertModal from "@/components/AlertModal";
import { useRouter } from "next/navigation";
import NormalForm from "@/common/NormalForm";
import NotificationManager from "@/components/NotificationManager";
import SurveySection from "@/common/Survey";

export default function Attendees({ params }) {
    const route = useRouter()
    const { data, loading } = useQuery(GetProductsBySlug, { variables: { slug: params?.ticketSlug }, context: { headers: { Authorization: `Bearer ${adminToken}` } } });
    const product = data?.products && data?.products[0]
    const cartItems = typeof localStorage !== 'undefined' && JSON.parse(localStorage.getItem('cart_items'))
    const attendee_details = typeof localStorage !== 'undefined' && JSON.parse(localStorage.getItem('attendee_details')) || []
    let dup = []
    const dupCart = (cartItems) => {
        for (let i = 0; i < cartItems?.length; i++) {
            for (let j = 0; j < cartItems[i].quantity; j++) {
                dup.push(cartItems[i])
            }
        }
    }
    dupCart(cartItems)
    // const intialValues = attendee_details?.length > 0 ? attendee_details : dup?.map(x => {
    //     const value = { id: x.id }
    //     x?.survey?.form_details?.pages[0]?.elements?.forEach((i) => {
    //         if (i?.type === 'checkbox') {
    //             value[i?.title || i?.name] = []
    //         } else {
    //             value[i?.title || i?.name] = ''
    //         }
    //     })
    //     return value
    // }) || {}
    const myRef = useRef(null)
    // console.log(cartItems, 'params', dup);
    // const element_map = { text: TextBoxs, dropdown: DropDown, radiogroup: RadioList, checkbox: CheckBox, comment: InputTextLong }
    const { isOpen, open, close } = useDisclosure({ initialValue: false });
    const [formCount, setFormCount] = useState(0)
    const [formValues, setFormValues] = useState([])
    const [errorValues, setErrorValues] = useState({})
    const [notifications, setNotifications] = useState(false)
    // console.log(formValues,'state', errorValues);
    const [showNormalForm, setShowForm] = useState(product?.product_variants[0]?.survey?.form_details ? false : true)
    // const formref = createRef(null)
    // console.log(formValues, 'values');
    // const element_ma = { text: function TextboxTest(name) { return <div>{name}</div> } }
    useEffect(() => {
        setShowForm(product?.product_variants[0]?.survey?.form_details ? false : true)
    }, [product])

    const onFormSubmit = async (e, id) => {
        // console.log(e.data, 'err');
        // e.preventDefault();
        // const AllEmpty = Object.values(errorValues).every(x => x === '')
        // if (AllEmpty) {
        const formData = e.data
        formData.id = id?.id
        // const form = Object.fromEntries(formData)
        if (dup?.length - 1 > formCount) {
            setFormCount(prevCount => prevCount + 1)
            formValues.push(formData)
        }
        if (dup?.length - 1 === formCount) {
            // console.log(formData, 'final');
            formValues.push(formData)
            localStorage.setItem('attendee_details', JSON.stringify(formValues))
            if (user_token) {
                route.push(`/tickets/${params?.ticketSlug}/checkout`)
                setShowForm(false)
            } else {
                setShowForm(true)
            }
        }
        setFormValues([...formValues])
        myRef.current.scrollIntoView()
        setNotifications(false)
        // } else {
        //     setNotifications(true)
        // }
    }

    // const handelChange = (e, value, type) => {
    //     // console.log(e.target.value, value, type, 'onchange');
    //     let check = formValues[formCount][value]?.length > 0 && formValues[formCount][value] || []
    //     if (type === 'checkbox') {
    //         if (e.target.checked) {
    //             check.push(e.target.value)
    //         } else {
    //             check = check.filter((item) => item !== e.target.value)
    //         }
    //         formValues[formCount][value] = check
    //     } else {
    //         formValues[formCount][value] = e?.target?.value || ""
    //         if (e?.target?.value === "") {
    //             errorValues[value] = "This field is required"
    //         } else if (type === "tel") {
    //             const reg = /^[0-9]{1,10}$/;
    //             const val = reg.test(e?.target?.value);
    //             errorValues[value] = val && (e?.target?.value?.length === 10) ? "" : 'Please enter a valid phone number';
    //         } else if (type === 'email') {
    //             const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
    //             const val = reg.test(e?.target?.value);
    //             errorValues[value] = val ? '' : 'Please enter valid email id';
    //         }
    //         // else if(type==='number'){
    //         //     const reg = /^[0-9]$/;
    //         //     const val = reg.test(e?.target?.value);
    //         //     errorValues[value] = val ? "" : 'Please enter a valid value';
    //         // }
    //         else {
    //             errorValues[value] = ""
    //         }
    //         setErrorValues({ ...errorValues })
    //     }
    //     setFormValues([...formValues])
    //     // console.log(e?.target?.value, "values", e?.target?.checked, formValues);
    // }

    useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    const handleBeforeUnload = (e) => {
        e.preventDefault();
        const message =
            "Are you sure you want to leave? All provided data will be lost.";
        e.returnValue = message;
        return message;
    };

    const onBackButtonClick = () => {
        open()
    }

    const onLeavePress = () => {
        localStorage.removeItem('cart_items')
        localStorage.removeItem('attendee_details')
        route.back(`/tickets/${params?.ticketSlug}/bookings`)
    }

    return (
        <>
            {!loading ?
                <div className="m-6" ref={myRef}>
                    <TicketHead product={product} toggleBack={onBackButtonClick} />
                    <div className="w-full flex items-center justify-center" >
                        <div className="max-w-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] w-full">
                            {dup?.length > 0 && JSON.stringify(formValues[formCount]) !== "{}" && !showNormalForm ?
                                // <div className="w-full flex flex-col items-center justify-center">
                                <>
                                    <div className="w-full flex items-center justify-center">
                                        <p className="capitalize p-4 uc-sb w-full" >{`${dup?.length > 0 && dup[formCount]?.attributes?.Type} Attendee ${formCount + 1}`}</p>
                                    </div>
                                    {/* <form ref={formref} id={formCount + 1} onSubmit={(e) => { onFormSubmit(e, dup[formCount]) }} className="flex flex-col gap-3 p-3">
                                        {dup?.length > 0 && dup[formCount]?.survey?.form_details?.pages[0]?.elements?.map((i) => (
                                            <div key={i.name}>
                                                {element_map[i?.type](i?.name, i?.title, i?.choices, i?.isRequired, formValues[formCount], handelChange, i?.inputType, errorValues || "")}
                                            </div>
                                        )
                                        )}
                                        <div className="flex flex-row gap-4 items-center w-full">
                                            {formCount > 0 && <SfButton className='!text-[#553074] mt-2 rota-sb border-[1px] border-purple-800' onClick={() => {
                                                setFormCount(prev => prev - 1)
                                                myRef.current.scrollIntoView()
                                            }}>Previous</SfButton>}
                                            <SfButton className='bg-purple-800 mt-2' type='submit'>{formCount === dup?.length - 1 ? "Save" : "Next"}</SfButton>
                                        </div>
                                    </form> */}
                                    <SurveySection
                                        // surveyId={product?.product_variants[0]?.survey?.id}
                                        formDetails={product?.product_variants[0]?.survey?.form_details}
                                        submitSurvey={(e) => { onFormSubmit(e, dup[formCount]) }}
                                    />
                                </>
                                // </div>
                                :
                                <div className="m-4">
                                <NormalForm link={`/tickets/${params?.ticketSlug}/checkout`} />
                                </div>
                            }
                        </div>
                    </div>
                </div>
                : <Loading />
            }
            <AlertModal close={close} open={open} isOpen={isOpen} toggleLeave={onLeavePress} />
            {notifications && <NotificationManager message={`Please resolve the errors above`} alertType={0} offset={1} />}
        </>
    )
}