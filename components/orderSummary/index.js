import { useState, useRef, useEffect } from 'react';
import { SfButton, SfIconCheckCircle, SfIconClose, SfIconError, SfInput, SfLink } from '@storefront-ui/react';
import NotificationManager from '../NotificationManager';




export default function OrderSummary({ saleAmt, taxAmt, DelvryAmt, itemCount, type, roundamount }) {
  const errorTimer = useRef(0);
  const positiveTimer = useRef(0);
  const informationTimer = useRef(0);
  const [inputValue, setInputValue] = useState('');
  const [promoCode, setPromoCode] = useState(0);
  const [informationAlert, setInformationAlert] = useState(false);
  const [positiveAlert, setPositiveAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);


  // const orderDetails = {
  //   items: itemCount||1,
  //   originalPrice: orginalAmt ||0,
  //   savings:orginalAmt && orginalAmt > saleAmt ? orginalAmt - saleAmt : 0 ,
  //   delivery: DelvryAmt ||0,
  //   tax: taxAmt || 0,
  // };
  // useEffect(() => {
  //   clearTimeout(errorTimer.current);
  //   errorTimer.current = window.setTimeout(() => setErrorAlert(false), 5000);
  //   return () => {
  //     clearTimeout(errorTimer.current);
  //   };
  // }, [errorAlert]);

  // useEffect(() => {
  //   clearTimeout(positiveTimer.current);
  //   positiveTimer.current = window.setTimeout(() => setPositiveAlert(false), 5000);
  //   return () => {
  //     clearTimeout(positiveTimer.current);
  //   };
  // }, [positiveAlert]);

  // useEffect(() => {
  //   clearTimeout(informationTimer.current);
  //   informationTimer.current = window.setTimeout(() => setInformationAlert(false), 5000);
  //   return () => {
  //     clearTimeout(informationTimer.current);
  //   };
  // }, [informationAlert]);

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(price);

  const totalPrice = () => saleAmt + promoCode + (DelvryAmt || 0) + (taxAmt || 0) +(roundamount||0);

  // const checkPromoCode = (event) => {
  //   event.preventDefault();
  //   if ((promoCode === -100 && inputValue.toUpperCase() === 'VSF2020') || !inputValue) return;
  //   if (inputValue.toUpperCase() === 'VSF2020') {
  //     setPromoCode(-100);
  //     setPositiveAlert(true);
  //   } else {
  //     setErrorAlert(true);
  //   }
  // };

  // const removePromoCode = () => {
  //   setPromoCode(0);
  //   setInformationAlert(true);
  // };

  return (
    <>
      <div>
        <div className="shadow-lg md:rounded-lg md:border md:border-neutral-100 mt-10 max-w-full ">
          <div className="flex justify-between items-end bg-neutral-100  py-2 px-4 md:px-6 md:pt-6 md:pb-4">
            <p className="text-xl md:text-2xl font-bold md:typography-headline-3 text-MFC-black">Order Summary</p>
            <p className="typography-text-base font-medium text-MFC-black">(Items: {itemCount})</p>
          </div>
          <div className="px-4 pb-4 mt-3 md:px-6 md:pb-6 md:mt-0">
            <div className="flex justify-between typography-text-base ">
              <div className="flex flex-col grow pr-2 text-MFC-black">
                <p className='my-2 font-semibold '>Items Subtotal</p>
                <p className="my-2 ">Convenience fee:</p>
                <p className=''>Estimated Sales Tax</p>
                <p className=''>Rounded amount</p>
              </div>
              <div className="flex flex-col text-right text-MFC-black">
                <p className='font-semibold my-2'>{formatPrice(saleAmt)}</p>
                <p className="my-2">{formatPrice(DelvryAmt || 0)}</p>
                <p>{formatPrice(taxAmt || 0)}</p>
                <p>{formatPrice(roundamount || 0)}</p>
              </div>
            </div>
            {/* {type===0?(promoCode ? (
            <div className="flex items-center mb-5 py-5 border-y text-sm border-neutral-200">
              <p>PromoCode</p>
              <SfButton size="sm" variant="tertiary" className="ml-auto text-[#FF5555] mr-2 text-sm" onClick={removePromoCode}>
                Remove
              </SfButton>
              <p>{formatPrice(promoCode)}</p>
            </div>
          ) : (
            <form className="flex gap-x-2 py-4 border-y border-neutral-200 mb-4" onSubmit={checkPromoCode}>
              <SfInput
                value={inputValue}
                placeholder="Enter promo code"
                wrapperClassName="grow"
                onChange={(event) => setInputValue(event.target.value)}
              />
              <SfButton type="submit" variant="secondary" className='bg-extraa-blue text-white w-36'>
                Apply
              </SfButton>
            </form>
          )):(null)}
          {promoCode<0 &&<p className="px-3 py-1.5 bg-secondary-100 text-green-600 text-lg font-semibold rounded-md text-center mb-4">
            You are saving ₹{Math.abs(promoCode).toFixed(2)} on your order today!
          </p>} */}
            <div className="flex justify-between mt-4  md:text-base font-bold pb-4 mb-4 border-b border-neutral-200">
              <p className='text-2xl text-MFC-black'>Total</p>
              <p className='text-2xl text-MFC-black'>{formatPrice(totalPrice())}</p>
            </div>
          </div>
        </div>
        {/* <div className="absolute top-0 right-0 mx-2 mt-2 sm:mr-6">
        {positiveAlert && (
        <NotificationManager message={'Your promo code has been added.'} alertType={1} />
        )}
        {informationAlert && (
          <NotificationManager message={'Your promo code has been removed.'} alertType={2} />
        )}
        {errorAlert && (
          <NotificationManager message={'This promo code is not valid.'} alertType={0} />
        )}
        
      </div> */}
      </div>
    </>
  );
}