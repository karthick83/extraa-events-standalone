"use client"
import UserAccountsSidePanel from '@/components/UserAccountsSidePanel'
import { GetUserAddress } from '@/queries/GetUserAddress';
import { useQuery } from '@apollo/client';
import { SfIconDelete } from '@storefront-ui/react';
import { useRouter } from 'next/navigation';
import React from 'react'
export const decodeJWT = (token) => {
    try {
        const decodedToken = jwtDecode(token);
        // console.log(decodedToken, 'token')
        return decodedToken;
    } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
    }
};
import { userToken } from '../page';
const ManageAddress = () => {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    const userid = token && token !== 'undefined' && decodeJWT(token) && decodeJWT(token)['https://hasura.io/jwt/claims']['x-hasura-user-id'] || ''
    const phone = token && token !== 'undefined'&& decodeJWT(token) && decodeJWT(token)['https://hasura.io/jwt/claims']['x-hasura-phone'] || ''
    const router = useRouter();
    const { data: userAddress } = useQuery(GetUserAddress, { context: { headers: { Authorization: `Bearer ${userToken}` } } })
    console.log(userAddress?.user_address,"add");
    return (
        <section className='px-4 py-2  h-full w-full flex flex-col md:flex-row md:justify-start  gap-4'>
            <UserAccountsSidePanel router={router} />
            <article className='md:w-full'>
                <p className='font-bold text-base border-b-2 border-MFC-White text-MFC-White'>Your Address</p>
                <section className='mt-4 lg:flex gap-2'>
                    {/* Add New Address Box */}
                    <div className='border-2 border-extraa-purple-btn w-full  min-h-[200px] max-w-[400px] rounded-xl grid grid-cols-1 place-items-center'>
                        <div className='grid grid-cols-1 place-items-center'>
                            <div className=' w-10 h-10 rounded-full text-3xl font-bold flex justify-center text-MFC-White bg-extraa-yellow'>+</div>
                            <p className='font-bold text-MFC-White'>Add New Address</p>
                        </div>
                    </div>
                    {/* Address Box */}
                    {userAddress?.user_address&&userAddress?.user_address.length>0&&
                    userAddress?.user_address?.map((user,index)=>(
                     <div key={user?.id} className=' relative border-2 mt-4 lg:mt-0 border-MFC-White w-full max-w-[400px] min-h-[200px] rounded-xl '>
                        <div className=''>
                         {index==0&&<div className="badge badge-neutral rounded-r-full mt-3 p-2 text-sm bg-extraa-purple-btn text-MFC-black border-0">Default</div>}
                        </div>
{/* >>>>>>>>>>>>>>>>>>>>>>>>>> User Name Section <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}
                        <div className='border-b-2 border-black  m-3 p-1'>
                            <h2 className='text-base font-semibold'>{user?.full_name}</h2>
                        </div>
{/* >>>>>>>>>>>>>>>>>>>>>>>>>> Address Section <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}
                        <article className='m-3 p-1 bottom-3'>                            
                            <p>{user?.address_line_1+", "+user?.address_line_2}</p>
                            <p>{user?.city+", "+user?.state+', '+user?.pincode}</p>
                        </article>
{/* >>>>>>>>>>>>>>>>>>>>>>>>>> Address Edit Section <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}                        
                        <div className='grid grid-cols-2 place-items-center max-w-[100px] gap-3 right-2 bottom-2 absolute cursor-not-allowed'>
                            <SfIconDelete />
                            <img src="assets/pencil.png" alt="Wallet" className=' max-w-[20px]  object-contain  left-0 ' />

                        </div>
                        <div></div>
                    </div>))}
                </section>
            </article>
        </section>
    )
}

export default ManageAddress