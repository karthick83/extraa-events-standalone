"use client";
import React, { useEffect, useState } from "react";
import OrderSummary from "@/components/orderSummary";
import {
  SfButton,
  SfIconClose,
  SfIconDelete,
  SfLink,
  useDisclosure,
} from "@storefront-ui/react";
import cartImage from "../../public/assets/empty-cart.png";
import Image from "next/image";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/LoginModal";
import { useCart, WithSSR } from "@/components/Cart/cart";

const Cart = () => {
  const [loading, setLoading] = useState(true);
  const route = useRouter();

  const cart = WithSSR(useCart, (state) => state);
  // const cartItems = cart?.cartItems;

  // const [cartItems, setCartItems] = useState([]);
  const cartdata =
    typeof localStorage !== "undefined"
      ? JSON.parse(localStorage?.getItem("cart"))
      : null;
  const {
    isOpen: isModal,
    open: modalOpen,
    close: modalClose,
  } = useDisclosure({ initialValue: false });
  const token =
    typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    if (cartdata?.length > 0) {
      setCartItems(cartdata);
    }
    //console.log(cartItems);
  }, [token]);

  const handleIncreaseQuantity = (id, varId) => {
    const incProduct = cart?.cartItems?.find((e) => e?.productId === varId);

    incProduct?.quantity < 10 && cart?.addToCart({ productId: varId });
  };

  const handleDecreaseQuantity = (id, varId) => {
    cart?.decreaseItem(varId, 1);
  };

  const handleDeleteItem = (itemId, varId) => {
    cart?.removeFromCart(varId);
  };

  const subTotal = cart?.cartItems.reduce(
    (acc, item) =>
      acc +
      (item?.product_variants?.length > 0 ? item?.product_variants[0]?.sale_price : item?.price)
      * item?.quantity, 0);

  // console.log(subTotal, "SUBTOTAL")

  const fees = cart?.cartItems?.reduce(
    (acc, item) =>
      acc + item?.metadata?.fee && (item?.metadata?.feeType === 'FLAT' && (item?.metadata?.fee * item?.quantity) || ((item?.metadata?.fee / 100) * (item?.product_variants?.length > 0 && item?.product_variants[0]?.sale_price || 0) * item?.quantity)) || acc,
    0
  );

  // const fees = parseFloat(parseFloat(subTotal) * 0.05) || 0;
  const taxes = parseFloat(fees * 0.18) || 0;
  const totalSum = parseFloat(parseFloat(subTotal) + fees + taxes).toFixed(2) || 0;
  const roundAmt = Math.ceil(totalSum) - totalSum || 0;

  const onCheckOutClick = (e) => {
    e.preventDefault();
    localStorage.setItem(
      "totalPrice",
      JSON.stringify({ amount: totalSum, item: cart?.cartItems?.length })
    );
    if (token) {
      route.push("/checkout");
    } else {
      modalOpen();
    }
  };
  return (
    <>
      <div className="container mx-auto mt-8 ">
        {loading ? (
          <div className="flex justify-center items-center min-h-[80vh]"> <Loader /> </div>
        ) : (
          <>
            <div className="flex flex-row justify-between px-5">
              <h2 className="text-2xl font-bold mb-4  uc-sb text-MFC-black">Your Cart</h2>
              <p className="text-xl font-bold mb-4 uc-regular text-MFC-black">{cart?.cartItems?.length} items</p>
            </div>
            {cart?.cartItems.length > 0 &&
              <div className="flex flex-col items-center px-2 ">
                <div className="max-w-[800px] border-[0.2px] shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] border-MFC-gray rounded-lg w-full flex flex-col gap-4 p-4">
                  {Array.isArray(cart?.cartItems) &&
                    cart?.cartItems.map((item, index) => (
                      <>
                        <div className="flex flex-row items-center justify-between" key={index}>
                          <div className="flex flex-col md:flex-row items-center justify-between gap-4 ">
                            <div className="flex flex-col items-center justify-center align-middle ml-4 max-w-[150px]">
                              <img
                                src={Array.isArray(item.images) && item.images[0] || typeof item?.images === "string" && item?.images || item?.images?.small
                                }
                                alt={item?.name}
                                className="object-contain max-w-[100px] rounded-md aspect-video"
                              ></img>
                              <p className="flex-wrap py-2 uc-regular h-fit align-middle text-xs text-MFC-black lg:font-bold lg:text-base truncate max-w-[150px] ">
                                {(item?.brand || item?.brand_name) + " | " + item?.name}<br></br>
                                <span> {(item?.product_variants?.length > 0 && item?.product_variants[0]?.attributes?.Type && `Type - ${item?.product_variants[0]?.attributes?.Type}`
                                ) || item?.denomination && `Denomination - ₹${item?.denomination}` ||
                                  ""
                                }</span>
                              </p>
                            </div>
                            <div className="p-1 text-center w-24 ">
                              <div className="flex items-center justify-center">
                                <button
                                  className=" w-8 h-8 mr-2 rounded-full bg-extraa-purple-btn"
                                  onClick={() =>
                                    handleDecreaseQuantity(
                                      item.id,
                                      item?.productId
                                    )
                                  }
                                >
                                  <p className="text-Zoominfo-text-button">-</p>

                                </button>
                                <p className="uc-sb">
                                  {item?.quantity}
                                </p>
                                <button
                                  className=" w-8 h-8 ml-2 rounded-full bg-extraa-purple-btn"
                                  onClick={() =>
                                    handleIncreaseQuantity(
                                      item.id,
                                      item?.productId
                                    )
                                  }
                                >
                                  <p className="text-Zoominfo-text-button">+</p>
                                  
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="text-MFC-gray font-bold text-[10px] uc-regular">Cost</p>
                            <p className="uc-sb text-MFC-black text-sm"> ₹
                              {(item.product_variants?.length > 0 &&
                                item.product_variants[0]?.sale_price) ||
                                item.price ||
                                0}</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="text-MFC-gray text-[10px] font-bold uc-regular">Total</p>
                            <p className="uc-sb text-MFC-black text-sm">₹
                              {((item.product_variants?.length > 0 &&
                                item.product_variants[0]?.sale_price) ||
                                item?.price) * item?.quantity || 0}
                            </p>
                          </div>
                          <button
                            className="mr-4"
                            onClick={() =>
                              handleDeleteItem(item.id, item?.productId)
                            }
                          >
                            <img src={'./icons/delete_white.png'} className="" alt='delete' />
                          </button>
                        </div>
                        {cart?.cartItems?.length - 1 !== index && <div className="divider mr-3"></div>}
                      </>
                    ))}
                </div>
              </div>}
            {cart?.cartItems.length === 0 ? (
              <div className="flex justify-center ">
                <Image
                  src={cartImage}
                  alt="**No items in the carts"
                  className="w-[300px] h-[300px] justify-center"
                />
              </div>
            ) : (
              <div>

                <div className="flex justify-center mx-8">
                  <OrderSummary
                    saleAmt={subTotal || 0}
                    itemCount={cart?.cartItems.length}
                    type={0}
                    taxAmt={taxes}
                    DelvryAmt={fees}
                    roundamount={roundAmt}
                  />
                </div>
                <div>
                  <div className="flex justify-center my-6 mx-10">
                    <SfButton
                      size="lg"
                      className="w-[400px] bg-extraa-purple-btn "
                      onClick={onCheckOutClick}
                    >
                      <p className="text-Zoominfo-text-button">
                      Checkout
                      </p>
                    </SfButton>
                  </div>
                  <div className="typography-text-sm mt-4 text-center mb-8 text-MFC-gray">
                    By placing my order, you agree to our{" "}
                    <SfLink  href="/terms">Terms and Conditions</SfLink> and our{" "}
                    <SfLink href="/privacy">Privacy Policy.</SfLink>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div >
      <LoginModal
        openModal={modalOpen}
        closeModal={modalClose}
        isModal={isModal}
      />
    </>
  );
};

export default Cart;
