"use client";
import { SfButton, SfIconChevronLeft, SfIconChevronRight, SfDrawer, SfDropdown, SfIconClose, useDisclosure, useTrapFocus,  } from '@storefront-ui/react';
import Image from 'next/image';
import like from "../../public/icons/avatar.png";
// import shoping from "../../public/icons/shoping.png"
import { useRef, useState, useEffect, use } from 'react';
import { Transition } from 'react-transition-group';
import classNames from 'classnames';
import { GetProducts } from '@/queries/GetProducts';
import { useQuery } from '@apollo/client';

import shopping from "@/public/icons/shoping.png"
export const adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic3VwZXJhZG1pbiIsImlhdCI6MTY5ODgxNTIyMiwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInN1cGVyYWRtaW4iLCJtZXJjaGFudCJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJzdXBlcmFkbWluIiwieC1oYXN1cmEtdXNlci1pZCI6IjEiLCJ4LWhhc3VyYS1tZXJjaGFudC1pZCI6IjEwNjAifX0._tQrdKxPCFszepLVKUjildzyv6hqLTYKuJHIOU3xHjw"

import { RangeSlider } from 'rsuite';
import "rsuite/dist/rsuite.css"
import { useRouter } from 'next/navigation';
import LoginModal from '@/components/LoginModal';
import NotificationManager from '@/components/NotificationManager';

