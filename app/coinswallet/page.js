"use client"
import { PaginationComponent } from '@/components/Pagination';
import UserAccountsSidePanel from '@/components/UserAccountsSidePanel'
import { getWalletTransactions } from '@/queries/GetWallertTrans';
import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const CoinWallet = () => {
  const user_id = typeof localStorage !== 'undefined' ? localStorage.getItem('user_id') : null;
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  const [limit, setLimit] = useState(5);

  const [offset, setOffset] = useState(0);
  const { data, loading } = useQuery(getWalletTransactions, {
    variables: {
      id: user_id,
      limit: limit,
      offset: offset
    },
    
    context: { headers: { Authorization: `Bearer ${token}` } }
  });
 
  const transactionCount = data?.wallet_transactions_aggregate?.aggregate?.count;
  const walletTransactions=data?.wallet_transactions
  const coinsLeft=data?.wallet_transactions[0].coin.wallets[0].balance
  // console.log(data,"data");
  const router = useRouter();
  return (
    <div className="px-4 py-2 bg-[#F4EEF9] h-full w-full  flex flex-col md:flex-row md:justify-start  gap-4">
      <UserAccountsSidePanel router={router}/>
      <div className='w-full border-red'>
        <div className='flex justify-evenly'>
          {/* Coins Wallet */}
        <header className='w-full md:w-[70%] min-h-[125px] border-[#4F3084] rounded-md  border-2 flex justify-between md:justify-around gap-2  content-start md:relative'>
          <div className='max-w-[300px] h-full'>
          <img src="assets/coins_wallet.png" alt="Wallet" className=' max-w-[200px] md:max-w-[170px] object-contain md:absolute left-0 '/>
          </div>
        <div className='flex justify-center gap-5 p-3'>
          {/* Gold Coins */}
       
            <div className='flex items-center  gap-2'>
              {/* <img src='' className='w-4 h-4'/> */}
              <svg   width="47" height="46" viewBox="0 0 47 46" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.7175 45.7664C35.264 45.7664 45.6723 35.5982 45.9649 23.055C46.2575 10.5119 36.3237 0.343628 23.7772 0.343628C11.2306 0.343628 0.822354 10.5119 0.529733 23.055C0.237112 35.5982 10.1709 45.7664 22.7175 45.7664Z" fill="#F9B233"/>
    <path d="M23.2481 4.33969C33.3296 4.33969 41.5316 12.7353 41.5316 23.0548C41.5316 33.3743 33.3296 41.7699 23.2481 41.7699C13.1665 41.7699 4.96448 33.3743 4.96448 23.0548C4.96448 12.7353 13.1665 4.33969 23.2481 4.33969ZM23.2481 3.13654C12.501 3.13654 3.78906 12.0541 3.78906 23.0548C3.78906 34.0555 12.5014 42.973 23.2481 42.973C33.9951 42.973 42.707 34.0551 42.707 23.0548C42.707 12.0541 33.9951 3.13654 23.2481 3.13654Z" fill="#F39200"/>
    <path opacity="0.3" d="M28.015 16.7847H32.7747L31.1094 19.3237C31.1094 19.3237 30.5666 19.3237 28.0622 19.3237C27.1649 25.6844 19.6586 25.8888 19.6586 25.8888V26.1062L29.5746 38.5964H25.3573L15.7191 26.4689V24.0024C18.5342 24.2622 20.4463 23.9066 21.7417 23.2915C21.7572 23.2856 21.7715 23.2785 21.787 23.2713C24.7634 21.9236 24.4717 19.3237 24.4717 19.3237H14.8447L16.5343 16.8571C16.5343 16.8571 19.5336 16.8571 24.2237 16.8571C23.5505 14.4271 20.1488 14.0643 19.688 14.0829C19.2272 14.1003 14.8447 14.0829 14.8447 14.0829L16.5343 11.5134H32.8571L31.1094 14.1003C31.1094 14.1003 28.0862 14.1003 26.7397 14.1003C27.7782 15.1411 28.015 16.7847 28.015 16.7847Z" fill="#F39200"/>
    <path d="M26.4671 16.0893H31.2268L29.5616 18.6283C29.5616 18.6283 29.0188 18.6283 26.5143 18.6283C25.6171 24.9886 18.1107 25.1933 18.1107 25.1933V25.4112L28.0267 37.9014H23.8095L14.1713 25.7735V23.307C16.9864 23.5668 18.8981 23.2112 20.1938 22.5961C20.2093 22.5902 20.2236 22.5831 20.2391 22.5759C23.2156 21.2282 22.9238 18.6283 22.9238 18.6283H13.2969L14.9865 16.1617C14.9865 16.1617 17.9858 16.1617 22.6758 16.1617C22.0026 13.7317 18.601 13.3689 18.1402 13.3879C17.6793 13.4053 13.2969 13.3879 13.2969 13.3879L14.9865 10.8184H31.3092L29.5616 13.4053C29.5616 13.4053 26.5383 13.4053 25.1919 13.4053C26.2303 14.4457 26.4671 16.0893 26.4671 16.0893Z" fill="#FFEFAB"/>
    </svg>

              <div className='flex items-center'>
              {/* <p className='font-bold text-xs md:text-lg'>Gold Coins</p> */}
              <p className='text-sm md:text-base text-extraa-yellow font-extrabold'> {coinsLeft} Coins</p>
              </div>
            </div>
        {/* Silver Coins */}
            {/* <div className='md:flex items-start gap-2'>
            <svg width="47" height="47" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.4951 46.7664C36.1977 46.7664 46.4951 36.469 46.4951 23.7664C46.4951 11.0639 36.1977 0.766418 23.4951 0.766418C10.7926 0.766418 0.495117 11.0639 0.495117 23.7664C0.495117 36.469 10.7926 46.7664 23.4951 46.7664Z" fill="#7975FD" fill-opacity="0.7"/>
    <path d="M23.4951 5.03599C33.8231 5.03599 42.2255 13.4384 42.2255 23.7664C42.2255 34.0943 33.8231 42.4968 23.4951 42.4968C13.1671 42.4968 4.76469 34.0943 4.76469 23.7664C4.76469 13.4384 13.1671 5.03599 23.4951 5.03599ZM23.4951 3.83185C12.4854 3.83185 3.56055 12.7571 3.56055 23.7664C3.56055 34.7761 12.4858 43.7009 23.4951 43.7009C34.5048 43.7009 43.4296 34.7761 43.4296 23.7664C43.4296 12.7567 34.5048 3.83185 23.4951 3.83185Z" fill="#7975FD"/>
    <path opacity="0.3" d="M28.3792 17.4913H33.2552L31.5489 20.0324C31.5489 20.0324 30.9928 20.0324 28.4272 20.0324C27.508 26.3979 19.8182 26.6028 19.8182 26.6028V26.8204L29.9766 39.3208H25.6566L15.7829 27.1835V24.715C18.6664 24.975 20.6252 24.619 21.9526 24.0035C21.9685 23.9975 21.9832 23.9904 21.999 23.9833C25.0482 22.6345 24.749 20.0324 24.749 20.0324H14.8867L16.6176 17.5638C16.6176 17.5638 19.6902 17.5638 24.4949 17.5638C23.8052 15.1318 20.3204 14.7687 19.8484 14.7877C19.3763 14.8052 14.8867 14.7877 14.8867 14.7877L16.6176 12.2161H33.3393L31.5489 14.8052C31.5489 14.8052 28.4518 14.8052 27.0724 14.8052C28.1367 15.846 28.3792 17.4913 28.3792 17.4913Z" fill="#2320A6"/>
    <path d="M26.7933 16.7952H31.6693L29.963 19.3363C29.963 19.3363 29.4069 19.3363 26.8412 19.3363C25.9221 25.7018 18.2323 25.9067 18.2323 25.9067V26.1243L28.3906 38.6251H24.0707L14.197 26.4874V24.0189C17.0809 24.2789 19.0397 23.923 20.3667 23.3074C20.3826 23.3015 20.3972 23.2943 20.4131 23.2872C23.4623 21.9384 23.163 19.3363 23.163 19.3363H13.3008L15.0317 16.8677C15.0317 16.8677 18.1043 16.8677 22.909 16.8677C22.2193 14.4357 18.7345 14.0726 18.2624 14.0912C17.7904 14.1087 13.3008 14.0912 13.3008 14.0912L15.0317 11.5197H31.7533L29.963 14.1087C29.963 14.1087 26.8658 14.1087 25.4865 14.1087C26.5507 15.1499 26.7933 16.7952 26.7933 16.7952Z" fill="white"/>
    </svg>
              <div className='content-center'>
              <p className='font-bold text-xs md:text-lg'>Silver Coins</p>
              <p className='text-xs md:text-base'><span className='font-bold text-base'>10000</span> left  of<p className='text-[#7975FD] font-extrabold'> 30000 Coins</p></p>
              </div>
            </div> */}
        </div>
        </header>
        
        {/* Silver Coins */}
        </div>
    
{/* Transactions */}
    <div className='pb-5 '>
    <h4 className='border-b-2 border-[#4F3084] mt-5 font-bold text-lg'>Transactions</h4>
    {/* Transaction slabs */}
    {walletTransactions?.map((transaction,index)=>(
    <div key={index} className='w-full border-2 border-[#CCBEDB] rounded-2xl h-full mt-4 flex justify-between p-2'>
      {/* img */}
      <div className='flex gap-2'>
      <div className="avatar">
  <div className="w-24 rounded-xl ">
    <img  src={transaction?.order?.order_products[0]?.product_variant!=null? (transaction?.order?.order_products[0]?.product_variant?.product?.images):(transaction?.order?.order_products[1]?.product_variant?.product?.images)} />
  </div>
</div>
{/* {transaction?.order?.order_products[0]?.product_variant&& */}
        <div>
          <p className='text-base font-bold'>{transaction?.order?.order_products[0]?.product_variant!=null?(transaction?.order?.order_products[0]?.product_variant?.product?.name):(transaction?.order?.order_products[1]?.product_variant?.product?.name)}</p>
          <p className='font-medium text-sm'>#{transaction?.id&&transaction?.id}</p>
          <p className='text-sm font-semibold'>{transaction?.created_at&&dayjs(transaction?.created_at).format('MMMM D, YYYY h:mm A')}</p>
          
        </div>
        {/* } */}
        {transaction?.order?.order_products?.length>1&&
        <div className="badge badge-primary badge-lg self-center">+{transaction?.order?.order_products?.length-1}</div>}
      </div>
      <div className='flex gap-2'>
        {console.log(transaction?.sender_wallet_number)}
        {transaction?.sender_wallet_number&&transaction?.sender_wallet_number.includes(user_id)&&
        <p className='font-bold text-red-700'>-{transaction?.amount}</p>}
        {transaction?.receiver_wallet_number&&transaction?.receiver_wallet_number.includes(user_id)&&
        <p className='font-bold text-green-700'>-{transaction?.amount}</p>}
        <svg   width="25" height="25" viewBox="0 0 47 46" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.7175 45.7664C35.264 45.7664 45.6723 35.5982 45.9649 23.055C46.2575 10.5119 36.3237 0.343628 23.7772 0.343628C11.2306 0.343628 0.822354 10.5119 0.529733 23.055C0.237112 35.5982 10.1709 45.7664 22.7175 45.7664Z" fill="#F9B233"/>
    <path d="M23.2481 4.33969C33.3296 4.33969 41.5316 12.7353 41.5316 23.0548C41.5316 33.3743 33.3296 41.7699 23.2481 41.7699C13.1665 41.7699 4.96448 33.3743 4.96448 23.0548C4.96448 12.7353 13.1665 4.33969 23.2481 4.33969ZM23.2481 3.13654C12.501 3.13654 3.78906 12.0541 3.78906 23.0548C3.78906 34.0555 12.5014 42.973 23.2481 42.973C33.9951 42.973 42.707 34.0551 42.707 23.0548C42.707 12.0541 33.9951 3.13654 23.2481 3.13654Z" fill="#F39200"/>
    <path opacity="0.3" d="M28.015 16.7847H32.7747L31.1094 19.3237C31.1094 19.3237 30.5666 19.3237 28.0622 19.3237C27.1649 25.6844 19.6586 25.8888 19.6586 25.8888V26.1062L29.5746 38.5964H25.3573L15.7191 26.4689V24.0024C18.5342 24.2622 20.4463 23.9066 21.7417 23.2915C21.7572 23.2856 21.7715 23.2785 21.787 23.2713C24.7634 21.9236 24.4717 19.3237 24.4717 19.3237H14.8447L16.5343 16.8571C16.5343 16.8571 19.5336 16.8571 24.2237 16.8571C23.5505 14.4271 20.1488 14.0643 19.688 14.0829C19.2272 14.1003 14.8447 14.0829 14.8447 14.0829L16.5343 11.5134H32.8571L31.1094 14.1003C31.1094 14.1003 28.0862 14.1003 26.7397 14.1003C27.7782 15.1411 28.015 16.7847 28.015 16.7847Z" fill="#F39200"/>
    <path d="M26.4671 16.0893H31.2268L29.5616 18.6283C29.5616 18.6283 29.0188 18.6283 26.5143 18.6283C25.6171 24.9886 18.1107 25.1933 18.1107 25.1933V25.4112L28.0267 37.9014H23.8095L14.1713 25.7735V23.307C16.9864 23.5668 18.8981 23.2112 20.1938 22.5961C20.2093 22.5902 20.2236 22.5831 20.2391 22.5759C23.2156 21.2282 22.9238 18.6283 22.9238 18.6283H13.2969L14.9865 16.1617C14.9865 16.1617 17.9858 16.1617 22.6758 16.1617C22.0026 13.7317 18.601 13.3689 18.1402 13.3879C17.6793 13.4053 13.2969 13.3879 13.2969 13.3879L14.9865 10.8184H31.3092L29.5616 13.4053C29.5616 13.4053 26.5383 13.4053 25.1919 13.4053C26.2303 14.4457 26.4671 16.0893 26.4671 16.0893Z" fill="#FFEFAB"/>
    </svg>
      </div>
    </div>
))}
    </div>
    <div className='px-4'>
                  <PaginationComponent
                    setOffset={setOffset}
                    offset={offset}
                    productCount={transactionCount}
                    limit={limit}
                  />
                </div>
      </div>
      

    </div>
  )
}

export default CoinWallet