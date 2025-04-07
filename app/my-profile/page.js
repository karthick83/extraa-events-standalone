"use client";
import { Datepicker, TextBox } from "@/components/TextBox";
import { GetUserDetails } from "@/queries/GetUserDetails";
import { useApolloClient, useQuery } from "@apollo/client";
import { SfButton, SfRadio, SfSelect } from "@storefront-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UseUpdateUser } from "@/mutation/UpdateUserDetails";
import NotificationManager from "@/components/NotificationManager";
import Loader from "@/components/loader";
import UserAccountsSidePanel from "@/components/UserAccountsSidePanel";

const options = [
    { "label": "Male", "value": "MALE", "name": "MALE" },
    { "label": "Female", "value": "FEMALE", "name": "FEMALE" },
    { "label": "Others", "value": "OTHERS", "name": "OTHERS" }
]

const Ageoptions = [
    { "label": "0-20", "value": "0-20", "name": "0-20" },
    { "label": "21-40", "value": "21-40", "name": "21-40" },
    { "label": "41-60", "value": "41-60", "name": "41-60" },
    { "label": "60+", "value": "60+", "name": "60+" }
]

const MyProfile = () => {
    
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        date: '',
        gender: '',
        pincode: '',
        add1: '',
        add2: '',
        state: '',
        city: '',
        land: '',
        age: ''
    });
    const [errorMsg, setErrorMsg] = useState('')
    const [notiType, setNotiType] = useState(0)
    const [loader, setLoader] = useState(false)
    const client = useApolloClient();
    const router = useRouter();
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    const user_id = typeof localStorage !== 'undefined' ? localStorage.getItem('user_id') : null;
    const { data } = useQuery(GetUserDetails, { variables: { id: user_id }, context: { headers: { Authorization: `Bearer ${token}` } } });
    const handleChange = (e) => {
        // console.log(e)
        const { name, value } = e?.target;
        if (name === 'phone' || name === 'pincode') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value.replace(/\D/g, ""),
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
        // console.log(formData, 'va');
    };

    useEffect(() => {
        if (!token) {
            router.push('/')
        }
    }, [token])

    useEffect(() => {
        //if(data){
        setLoader(true)
        setFormData((prevData) => ({
            ["name"]: data?.users_by_pk?.name || '',
            ["phone"]: data?.users_by_pk?.phone_number || '',
            ["email"]: data?.users_by_pk?.email || '',
            ["date"]: data?.users_by_pk?.dob || '',
            ["age"]: data?.users_by_pk?.age_range || '',
            ["gender"]: data?.users_by_pk?.gender || '',
            ['pincode']: data?.users_by_pk?.user_addresses?.length > 0 && data?.users_by_pk?.user_addresses[0]?.pincode || '',
            ["add1"]: data?.users_by_pk?.user_addresses?.length > 0 && data?.users_by_pk?.user_addresses[0]?.address_line_1 || '',
            ["add2"]: data?.users_by_pk?.user_addresses?.length > 0 && data?.users_by_pk?.user_addresses[0]?.address_line_2 || '',
            ["state"]: data?.users_by_pk?.user_addresses?.length > 0 && data?.users_by_pk?.user_addresses[0]?.state || '',
            ["city"]: data?.users_by_pk?.user_addresses?.length > 0 && data?.users_by_pk?.user_addresses[0]?.city || '',
            ['land']: data?.users_by_pk?.user_addresses?.length > 0 && data?.users_by_pk?.user_addresses[0]?.landmark || '',
        }));
        // }
        setLoader(false)
        localStorage.setItem("user_name",data?.users_by_pk?.name)
        localStorage.setItem("user_gender",data?.users_by_pk?.gender)

    }, [data])

    const onSaveClick = async () => {
        setLoader(true)
        if (formData?.name?.length === 0) {
            setErrorMsg('Please Enter User name')
            setNotiType(0)
        } else if (formData?.email === '' || (!/\S+@\S+\.\S+/.test(formData?.email))) {
            setErrorMsg('Invalid Email Id')
            setNotiType(0)
        } 
        
         else {
            const result = await UseUpdateUser(formData, client, parseInt(user_id) )
            if (result?.success) {
                // console.log(result?.result,'res')
                setNotiType(1)
                setErrorMsg('User Successfully update')
                // setFormData('')
            } else {
                setNotiType(0)
                setErrorMsg(result?.error)
            }
        }
        setLoader(false)
        setTimeout(() => setErrorMsg(''), 5000)
    }

    return (
        <>
            {
                loader ? <Loader />
                    :
                    <div className="px-4 py-2  h-full w-full flex flex-col md:flex-row md:justify-start  gap-4">
                       {/* userAccounts Side Panel */}
                       <UserAccountsSidePanel name={formData?.name} gender={formData?.gender} router={router}/>
                       <div className="flex flex-col justify-center items-center w-full">
                        <div className="flex flex-col  max-w-[1000px] min-w-[300px] w-[80%] mb-5  px-6 py-4 border-2 rota-sb gap-4 rounded-lg">
                            <h1 className="text-[24px] rota-sb text-MFC-black">Presonal Details</h1>
                            <div className="w-full flex flex-col gap-4 pb-6 text-MFC-black ">
                                {TextBox("name", "Username", formData.name, (e) => handleChange(e))}
                                {TextBox("phone", "Phone Number", formData.phone, (e) => handleChange(e), true)}
                                {TextBox("email", "Email", formData.email, (e) => handleChange(e))}
                                {TextBox("date", "Date of Birth", formData.date, (e) => handleChange(e), false, "date")}
                                <label>
                                    <span className="pb-1 font-medium text-MFC-black font-body">Gender</span>
                                    <SfSelect name="gender" placeholder="-- Select --" className="text-MFC-black" value={formData?.gender} onChange={handleChange}>
                                        {options.map((option) => (
                                            <option value={option.value} key={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </SfSelect>
                                </label>
                                <label>
                                    <span className="pb-1 font-medium text-MFC-black font-body">Age range</span>
                                    <SfSelect name="age" placeholder="-- Select --" className="text-MFC-black" value={formData?.age} onChange={handleChange}>
                                        {Ageoptions.map((option) => (
                                            <option value={option.value} key={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </SfSelect>
                                </label>
                            </div>
                        </div>
                        {/* ----address----- */}
                        {/* <div className="flex flex-col items-start max-w-[600px] min-w-[300px] w-[80%] px-6 py-4 bg-[#fff] rota-sb gap-4 rounded-lg"> */}
                            {/* <h1 className="text-[24px]">{"Address (Optional)"}</h1> */}
                            {/* <form className="w-full flex flex-col gap-4" onSubmit={sendForm}> */}
                            {/* <div className="w-full flex flex-col gap-4 pb-6">
                                {TextBox("pincode", "Area Pincode", formData.pincode, (e) => handleChange(e), false, '', 6)}
                                {TextBox("add1", "Address Line 1", formData.add1, (e) => handleChange(e))}
                                {TextBox("add2", "Address Line 2", formData.add2, (e) => handleChange(e))}
                                {TextBox("land", "Landmark", formData.land, (e) => handleChange(e))}
                                {TextBox("city", "City", formData.city, (e) => handleChange(e))}
                                {TextBox("state", "State", formData.state, (e) => handleChange(e))}
                            </div> */}
                            {/* </form> */}
                        {/* </div> */}
                        <div className="flex gap-4">
                            <SfButton variant="primary" className="bg-extraa-purple-btn " onClick={onSaveClick}> <span className="text-Zoominfo-text-button">Save</span></SfButton>
                            <SfButton variant="secondary" onClick={() => { router.push('/') }}>Cancel</SfButton>
                        </div>
                       </div>
                        {/* </form> */}
                        {errorMsg.length > 0 && <NotificationManager message={errorMsg} alertType={notiType} />}
                    </div>
            }
        </>


    )
}

export default MyProfile;