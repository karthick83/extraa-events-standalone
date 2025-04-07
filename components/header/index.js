"use client";
import {
  SfIconShoppingCart,
  SfIconFavorite,
  SfIconPerson,
  SfIconClose,
  SfButton,
  SfDrawer,
  SfIconMenu,
  useTrapFocus,
  useDisclosure,
  SfDropdown,
  SfIconLogout,
  SfBadge,
} from '@storefront-ui/react';
import { useCart, WithSSR } from "@/components/Cart/cart";

import { Fragment, useClient, useRef, useState, useMemo, createRef, RefObject } from 'react';
import LoginModal from '../LoginModal';
import { useRouter } from 'next/navigation';
import SearchBar from '../SearchBar';
import NotificationManager from '../NotificationManager';
import { useQuery } from '@apollo/client';
import GetAllCoins from '@/queries/GetCoins';
import { usePathname } from "next/navigation";
import { showLandingPageSection, whiteLableBrandData } from '@/common/whitelable';

//import { useRouter } from 'next/router';




const findNode = (keys, node) => {
  if (keys.length > 1) {
    const [currentKey, ...restKeys] = keys;
    return findNode(restKeys, node.children?.find((child) => child.key === currentKey) || node);
  }
  return node.children?.find((child) => child.key === keys[0]) || node;
};

