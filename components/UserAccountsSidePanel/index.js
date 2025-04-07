"use client"
import { SfIconMenu } from '@storefront-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

const UserAccountsSidePanel = ({router}) => {
    const gender = typeof localStorage !== 'undefined' && localStorage.getItem("user_gender") || "";
    const name = typeof localStorage !== 'undefined' && localStorage.getItem("user_name") || "";
    const url =typeof window!=='undefined'&&window.location.href
    const parts=url&&url?.split('/')||[]
    const path=parts[parts.length-1]
    const [pathName, setPathName] = useState('');
console.log(path);
    useEffect(() => {       
        // Update path state when route changes
        setPathName(path);

    }, [path]);
    // >>>>>>>>>>>>>>>>> Functions <<<<<<<<<<<<<<<<<<<<<< 
    // const onClickCoinWallet = (e) => {
    //     e.preventDefault();
    //     // router.push('/coinswallet');
        
   
      const onClickNavigate = (e,path) => {
        e.preventDefault();
        router.push(path);
        
    }

    return (
        <div className='w-full md:max-w-[300px]  max-h-[100vh] mb-5 rounded-lg   p-2 md:ml-4 '>
            <div>
                <div className="avatar px-5 flex justify-start w-full pt-4">
                    <div className="w-16 rounded-full flex ">
                        {/* Male user  avatar */}
                        {
                            gender == "MALE" &&

                            <svg viewBox="0 0 61.7998 61.7998" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g data-name="Layer 2" id="Layer_2"> <g data-name="—ÎÓÈ 1" id="_ÎÓÈ_1"> <circle cx="30.8999" cy="30.8999" fill="#ffc200" r="30.8999"></circle> <path d="M52.587 52.908a30.895 30.895 0 0 1-43.667-.291 9.206 9.206 0 0 1 4.037-4.832 19.799 19.799 0 0 1 4.075-2.322c-2.198-7.553 3.777-11.266 6.063-12.335 0 3.487 3.265 1.173 7.317 1.217 3.336.037 9.933 3.395 9.933-1.035 3.67 1.086 7.67 8.08 4.917 12.377a17.604 17.604 0 0 1 3.181 2.002 10.192 10.192 0 0 1 4.144 5.22z" fill="#677079" fill-rule="evenodd"></path> <path d="M24.032 38.68l14.92.09v3.437l-.007.053a2.784 2.784 0 0 1-.07.462l-.05.341-.03.071c-.966 5.074-5.193 7.035-7.803 8.401-2.75-1.498-6.638-4.197-6.947-8.972l-.013-.059v-.2a8.897 8.897 0 0 1-.004-.207c0 .036.003.07.004.106z" fill="#f9dca4" fill-rule="evenodd"></path> <path d="M38.953 38.617v4.005a7.167 7.167 0 0 1-.095 1.108 6.01 6.01 0 0 1-.38 1.321c-5.184 3.915-13.444.704-14.763-5.983z" fill-rule="evenodd" opacity="0.11"></path> <path d="M18.104 25.235c-4.94 1.27-.74 7.29 2.367 7.264a19.805 19.805 0 0 1-2.367-7.264z" fill="#f9dca4" fill-rule="evenodd"></path> <path d="M43.837 25.235c4.94 1.27.74 7.29-2.368 7.263a19.8 19.8 0 0 0 2.368-7.263z" fill="#f9dca4" fill-rule="evenodd"></path> <path d="M30.733 11.361c20.523 0 12.525 32.446 0 32.446-11.83 0-20.523-32.446 0-32.446z" fill="#ffe8be" fill-rule="evenodd"></path> <path d="M21.047 22.105a1.738 1.738 0 0 1-.414 2.676c-1.45 1.193-1.503 5.353-1.503 5.353-.56-.556-.547-3.534-1.761-5.255s-2.032-13.763 4.757-18.142a4.266 4.266 0 0 0-.933 3.6s4.716-6.763 12.54-6.568a5.029 5.029 0 0 0-2.487 3.26s6.84-2.822 12.54.535a13.576 13.576 0 0 0-4.145 1.947c2.768.076 5.443.59 7.46 2.384a3.412 3.412 0 0 0-2.176 4.38c.856 3.503.936 6.762.107 8.514-.829 1.752-1.22.621-1.739 4.295a1.609 1.609 0 0 1-.77 1.214c-.02.266.382-3.756-.655-4.827-1.036-1.07-.385-2.385.029-3.163 2.89-5.427-5.765-7.886-10.496-7.88-4.103.005-14 1.87-10.354 7.677z" fill="#8a5c42" fill-rule="evenodd"></path> <path d="M19.79 49.162c.03.038 10.418 13.483 22.63-.2-1.475 4.052-7.837 7.27-11.476 7.26-6.95-.02-10.796-5.6-11.154-7.06z" fill="#434955" fill-rule="evenodd"></path> <path d="M36.336 61.323c-.41.072-.822.135-1.237.192v-8.937a.576.576 0 0 1 .618-.516.576.576 0 0 1 .619.516v8.745zm-9.82.166q-.622-.089-1.237-.2v-8.711a.576.576 0 0 1 .618-.516.576.576 0 0 1 .62.516z" fill="#e6e6e6" fill-rule="evenodd"></path> </g> </g> </g></svg>
                        }
                        {/* Female User avatar */}
                        {gender == "FEMALE" &&
                            
                            <svg viewBox="0 0 61.7998 61.7998" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g data-name="Layer 2" id="Layer_2"> <g data-name="—ÎÓÈ 1" id="_ÎÓÈ_1"> <path d="M31.129 8.432c21.281 0 12.987 35.266 0 35.266-12.266 0-21.281-35.266 0-35.266z" fill="#ffe8be" fill-rule="evenodd"></path> <circle cx="30.8999" cy="30.8999" fill="#a9cf54" r="30.8999"></circle> <path d="M16.647 25.104s1.394 18.62-1.98 23.645 16.51-.19 16.51-.19l.006-34.863z" fill="#302e33" fill-rule="evenodd"></path> <path d="M45.705 25.104s-1.394 18.62 1.981 23.645-16.51-.19-16.51-.19l-.006-34.863z" fill="#302e33" fill-rule="evenodd"></path> <path d="M52.797 52.701c-.608-1.462-.494-2.918-5.365-5.187-2.293-.542-8.21-1.319-9.328-3.4-.567-1.052-.43-2.535-.43-5.292l-12.93-.142c0 2.777.109 4.258-.524 5.298-1.19 1.957-8.935 3.384-11.338 4.024-4.093 1.819-3.625 2.925-4.165 4.406a30.896 30.896 0 0 0 44.08.293z" fill="#f9dca4" fill-rule="evenodd"></path> <path d="M37.677 38.778l-.015 2.501a5.752 5.752 0 0 0 .55 3.011c-4.452 3.42-12.794 2.595-13.716-5.937z" fill-rule="evenodd" opacity="0.11"></path> <path d="M19.11 24.183c-2.958 1.29-.442 7.41 1.42 7.383a30.842 30.842 0 0 1-1.42-7.383z" fill="#f9dca4" fill-rule="evenodd"></path> <path d="M43.507 24.182c2.96 1.292.443 7.411-1.419 7.384a30.832 30.832 0 0 0 1.419-7.384z" fill="#f9dca4" fill-rule="evenodd"></path> <path d="M31.114 8.666c8.722 0 12.377 6.2 12.601 13.367.307 9.81-5.675 21.43-12.6 21.43-6.56 0-12.706-12.018-12.333-21.928.26-6.953 3.814-12.869 12.332-12.869z" fill="#ffe8be" fill-rule="evenodd"></path> <path d="M31.183 13.697c-.579 2.411-3.3 10.167-14.536 11.407C15.477 5.782 30.182 6.256 31.183 6.311c1.002-.055 15.707-.53 14.536 18.793-11.235-1.24-13.957-8.996-14.536-11.407z" fill="#464449" fill-rule="evenodd"></path> <path d="M52.797 52.701c-14.87 4.578-34.168 1.815-39.915-4.699-4.093 1.819-3.625 2.925-4.165 4.406a30.896 30.896 0 0 0 44.08.293z" fill="#e9573e" fill-rule="evenodd"></path> <path d="M42.797 46.518l1.071.253-.004 8.118h-1.067v-8.371z" fill="#e9573e" fill-rule="evenodd"></path> <path d="M23.834 44.42c.002.013.878 4.451 7.544 4.451 6.641 0 7.046-4.306 7.047-4.318l.188.183c0 .012-.564 4.702-7.235 4.702-6.797 0-7.756-4.83-7.759-4.845z" fill="#464449" fill-rule="evenodd"></path> <ellipse cx="31.3239" cy="49.44545" fill="#464449" rx="1.5127" ry="1.9093"></ellipse> </g> </g> </g></svg>
                        }
                        {/* Default Avatar */}
                        {gender == " " || gender == null||gender==undefined ||!gender &&
                            
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMlDdRB_Ghuy8qjFr0vRGR1QViAvzVuWdqWg&usqp=CAU" className='bg-transparent'/>
                        }


                    </div>
                    <p className='font-bold text-MFC-White flex items-center ml-2'>Hi, {name}</p>
                </div>

{/*>>>>>>>>>>>>>>>>>>>> Menu DropDown For Mobile View <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/}
                    <div className="menu  list-none lg:menu-horizontal bg-base-200 rounded-box lg:mb-64 mt-2 md:hidden">
                        <details close>
                        <summary className='text-center'>Menu</summary>
                            <div className=''>
                                <ul className="menu menu-horizontal  md:text-base font-semibold flex justify-evenly md:flex-col  gap-3">
                                <button
                        className={`rounded-lg w-fit bg-transparent hover:!bg-extraa-purple-btn text-black md:text-left px-5 py-2 ${path === 'my-profile' ? '!bg-extraa-purple-btn !text-Zoominfo-text-button' : ''}`}
                        onClick={(e)=>onClickNavigate(e,'/my-profile')}
                    >Account Details</button>
                    <button
                        className={`rounded-lg bg-transparent hover:bg-extraa-purple-btn text-black w-36 md:text-left px-5 py-2 ${path === 'yourOrders' ? '!bg-extraa-purple-btn text-Zoominfo-text-button' : ''}`}
                        onClick={(e)=>onClickNavigate(e,'/yourOrders')}
                    >
                        Order Details
                    </button>
                    <button
                        className={`rounded-lg w-fit bg-transparent hover:bg-extraa-purple-btn text-black md:text-left px-5 py-2 ${path === 'address' ? '!bg-extraa-purple-btn text-Zoominfo-text-button' : ''}`}
                        onClick={(e)=>onClickNavigate(e,'/manage-address')}
                    >
                        Manage Address
                    </button>
                    <button
                        className={`rounded-lg bg-transparent hover:bg-extraa-purple-btn text-black w-36 md:text-left px-5 py-2 ${path === 'coinswallet' ? '!bg-extraa-purple-btn text-Zoominfo-text-button' : ''}`}
                     
                    >
                        Coin Wallet
                    </button>
                                </ul>
                            </div>
                        </details>

                    </div>
                    
                
            </div>
 {/*>>>>>>>>>>>>>>>> Menu Buttons for Large Scr.  <<<<<<<<<<<<<<<<<<<<<<<<<<<,*/}
            <div className='hidden md:flex'>
                <ul className="menu menu-horizontal      md:text-base font-semibold hidden md:flex justify-evenly md:flex-col  gap-3">
                    <button className={`rounded-lg  w-fit bg-transparent text-black
                    md:text-left px-5 py-2 ${path =='my-profile' ? '!bg-extraa-purple-btn !text-white' : ''}`} onClick={(e)=>onClickNavigate(e,'/my-profile')}
                    >Account Details</button>

                    <button className={`rounded-lg  w-fit bg-transparent text-black 
                    md:text-left px-5 py-2 ${path =='yourOrders' ? '!bg-extraa-purple-btn !text-white' : ''}`}  onClick={(e)=>onClickNavigate(e,'/yourOrders')}
                    >Order Details</button>

                    <button className={`rounded-lg  w-fit bg-transparent text-black  
                    md:text-left px-5 py-2 ${path =='manage-address' ? '!bg-extraa-purple-btn !text-white' : ''}`} onClick={(e)=>onClickNavigate(e,'/manage-address')}>Manage Address</button>

<button className={`rounded-lg  w-fit bg-transparent text-black cursor-not-allowed
                    md:text-left px-5 py-2 ${path =='coinswallet' ? '!bg-extraa-purple-btn !text-white' : ''}`}  
                    >Coin Wallet</button>
                </ul>
            </div>
        </div>
    )
}

export default UserAccountsSidePanel