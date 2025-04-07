"use client";
import { SfButton, SfDrawerPlacement, SfRadio } from '@storefront-ui/react';
import { GetAllProduct, GetProductFilters, GetProducts, GetProductsBySearch } from '@/queries/GetProducts';

import {
  SfDrawer,
  SfDropdown,
  SfIconFavorite,
  SfIconClose,
  useDisclosure,
  useTrapFocus,
} from '@storefront-ui/react';
import Image from 'next/image';
import like from "../../public/icons/avatar.png";
import shoping from "../../public/icons/shoping.png"

import { useEffect, useRef, useState } from 'react';
import { Transition } from 'react-transition-group';
import classNames from 'classnames';
import ProductCard from '@/components/productCard';
import LoginModal from '@/components/LoginModal';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import NotificationManager from '@/components/NotificationManager';
import Loader from '@/components/loader';
import SortDropDown from '@/components/sort';
import FilterDrawer from '@/components/filter';
import Ticket from '@/components/Tickets';
import { EventCard } from '@/components/EventCard';
import { DealCard } from '@/components/DealCard';
import { PaginationComponent } from '@/components/Pagination';
import GiftCardCard from '@/components/GiftCard';
import GoodiesCard from '@/components/GoodiesCard';
export const adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic3VwZXJhZG1pbiIsImlhdCI6MTY5ODgxNTIyMiwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInN1cGVyYWRtaW4iLCJtZXJjaGFudCJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJzdXBlcmFkbWluIiwieC1oYXN1cmEtdXNlci1pZCI6IjEiLCJ4LWhhc3VyYS1tZXJjaGFudC1pZCI6IjEwNjAifX0._tQrdKxPCFszepLVKUjildzyv6hqLTYKuJHIOU3xHjw"



