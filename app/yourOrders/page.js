"use client"
import Loader from '@/components/loader';
import { UserOrdersQuery } from '@/queries/GetOrders';
import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react'
// import { adminToken } from '../page';
import { GetProductbyID } from '@/queries/GetProducts';
import dayjs from 'dayjs';
import LoginModal from '@/components/LoginModal';
import { SfButton, SfIconClose, useDisclosure } from '@storefront-ui/react';
import UserAccountsSidePanel from '@/components/UserAccountsSidePanel';
import { PaginationComponent } from '@/components/Pagination';
import { useRouter } from 'next/navigation';
import { AES, enc } from 'crypto-js';
import { encode } from '@yag/id-hash';

function YourOrders() {
  const router = useRouter();
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0);
  const [filterColor, setFilterColor] = useState("allOrders");
  const [orderData, setOrderData] = useState()
  const user_id = typeof localStorage !== 'undefined' ? localStorage.getItem('user_id') : null;
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  const { data, loading } = useQuery(UserOrdersQuery, {
    variables: {
      id: user_id,
      limit: limit,
      offset: offset
    },
    context: { headers: { Authorization: `Bearer ${token}` } }
  });
  const { isOpen: isModal, open: modalOpen, close: modalClose } = useDisclosure({ initialValue: false });
  // State variable to hold selected product data
  const [selectedProduct, setSelectedProduct] = useState([]);
  const ordersCount = data?.orders_aggregate?.aggregate?.count;
  useEffect(() => {
    if (!token) {
      modalOpen();
    }
  }, [token, modalOpen]);

  useEffect(() => {
    if (data && data?.orders?.length > 0) {
      const new_data = data?.orders?.map((x) => {
        let decryptedData = null
        if (x?.card_details?.length > 0) {
          const bytes = AES.decrypt(x?.card_details[0], "20aserasecretkey24");
          decryptedData = JSON.parse(bytes.toString(enc.Utf8));
        }
        return { ...x, card_details: decryptedData }
      })
      setOrderData(new_data);
      // console.log(new_data, 'details');
    }
  }, [data])


  // >>>>>>>>>>>>>> Functions <<<<<<<<<<<<<<<<<<<<<<<<<<
  const handleViewDetails = (order) => {
    // console.log(order, 'order');
    setSelectedProduct([...selectedProduct, order])
  };
  const   handleCloseDrawer = () => {
    
    setSelectedProduct([]);
  }
  const buttonOptions = [
    { label: 'View All Orders', filter: 'allOrders' },
    // { label: 'View Tickets', filter: 'tickets' },
    // { label: 'View Deals', filter: 'deals' },
    // { label: 'View Giftcards', filter: 'giftCards' },
  ];
  
  const handleClick = (filter) => {
    setFilterColor(filter);
  };

  const onViewClick = (id) => {
    const encoded = encode(id * 11111)
    router.push(`/od/${encoded}`)
  }

  // console.log(selectedProduct);
  return (
    <>
      {
        token ?
          (loading ?
            <div className='min-h-[80vh] flex justify-center items-center'><Loader /></div>
            :
            <section className='px-4 py-2  h-full w-full flex flex-col md:flex-row md:justify-start  gap-4'>
              <UserAccountsSidePanel router={router} />
              <article className='md:w-full'>
                {/*>>>>>>>>>>>>> Orders Filter (deals,tickets,giftcards) <<<<<<<<<<<<<<<<<<<<<<<< */}
                <div className='flex flex-row flex-wrap uc-sb text-xs p-4 gap-4'>
    {buttonOptions.map((button) => (
      <div
        key={button.filter}
        className={`w-full flex items-center cursor-pointer justify-center border-[1px] h-[27px] rounded-lg border-white max-w-[111px] md:py-4 font-bold py-4  ${
          filterColor === button.filter ? "bg-extraa-purple-btn text-Zoominfo-text-button" : "text-Zoominfo-text-button bg-transparent"
        }`}
        onClick={() => handleClick(button.filter)}
      >
        {button.label}
      </div>
    ))}
  </div>
                {/*>>>>>>>>>>>>>>>>>>>>>>>>>> Order Details <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}
                <h1 className='w-full text-center font-extrabold my-4 text-MFC-black'>Order Details</h1>
                <div className='w-full h-fit flex items-center flex-col '>
                {orderData?.map((orders) => (
                    <section key={orders?.id} className=' border-2 max-w-[600px] md:max-w-full  w-full mx-2 mb-8 py-2 rounded-2xl lg:flex lg:flex-col lg:items-center p-3'>
                      {/* card header orderNumber+date */}
                      <div className=' w-full flex flex-col justify-between items-center border-b-2'>
                        {/* <div className="flex flex-col justify-between items-center border-b-2 pb-1"> */}

                        {/*>>>>>>>>>>>>>>>>>>>>>> Order Details Tab <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}
                        <div className='py-2 flex w-full justify-between md:px-5 md:justify-between md:gap-3 uc-regular'>
                          {/* >>>>>>>>>> Order ID <<<<<<<<<<, */}
                          <div className='md:flex flex items-center'>
                            <p className="text-black text-sm mb-2 md:mr-3 font-medium"> Order ID : <span className="font-bold text-MFC-black text-sm">#{orders?.id}</span></p>
                          </div>
                          <div className='flex flex-row items-center '>
                            {/* <<<<<<<<< Date >>>>>> */}
                            <div className='md:flex felx flex-col'>
                              <p className="text-black mb-0 text-sm md:mr-3 font-medium">Placed On:</p>
                              <p className="font-bold  text-MFC-black text-sm">{orders?.created_at && dayjs(orders?.created_at).format('D MMM YYYY')}</p>
                            </div>
                            <div className="divider divider-horizontal "></div>
                            {/*>>>>>>>>>> Order Amount <<<<<<<<<<<<<<<<*/}
                            <div className='md:flex felx flex-col'>
                              <p className="text-black mb-0 text-sm md:md:mr-3 font-medium">Total cost:</p>
                              <p className="font-bold  text-MFC-black text-sm">₹{orders?.amount}</p>
                            </div>
                            <SfButton className='bg-extraa-purple-btn h-[27px] w-24 ml-4 hidden md:flex'>
                              <span className='uc-sb text-xs text-Zoominfo-text-button' onClick={() => { onViewClick(orders?.id) }}>View Order</span>
                            </SfButton>
                          </div>
                        </div>
                        <SfButton className='bg-extraa-purple-btn  h-[27px] w-24 mb-4 md:hidden'>
                          <span className='uc-sb text-xs text-Zoominfo-text-button' onClick={() => { onViewClick(orders?.id) }}>View Order</span>
                        </SfButton>
                      </div>
                      {/* >>>>>>>>>>>>>>>>>>>>>>>>> Order Img+desc <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}
                      <section className='flex gap-4 border-b-2 w-full justify-start md:pl-5 p-5 uc-regular'>
                        {orders?.order_products?.map((product, i) => (
                          <div className='flex flex-row mt-3 md:mb-4 gap-2 items-center' key={i}>
                            {/* {console.log(product, 'product', giftCardDetails)} */}
                            <div className="avatar">
                              <div className="w-16 rounded-full">
                                <img className='object-cover' src={product?.product_variant?.product?.images[0] || orders?.card_details?.amz_details?.products && orders?.card_details?.amz_details?.products[product?.sku]?.images?.small || orders?.card_details?.products[product?.sku]?.images?.small || ''} />
                              </div>
                            </div>
                            <div className='flex flex-col gap-y-1'>
                              <p className='text-sm max-w-[200px] font-semibold md:text-base text-wrap text-MFC-black'>{product?.product_variant?.product.name || orders?.card_details?.amz_details?.products && orders?.card_details?.amz_details?.products[product?.sku]?.name || orders?.card_details?.products[product?.sku]?.name || ''}</p>
                              {product?.product_variant?.product.category && <p className='text-xs font-normal md:text-base text-black'>Type : <span className='text-MFC-black'>{product?.product_variant?.product.category}</span></p>}
                              <p className='text-xs font-normal md:text-base text-black'>Quantity :<span className='text-MFC-black'> {product?.quantity}</span></p>
                            </div>
                          </div>
                        ))}
                        {orders?.order_products.length > 2 &&
                          <div className="avatar flex items-center h-16 w-16 mt-3">
                            <h1 className='text-xl font-semibold bg-extraa-yellow p-2 rounded-full text-black '>{(orders?.order_products.length) - 2}</h1>
                          </div>}
                      </section>
                      {/* View Details Drawer */}
                      <div className='w-full  drawer z-50 '>
                        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                        <div className="drawer-content flex justify-center z-0 ">
                          {/* Page content here */}
                          <label htmlFor="my-drawer" className="btn-sm text-MFC-black font-bold drawer-button my-2 uc-regular" onClick={() => handleViewDetails(orders)}>View Details</label>
                        </div>
                        {/* Drawer Component */}
                        {selectedProduct &&
                          <div className="drawer-side">
                            <label htmlFor="my-drawer" onClick={handleCloseDrawer} aria-label="close sidebar" className="drawer-overlay"></label>
                            <ul className="menu !p-4 w-80 min-h-full bg-MFC-slate-white text-base-content relative   ">
                              {/* Sidebar content here */}
                              {/* {console.log(selectedProduct, 'product')} */}
                              <nav className=''>
                                <h1 className='text-lg font-semibold text-MFC-black'>Product Description</h1>
                                {/* <SfButton  {}><SfIconClose></SfIconClose></SfButton> */}
                              </nav>
                              <header className='mt-8 h-fit w-full flex divide-x divide-[#cccccc] '>
                                <p className='text-black pt-3 w-full text-center !text-xs font-normal px-2 '>
                                  Order ID
                                </p>
                                <p className='text-black pt-3 w-full  text-center !text-xs px-2'>
                                  Transaction ID
                                </p>
                                <p className='text-black pt-3 w-full  text-center !text-xs px-2 '>
                                  Order Placed On
                                </p>
                              </header>
                              {/* Order Information */}
                              {
                                <div className=' h-fit w-full flex divide-x divide-[#cccccc]'>
                                  <p className='text-MFC-black py-3 w-full text-center !text-xs font-normal px-2 '>{selectedProduct?.[0]?.id && selectedProduct?.[0]?.id}</p>
                                  <p className='text-MFC-black py-3 w-full text-center !text-xs font-normal px-2 '>{selectedProduct?.[0]?.order_transactions?.[0]?.id && selectedProduct?.[0]?.order_transactions?.[0]?.id}</p>
                                  <p className='text-MFC-black py-3 w-full text-center !text-xs font-normal px-2 '>{selectedProduct?.[0]?.created_at && dayjs(selectedProduct?.[0]?.created_at).format('D MMM YYYY')}</p>
                                </div>
                              }
                              {/* {console.log(selectedProduct, 'product')} */}
                              {/* product Description */}
                              <div className='max-h-[400px] overflow-y-scroll '>
                                {selectedProduct && selectedProduct?.[0]?.order_products?.map((order, id) => (
                                  <section key={id} className='mt-2 flex gap-4 justify-evenly  pb-3  ' >
                                    {/* Product Avatar */}
                                    {/* {console.log(selectedProduct, 'dd', order)} */}
                                    <div className="avatar">
                                      <div className="w-12 h-12 rounded-full">
                                        <img className='object-cover' src={order?.product_variant?.product?.images[0] || selectedProduct?.[0]?.card_details?.amz_details?.products[order?.sku]?.images?.small || selectedProduct?.[0]?.card_details?.products[order?.sku]?.images?.small || ''} />
                                      </div>
                                    </div>
                                    {/* Product Title */}
                                    <div className='flex flex-col gap-y-1 justify-center'>
                                      {order?.product_variant?.product?.brand && <p className='text-sm max-w-[200px] text-MFC-black font-semibold md:text-sm text-wrap'>{order?.product_variant?.product?.brand}</p>}
                                      <p className='text-xs font-normal md:text-sm text-MFC-black'>{order?.product_variant?.product.name || selectedProduct?.[0]?.card_details?.amz_details?.products[order?.sku]?.name || selectedProduct?.[0]?.card_details?.products[order?.sku]?.name || ''}</p>
                                      <p className='text-xs font-normal md:text-sm text-MFC-black'>{order?.product_variant?.product?.category}</p>
                                    </div>
                                    {/* Quantity */}
                                    <div className='flex items-center'>
                                      <button className='btn-square btn-xs ring-1 ring-[#CCCCCC] text-MFC-black'>{order?.quantity}</button>
                                    </div>
                                    {/* Price */}
                                    <div className='flex items-center'>
                                      <p className='text-MFC-black'>₹{order?.quantity * (parseInt(selectedProduct?.[0]?.card_details?.cards?.length > 0 && selectedProduct?.[0]?.card_details?.cards[0]?.amount || selectedProduct?.[0]?.amz_details?.card_details?.cards[0]?.amount || order?.product_variant?.sale_price || 0))}</p>
                                    </div>
                                  </section>
                                ))}
                              </div>
                              {/* Total Details */}
                              <section className=' h-fit pb-10 pt-7 absolute bottom-0 w-full left-0 px-4  '>
                                <div className='flex flex-col justify- min-h-[100px] text-MFC-black'>
                                  <div className='flex font-normal text-base justify-between border-b-[1px] py-2'>
                                    <p>Sub Total</p>
                                    <p>{orders?.metadata?.subTotal}</p>
                                  </div>
                                  <div className='flex font-normal text-base justify-between border-b-[1px] py-2'>
                                    <p>Taxes</p>
                                    <p>{orders?.tax_amount}</p>
                                  </div>
                                  <div className='flex font-bold text-lg justify-between border-b-[1px] py-2 '>
                                    <p>Grand Total</p>
                                    <p>{orders?.amount}</p>
                                  </div>

                                </div>

                              </section>


                            </ul>
                          </div>}

                      </div>
                    </section>
                  ))}
                </div>
                <div className='px-4'>
                  <PaginationComponent
                    setOffset={setOffset}
                    offset={offset}
                    productCount={ordersCount}
                    limit={limit}
                  />
                </div>
              </article>
            </section>
          )
          :
          <LoginModal openModal={modalOpen} closeModal={modalClose} isModal={isModal} error={true} />
      }

    </>

  )
}

export default YourOrders