const mergeArrays = (arr1, arr2) => {
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


export default function CardDefault() {
  const [open, setOpen] = useState(false);
  console.log("open", open);
  const placement='left';
  const nodeRef = useRef(null);
  const drawerRef = useRef(null);

  useTrapFocus(drawerRef, { activeState: open });
  const { isOpen, toggle, close } = useDisclosure();

  //  Query Call Method

  const { data } = useQuery(GetProducts, { context: { headers: { Authorization: `Bearer ${adminToken}` } } });
  const products = data?.products
  
  const [allprod, setAllProd] = useState(products)
  console.log("allprod",allprod);
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
  }, [products])

  // Slider Range Method

  const [firstValue, setFirstValue] = useState(0);
  const [secondValue, setSecondValue] = useState(500);

  function handleRange(value) {
    setFirstValue(value[0])
    setSecondValue(value[1])
  }

  //  CheckBox Clier Filter Method

  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [checkbox3, setCheckbox3] = useState(false);
  const [checkbox4, setCheckbox4] = useState(false);
  const [checkbox5, setCheckbox5] = useState(false);
  const [checkbox6, setCheckbox6] = useState(false);
  const [checkbox7, setCheckbox7] = useState(false);
  const [checkbox8, setCheckbox8] = useState(false);
  const [checkbox9, setCheckbox9] = useState(false);
  
  const [noti, setNoti] = useState(false)
  const [notiType, setNotiType] = useState('')
  const router = useRouter();
  const { isOpen: isModal, open: modalOpen, close: modalClose } = useDisclosure({ initialValue: false });
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

  const handleCheckboxReset = () => {
    setCheckbox1(false);
    setCheckbox2(false)
    setCheckbox3(false)
    setCheckbox4(false)
    setCheckbox5(false)
    setCheckbox6(false)
    setCheckbox7(false)
    setCheckbox8(false)
    setCheckbox9(false)
  }  
  
  const onCartClick = (e, id) => {
    e.stopPropagation()
    setNoti(true)
    setNotiType(1)
    const index = allprod.findIndex(x => x.id === id)
    allprod[index]["qty"] = allprod[index]["qty"] + 1
    setAllProd([...allprod])
    const cartItems = allprod.filter(x => x.qty !== 0)
    localStorage.setItem('cart', JSON.stringify(cartItems))
    setTimeout(() => setNoti(false), 5000)
  }

  const removeFromCart = (e, id) => {
    e.stopPropagation()
    const index = allprod.findIndex(x => x.id === id)
    allprod[index]["qty"] = allprod[index]["qty"] - 1
    if (allprod[index]["qty"] === 0) {
      setNoti(true)
      setNotiType(0)
    }
    setAllProd([...allprod])
    const cartItems = allprod.filter(x => x.qty !== 0)
    localStorage.setItem('cart', JSON.stringify(cartItems))
    setTimeout(() => setNoti(false), 5000)
  }

  const onDealClick = (e, id, totalPrice) => {
    e.stopPropagation()
    localStorage.setItem('totalPrice', JSON.stringify({ amount: totalPrice, item: 1, id: id }))
    //  console.log(id, 'id');
    if (token) {
      router.push(`/checkout`)
    } else {
      modalOpen()
    }
  }

  return (
    <>

    <div className='mt-7 ml-3'>
          <h1 className='text-3xl font-bold'>Products</h1>
          <h3 className='text-base text-[#929299]'>Buy products from our stores</h3>
            <div className='flex mt-5 mr-0 mb-2.5 ml-0 gap-2.5'>
              <SfButton className='bg-[#6B21A8]' onClick={() => setOpen(true)}>Filter</SfButton>
              <SfDropdown trigger={<SfButton className='text-[#000] bg-white' variant='secondary' onClick={toggle}>Sort</SfButton>} open={isOpen} onClose={close} className='z-[999]'>
                  <ul className="p-2 rounded bg-gray-100">
                    <li className='text-black text-sm py-1.5 px-2 font-bold'>Date: Old to new</li>
                    <li className='text-sm py-1.5 px-2'>Date: New to old</li>
                    <li className='text-sm py-1.5 px-2'>Price: Low to high</li>
                    <li className='text-sm py-1.5 px-2'>Price: High to low</li>
                    <li className='text-sm py-1.5 px-2'>Alphabetical: A to Z</li>
                    <li className='text-sm py-1.5 px-2'>Alphabetical: Z to A</li>
                  </ul>
                </SfDropdown>
            </div>
        </div>

    <div className="flex lg:flex-nowrap justify-center items-center w-full">
      <div>
        <Transition ref={nodeRef} in={open} timeout={300}>
        {(state) => (
          <SfDrawer
            ref={drawerRef}
            open
            placement={placement}
            onClose={() => setOpen(false)}
            className={classNames(
              'bg-neutral-50 border border-gray-300 max-w-[300px] duration-500 transition ease-in-out z-[999]',
              {
                'translate-x-0': state === 'entered',
                '-translate-x-full': (state === 'entering' || state === 'exited'),
              },
            )}
          >
            <header className="flex items-center justify-between p-3 bg-white">
              <div className="flex items-center text-black">
                {/* <SfIconFavorite className="mr-2 " /> */}
                 Filters
              </div>
              <SfButton
                square
                variant="tertiary"
                onClick={() => {
                  setOpen(!open);
                }}
                className="text-black"
              >
                <SfIconClose /> 
              </SfButton>
            </header>

            <div className='w-full p-5'>
              <p className='pb-3 text-sm font-medium text-black'>Price range ($)</p>
              <RangeSlider min={0} max={500} defaultValue={[0, 500]} onChange={handleRange} />
              <div class="flex items-center justify-between pt-3 space-x-4 text-sm text-gray-700">
                  <div>
                    <input type="text" maxlength="5" x-model="minprice" class="w-24 px-3 py-2 text-center border border-gray-200 rounded-lg bg-gray-50 focus:border-yellow-400 focus:outline-none" value={firstValue} onChange={(e) => setFirstValue(e.target.value)} />
                  </div>
                  -
                  <div>
                    <input type="text" maxlength="5" x-model="maxprice" class="w-24 px-3 py-2 text-center border border-gray-200 rounded-lg bg-gray-50 focus:border-yellow-400 focus:outline-none" value={secondValue} onChange={(e) => setSecondValue(e.target.value)} />
                  </div>
                </div>
            </div>

            <div className='p-3'>
              <form>
                <label className='text-sm font-semibold'>Categories</label>
                  <select className='w-[275px] border-solid border border-slate-400 rounded-lg bg-white p-2 mt-1.5' >
                  <option value=""></option>
                    <option value="Accessories">Accessories</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Tech">Tech</option>
                  </select>
              </form>
              <div className='flex justify-between mt-4'>
                <p className='text-xs font-medium'>Stores</p>
                <div className='flex gap-5'>
                  <SfIconChevronLeft />
                  <SfIconChevronRight />
                </div>
              </div>
              <form className='overflow-auto max-h-48'>
                <div className='flex items-center'>
                  <input type='checkbox' value="rtest" id="rtest" checked={checkbox1} onChange={() => setCheckbox1(!checkbox1)} />
                  <label htmlFor='rtest' className='cursor-pointer text-sm text-black ml-2 font-medium'>rtest</label>
                </div>
                <div className='flex items-center mt-2'>
                  <input type='checkbox' value="TestStore2" id="testStore" checked={checkbox2} onChange={() => setCheckbox2(!checkbox2)} />
                  <label  htmlFor='testStore' className='cursor-pointer text-sm text-black ml-2 font-medium'>TestStore2</label>
                </div>
                <div className='flex items-center mt-2'>
                  <input type='checkbox' value="Relivator Official" id='relivator-official' checked={checkbox3} onChange={() => setCheckbox3(!checkbox3)} />
                  <label htmlFor='relivator-official' className='cursor-pointer text-sm text-black ml-2 font-medium'>Relivator Official</label>
                </div>
                <div className='flex items-center mt-2'>
                  <input type='checkbox' value="Bleverse Store" id='bleverse-story' checked={checkbox4} onChange={() => setCheckbox4(!checkbox4)} />
                  <label htmlFor='bleverse-story' className='cursor-pointer text-sm text-black ml-2 font-medium'>Bleverse Store</label>
                </div>
                <div className='flex items-center mt-2'>
                  <input type='checkbox' value="Test Store" id='text-store' checked={checkbox5} onChange={() => setCheckbox5(!checkbox5)} />
                  <label htmlFor='text-store' className='text-sm text-black ml-2 font-medium'>Test Store</label>
                </div>
                <div className='flex items-center mt-2'>
                  <input type='checkbox' value="Aldo Books" id='aldo-books' checked={checkbox6} onChange={() => setCheckbox6(!checkbox6)} />
                  <label htmlFor='aldo-books' className='cursor-pointer text-sm text-black ml-2 font-medium'>Aldo Books</label>
                </div>
                <div className='flex items-center mt-2'>
                  <input type='checkbox' value="hol_pre" id='hol-pre' checked={checkbox7} onChange={() => setCheckbox7(!checkbox7)} />
                  <label htmlFor='hol-pre' className='cursor-pointer text-sm text-black ml-2 font-medium'>hol_pre</label>
                </div>
                <div className='flex items-center mt-2'>
                  <input type='checkbox' value="demoddddd" id='demoddddd' checked={checkbox8} onChange={() => setCheckbox8(!checkbox8)} />
                  <label htmlFor='demoddddd' className='cursor-pointer text-sm text-black ml-2 font-medium'>demoddddd</label>
                </div>
                <div className='flex items-center mt-2'>
                  <input type='checkbox' value="sadfasdfas" id='sadfasdfas' checked={checkbox9} onChange={() => setCheckbox9(!checkbox9)} />
                  <label htmlFor='sadfasdfas' className='cursor-pointer text-sm text-black ml-2 font-medium'>sadfasdfas</label>
                </div>
              </form>
              <div>
              <SfButton className='bg-[#6B21A8] w-full text-xs h-8 mt-3.5 mx-0 mb-0' onClick={handleCheckboxReset}>Clear Filter</SfButton>
              </div>
            </div>
          </SfDrawer>
        )}
      </Transition>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-center">
          {/* <h2 className='rota-bold text-4xl  text-[#3635A6] text-center p-4 md:p-10'> OUR TOP DEALS</h2> */}
            {allprod?.length > 0 && allprod?.map(({ id, brand, name, type, category, images, product_variants, qty }) => (
                <div className="flex flex-col mb-12 md:mx-10  sm:mx-6 m-2.5 relative border border-neutral-200 rounded-md hover:shadow-xl p-2.5" key={id}>
                  <div className='flex justify-end items-center absolute top-[25px] right-[20px]'>
                    <Image src={like} alt="like" />
                  </div>
                  <a
                    className=""
                    href={`/deals/${id}`}
                    aria-label={name}
                  >
                    <img src={images} alt={name} className=" p-10 object-contain  rounded-t-md aspect-video min-w-336px min-h-[244px] rounded-lg" />
                  </a>
                  <div className='absolute bottom-[20%] right-[12px]'>
                    {qty > 0 ?
                      <div className='p-2 bg-[#3734a9] w-[60px] flex rounded-full items-center justify-between text-white font-bold cursor-pointer'>
                        <div className='text-2xl'
                          onClick={(e) => { removeFromCart(e, id) }}
                        >
                          -
                        </div>
                        <div className="text-xl">{qty}</div>
                        <div className="text-2xl"
                          onClick={(e) => { onCartClick(e, id) }}
                        >
                          +
                        </div>
                      </div>
                      :
                      <Image src={shopping} alt='shopping' onClick={(e) => onCartClick(e, id)} />
                    }
                  </div>
                  <div className=' border-r-4 absolute top-[25px] left-[10px] w-[114px] h-[34px] flex justify-center items-center bg-slate-200'>
                    <p className='text-xs font-light text-black'>{category}</p>
                  </div>
                  <div className="flex flex-col items-start grow">
                    <p className="font-medium typography-text-base pl-2">{brand}</p>
                    <p className="mt-1 mb-4 font-normal typography-text-base text-neutral-700 pl-2 pr-16 min-h-[48px]">{name}</p>
                    <div className='flex flex-row justify-center items-center w-full p-4'>
                      <SfButton size="sm" variant="tertiary" onClick={(e) => { onDealClick(e, product_variants[0]?.id, product_variants[0]?.sale_price) }} className="relative mt-auto bg-indigo-700 text-white w-[173px] h-[34px] text-base font-semibold">

                        Get deal for ₹{product_variants[0]?.sale_price}
                      </SfButton>
                    </div>
                  </div>
                </div>
            ))}
        </div>  
      </div>
    </div>
    <LoginModal openModal={modalOpen} closeModal={modalClose} isModal={isModal} />
      {noti &&
        (notiType === 1 ? <NotificationManager message={'Item added to cart'} alertType={1} /> : <NotificationManager message={'Item removed from cart'} alertType={0} />)
      }
    </>
  );
}