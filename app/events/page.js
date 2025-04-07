"use client";
import { SfButton, SfIconChevronLeft, SfIconChevronRight, SfDrawer, SfDropdown, SfIconClose, useDisclosure, useTrapFocus, SfCheckbox, SfSelect, } from '@storefront-ui/react';
import Image from 'next/image';
import like from "../../public/icons/avatar.png";
import shoping from "../../public/icons/shoping.png"
import { useRef, useState, useEffect, use, createRef } from 'react';
import { Transition } from 'react-transition-group';
import classNames from 'classnames';
import { GetAllProduct, GetProductFilters, GetProducts } from '@/queries/GetProducts';
import { useQuery } from '@apollo/client';
// import "rsuite/dist/rsuite.css"
import { mergeArrays } from '../page';
import Loader from '@/components/loader';
import FilterDrawer from '@/components/filter';
import LoginModal from '@/components/LoginModal';
import SortDropDown from '@/components/sort';
import { useRouter } from 'next/navigation';
import NotificationManager from '@/components/NotificationManager';
import { RangeSlider } from 'rsuite';
import shopping from "@/public/icons/shoping.png";
import InnerPageBanner from '@/components/InnerPageBanner';
import { DealCard } from '@/components/DealCard';
import { PaginationComponent } from '@/components/Pagination';
import StaticFilter from '@/components/filter/StaticFilter';
import { UserSignUp } from '@/queries/UserUpdate';
import { EventCard } from '@/components/EventCard';
import noData from "public/assets/noData.png";
export const adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic3VwZXJhZG1pbiIsImlhdCI6MTY5ODgxNTIyMiwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInN1cGVyYWRtaW4iLCJtZXJjaGFudCJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJzdXBlcmFkbWluIiwieC1oYXN1cmEtdXNlci1pZCI6IjEiLCJ4LWhhc3VyYS1tZXJjaGFudC1pZCI6IjEwNjAifX0._tQrdKxPCFszepLVKUjildzyv6hqLTYKuJHIOU3xHjw";

const sortData = [
  { label: 'Date: Old to new', id: 1, select: true },
  { label: 'Date: New to old', id: 2, select: false },
  { label: 'Price: Low to high', id: 3, select: false },
  { label: 'Price: High to low', id: 4, select: false },
  { label: 'Alphabetical: A to Z', id: 5, select: false },
  { label: 'Alphabetical: Z to A', id: 6, select: false },
]

export default function Events() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState(sortData);
  const [firstValue, setFirstValue] = useState(0);
  const [secondValue, setSecondValue] = useState(500);
  const [cate, setCate] = useState('');
  const [check, setCheck] = useState([]);
  const [checkCategory, setCheckCategory] = useState([]);
  const [orderby, setOrderBy] = useState({ "created_at": "asc" });
  const [filter, setFilter] = useState({active: {_eq: true},type:{_eq:2}});
  const [noti, setNoti] = useState(false)
  const [notiType, setNotiType] = useState('')
  // console.log("open", open);
  const placement = 'left';
  const nodeRef = useRef(null);
  const drawerRef = useRef(null);
  const formRef = createRef(null)
  const { isOpen: isModal, open: modalOpen, close: modalClose } = useDisclosure({ initialValue: false });
  useTrapFocus(drawerRef, { activeState: open });
  const { isOpen, toggle, close } = useDisclosure();
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  const [limit, setLimit] = useState(12);
  const [offset, setOffset] = useState(0);

  //  Query Call Method

  const { data, loading } = useQuery(GetProducts, {
    variables: {
      "order_by": orderby,
      "_or": filter,
      "limit":limit,
      "offset":offset*limit,
    
    }, context: { headers: { Authorization: `Bearer ${adminToken}` } }
  });
  // Filter  Data By Category
  const { data: allproducts } = useQuery(GetProductFilters, {   
    variables:{
      "type": {"_eq":2}
    },
    context: { headers: { Authorization: `Bearer ${adminToken}` }
   }
  });
  const products = data?.products
  const productCount=data?.products_aggregate?.aggregate?.count
