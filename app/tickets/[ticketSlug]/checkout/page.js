"use client";
import { GetAPI, PostAPI } from "@/api/postApi";
import { decodeJWT } from "@/app/checkout/page";
import { adminToken, superadmin } from "@/app/page";
import TicketHead from "@/common/TicketHead";
import DotLoader from "@/components/DotLoader";
import { UseCreateOrder } from "@/mutation/CreateOrder";
import { UseDiscount } from "@/mutation/UpdateDiscounts";
import { UsePaymentOrder } from "@/mutation/UpdatePaymentStatus";
import { GetProductsBySlug } from "@/queries/GetProducts";
import UsePromoCode from "@/queries/GetPromoCode";
import { useApolloClient, useQuery } from "@apollo/client";
import { SfButton, SfIconArrowForward, SfIconCheckCircle, SfInput, SfLink, SfLoaderCircular } from "@storefront-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { encode } from "@yag/id-hash";
import { usernameQuery } from "@/queries/GetUserDetails";

const CheckOut = ({ params }) => {
  const route = useRouter()
  const user_token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  const { data, loading } = useQuery(GetProductsBySlug, { variables: { slug: params?.ticketSlug }, context: { headers: { Authorization: `Bearer ${adminToken}` } } });
  const product = data?.products && data?.products[0]
  const [codeApplied, setCodeApplied] = useState('');
  const [vaild, setvaild] = useState({ load: false, value: false });
  const [inputValue, setInputValue] = useState('');
  const [promoCode, setPromoCode] = useState(0);
  const [remaining, setRemainings] = useState(0);
  const [loader, setLoader] = useState(false)
  const [total, setTotal] = useState(0);
  const client = useApolloClient()
  const userid = user_token && user_token !== 'undefined' && decodeJWT(user_token)['https://hasura.io/jwt/claims']['x-hasura-user-id'] || ''
  const phone = user_token && user_token !== 'undefined' && decodeJWT(user_token)['https://hasura.io/jwt/claims']['x-hasura-phone'] || ''
  const cartitems = typeof localStorage !== 'undefined' && JSON?.parse(localStorage?.getItem("cart_items")) || []
  // console.log(cartitems, 'data');
  const { data: users } = useQuery(usernameQuery, { variables: { "_eq": phone }, context: { headers: { Authorization: `Bearer ${superadmin}` } } })
  const attendee_details = typeof localStorage !== 'undefined' && JSON?.parse(localStorage?.getItem("attendee_details")) || []
  const subTotal = Array.isArray(cartitems) && cartitems?.reduce((acc, item) => acc + (item?.sale_price || item?.price) * (item?.quantity || 1), 0) || 0;
  const fees = cartitems.reduce(
    (acc, item) =>
      acc + (item?.metadata?.feeType === 'FLAT' ?
        (item?.metadata?.fee || 0 * item?.quantity) :
        ((item?.metadata?.fee || 0 / 100) * item?.sale_price * item?.quantity)),
    0
  );
  // console.log(attendee_details,'details');
  let totalAmountPayable = false;
  if (attendee_details?.length > 0) {
    attendee_details?.forEach(person => {
      totalAmountPayable += person["Total amount payable"];
    });
  }

  const taxes = parseFloat(fees * 0.18) || 0;
  let totalSum = parseFloat(subTotal + parseFloat(fees) + taxes) || 0;
  const roundAmt = Math.ceil(totalSum) - totalSum;
  totalSum = totalSum + roundAmt
  //localStorage.setItem('totalPrice', {amount:totalSum})

  const totalQuantity = Array.isArray(cartitems) && cartitems?.reduce((accumulator, item) => {
    return accumulator + item.quantity;
  }, 0);

  let maxSalePriceProduct = null;
  if (cartitems?.length > 0) {
    for (const product of cartitems) {
      if (!maxSalePriceProduct || product?.sale_price > maxSalePriceProduct?.sale_price) {
        maxSalePriceProduct = product;
      }
    }
  }
  // console.log("Product with highest sale price:", maxSalePriceProduct?.qr_id);

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

  const BenePayGateway = async (orderId, transId, amt) => {
    const panVal = attendee_details.length > 0 && attendee_details[0].hasOwnProperty("PAN Number") && attendee_details[0]["PAN Number"]
    const variables = {
      "ref_id": orderId.toString() + "-" + transId.toString(),// order_id 
      "email": users?.users?.length > 0 && users?.users[0]?.email || '',
      "name": users?.users?.length > 0 && users?.users[0]?.name || '',
      "amount": amt.toString(),
      "transaction_id": transId.toString(),
      "phone_number": phone
    }
    if (panVal) variables.order_details = "Donor's PAN - " + panVal;
    console.log(variables);
    const result = await PostAPI("https://pay.extraa.in/bene-send-request", variables)
    route.push(result?.data?.message)
  }

  const hdfcPayGateway = async (orderId, transId, amt) => {
    const variables = {
      "order_id": orderId.toString(),// order_id 
      "email": users?.users?.length > 0 && users?.users[0]?.email || '',
      "name": users?.users?.length > 0 && users?.users[0]?.name || '',
      "amount": amt.toString(),
      "transaction_id": transId.toString(),
      "phone_number": phone,
      "redirect_url": `https://deals.extraa.in/order-process/${encode(orderId * 11111)}`
      // "redirect_url": `http://localhost:3000/order-process/${encode(orderId * 11111)}`
    }
    const result = await PostAPI("https://pay.extraa.in/initiateJuspayPayment", variables)
    // console.log(result, 'res');
    if (result.data.status === "NEW") {
      const link = result.data.payment_links?.web
      route.push(link)
    } else {

    }
    return result
  }

  const onSucessClick = async (e, values) => {
    e.preventDefault()
    setLoader(true)
    // const { success, result: add_id } = await UseInsertUserAddress(formData, client, userid, token)
    // console.log(add_id?.insert_user_address?.returning[0]?.id, 'address')
    // localStorage.setItem('user_name', formData?.name)
    let variables;
    // if (cartitems.length > 0) {
    const prod = Array.isArray(cartitems) && cartitems?.map((i) => {
      const filters = attendee_details?.filter(j => j?.id === i?.id) || []
      return { "product_variant_id": i?.id, "quantity": i?.quantity, "form_response": filters }
    })
    variables = {
      "amount": totalAmountPayable || (totalSum - promoCode),
      "order_products": prod,
      "payment": 1,
      "user_id": userid,
      "discount_code": inputValue,
      "billing_address_id": null,
      "tax_amount": parseFloat(taxes)?.toFixed(2),
      "metadata": { subTotal: subTotal, product_items: ['tickets'], entry_date: cartitems[0]?.date },
      "order_status": "CHECKOUT"
    }
    // } else {
    //     variables = {
    //         "amount": totalSum - promoCode,
    //         "products": [{ "product_variant_id": totalAmt?.id, "quantity": 1 }],
    //         "payment": 1,
    //         "user_id": userid,
    //         "code": inputValue,
    //         "billing_address": add_id?.insert_user_address?.returning?.length > 0 && add_id?.insert_user_address?.returning[0]?.id || 0
    //     }
    // }

    const resp = await UseCreateOrder(variables, client)
    if (promoCode > 0) {
      const result = await UseDiscount({ "code": inputValue, "quantity": remaining - totalQuantity }, client)
    }
    //  console.log(resp?.result, 'result')
    const id = resp?.result?.insert_orders_one?.id || 0
    const transId = resp?.result?.insert_orders_one?.order_transactions?.length > 0 && resp?.result?.insert_orders_one?.order_transactions[0]?.id || 0
    const amt = resp?.result?.insert_orders_one?.order_transactions?.length > 0 && resp?.result?.insert_orders_one?.order_transactions[0]?.amount || 0
    if (totalAmountPayable && resp?.success) {

      //***************** Phonepe payment gateway code ******************
      // const req = {
      //   "transaction_id": transId,
      //   "amount": amt * 100,
      //   "user_id": userid,
      //   "phone_number": phone,
      //   "message": `Payment for order#${id}`,
      //   // "redirect_url": `http://localhost:3000/redirect?trans=${transId}&order=${id}`
      //   "redirect_url": `https://deals.extraa.in/coupon-redirect?trans=${transId}&order=${id}&ph=${phone}`
      // }
      // const result = await PostAPI('https://pay.extraa.in/send-request', req)
      // if (result?.data?.success) {
      //   const url = result?.data?.data?.instrumentResponse?.redirectInfo?.url
      //   // window.location.href(url)
      //   route.push(url);
      // }
      //***************** Phonepe payment gateway code ******************
      //***************** bene pay payment gateway code ******************
      // const res = await BenePayGateway(id, transId, amt)
      //***************** bene pay payment gateway code end ******************
      //   //***************** hdfc payment gateway code ******************
      const res = await hdfcPayGateway(id, transId, amt)
      //   // *************end of hdfc method*************

    } else if (resp?.success && amt > 0) {
      //***************** bene pay payment gateway code ******************
      // const res = await BenePayGateway(id, transId, amt)
      //***************** bene pay payment gateway code end ******************

      //   //***************** hdfc payment gateway code ******************
      const res = await hdfcPayGateway(id, transId, amt)
      //   // *************end of hdfc method*************
      // localStorage.removeItem('totalPrice')
      // localStorage.setItem('totalAmt', amt)

      //***************** Phonepe payment gateway code ******************
      // const req = {
      //   "transaction_id": transId,
      //   "amount": amt * 100,
      //   "user_id": userid,
      //   "phone_number": phone,
      //   "message": `Payment for order#${id}`,
      //   // "redirect_url": `http://localhost:3000/redirect?trans=${transId}&order=${id}`
      //   "redirect_url": `https://deals.extraa.in/coupon-redirect?trans=${transId}&order=${id}`
      // }
      // const result = await PostAPI('https://pay.extraa.in/send-request', req)
      // if (result?.data?.success) {
      //   const url = result?.data?.data?.instrumentResponse?.redirectInfo?.url
      //   // window.location.href(url)
      //   route.push(url);
      // }
      // *************end of phonepe method*************
    } else if (amt <= 0) {
      const desc = `Your+order+number+${id}+of+amount+Rs.${amt}+has+been+placed+successfully`
      const items = {
        id: transId,
        order_id: id,
        status: 'PAYMENT_SUCCESS',
        amount: 0
      }
      const encoded = encode(id * 11111)
      const mailVariables = {
        "order_id": id.toString(),
        "email": users?.users?.length > 0 && users?.users[0]?.email || '',
        "order_link": `https://deals.extraa.in/od/${encoded}`
      }
      const couponVariables = {
        "qr_id": maxSalePriceProduct?.qr_id,
        "user_id": userid,
      }
      await UsePaymentOrder(items, client)
      //whatsapp api
      await GetAPI(`https://api.growaasan.com/api/sendPosCommunication?clietnId=100365&authKey=Q0ptUDJ1dTlzZFYrd0RMUFR6aU5OUT09&communicationType=2&waTemplateName=deals_confirmation&waTemplateLang=en&country_code=91&customerMobile=${phone}&varCount=3&var1=Customer&var2=${desc || ''}&var3=https://deals.extraa.in/od/${encoded} `)
      // email api
      await PostAPI('https://6tgvrplkxbg2bif6vrv5gxdofe0wrver.lambda-url.ap-south-1.on.aws/', mailVariables)
      // user coupon add api
      await PostAPI("https://wzputfojcxnmkpncb2dd25jihe0eovtp.lambda-url.ap-south-1.on.aws/", couponVariables)
      route.push(`/success/${id}`)
      setLoader(false)
    }
  }

  const onBackButtonClick = () => {
    if (user_token && attendee_details?.length === 0) {
      route.push(`/tickets/${params?.ticketSlug}/bookings`)
    } else {
      route.back()
    }

  }

  return (
    <>
      <div className="m-6">
        <TicketHead product={product} toggleBack={onBackButtonClick} />
      </div>
      <div className=" m-3 flex flex-col justify-center items-center">
        <div className="mx-4 w-full max-w-lg mt-8 ">
          <div>
            <h2 className="text-xl uc-sb text-[#421C4D] font-bold mb-4 ">Order Summary</h2>
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
                    <p className='text-sm'>
                      {item?.attributes?.Type}
                    </p>
                    {/* {item?.product_variants?.length > 0 && item?.product_variants[0]?.attributes && Object.keys(item?.product_variants[0]?.attributes)?.map((pv_key) => {
                        return (
                          <small className="max-w-[140px] text-center" key={pv_key}>{pv_key}: {item?.product_variants[0]?.attributes[pv_key]}</small>
                        )
                      })} */}
                    <small className="text-center ">Qty: {item?.quantity || 1}</small>
                  </div>
                  <p className="text-base font-bold">
                    ₹{totalAmountPayable || (item?.sale_price || item?.price) * (item.quantity || 1) || 0}
                  </p>
                </div>
              ))}
              <div className="divider mr-3"></div>
              <div className="flex flex-row justify-between items-center uc-regular text-[#7B7979] mr-3">
                <p className='text-sm'>Net Order Value</p>
                <p className='text-base font-bold'>₹{parseFloat(subTotal)?.toFixed(2) || 0}</p>
              </div>
              <div className="flex flex-row justify-between items-center uc-regular text-[#7B7979] mr-3">
                <p className='text-sm'>Convenience fee</p>
                <p className='text-base font-bold'>₹{parseFloat(fees)?.toFixed(2) || 0}</p>
              </div>
              <div className="flex flex-row justify-between items-center uc-regular text-[#7B7979] mr-3">
                <p className='text-sm'>Taxes(GST)</p>
                <p className='text-base font-bold'>₹{parseFloat(taxes)?.toFixed(2) || 0}</p>
              </div>
              <div className="flex flex-row justify-between items-center uc-regular text-[#7B7979] mr-3">
                <p className='text-sm'>Rounded amount</p>
                <p className='text-base font-bold'>₹{parseFloat(roundAmt)?.toFixed(2) || 0}</p>
              </div>
              <div className="divider mr-3"></div>
              <div className="flex flex-row justify-between items-center uc-sb text-[#9356C0] mr-3">
                <p className='text-base '>Total Amount Payable</p>
                {/* {promoCode > 0 ?
                    <div className="flex gap-2 text-base">
                      <p className="line-through">₹{totalSum}</p> <p>₹{(totalSum) - promoCode}</p>
                    </div>
                    : */}
                <p className="text-base">₹{totalAmountPayable || totalSum}</p>
                {/* } */}
              </div>
              <label className="">
                {codeApplied?.length > 0 ?
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
                }
                {vaild?.value &&
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-red-600 font-medium mt-0.5">Invalid promo code</p>
                    </div>
                  </div>
                }
              </label>
            </div>
            <div className="w-full mt-4 mb-8 cursor-pointer">
              <button disabled={loader} onClick={onSucessClick} className="bg-extraa-blue text-white w-full py-2 px-4 rounded-md uc-sb ">
                {loader ?
                  <div className="flex justify-center">
                    <SfLoaderCircular className='text-yellow-500' size="xs" />
                  </div>
                  :
                  <div className="flex flex-row justify-between">
                    <label className="text-base">Checkout</label>
                    {promoCode > 0 ?
                      <div className="flex gap-2 text-base ">
                        <p className="line-through">₹{totalSum}</p> <p>₹{(totalSum) - promoCode}</p>
                      </div>
                      :
                      <p className="text-base">₹{totalAmountPayable || totalSum}</p>
                    }
                  </div>
                }
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default CheckOut;