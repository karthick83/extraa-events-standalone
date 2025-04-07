"use client";

import { GetProducts, GetBrandImages, GetProductsBySearch, goodiesQuery, dealsQuery, ticketsQuery, panIndiaQuery } from '@/queries/GetProducts';
import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import {
  SfLink,
  SfButton,
  useDisclosure,
  SfIconArrowForward,
} from '@storefront-ui/react';
import Image from 'next/image';
import Icoupon from "@/public/icons/coupon.png"
import Igoodies from "@/public/icons/discount.png"
import Itickets from "@/public/icons/tickets.png"
import Igiftcard from "@/public/icons/gift-card.png"

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginModal from '@/components/LoginModal';
import NotificationManager from '@/components/NotificationManager';
import ProductCarousel from '@/components/carousel';
export const userToken = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
export const adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikd1ZXN0IiwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbImd1ZXN0Il0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6Imd1ZXN0In19.dFW-ZzED-qnnoWVb0r9oZIcmn2gSsBxqBp30BuUz1wk"
export const superadmin = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic3VwZXJhZG1pbiIsImlhdCI6MTcwMzkyMDQ4MCwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInN1cGVyYWRtaW4iLCJtZXJjaGFudCJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJzdXBlcmFkbWluIiwieC1oYXN1cmEtdXNlci1pZCI6IjEiLCJ4LWhhc3VyYS1tZXJjaGFudC1pZCI6IjEwNjAifX0.GmEImnsHm9zxXj2TVNsswvSA3HICCQHuYJiMtPCVZRY"
import search from './SearchResults/page';
import SearchResults from './SearchResults/page';
import axios from 'axios';
import Ticket from '@/components/Tickets';
import { EventCard } from '@/components/EventCard';
import { DealCard } from '@/components/DealCard';
import CardsEvent from '@/components/CardsEvent';
import { AltDealCard } from '@/components/AltDealCard';
import { GetGiftCardsList, GetHomePagGiftCards } from '@/queries/GetGiftcards';
import GiftCardCard from '@/components/GiftCard';
import GoodiesCard from '@/components/GoodiesCard';
import RootLayout from './layout';
import Loader from '@/components/loader';
import { showLandingPageSection } from '@/common/whitelable';


export const user_token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

export const mergeArrays = (arr1, arr2) => {
  const mergedArray = arr1?.map((item1) => {
    const matchingItem = arr2?.find((item2) => item1.id === item2.id);
    if (matchingItem) {
      return { ...item1, qty: matchingItem.qty };
    }
    return item1;
  });
  arr2?.forEach((item2) => {
    if (!mergedArray?.find((item) => item.id === item2.id)) {
      mergedArray?.push(item2);
    }
  });
  return mergedArray;
};

