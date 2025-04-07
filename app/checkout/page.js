"use client"
import { SfLoaderCircular, useDisclosure } from "@storefront-ui/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useApolloClient, useQuery } from '@apollo/client';
import { UseCreateOrder } from "@/mutation/CreateOrder";
import NotificationManager from "@/components/NotificationManager";
import { GetAPI, PostAPI } from "@/api/postApi";
import { jwtDecode } from "jwt-decode";
import { useCart, WithSSR } from "@/components/Cart/cart";
import UsePromoCode from "@/queries/GetPromoCode";
import { UsePaymentOrder } from "@/mutation/UpdatePaymentStatus";
import { UseDiscount } from "@/mutation/UpdateDiscounts";
import { UseInsertUserAddress, userEditAddress } from "@/mutation/InsertUserAddress";
import { usernameQuery } from "@/queries/GetUserDetails";
import { superadmin } from "../page";
import AddressBox from "@/components/AddressBox";
import { GetUserAddress } from "@/queries/GetUserAddress";
import ModalWrapper from "@/components/Modal";
import { encode } from "@yag/id-hash";
import Loader from "@/components/loader";
import GetAllCoins, { UseWalletBalance } from "@/queries/GetCoins";

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

// validation Schema for the form fields
const nameRegex = /^[a-zA-Z\s]+$/;
const addressRegex = /^[a-zA-Z0-9\s,.-]+$/;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const mobileRegex = /^[6-9]\d{9}$/;

const states = ['Tamil Nadu']