export default function Header() {

  const cart = WithSSR(useCart, (state) => state);
  // {
  //   icon: <SfIconPerson />,
  //     label: 'Log in',
  //       ariaLabel: 'Log in',
  //         role: 'login',
  //   },

  // useClient();
  const drawerRef = useRef(null);
  const megaMenuRef = useRef(null);
  const [activeNode, setActiveNode] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();
  // const [loginModal, setLoginModal] = useState(false);
  const { isOpen: isModal, open: modalOpen, close: modalClose } = useDisclosure({ initialValue: false });
  const { isOpen: isDropDown, toggle, close: dropDownClose } = useDisclosure();

  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  // let coin_balance = 0;
  // if (token) {
  const { data: coins } = useQuery(GetAllCoins, { context: { headers: { Authorization: `Bearer ${token}` } } })
  const gold_balance = coins?.coins?.length > 0 && coins?.coins?.filter(x => x.id === 10)
  const silver_balance = coins?.coins?.length > 0 && coins?.coins?.filter(x => x.id === 5)
  const blue_balance = coins?.coins?.length > 0 && coins?.coins?.filter(x => x.id === 6)
  // console.log(coins, 'coins', gold_balance, silver_balance, blue_balance);
  // }
  const [isLoggedIn, setIsLoggedIn] = useState(token ? true : false);

  const actionItems = [
    // {
    //   icon: <img src="https://storage.extraa.in/files/coin-svgrepo-com.svg" alt="My Happy SVG" />,
    //   label: '',
    //   ariaLabel: 'Wishlist',
    //   role: 'wish',
    // },
    {
      icon: <SfIconShoppingCart size='lg' />,
      label: '',
      ariaLabel: 'Cart',
      role: 'button',
      counter: cart?.cartItems?.length
    }

  ];
  // const refsByKey = useMemo(() => {
  //   const buttonRefs = {};
  //   content.children?.forEach((item) => {
  //     buttonRefs[item.key] = createRef();
  //   });
  //   return buttonRefs;
  // }, [content.children]);

  const { close, open, isOpen } = useDisclosure();
  // const { refs, style } = useDropdown({
  //   isOpen,
  //   onClose: (event) => {
  //     if (event.key === 'Escape') {
  //       refsByKey[activeNode[0]]?.current?.focus();
  //     }
  //     close();
  //   },
  //   placement: 'bottom-start',
  //   middleware: [],
  //   onCloseDeps: [activeNode],
  // });

  const trapFocusOptions = {
    activeState: isOpen,
    arrowKeysUpDown: true,
    initialFocus: 'container',
  };
  useTrapFocus(megaMenuRef, trapFocusOptions);
  useTrapFocus(drawerRef, trapFocusOptions);

  // const activeMenu = findNode(activeNode, content);
  // const bannerNode = findNode(activeNode.slice(0, 1), content);

  const handleOpenMenu = (menuType) => () => {
    setActiveNode(menuType);
    open();
  };

  const handleBack = () => {
    setActiveNode((menu) => menu.slice(0, menu.length - 1));
  };

  const handleNext = (key) => () => {
    setActiveNode((menu) => [...menu, key]);
  };

  const handleBlurWithin = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      close();
    }
  };

  const search = (event) => {
    event.preventDefault();
    alert(`Successfully found 10 results for ${inputValue}`);
  };

  const onLoginClick = (actionItem) => {
    // console.log('login', actionItem)
    if (actionItem.role === 'login') {
      modalOpen()
    } else if (actionItem.role === 'account') {
      toggle()
      isDropDown()
    } else if (actionItem.role === 'coins') {
    }
    else {
      router.push('/cart')
    }
  }

  const onLogoutClick = (e) => {
    e.preventDefault()
    //localStorage.clear();
    localStorage?.removeItem("token");
    localStorage?.removeItem("user_id");
    // console.log('hello')
    setIsLoggedIn(false);
    dropDownClose()
    if (typeof window !== "undefined") {
      window.location.reload()
    }

  }

  const onAccountClick = (e) => {
    e.preventDefault()
    dropDownClose()
    router.push('/my-profile')
  }
  const onMyOrderClick = (e) => {
    e.preventDefault()
    dropDownClose()
    router.push('/yourOrders')
  }
  const onMyCoupons = (e) => {
    e.preventDefault()
    dropDownClose()
    router.push('/my-coupons')
  }
  const pathname = usePathname();
  // console.log(pathname);

  return (
    <>
      {!pathname.includes('/delite') &&
        <div className="w-full h-full">
          <header className="relative uc-sb" >
            <div className="flex flex-wrap md:flex-nowrap justify-between items-center px-4 md:px-10 py-2 md:py-5 w-full border-0 bg-primary-700 border-neutral-200 h-full md:z-10">
              <div className="flex items-center">
                {/* Mobile menu button */}
                <SfButton
                  onClick={handleOpenMenu([])}
                  variant="tertiary"
                  square
                  aria-label="Close menu"
                  className="block md:hidden bg-transparent active:bg-primary-900"
                >
                  <SfIconMenu className="" />
                </SfButton>

                <a
                  href="/"
                  aria-label="SF Homepage"
                  className="flex  items-center  focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm"

                >
                  <picture>
                    {/* <source srcSet="https://storage.extraa.in/files/logo512.png" media="(min-width: 1024px)" /> */}
                    <img className=' object-contain sm:min-w-[60px] h-[50px] md:h-[60px]' src={whiteLableBrandData?.logo} alt="Logo" />
                  </picture>
                </a>
              </div>
              <div className='flex justify-end items-center'>
                <SearchBar className={"hidden md:flex w-[360px] lg:w-[500px] mr-4"} />
                {/* Icons buttons */}
                {/* <nav className="flex flex-nowrap justify-end items-center md:ml-4 gap-x-2"> */}
                {/*<div className=' bg-extraa-blue py-2 px-4 gap-3 mr-3 rounded-md items-center hidden sm:flex'>
                  
                  {showLandingPageSection?.deals&&(
                    <><div className='flex h-4 text-MFC-blackuc-sb mb-2 gap-2' >
                    <img src="https://storage.extraa.in/files/silver-coins-new2.png" className="h-6" alt="extraa silver" />
                    <p>{silver_balance?.length > 0 && silver_balance[0]?.wallets[0]?.balance > 0 && silver_balance[0]?.wallets[0]?.balance || 0}</p>
                  </div>
                  <div className="text-xl text-btn-text">|</div></>)}

                 {showLandingPageSection?.giftcards&&<> <div className='flex h-4 text-MFC-slate-white mb-2 gap-2' >
                    <img src="https://storage.extraa.in/files/gold-coin.png" className="h-6" alt="extraa gold" />
                    <p>{gold_balance?.length > 0 && gold_balance[0]?.wallets[0]?.balance > 0 && gold_balance[0]?.wallets[0]?.balance || 0}</p>
                  </div>

                  <div className="text-xl text-btn-text">|</div></>}
                  {showLandingPageSection?.goodies&&<>
                  <div className='flex h-4 text-MFC-blackuc-sb mb-2 gap-2' >
                    <img src="https://storage.extraa.in/files/blue-coins-new.png" className="h-6" alt="extraa blue coins" />
                    <p>{blue_balance?.length > 0 && blue_balance[0]?.wallets[0]?.balance > 0 && blue_balance[0]?.wallets[0]?.balance || 0}</p>
                  </div></>}
                </div>*/}
                <div className='flex flex-nowrap gap-2'>
                  {actionItems.map((actionItem) => (
                    token && actionItem.role === 'login'
                      ?
                      <SfDropdown className='z-50' key={actionItem.ariaLabel} trigger={<SfButton
                        className=" bg-transparent hover:bg-primary-800 hover: active:bg-primary-900 "
                        key={actionItem.ariaLabel}
                        aria-label={actionItem.ariaLabel}
                        variant="tertiary"
                        slotPrefix={actionItem.icon}
                        square
                        onClick={() => onLoginClick(actionItem)}
                      >
                        {actionItem.role === 'login' && !token && (
                          <p className="hidden lg:inline-flex whitespace-nowrap mr-2">{actionItem.label}</p>
                        )}
                      </SfButton>} open={isDropDown} onClose={dropDownClose}>
                        <ul className="p-2 rounded-lg bg-gray-100 w-[150px] cursor-pointer rota-sb">
                          {/* Accounts */}
                          <li>
                            <div className='py-2 px-4 items-center' onClick={onAccountClick}>
                              <h3 className="text-sm font-medium text-gray-900">Account</h3>
                            </div>
                            <div className="border-[1px] border-slate-300 mt-2"></div>
                          </li>
                          {/* My orders */}
                          <li>
                            <div className='py-2 px-4 items-center' onClick={onMyOrderClick}>
                              <h3 className="text-sm font-medium text-gray-900">My Orders</h3>
                            </div>
                            <div className="border-[1px] border-slate-300 mt-2"></div>
                          </li>
                          {/* My Coupons */}
                          {/* <li>
                            <div className='py-2 px-4 items-center' onClick={onMyCoupons}>
                              <h3 className="text-sm font-medium text-gray-900">My Coupons</h3>
                            </div>
                            <div className="border-[1px] border-slate-300 mt-2"></div>
                          </li> */}
                          {/* Wishlist */}
                          {/* <li>
                      <div className='py-2 px-4 flex flex-row justify-between items-center' >
                        <h3 className="text-sm font-medium text-gray-900 mt-1">Wishlist</h3>
                        <SfIconFavorite size='sm' />
                      </div>
                      <div className="border-[1px] border-slate-300 mt-2"></div>
                    </li> */}
                          {/* logout */}
                          <li>
                            <div className='py-2 px-4 flex flex-row justify-between items-center' onClick={onLogoutClick}>
                              <h3 className="text-sm font-medium text-gray-900 mt-1">Logout</h3>
                              <SfIconLogout size='sm' onClick={onLogoutClick} />
                            </div>
                          </li>
                        </ul>
                      </SfDropdown>
                      :

                      <SfButton
                        className={`${actionItem.role !== 'coins' && " w-10 bg-extraa-blue" || "w-20 ml-2 p-1 text-sm bg-MFC-slate-white"} text-MFC-slate-white p-2 hover:bg-primary-800 relative active:bg-primary-900 `}
                        key={actionItem.ariaLabel}
                        aria-label={actionItem.ariaLabel}
                        variant="tertiary"
                        slotPrefix={actionItem.icon}
                        // slotSuffix={}
                        square
                        onClick={() => onLoginClick(actionItem)}
                      >
                        {actionItem.role === 'login' && !token && (
                          <p className="hidden lg:inline-flex whitespace-nowrap mr-2">{actionItem.label}</p>
                        )}
                        {actionItem.role === 'coins' && token && (
                          <p className="w-16 inline-flex whitespace-nowrap mr-2">{actionItem.label}</p>
                        )}
                        {actionItem?.counter > 0 &&
                          <SfBadge content={actionItem?.counter} className="!text-extraa-blue rota-bold bg-white " />
                        }
                      </SfButton>
                  ))}

                  {/*  -------------------- New Login and Account btn */}
                  {isLoggedIn ?
                    <>
                      <SfButton
                        className=" bg- text-MFC-slate-white !bg-extraa-purple-btn hover:bg-primary-800 hover: active:bg-primary-900 "
                        aria-label={'Account'}
                        variant="tertiary"
                        slotPrefix={<SfIconPerson />}
                        square
                        onClick={() => onLoginClick({ 'role': 'account' })}
                      />
                      <SfDropdown className='z-50'
                        open={isDropDown} onClose={dropDownClose}>

                        <ul className="p-2 z-10 rounded-lg bg-gray-100 w-[200px] cursor-pointer uc-sb mr-6">
                          {/* Accounts */}
                          <li>
                            <div className='py-2 px-4 items-center' onClick={onAccountClick}>
                              <h3 className="text-sm font-medium text-gray-900">Account Details</h3>
                            </div>
                            <div className="border-[1px] border-slate-300 mt-2"></div>
                          </li>
                          {/* My orders */}
                          <li>
                            <div className='py-2 px-4 items-center' onClick={onMyOrderClick}>
                              <h3 className="text-sm font-medium text-gray-900">My Orders</h3>
                            </div>
                            <div className="border-[1px] border-slate-300 mt-2"></div>
                          </li>
                          {/* My Coupons */}
                          {/* <li>
                            <div className='py-2 px-4 items-center' onClick={onMyCoupons}>
                              <h3 className="text-sm font-medium text-gray-900">My Coupons</h3>
                            </div>
                            <div className="border-[1px] border-slate-300 mt-2"></div>
                          </li>
                          {/* Coin Wallet 
                          <li>
                            <div className='py-2 px-4 flex flex-row justify-between items-center' >
                              <h3 className="text-sm font-medium text-gray-900 mt-1">Coin Wallet</h3>
                            </div>
                            <div className="border-[1px] border-slate-300 mt-2"></div>
                          </li> */}
                          {/* logout */}
                          <li>
                            <div className='py-2 px-4 flex flex-row justify-between items-center' onClick={onLogoutClick}>
                              <h3 className="text-sm font-medium text-gray-900 mt-1">Logout</h3>
                              <SfIconLogout size='sm' onClick={onLogoutClick} />
                            </div>
                          </li>
                        </ul>
                      </SfDropdown>
                    </>
                    :
                    <SfButton
                      className=" bg-extraa-purple-btn text-Zoominfo-text-button "
                      aria-label={'login'}
                      variant="tertiary"
                      onClick={() => onLoginClick({ role: 'login' })}
                    >
                      Login
                    </SfButton>
                  }
                </div>
                {/* </nav> */}
              </div>

              {/* Mobile Search Bar */}
              <SearchBar className={"flex md:hidden flex-[100%] mt-4 mx-4 "} />
            </div>
            <div className='mx-8'>
              <div className='hidden md:flex p-5 justify-start gap-8 mt-2 mb-4 rounded-xl px-8 border-2 border-MFC-black text-MFC-black text-sm'>
                <div className='flex gap-8 '>
                  {showLandingPageSection?.deals&&<a href='/deals'>Deals</a>}
                  {showLandingPageSection?.giftcards&&<a href='/giftcard'>GiftCards</a>}
                  {showLandingPageSection?.goodies&&<a href='/goodies'>Goodies</a>}
                  {showLandingPageSection?.events&&<a href='/tickets'>Tickets</a>}
                  {/* <a href='#'>Brands</a> */}
                </div>
                <div>
                  <a target='_blank' href={whiteLableBrandData?.about_us}>About</a>
                </div>
              </div>
            </div>
            <div className='flex justify-center items-center'>
              {/* <NotificationManager message={"site is still in development"} alertType={2} /> */}
            </div>
            <div className='flex justify-center items-center'>
              {/* <NotificationManager message={"site is still in development"} alertType={2} /> */}
            </div>

            {/* Mobile drawer */}
            {isOpen && (
              <>
                <div className="md:hidden fixed inset-0 bg-neutral-500 bg-opacity-50" />
                <SfDrawer
                  ref={drawerRef}
                  open={isOpen}
                  onClose={close}
                  placement="left"
                  className="md:hidden right-[50px] max-w-[376px] bg-white overflow-y-auto"
                  id='mob-drawer'
                >
                  <nav>
                    <div className="flex items-center justify-between p-4 border-b border-b-neutral-200 border-b-solid">
                      {/* <p className="typography-text-base font-medium">Browse products</p> */}

                      <SfButton onClick={close} variant="tertiary" square aria-label="Close menu" className="ml-2">
                        <SfIconClose className="text-neutral-500" />
                      </SfButton>
                    </div>
                    <div className=' bg-extraa-dark-purple py-2 px-4 gap-3 mx-3 rounded-md items-center mt-6 flex'>
                      {/* <div className='flex h-4 text-white uc-sb mb-2 gap-2' >
                        <img src="https://storage.extraa.in/files/silver-coins-new2.png" className="h-6" alt="extraa silver" />
                        <p>{silver_balance?.length > 0 && silver_balance[0]?.wallets[0]?.balance || 0}</p>
                      </div>
                      <div className="text-xl text-white">|</div> */}

                      <div className='flex h-4 text-MFC-White uc-sb mb-2 gap-2' >
                        <img src="https://storage.extraa.in/files/gold-coin.png" className="h-6" alt="extraa gold" />
                        <p className="text-white">{gold_balance?.length > 0 && gold_balance[0]?.wallets[0]?.balance > 0 && gold_balance[0]?.wallets[0]?.balance || 0}</p>
                        </div>

                      {/* <div className="text-xl text-white">|</div>
                      <div className='flex h-4 text-white uc-sb mb-2 gap-2' >
                        <img src="https://storage.extraa.in/files/blue-coins-new.png" className="h-6" alt="extraa blue coins" />
                        <p>{blue_balance?.length > 0 && blue_balance[0]?.wallets[0]?.balance || 0}</p>
                      </div> */}
                    </div>

                    <div className='flex flex-col mx-4 mt-8 gap-2 ' >
                      {/* <a href='/deals'><div className='bg-slate-200 p-4 rounded-md'>Deals</div></a>
                      <a href='/giftcard'><div className='bg-slate-200 p-4 rounded-md'>GiftCards</div></a> */}
                      {/* <a href='/goodies'><div className='bg-slate-200 p-4 rounded-md'>Goodies</div></a> */}
                      {/* <a href='/tickets'><div className='bg-slate-200 p-4 rounded-md'>Tickets</div></a> */}
                    </div>

                  </nav>
                </SfDrawer>
              </>
            )}
          </header>
          <LoginModal openModal={modalOpen} closeModal={modalClose} isModal={isModal} />
        </div>
      }
    </>

  );
}