export default function Home() {

  const { data } = useQuery(GetProducts, {
    context: { headers: { Authorization: `Bearer ${adminToken}` } },
    variables: {
      "_or": [{ "active": { "_eq": true } }]
    }
  });
  const products = data?.products

  const { data: goodies } = useQuery(goodiesQuery, {
    context: { headers: { Authorization: `Bearer ${adminToken}` } },
  });

  const { data: deals } = useQuery(dealsQuery, {
    context: { headers: { Authorization: `Bearer ${adminToken}` }, },

  });

  // const { data: panDeals } = useQuery(panIndiaQuery, {
  //   context: { headers: { Authorization: `Bearer ${adminToken}` } },
  // });

  const { data: tickets } = useQuery(ticketsQuery, {
    context: { headers: { Authorization: `Bearer ${adminToken}` } },
  });

  const { data: brdata } = useQuery(GetBrandImages, { context: { headers: { Authorization: `Bearer ${adminToken}` } } });
  const brandImgs = brdata?.coupons;

  // const [allDeals, setAllDeals] = useState(products)
  // const [allTickets, setAllTickets] = useState(products)
  // const [allGoodies, setAllGoodies] = useState(goodies)
  // const [giftProd, setGiftProd] = useState()
  const [noti, setNoti] = useState(false)
  const [notiType, setNotiType] = useState('')
  const router = useRouter();
  const cartdata = typeof localStorage !== 'undefined' && JSON.parse(localStorage?.getItem('cart'))
  const { isOpen: isModal, open: modalOpen, close: modalClose } = useDisclosure({ initialValue: false });
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  const [notifications, setNotification] = useState([])
  //----------------------- Fetch gift cards ------------------
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get('https://gapi.extraa.in/get-product-list/');
  //       setGiftProd(response.data);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const { data: giftData, loading } = useQuery(GetHomePagGiftCards, {
    context: { headers: { Authorization: `Bearer ${adminToken}` } },
    variables: {
      "where": { "extraa_images": { "_is_null": false }, active: { _eq: true } }
    }
  });

  const giftCards = giftData?.gift_cards;



  // useEffect(() => {
  //   const OnlyDeals = deals?.products
  //   const OnlyTickets = tickets?.products
  //   const OnlyGoodies = goodies?.products
  //   // console?.log(goodies?.products, 'data')
  //   const finaldata = OnlyDeals?.map((i) => {

  //     return {
  //       ...i,
  //       qty: 0

  //     }

  //   })
  //   setAllDeals(finaldata);
  //   // console.log(OnlyTickets,'data');
  //   setAllTickets(OnlyTickets);
  //   // console.log(finaldata, 'data')
  //   setAllGoodies(OnlyGoodies)
  //   if (cartdata?.length > 0) {
  //     const arr = mergeArrays(finaldata, cartdata)
  //     setAllDeals(arr)
  //   }
  // }, [products])





  // SearchData

  const searchParams = useSearchParams()
  const searchInput = searchParams.get('search')
  // const searchData = useQuery(GetProductsBySearch, { variables: { _ilike: `%${searchInput}%` }, context: { headers: { Authorization: `Bearer ${adminToken}` } } })


  // let res = ""
  // if (searchData && searchData?.data?.products.length > 0) {
  //   res = searchData?.data?.products?.filter((x) => { return x?.active })
  // }

  return (
    loading ? <div className='h-[90vh] flex justify-center items-center'> <Loader />
    </div>
      :
      <>
        <div className="fixed w-full top-10 z-10">
          {notifications?.length > 0 &&
            notifications.map((n, index) =>
              n < 0 ? <NotificationManager key={index} message={"Sorry, You can't add more than 10 products in an order"} alertType={2} offset={1} /> : <NotificationManager key={index} message={`${n} added to cart`} alertType={1} offset={5} />
            )
          }
        </div>
        {/* --------------- HERO BANNER ----------------------- */}
        {searchInput ? (<SearchResults
          notification={notifications}
          toggleNotification={setNotification}
          searchInput={searchInput} />) : (
          <>
            <div className='mx-4 md:block hidden' >
              <swiper-container navigation="true" pagination="true" autoplay="true" >
                <swiper-slide>
                  <div className="px-8 pb-6">
                    <a href='/deals/Adidas-apparel-40'>
                      <img src='https://storage.extraa.in/files/Homeslide-1.jpeg' alt='home banner' className='w-full rounded-lg object-cover' />
                    </a>
                  </div>
                </swiper-slide>
                <swiper-slide>
                  <div className="px-8 pb-6">
                    <a href='/deals/boat-electronics-500'>
                      <img src='https://storage.extraa.in/files/Homeslide-2.jpeg' alt='home banner' className='w-full rounded-lg object-cover' />
                    </a>
                  </div>
                </swiper-slide>

              </swiper-container>
            </div>

            <div className='my-4 md:hidden block' >
              <swiper-container pagination="true" autoplay="true" >
                <swiper-slide>
                  <div className="px-8 pb-6">
                    <a href='/deals/Adidas-apparel-40'>
                      <img src='https://storage.extraa.in/files/homemob-1.jpg' alt='home banner' className='w-full rounded-lg object-cover' />
                    </a>
                  </div>
                </swiper-slide>
                <swiper-slide>
                  <div className="px-8 pb-6">
                    <a href='/deals/boat-electronics-500'>
                      <img src='https://storage.extraa.in/files/homemob-2.jpg' alt='home banner' className='w-full rounded-lg object-cover' />
                    </a>
                  </div>
                </swiper-slide>

              </swiper-container>
            </div>




            {/* ------------ PRODUCTS CAROUSEL  --------------- */}
            {/* ==================================== DEALS =============================== */}
          { showLandingPageSection?.deals&& <div className=''>
              <div className='flex items-end gap-0'>
                <h2 className='kalnia text-4xl text-extraa-dark-purple  p-4 md:p-10 md:pb-4'>Featured Deals</h2>
                <SfButton onClick={() => router.push('/deals')} slotSuffix={<SfIconArrowForward />} className=' underline mb-3 uc-sb  ml-[-24px]' variant='tertiary'>View All</SfButton>
              </div>
              <div className='mx-8'>
                <swiper-container navigation="true" grab-cursor="true" pagination="true"
                  slides-per-view="1" breakpoints='{ "1200": {"slidesPerView": 4}, "1024": {"slidesPerView": 3}, "768" : {"slidesPerView": 2}}'
                >

                  {deals?.products?.map(({ id, name, brand, metadata, category, brand_logo, slug, images, product_variants, }) =>

                    // Deals CARD ------------------------
                    <swiper-slide style={{ padding: 8, paddingBottom: "24px" }} key={id} >
                      <DealCard name={name} brandLogo={brand_logo} slug={`/deals/${slug}`} brand={brand} metadata={metadata} imageSrc={images} price={product_variants[0]?.sale_price} />
                    </swiper-slide>
                    // -----------------------------------
                  )}
                </swiper-container>
              </div>
            </div>}


            {/*giftCard Products */}
           {showLandingPageSection?.giftcards&& <div>
              <div className='flex items-end gap-0'>
                <h2 className='kalnia text-4xl text-extraa-dark-purple p-4 md:p-10 md:pb-4'>Gift Cards</h2>
                <SfButton onClick={() => router.push('/giftcard')} slotSuffix={<SfIconArrowForward />} className=' underline mb-3 uc-sb  ml-[-24px]' variant='tertiary'  >View All</SfButton>
              </div>
              <div className='px-8'>
                <swiper-container navigation="true" grab-cursor="true" pagination="true"
                  slides-per-view="1" breakpoints='{"1200": {"slidesPerView": 4}, "1024": {"slidesPerView": 3}, "768" : {"slidesPerView": 2}}'
                // slides-per-view="auto"
                >
                  {giftCards && Array.isArray(giftCards) && giftCards?.map((item) =>
                    <swiper-slide key={item?.sku}  >
                      <div className='mb-8'>
                        <GiftCardCard sku={item?.sku}
                          name={item?.name}
                          slug={`/${item?.slug}`}
                          brandName={item?.brand_name}
                          images={item?.images}
                          minPrice={item?.min_price}
                          maxPrice={item?.max_price}
                          price={item?.price}
                          item={item}
                          notification={notifications}
                          toggleNotification={setNotification}
                        />
                      </div>
                    </swiper-slide>

                  )}
                </swiper-container>
              </div>
            </div>}

            {/* goodies list */}
           {showLandingPageSection?.goodies&& <div>
              <div className='flex items-end gap-0'>
                <h2 className='kalnia text-4xl text-extraa-dark-purple p-4 md:p-10 md:pb-4'>Goodies</h2>
                <SfButton onClick={() => router.push('/goodies')} slotSuffix={<SfIconArrowForward />} className=' underline mb-3 uc-sb  ml-[-24px]' variant='tertiary'  >View All</SfButton>
              </div>
              <div className='px-8'>
                <swiper-container navigation="true" grab-cursor="true" pagination="true"
                  slides-per-view="1" breakpoints='{"1200": {"slidesPerView": 4}, "1024": {"slidesPerView": 3}, "768" : {"slidesPerView": 2}}'
                // slides-per-view="auto"
                >
                  {goodies?.products && Array.isArray(goodies?.products) && goodies?.products?.map((item) =>
                    <swiper-slide key={item?.sku}  >
                      <div className='mb-8'>
                        <GoodiesCard item={item} notification={notifications}
                          toggleNotification={setNotification} />
                      </div>
                    </swiper-slide>

                  )}
                </swiper-container>
              </div>
            </div>}

            {/* <div className=''>
              <h2 className='kalnia text-4xl text-extraa-dark-purple  p-4 md:p-10 md:pb-4'>Pan India Deals</h2>
              <div className='mx-8'>
                <swiper-container navigation="true" grab-cursor="true" pagination="true"
                  slides-per-view="1" breakpoints='{ "1200": {"slidesPerView": 4}, "1024": {"slidesPerView": 3}, "768" : {"slidesPerView": 2}}'
                >

                  {panDeals?.products?.map(({ id, name, brand, metadata, category, brand_logo, slug, images, product_variants, }) =>

                    // Deals CARD ------------------------
                    <swiper-slide style={{ padding: 8, paddingBottom: "24px" }} key={id} >
                      <AltDealCard name={name} brandLogo={brand_logo} slug={`/deals/${slug}`} brand={brand} metadata={metadata} imageSrc={images} price={product_variants[0]?.sale_price} />
                    </swiper-slide>
                    // -----------------------------------
                  )}
                </swiper-container>
              </div>
            </div> */}

            {/*===================== EVENTS======================= */}
          {/* { showLandingPageSection?.events&& <div className=''>
              {tickets?.products?.length > 0 && <h2 className='kalnia text-4xl  text-extraa-dark-purple  p-4 md:p-10 md:pb-4'> Tickets</h2>}
              <div className='mx-8'>
                <swiper-container navigation="true" grab-cursor="true" pagination="true"
                  slides-per-view="1" breakpoints='{"1024": {"slidesPerView": 3}, "768" : {"slidesPerView": 2}}'
                // slides-per-view="auto"
                >

                  {tickets?.products?.map(({ id, metadata, name, type, category, slug, images, product_variants, }) =>


                    <swiper-slide style={{ padding: 8, display: "flex", flexDirection: "column", alignItems: "center" }} key={id} >
                      <EventCard name={name} metadata={metadata} imageSrc={images} price={product_variants[0]?.sale_price} slug={slug} />
                    </swiper-slide>
                    // -----------------------------------
                  )}
                </swiper-container>
              </div>

            </div>} */}

          <CardsEvent />

            {/* ------------ BRAND CAROUSEL2  --------------- */}

            {showLandingPageSection?.brandSwipper && <div className='mt-8 bg-[url("https://storage.extraa.in/files/brands_bg.png")] bg-no-repeat bg-cover pb-4'>
              <h2 className='kalnia text-4xl  text-extraa-dark-purple  p-4 md:p-10'>Our Favourite Brands</h2>
              <swiper-container autoplay="true" speed="500" navigation="true" grab-cursor="true" pagination="true" slides-per-view="1" breakpoints='{"1024": {"slidesPerView": 6}, "768" : {"slidesPerView": 2}}'
              >
                {brandImgs?.length > 0 && brandImgs?.map(({ id, brand_logo, brand_name }) => (
                  <swiper-slide key={id}>
                    <div className=' flex justify-center items-center w-full'>
                      <div className=' bg-white shadow-md transition-shadow  rounded-full hover:shadow-xl flex justify-center items-center  p-10 h-48 w-48 mb-12 '>
                        <img src={brand_logo} alt={brand_name} />
                      </div>
                    </div>

                  </swiper-slide>

                ))}
              </swiper-container>
              
            </div>}

            {/* ------------ PRODUCTS CAROUSEL3  --------------- */}

            {/* <div className=''>
        <h2 className='rota-bold text-2xl p-4 md:p-10'> TICKETS</h2>
      </div> */}
            <LoginModal openModal={modalOpen} closeModal={modalClose} isModal={isModal} />
            {noti &&
              (notiType === 1 ? <NotificationManager message={'Item added to cart'} alertType={1} /> : <NotificationManager message={'Item removed from cart'} alertType={0} />)
            }
          </>)



        }</>)
}