// console.log(allproducts);
  const [allprod, setAllProd] = useState(products)

  let category = allproducts?.categories?.map((i) => {
    return { label: i?.category, check: false }
  })
  category = category && [...new Set(category)];
  let brand = allproducts?.brands?.map((i) => {
    return { label: i?.brand, check: false }
  })
  brand = brand && [...new Set(brand)]
  const [categoryData,setCategoryData]=useState(category)
  const [brandData, setBrandData] = useState(brand)
  const cartdata = typeof localStorage !== 'undefined' && JSON.parse(localStorage?.getItem('cart'))

  useEffect(() => {
    const finaldata = products?.map((i) => {
      return {
        ...i,
        qty: 0
      }
    })
    setAllProd(finaldata)
    // console.log(finaldata, 'data')
    if (cartdata?.length > 0) {
      const arr = mergeArrays(finaldata, cartdata)
      setAllProd(arr)
    }
    // setBrandData(brand)
  }, [products])

  useEffect(() => {
    setBrandData(brand)
    setCategoryData(category)
    // console.log(brand,'bra')
  }, [allproducts])

  // Slider Range Method

  function handleRange(value) {
    setFirstValue(value[0])
    setSecondValue(value[1])
  } 
  const handleStaticCate= (e) => { //static Filter
    const ind = categoryData?.findIndex(x => x.label === e?.target?.value)
    console.log(categoryData);
    if (e?.target?.checked) {
      setCheckCategory([...checkCategory, e?.target?.value])
      categoryData[ind]['check'] = true
    } else {
      const index = checkCategory?.findIndex(x => x === e?.target?.value)
      checkCategory?.splice(index, 1)
      categoryData[ind]['check'] = false
    }
    setCategoryData([...categoryData])
  }
  const handleBrand = (e) => {
    const ind = brandData?.findIndex(x => x.label === e?.target?.value)
    if (e?.target?.checked) {
      setCheck([...check, e?.target?.value])
      brandData[ind]['check'] = true
    } else {
      const index = check?.findIndex(x => x === e?.target?.value)
      check?.splice(index, 1)
      brandData[ind]['check'] = false
    }
    setBrandData([...brandData])
    //  console.log(brandData,'value', e?.target?.checked);
  }

  const handleCheckboxReset = (e, values) => { //Apply filter
    e?.preventDefault()
    const arr = check?.length > 0 && check?.map((i) => {return { "brand": { "_eq": i },"active": {_eq: true},"type":{_eq:2} } }) || []
    const categoryArr=checkCategory?.length>0&&checkCategory?.map((i) => { return { "category": { "_eq": i },"active": {_eq: true},"type":{_eq:2} }  }) || []
    // if (cate !== "") {
    //   arr.push({"active": {_eq: true},"type":{_eq:1} })
    // }

    setFilter(arr?.length > 0||categoryArr.length>0 ? [...arr,...categoryArr] : {"active": {_eq: true},"type":{_eq:2}})
    setBrandData([...brandData])
    setCategoryData([...categoryData])
    setOpen(false)
    setOffset(0)
  }

  const onClearPress = () => {
    setCate([...category])
    setCheck([])
    setCheckCategory([])
    setOpen(false)
    setBrandData([...brand])
    setFilter({active: {_eq: true},type:{_eq:2}})
    // formRef.current.resetForm()
  }

  const onSortClick = (e, x) => {
    e.preventDefault()
    const data = sort?.map((i) => {
      return { id: i.id, label: i?.label, select: false }
    })
    x["select"] = true
    const index = data.findIndex(y => y.id === x?.id)
    data[index]['select'] = true;
    setSort([...data])
    if (x?.id === 1) {
      setOrderBy({ "created_at": "asc" })
    } else if (x?.id === 2) {
      setOrderBy({ "created_at": "desc" })
    }
    else if (x?.id === 3) {
      setOrderBy({"product_variants_aggregate": {"max": {"sale_price": "asc"}}})
    }
    else if (x?.id === 4) {
      setOrderBy({"product_variants_aggregate": {"max": {"sale_price": "desc"}}})
    }
    else if (x?.id === 5) {
      setOrderBy({ "name": "asc" })
    } else if (x?.id === 6) {
      setOrderBy({ "name": "desc" })
    }
    close()
    // console.log(data, 'pressed')
  }
 const innerBannerImg="https://storage.extraa.in/files/deals_inner_banner.png"
 let startIndex = (offset * limit) + 1;
 let endIndex = ((offset * limit)+limit+1)>productCount?productCount:((offset * limit)+limit+1);
  return (
    <>
      <div className="flex lg:flex-nowrap justify-center items-center w-full min-h-[70vh]">
        <div className='w-full'>          
          {loading ? <Loader /> :
          <>
          <InnerPageBanner img={innerBannerImg}/>
          <p className='text-extraa-purple-btn font-medium text-base md:text-lg md:font-extrabold px-12'>{startIndex} - {endIndex} of {productCount} Event(s)</p>
                      {/* Sort and Mobile filter*/}
           <div className='flex justify-between md:justify-end ml-8 mr-12 mt-4 mb-8'>
             {/* Mobile filter */}
             <div className='flex  gap-2.5 md:hidden'>
          <SfButton className='bg-[#6B21A8] ' onClick={() => setOpen(true)}>Filter</SfButton>          

          <FilterDrawer
            nodeRefer={nodeRef}
            drawerRefer={drawerRef}
            openModel={open}
            toggleOpen={setOpen}
            // rangeHandler={handleRange}
            setFilterpress={handleCheckboxReset}
            handleCate={handleStaticCate}//category Filter
            handleBrandPress={handleBrand} //Brand Filter
            handleClearPress={onClearPress}
            brandData={brandData} //brand Data
            // cateData={categoryData}//category Data
            selectedCate={cate}
            valueFirst={firstValue}
            valueSecond={secondValue}
            toggleFirst={setFirstValue}
            toggleSecond={setSecondValue}
          />

              </div>

            <SortDropDown
            data={sort}
            toggleOpen={toggle}
            onclose={close}
            onSortClick={onSortClick}
            open={isOpen}
          />
          </div>
           
            <section className='flex'>

            <div className=' mt-5 mr-4 mb-2.5 ml-4 max-w-[250px] w-full gap-2.5 hidden md:flex'>
          {/* <SfButton className='bg-[#6B21A8] ' onClick={() => setOpen(true)}>Filter</SfButton>           */}

          <StaticFilter 
          nodeRefer={nodeRef}
          drawerRefer={drawerRef}
          openModel={open}
          toggleOpen={setOpen}
          // rangeHandler={handleRange}
          setFilterpress={handleCheckboxReset}
          handleCate={handleStaticCate} //category filter
          handleBrandPress={handleBrand}//Brand filter
          handleClearPress={onClearPress}
          brandData={brandData}
          // cateData={}
          selectedCate={cate}
          valueFirst={firstValue}
          valueSecond={secondValue}
          toggleFirst={setFirstValue}
          toggleSecond={setSecondValue}
          />

            </div>

      

            <div className=" md:ml-8 flex flex-wrap gap-10 md:justify-start justify-center items-center">
          
              
            {allprod?.length > 0 ?( allprod?.map(({ id, brand,brand_logo,slug, name,metadata, type, category, images, product_variants, qty }) => (
             
             
              <div className='relative' key={id}>
              <EventCard name={name} brandLogo={brand_logo} slug={`/deals/${slug}`} brand={brand} metadata={metadata} imageSrc={images} price={product_variants[0]?.sale_price} />

              </div>
            ))):(
              <>
              <Image src={noData} className="p-10 object-contain max-h-[500px]"></Image>
              <p className='text-center w-full text-xl font-bold '>Oops ! No data found.</p>
              </>
              )}
            
          </div>
            </section>
           
            <PaginationComponent
             setOffset={setOffset}  
             offset={offset} 
             productCount={productCount}
             limit={limit}
            
            />
            </>
          }
        </div>
      </div>
      <LoginModal openModal={modalOpen} closeModal={modalClose} isModal={isModal} />
      {noti &&
        (notiType === 1 ? <NotificationManager message={'Item added to cart'} alertType={1} /> : <NotificationManager message={'Item removed from cart'} alertType={0} />)
      }
    </>
  );
}