const options = [
  { label: 'Slide from right', value: 'right' },
];
export const mergeArrays = (arr1, arr2) => { //finalData, cartData
  const mergedArray = arr1.length > 0 && arr1?.map((item1) => {
    const matchingItem = arr2?.find((item2) => item1.id === item2.id);
    if (matchingItem) {
      return { ...item1, qty: matchingItem.qty };
    }
    return item1;
  });

  return mergedArray;
};
const sortData = [
  { label: 'Date: Old to new', id: 1, select: true },
  { label: 'Date: New to old', id: 2, select: false },
  { label: 'Price: Low to high', id: 3, select: false },
  { label: 'Price: High to low', id: 4, select: false },
  { label: 'Alphabetical: A to Z', id: 5, select: false },
  { label: 'Alphabetical: Z to A', id: 6, select: false },
]
export default function SearchResults({ searchInput, notification, toggleNotification }) {
  // console.log(searchInput);
  const [orderby, setOrderBy] = useState({ "created_at": "asc" });
  const [filter, setFilter] = useState({ active: { _eq: true } });
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState('right');
  const nodeRef = useRef(null);
  const drawerRef = useRef(null);

  useTrapFocus(drawerRef, { activeState: open });

  const { isOpen, toggle, close } = useDisclosure();
  const { isOpen: isModal, open: modalOpen, close: modalClose } = useDisclosure({ initialValue: false });
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  const [noti, setNoti] = useState(false)
  // const { data } = useQuery(GetProducts, { context: { headers: { Authorization: `Bearer ${adminToken}` } } });
  // const [allprod, setAllProd] = useState(products)
  const router = useRouter();
  const [notiType, setNotiType] = useState('')
  const cartdata = typeof localStorage !== 'undefined' && JSON.parse(localStorage?.getItem('cart'))
  const [sort, setSort] = useState(sortData);
  const [cate, setCate] = useState('');
  const [firstValue, setFirstValue] = useState(0);
  const [secondValue, setSecondValue] = useState(500);
  const [check, setCheck] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [limit, setLimit] = useState(8);
  const [offset, setOffset] = useState(0);

  //  Query Call Method


  const { data: allproducts } = useQuery(GetProductFilters, {
    context: { headers: { Authorization: `Bearer ${adminToken}` } }
  });

  // console.log("allprod", allprod);


  const { data, loading } = useQuery(GetProductsBySearch, {
    variables: {
      "_ilike": `%${searchInput}%`,
      "order_by": orderby,
      "filters": filter,
      "limit": limit,
      "offset": offset * limit,

    }, context: { headers: { Authorization: `Bearer ${adminToken}` } }
  });
  const products = data?.products;
  const gift_cards = data?.gift_cards;
  // console.log(products, 'products');
  const productCount = data?.products_aggregate?.aggregate?.count
  const giftcardCount = data?.gift_cards_aggregate?.aggregate?.count
  // const [allprod, setAllProd] = useState(products)
  // let category = allproducts?.products?.map((i) => {
  //   return i?.category;
  // })
  // category = category && [...new Set(category)];
  // let brand = allproducts?.products?.map((i) => {
  //   return { label: i?.brand, check: false }
  // })
  // brand = brand && [...new Set(brand)]
  // const [brandData, setBrandData] = useState(brand)


  // const sortFilter = (e) => {
  //   let sortData = [...allprod];
  //   // console.log(sortData);

  // }

  useEffect(() => {
    setOffset(0)
  }, [searchInput])


  // const onSortClick = (e, x) => {
  //   e.preventDefault()
  //   const data = sort?.map((i) => {
  //     return { id: i.id, label: i?.label, select: false }
  //   })
  //   x["select"] = true
  //   const index = data.findIndex(y => y.id === x?.id)
  //   data[index]['select'] = true;
  //   setSort([...data])
  //   if (x?.id === 1) {
  //     setOrderBy({ "created_at": "asc" })
  //     sortFilter("e")
  //   } else if (x?.id === 2) {
  //     setOrderBy({ "created_at": "desc" })
  //     sortFilter("e")
  //   } else if (x?.id === 5) {
  //     setOrderBy({ "name": "asc" })

  //   } else if (x?.id === 6) {
  //     setOrderBy({ "name": "desc" })
  //   }
  //   close()
  //   // console.log(data, 'pressed')
  // }
  // function handleRange(value) {
  //   setFirstValue(value[0])
  //   setSecondValue(value[1])
  // }
  // const handleChange = (e) => {
  //   setCate(e?.target?.value)
  // }

  // const handleBrand = (e) => {
  //   // console.log(e);
  //   const ind = brandData?.findIndex(x => x.label === e?.target?.value)
  //   if (e?.target?.checked) {
  //     //  console.log(e?.target?.value);
  //     setCheck([...check, e?.target?.value])
  //     brandData[ind]['check'] = true
  //     // console.log(brandData);
  //   } else {
  //     const index = check?.findIndex(x => x === e?.target?.value)
  //     check?.splice(index, 1)
  //     brandData[ind]['check'] = false
  //     // console.log(brandData);
  //   }
  //   setBrandData([...brandData])
  //   //  console.log(brandData,'value', e?.target?.checked);
  // }

  // const handleCheckboxReset = (e, values) => {
  //   e?.preventDefault()
  //   // console.log(e);
  //   const arr = check?.length > 0 && check?.map((i) => { return { "brand": { "_eq": i } } }) || []
  //   //console.log(arr);
  //   arr.push({active: {_eq: true}})
  //   if (cate !== "") {
  //     arr.push({ "category": { "_eq": cate } })
  //   }
  //   //  console.log(arr);
  //   setFilter(arr?.length > 0 ? arr : [])
  //   // console.log(filter);
  //   setBrandData([...brandData])
  //   setOpen(false)
  // }
  // const onClearPress = () => {
  //   setCate('')
  //   setCheck([])
  //   setOpen(false)
  //   setBrandData([...brand])
  //   setFilter({active: {_eq: true}})
  //   // setAllProd(products)
  //   // formRef.current.resetForm()
  // }

  return (
    <>
      {loading ? <Loader /> :
        (products?.length == 0 && gift_cards?.length == 0 ? (
          <>
            <div className='mt-7 ml-3 h-96'>
              <h1 className='text-3xl font-bold rota-bold text-center '>No results for {searchInput}!</h1>
            </div>
          </>

        ) : (
          <>
            <div className='mt-7 ml-16'>
              <h1 className='md:text-3xl text-xl font-bold rota-bold'>Search Results for : {searchInput} </h1>
              <h3 className='text-base text-[#929299] rota-sb'>Showing {products?.length + gift_cards?.length
              } of {productCount + giftcardCount} results for {searchInput}</h3>
              {/* <div className='flex mt-5 mr-0 mb-2.5 ml-0 gap-2.5'>
                <SfButton className='bg-[#6B21A8]' onClick={() => setOpen(true)}>Filter</SfButton>
                <SortDropDown
                  data={sort}
                  toggleOpen={toggle}
                  onclose={close}
                  onSortClick={onSortClick}
                  open={isOpen}
                />
              </div> */}
            </div>
            <div className="flex lg:flex-nowrap justify-center items-center w-full">
              <div className='mb-5'>
                {/* <FilterDrawer
                  nodeRefer={nodeRef}
                  drawerRefer={drawerRef}
                  openModel={open}
                  toggleOpen={setOpen}
                  rangeHandler={handleRange}
                  setFilterpress={handleCheckboxReset}
                  handleCate={handleChange}
                  handleBrandPress={handleBrand}
                  handleClearPress={onClearPress}
                  brandData={brandData}
                  cateData={category}
                  selectedCate={cate}
                  valueFirst={firstValue}
                  valueSecond={secondValue}
                  toggleFirst={setFirstValue}
                  toggleSecond={setSecondValue}
                />                 */}
                {/* Render Events*/}
                {products && products.some(product => product.type === 2) && (

                  <section>
                    <h2 className='kalnia text-4xl text-extraa-dark-purple p-4 md:p-10 md:pb-4'>
                      Tickets
                    </h2>
                    <div className="grid gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center items-center">
                      {products && products?.map(product => (product.type === 2 && (
                        <section key={product?.id} className=''>
                          {/* Render Event  Card */}
                          <EventCard name={product.name} metadata={product.metadata} imageSrc={product.images} price={product.product_variants[0]?.sale_price} slug={product.slug} />
                        </section>
                      )
                      ))}
                    </div>
                  </section>)}
                {/* Render Deals */}
                {products && products.some(product => product.type === 1) && (
                  <section >
                    <h2 className='kalnia text-4xl text-extraa-dark-purple p-4 md:p-10 md:pb-4'>
                      Deals
                    </h2>
                    <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center items-center relative">
                      {products && products?.map(product => (product.type === 1 && (
                        <section key={product?.id}>
                          {/* Render Deals  Card */}
                          <DealCard name={product.name} brandLogo={product.brand_logo} slug={`/deals/${product.slug}`} brand={product.brand} metadata={product.metadata} imageSrc={product.images} price={product.product_variants[0]?.sale_price} />
                        </section>
                      )
                      ))}
                    </div>
                  </section>)}
                {/* Render GiftCards */}
                {gift_cards && gift_cards.length > 0 &&
                  <section >
                    <h2 className='kalnia text-4xl text-extraa-dark-purple p-4 md:p-10 md:pb-4'>
                      Gift Cards
                    </h2>
                    <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center items-center relative">
                      {gift_cards && gift_cards.length > 0 && gift_cards?.map((item) => (
                        // gift_cards?.map((product) => {
                        <section key={item?.id}>
                          {/* Render Gift  Card */}
                          <GiftCardCard
                            name={item?.name}
                            slug={`/${item?.slug}`}
                            brandName={item?.brand_name}
                            images={item?.images}
                            minPrice={item?.min_price}
                            maxPrice={item?.max_price}
                            price={item?.price}
                            item={item}
                            notification={notification}
                            toggleNotification={toggleNotification} />
                        </section>))
                        // }  )
                      }
                    </div>
                  </section>}
                {products && products.some(product => product.type === 4) && (
                  <section>
                    <h2 className='kalnia text-4xl text-extraa-dark-purple p-4 md:p-10 md:pb-4'>
                      Goodies
                    </h2>
                    <div className="flex flex-wrap gap-4 justify-center items-center">
                      {products && products?.map(product => (product.type === 4 && (
                        <section key={product?.id} className=''>
                          {/* Render Event  Card */}
                          <GoodiesCard item={product} notification={notification}
                            toggleNotification={toggleNotification} />
                        </section>
                      )
                      ))}
                    </div>
                  </section>)}
                <PaginationComponent
                  setOffset={setOffset}
                  offset={offset}
                  productCount={productCount + giftcardCount}
                  limit={limit}
                />
                <LoginModal openModal={modalOpen} closeModal={modalClose} isModal={isModal} />
                {noti &&
                  (notiType === 1 ? <NotificationManager message={'Item added to cart'} alertType={1} /> : <NotificationManager message={'Item removed from cart'} alertType={0} />)
                }

              </div>
            </div>
          </>
        ))}
    </>
  );
}