const Checkout = () => {

  const cart = WithSSR(useCart, (state) => state);

  const route = useRouter()
  const totalAmt = typeof localStorage !== 'undefined' && JSON?.parse(localStorage?.getItem("totalPrice")) || 0
  const cartitems = cart?.cartItems || 0;
  // console.log(cartitems, 'cartitems');
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  const userid = token && token !== 'undefined' && decodeJWT(token)['https://hasura.io/jwt/claims']['x-hasura-user-id'] || ''
  const phone = token && token !== 'undefined' && decodeJWT(token)['https://hasura.io/jwt/claims']['x-hasura-phone'] || ''
  const { data } = useQuery(usernameQuery, { variables: { "_eq": phone }, context: { headers: { Authorization: `Bearer ${superadmin}` } } })
  const [inputValue, setInputValue] = useState('');
  const [promoCode, setPromoCode] = useState(0);
  const [remaining, setRemainings] = useState(0);
  const [total, setTotal] = useState(1);
  const [codeApplied, setCodeApplied] = useState('');
  const [vaild, setvaild] = useState({ load: false, value: false });
  const [loader, setLoader] = useState(false)
  const [coinsApplied, setCoinApplied] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    address: "",
    email: "",
    phone: phone,
    payment: "",
    state: 'Tamil Nadu'
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    address: "",
    email: "",
    mobile: "",
    payment: "",
  });
  const client = useApolloClient()
  const [noti, setNoti] = useState(false)
  const [notiMsg, setNotiMsg] = useState("Something went wrong or Not enough balance")
  const [addAddressId, setAddAddressId] = useState()
  const { data: userAddress, refetch } = useQuery(GetUserAddress, { variables: { "id": userid }, context: { headers: { Authorization: `Bearer ${token}` } } })
  const { data: coins } = useQuery(GetAllCoins, { context: { headers: { Authorization: `Bearer ${token}` } } })
  const { isOpen, open, close } = useDisclosure(false);
  const [editId, setEditId] = useState()
  const [highlightedAddresses, setHighlightedAddresses] = useState(0);
  const totalBlueAmount = cartitems && cartitems?.reduce((total, product) => {
    if (product.type === 4) {
      return total + product.product_variants.reduce((variantTotal, variant) => {
        return variantTotal + variant.sale_price;
      }, 0);
    }
    return total;
  }, 0) || 0

  // const totalGoldAmount = cartitems && cartitems?.reduce((total, product) => {
  //   if (product.denomination >= 3) {
  //     return total + (parseInt(product.denomination) * product.quantity);
  //   }
  //   return total;
  // }, 0) || 0

  // const totalSilverAmount = cartitems && cartitems?.reduce((total, product) => {
  //   if (product.type === 1) {
  //     return total + product.product_variants.reduce((variantTotal, variant) => {
  //       return variantTotal + variant.sale_price;
  //     }, 0);
  //   }
  //   return total;
  // }, 0) || 0

  // console.log(totalBlueAmount, totalGoldAmount, totalSilverAmount, 'amounts');

  useEffect(() => {
    if (!token) {
      route.push('/')
      // console.log('hello')
    }
  }, [token])

  useEffect(() => {
    setFormData({
      ...formData,
      name: data?.users?.length > 0 ? data?.users[0]?.name : '', //maps the value to the respective obj name
    });
    setHighlightedAddresses(userAddress?.user_address?.length > 0 && userAddress?.user_address[0]?.id || 0)
  }, [userAddress])


  // handleChange
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, //maps the value to the respective obj name
    });
    // validation
    switch (name) {
      case "name":
        if (!value) {
          setFormErrors({
            ...formErrors,
            name: "Name is required",
          });
        } else if (!nameRegex.test(value)) {
          setFormErrors({
            ...formErrors,
            name: "Invalid name",
          });
        } else {
          setFormErrors({
            ...formErrors,
            name: "",
          });
        }
        break;
      case "address":
        if (!value) {
          setFormErrors({
            ...formErrors,
            address: "Address is required",
          });
        } else if (!addressRegex.test(value)) {
          setFormErrors({
            ...formErrors,
            address: "Invalid address",
          });
        } else {
          setFormErrors({
            ...formErrors,
            address: "",
          });
        }
        break;
      case "email":
        if (!value) {
          setFormErrors({
            ...formErrors,
            email: "Email is required",
          });
        } else if (!emailRegex.test(value)) {
          setFormErrors({
            ...formErrors,
            email: "Invalid email",
          });
        } else {
          setFormErrors({
            ...formErrors,
            email: "",
          });
        }
        break;
      case "mobile":
        if (!value) {
          setFormErrors({
            ...formErrors,
            mobile: "Mobile number is required",
          });
        } else if (!mobileRegex.test(value)) {
          setFormErrors({
            ...formErrors,
            mobile: "Invalid mobile number",
          });
        } else {
          setFormErrors({
            ...formErrors,
            mobile: "",
          });
        }
        break;
      default:
        break;
    }

  };

  const subTotal = Array.isArray(cartitems) && cartitems?.reduce((acc, item) => acc + (item?.product_variants?.length > 0 && item?.product_variants[0]?.sale_price || item?.price || 0) * (item?.quantity || 1), 0);

  const fees = cart?.cartItems?.reduce(
    (acc, item) =>
      acc + item?.metadata?.fee && (item?.metadata?.feeType === 'FLAT' && (item?.metadata?.fee * item?.quantity) || ((item?.metadata?.fee / 100) * (item?.product_variants?.length > 0 && item?.product_variants[0]?.sale_price || 0) * item?.quantity)) || acc,
    0
  ) || 0
  // const fees = parseFloat(parseFloat(subTotal) * 0.05) || 0;
  const taxes = parseFloat(fees * 0.18) || 0;
  let totalSum = parseFloat(parseFloat(subTotal) + parseFloat(fees) + taxes) || 0;
  const roundAmt = Math.ceil(totalSum) - totalSum;
  totalSum = totalSum + roundAmt
  //localStorage.setItem('totalPrice', {amount:totalSum})
  // console.log(addAddressId);
  const totalQuantity = Array.isArray(cartitems) && cartitems?.reduce((accumulator, item) => {
    return accumulator + item.quantity;
  }, 0);

  // console.log(coinsApplied);

  const addBillingAddress = (e) => {
    // console.log('billing address');
    setNotiMsg('Please select or add billing address to checkout')
    setNoti(true)
    setTimeout(() => {
      setNoti(false)
    }, 5000)
  }
  const encodeEncryptlink = {

  }
  const onSucessClick = async (e, values) => {
    e.preventDefault()
    setLoader(true)
    // const { success, result: add_id } = await UseInsertUserAddress(formData, client, userid, token)
    // console.log(add_id?.insert_user_address?.returning[0]?.id, 'address')
    localStorage.setItem('user_name', formData?.name)
    let variables;
    let giftOrderData;

    // Define an object mapping id values to their corresponding types
    const idToType = {     
      3: 'Zoominfo Goodies'
    };
    // Initialize an empty array to store items with type information
    let categorizedItems = [];

    if (cartitems.length > 0) {
      const prod = Array.isArray(cartitems) && cartitems?.map((i) => {
        // Setting type id to tags and pushing it into categorizedItems.
        console.log(parseInt(i?.store_id),"store_id");
        
        const itemType = idToType[parseInt(i?.store_id) || (i?.__typename == "gift_cards" && 3)]
        console.log( idToType[parseInt(i?.store_id) || (i?.__typename == "gift_cards" && 3)],"prodID");
        
        itemType && categorizedItems.push(itemType);
        // remove duplicates
        categorizedItems = [...new Set(categorizedItems)];
        //  console.log(categorizedItems,'cat');
        return {
          "product_variant_id": i?.product_variants?.length > 0 && i?.product_variants[0]?.id || null,
          "quantity": i.quantity,
          "giftcard_id": i?.denomination && i?.product_id || null,
          "giftcard_denom": i?.denomination || null,
          "sku": i?.sku || '',
          "type": i?.type || 2,
          "amount": i?.product_variants?.length > 0 && i?.product_variants[0]?.sale_price || 0,
          "coupon_id": i?.coupon_id
        }
      })
      variables = {
        "amount": totalSum - promoCode,
        "order_products": prod,
        "payment": 1,
        "user_id": userid,
        "discount_code": inputValue,
        "billing_address_id": highlightedAddresses || 0,
        "order_status": "CHECKOUT",
        "tax_amount": parseFloat(taxes)?.toFixed(2),
        "metadata": { subTotal: subTotal, product_items: categorizedItems },
      }
      // console.log(metadata,"metaData");
    }
    else {
      variables = {
        "amount": totalSum - promoCode,
        "order_products": [{ "product_variant_id": totalAmt?.id, "quantity": 1 }],
        "payment": 1,
        "user_id": userid,
        "discount_code": inputValue,
        "billing_address_id": highlightedAddresses || 0,
        "order_status": "CHECKOUT",
        "tax_amount": parseFloat(taxes)?.toFixed(2),
        "metadata": { subTotal: subTotal, product_items: categorizedItems },
      }
    }
    // console.log(coinsApplied, 'coins');
    if (totalSum <= 0) {
      const resp = await UseCreateOrder(variables, client);
      if (promoCode > 0) {
        const result = await UseDiscount({ "code": inputValue, "quantity": remaining - totalQuantity }, client)
      }
      //  console.log(resp?.result, 'result')
      const id = resp?.result?.insert_orders_one?.id || 0
      const transId = resp?.result?.insert_orders_one?.order_transactions?.length > 0 && resp?.result?.insert_orders_one?.order_transactions[0]?.id || 0
      const amt = resp?.result?.insert_orders_one?.order_transactions?.length > 0 && resp?.result?.insert_orders_one?.order_transactions[0]?.amount || 0
      const desc = `Your+order+number+${id}+for+amount+Rs.${amt}+has+been+placed+successfully`
      const items = {
        id: transId,
        order_id: id,
        status: 'PAYMENT_SUCCESS',
        amount: 0,
        q_id: giftOrderData?.orderId
      }
      const encoded = encode(id * 11111)
      const mailVariables = {
        "order_id": id?.toString(),
        "email": data?.users?.length > 0 && data?.users[0]?.email,
        "order_link": `https://deals.extraa.in/od/${encoded}`
      }
      const couponVariables = {
        "objects":
          Array.isArray(cartitems) && cartitems?.map((item) => {
            return {
              "coupons_id": item?.coupon_id,
              "user_id": userid
            }
          })

      }
      // console.log(couponVariables);
      await UsePaymentOrder(items, client)
      // whatsapp api link
      await GetAPI(`https://api.growaasan.com/api/sendPosCommunication?clietnId=100365&authKey=Q0ptUDJ1dTlzZFYrd0RMUFR6aU5OUT09&communicationType=2&waTemplateName=deals_confirmation&waTemplateLang=en&country_code=91&customerMobile=${phone}&varCount=3&var1=customer&var2=${desc || ''}&var3=https://deals.extraa.in/od/${encoded}`)
      // normal msg api
      await GetAPI(`https://api.growaasan.com/api/sendPosCommunication?varCount=1&var1=${id}&var2=${encoded}&clietnId=100365&authKey=Q0ptUDJ1dTlzZFYrd0RMUFR6aU5OUT09&communicationType=1&smsTemplateId=1707170558637253609&country_code=91&customerMobile=${phone}&varCount=2`)
      // email api link
      await PostAPI('https://6tgvrplkxbg2bif6vrv5gxdofe0wrver.lambda-url.ap-south-1.on.aws/', mailVariables)
      // user coupon add api
      await PostAPI("https://wzputfojcxnmkpncb2dd25jihe0eovtp.lambda-url.ap-south-1.on.aws/", couponVariables)
      route.push(`/success/${id}`)
      // setLoader(false)
    } else
    // if (JSON.stringify(coinsApplied) !== '{}' && (coinsApplied?.gold || coinsApplied?.silver || coinsApplied?.blue))
    {
      const sender = []
      if (coinsApplied?.gold) {
        sender.push(3)
      }
      if (coinsApplied?.silver) sender.push(5)
      if (coinsApplied?.blue) sender.push(6)
      // const result = await UseWalletBalance(sender)
      // console.log(result, 'res');
      // variables.sender_id = result?.data?.map((x) => x?.id);
      variables.token = token;
      // variables.coin_type = coinsApplied?.gold ? "3" : coinsApplied?.silver ? "5" : "6";
      variables.amount = (totalSum - promoCode)?.toString();
      variables.payment = "1";
      variables.billing_address = (highlightedAddresses && highlightedAddresses || userAddress?.userAddress[0]?.id)?.toString()
      // console.log(variables, 'variable');
      const res = await PostAPI('https://6j8wmnnyoa.execute-api.ap-south-1.amazonaws.com/process-coin-order', variables)
      // console.log(res, 'result')
      if (res?.data?.status === 'SUCCEEDED') {
        if (JSON.parse(res?.data?.output)?.error) {
          setNotiMsg(JSON.parse(res?.data?.output)?.error)
          setNoti(true)
          setTimeout(() => {
            setNoti(false)
          }, 5000)
          setLoader(false);
        } else {
          route.push("order-process?response=" + res?.data?.output)
        }
      } else {
        setNotiMsg("Something went wrong or Not enough balance")
        setNoti(true)
        setTimeout(() => {
          setNoti(false)
        }, 5000)
      }
    }
  }

  const checkPromoCode = async (event) => {
    event.preventDefault();
    setvaild({ load: true, value: false })
    const { data } = await UsePromoCode(inputValue)
    if (data?.discounts?.length > 0 && data?.discounts[0]?.remaining >= totalQuantity) {
      setCodeApplied(data?.discounts[0]?.message)
      setRemainings(data?.discounts[0]?.remaining)
      const amount = data?.discounts[0]?.type === 1 ? data?.discounts[0]?.amount : (data?.discounts[0]?.amount / 100) * totalSum
      // console.log(amount,'amt');
      setTotal(totalSum - amount)
      setPromoCode(amount)
      setvaild({ load: false, value: false })
    } else {
      setCodeApplied('')
      setPromoCode(0)
      setvaild({ load: false, value: true })
    }
    // console.log(data, 'res');
  };

  const onRemoveClicked = () => {
    // console.log('removed');
    setInputValue('')
    setCodeApplied('')
    setPromoCode(0)
    setvaild({ load: false, value: false })
  }
  const formSubmit = async (e, id) => {
    e.preventDefault()
    if (editId) {
      e.stopPropagation()
      // const selectedAddress=userAddress?.user_address.filter(e=>e.id===id)
      const { success, result: add_id } = await userEditAddress(formData, client, editId, token)
      // console.log(add_id)
      close()
    }
    else {
      const { success, result: add_id } = await UseInsertUserAddress(formData, client, userid, token)
      setAddAddressId(add_id?.insert_user_address?.returning[0]?.id)
      refetch()
      close()
    }

  }
  const editAddress = (e, address) => {
    //console.log(address.id);
    setFormData({
      ...formData,
      full_name: address?.full_name || "",
      phone_number: address?.phone_number || "",
      address_line_1: address?.address_line_1 || "",
      address_line_2: address?.address_line_2 || "",
      city: address?.city || "",
      pincode: address?.pincode || "",
      landmark: address?.landmark || ""
    })
    open()
    setEditId(address.id);
  }
  // // encoding encrypt url to Base 64 to remove special characters
  // const base64UrlEncode = (data) => {
  //   return data.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  // };
  // const encryptAndEncode = (text, secretKey) => {
  //   const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
  //   const base64Encoded = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encrypted));
  //   return base64UrlEncode(base64Encoded);
  // };

  return (
    <>

      {loader ? <div className="h-[80vh] flex justify-center items-center"><Loader /></div> :
        <div className="flex flex-col-reverse justify-center md:flex-row md:justify-around container mx-auto md:px-6 py-2 ">
          <div className="flex flex-col mt-14 min-w-[50%] px-5">
            {/* {userAddress?.user_address?.length != 0 && */}
            <AddressBox open={open} address={userAddress?.user_address} formSubmit={formSubmit} editAddress={editAddress} highlightedAddresses={highlightedAddresses} setHighlightedAddresses={setHighlightedAddresses} />
            <ModalWrapper formData={formData} formSubmit={formSubmit} handleChange={handleChange} isOpen={isOpen} open={open} close={close} />

            {/* ------------ Checkout Form ------------------ */}

            {/* <div className="typography-text-sm mb-2 mt-8  max-w-[400px]">
              By placing this order, you are agreeing to our <SfLink href="/terms">Terms and Conditions</SfLink> and our{' '}
              <SfLink href="/privacy">Privacy Policy.</SfLink>
            </div> */}
            <div className="w-full flex gap-4 mt-4 mb-8 md:hidden cursor-pointer">
              <div onClick={highlightedAddresses > 0 ? onSucessClick : addBillingAddress} className="bg-extraa-purple-btn text-MFC-black w-full py-2 px-4 rounded-md uc-sb">
                {loader ? <SfLoaderCircular className='text-yellow-500' size="xs" /> :
                  <div className="flex flex-row justify-between">
                    <label className="text-base">Checkout</label>
                    {promoCode > 0 ?
                      <div className="flex gap-2 text-base ">
                        <div className="flex flex-row items-center line-through gap-2">
                          <img src="https://storage.extraa.in/files/coins-white.svg" className="h-4" alt="extraa blue" />
                          {totalSum}</div>
                        <div className="flex flex-row items-center gap-2" >
                          <img src="https://storage.extraa.in/files/coins-white.svg" className="h-4" alt="extraa blue" />
                          {(totalSum) - promoCode}
                        </div>
                      </div>
                      :
                      <div className="flex flex-row items-center gap-2" >
                        <img src="https://storage.extraa.in/files/coins-white.svg" className="h-4" alt="extraa blue" />
                        {totalSum}
                      </div>
                    }
                  </div>
                }
              </div>
            </div>

          </div>
          {/* --------------- Order Details ----------------- */}
          <div className="w-full px-4">
            <div className="container mt-8 mx-3">
              <h2 className="text-xl uc-sb text-MFC-black font-bold mb-4 ">Order Summary</h2>
              {/* {cartitems.length === 0 ? (
                <div className='flex justify-center '>
                  <Image
                    src={cartImage}
                    alt='**No items in the carts'
                    className='w-[300px] h-[300px] justify-center'
                  />
                </div>
              ) : ( */}
              <div>
                {Array.isArray(cartitems) && cartitems.map((item, index) => (
                  <div className="flex flex-row justify-between items-center mr-3" key={index}>
                    <div className="flex flex-row gap-4 uc-regular text-[#1B1C1E]">
                      <p className='text-sm text-MFC-black'>
                        {item?.brand + " | " + item.name}
                      </p>
                      {/* {item?.product_variants?.length > 0 && item?.product_variants[0]?.attributes && Object.keys(item?.product_variants[0]?.attributes)?.map((pv_key) => {
                        return (
                          <small className="max-w-[140px] text-center" key={pv_key}>{pv_key}: {item?.product_variants[0]?.attributes[pv_key]}</small>
                        )
                      })} */}
                      <small className="text-center text-MFC-black">Qty: <span className="text-MFC-black">{item?.quantity || 1}</span></small>
                    </div>
                    <p className="text-base font-bold text-MFC-black">
                      ₹{(item.product_variants?.length > 0 && item.product_variants[0]?.sale_price || item?.price || 0) * (item.quantity || 1)}
                    </p>
                  </div>
                ))}
                <div className="divider mr-3"></div>
                <div className="flex flex-row justify-between items-center uc-regular mr-3">
                  <p className='text-sm text-MFC-black'>Net Order Value</p>
                  <p className='text-base font-bold text-MFC-black'>₹{parseFloat(subTotal)?.toFixed(2) || 0}</p>
                </div>
                <div className="flex flex-row justify-between items-center uc-regular  mr-3">
                  <p className='text-sm text-MFC-black'>Convenience fee</p>
                  <p className='text-base font-bold text-MFC-black'>₹{parseFloat(fees)?.toFixed(2) || 0}</p>
                </div>
                <div className="flex flex-row justify-between items-center uc-regular  mr-3">
                  <p className='text-sm text-MFC-black'>Taxes(GST)</p>
                  <p className='text-base font-bold text-MFC-black'>₹{parseFloat(taxes)?.toFixed(2) || 0}</p>
                </div>
                <div className="flex flex-row justify-between items-center uc-regular  mr-3">
                  <p className='text-sm text-MFC-black'>Rounded amount</p>
                  <p className='text-base font-bold text-MFC-black'>₹{parseFloat(roundAmt)?.toFixed(2) || 0}</p>
                </div>
                <div className="divider mr-3"></div>
                <div className="flex flex-row justify-between items-center uc-sb  mr-3">
                  <p className='text-base text-MFC-black '>Total Amount Payable</p>
                  {/* {promoCode > 0 ?
                    <div className="flex gap-2 text-base">
                      <p className="line-through">₹{totalSum}</p> <p>₹{(totalSum) - promoCode}</p>
                    </div>
                    : */}
                  <p className="text-base text-MFC-black">₹{totalSum}</p>
                  {/* } */}
                </div>
                {/* <p className="text-[#1B1C1EB2] text-xs mt-8 uc-sb">Select Coins to redeem</p> */}
                {/* <CoinRedeem options={coins?.coins} toggleNoti={setNoti} toggleMsg={setNotiMsg} items={cartitems} amount={totalSum} toggeleCoin={setCoinApplied} /> */}
                <p className="text-MFC-black text-xs mt-8 mb-4 uc-sb">Using the following coins to place the order:</p>
                {/* {totalGoldAmount > 0 &&
                  <div className="flex flex-row justify-between items-center uc-regular text-[#7B7979] mr-3">
                    <p className='text-sm'>Gold coins</p>
                    <div className='flex flex-row gap-2 text-base font-bold items-center'>
                      <img src="https://storage.extraa.in/files/coins-gray.svg" className="h-4" alt="extraa gold" />
                      {totalGoldAmount}
                    </div>
                  </div>
                }
                {totalSilverAmount > 0 &&
                  <div className="flex flex-row justify-between items-center uc-regular text-[#7B7979] mr-3">
                    <p className='text-sm'>Silver coins</p>
                    <div className='flex flex-row gap-2 text-base font-bold items-center'>
                      <img src="https://storage.extraa.in/files/coins-gray.svg" className="h-4" alt="extraa silver" />
                      {totalSilverAmount}
                    </div>
                  </div>} */}
                {totalBlueAmount > 0 &&
                  <div className="flex flex-row justify-between items-center uc-regular  mr-3">
                    <p className='text-sm text-MFC-black'>Zoominfo Coins</p>
                    <div className='flex flex-row gap-2 text-base font-bold items-center'>
                      <img src="https://storage.extraa.in/files/coins-gray.svg" className="h-4" alt="extraa blue" />
                     <span className="text-MFC-White"> {totalSum}</span>
                    </div>
                  </div>}
                {/* promo code section */}
                {/* <label className=""> */}  
                {/* {codeApplied?.length > 0 ?
                    <div className="flex flex-row items-center uc-sb mt-4">
                      <p className="text-sm"><SfIconCheckCircle className="text-green-500" /> {codeApplied}
                        <button className='bg-[#ffff] h-[38px] uc-sb ml-4 rounded-r-md' onClick={onRemoveClicked}>
                          <span className='text-red-600'>Remove</span>
                        </button>
                      </p>

                    </div>
                    :
                    <div className="flex flex-row items-center">
                      <input
                        value={inputValue}
                        onChange={(event) => setInputValue(event.target.value)}
                        invalid={vaild?.value}
                        // name='phone'
                        className='mt-4 w-full border-2 rounded-l-md h-[40px] px-4 uc-sb rounded-r-none'
                        placeholder="Add Discount Code"
                      />
                      <button className='bg-[#FEC447] h-[38px] w-24 uc-sb mt-4 rounded-r-md' onClick={checkPromoCode}>
                        <span className='text-black'>Apply</span>
                      </button>
                    </div>
                  } */}
                {/* {vaild?.value &&
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-red-600 font-medium mt-0.5">Invalid promo code</p>
                      </div>
                    </div>
                  }
                </label> */}
                {/* promo code section end */}
              </div>
              <div className="w-full mt-4 mb-8 md:block hidden cursor-pointer">
                <div onClick={highlightedAddresses > 0 ? onSucessClick : addBillingAddress} className="bg-extraa-purple-btn text-Zoominfo-text-button w-full py-2 px-4 rounded-md uc-sb">
                  {loader ? <SfLoaderCircular className='text-yellow-500' size="xs" /> :
                    <div className="flex flex-row justify-between">
                      <label className="text-base">Checkout</label>
                      {promoCode > 0 ?
                        <div className="flex gap-2 text-base ">
                          <div className="flex flex-row items-center line-through gap-2">
                            <img src="https://storage.extraa.in/files/coins-white.svg" className="h-4" alt="extraa blue" />
                            {totalSum}</div>
                          <div className="flex flex-row items-center gap-2" >
                            <img src="https://storage.extraa.in/files/coins-white.svg" className="h-4" alt="extraa blue" />
                            {(totalSum) - promoCode}
                          </div>
                        </div>
                        :
                        <div className="flex flex-row items-center gap-2 bg-extraa-purple-btn" >
                          <img src="https://storage.extraa.in/files/coins-white.svg" className="h-4" alt="extraa blue" />
                          {totalSum}
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      {noti && <NotificationManager message={notiMsg} alertType={0} />}
    </>
  );
};

export default Checkout;