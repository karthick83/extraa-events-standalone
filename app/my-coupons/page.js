"use client";
import GetAllIndustries from "@/queries/GetAllIndustries";
import GetAllCoupons from "@/queries/GetAllCoupons";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { useDraggable } from "react-use-draggable-scroll"
import { useRef } from "react";
import copyIcon from "../../public/icons/copy.png";
import Image from "next/image";
import copy from "copy-to-clipboard";
import moment from "moment/moment";
import NotificationManager from "@/components/NotificationManager";
import Loader from "@/components/loader";
export const adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic3VwZXJhZG1pbiIsImlhdCI6MTY5ODgxNTIyMiwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInN1cGVyYWRtaW4iLCJtZXJjaGFudCJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJzdXBlcmFkbWluIiwieC1oYXN1cmEtdXNlci1pZCI6IjEiLCJ4LWhhc3VyYS1tZXJjaGFudC1pZCI6IjEwNjAifX0._tQrdKxPCFszepLVKUjildzyv6hqLTYKuJHIOU3xHjw";
import { Fragment } from "react";
import { SfButton, SfIconChevronLeft, SfIconChevronRight, usePagination, SfModal, useDisclosure } from "@storefront-ui/react";
import classNames from 'classnames';
import CouponModal from "@/components/CouponModal";
import LoginModal from "@/components/LoginModal";
import { userToken } from "../page";
import CouponCard from "@/components/CouponCard";
import { user_token } from "../page";
import GetAllCoins from "@/queries/GetCoins";

function MyCoupons() {
  const [allCoupons, setAllCoupons] = useState();
  // console.log("allCoupons", allCoupons);
  const ref = useRef();
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  // const cSection = useRef();
  const { events } = useDraggable(ref);
  const { data } = useQuery(GetAllIndustries, { context: { headers: { Authorization: `Bearer ${adminToken}` } } });
  // console.log("data", data);
  const products = data?.industries;

  const { isOpen: isModal, open: modalOpen, close: modalClose } = useDisclosure({ initialValue: false });
  const { isOpen: loginIsOpen, open: loginOpen, close: loginClose } = useDisclosure({ initialValue: false });

  const couponsItems = useState()
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [selectedIndustries, SetSelectedIndustries] = useState([]);
  const { data: couponsData, loading } = useQuery(GetAllCoupons, {
    variables: { limit: limit, offset: offset, "_or": selectedIndustries.length > 0 ? selectedIndustries : {} },
    context: { headers: { Authorization: `Bearer ${token}` } }
  });

  const { data: coins } = useQuery(GetAllCoins, { context: { headers: { Authorization: `Bearer ${user_token}` } } })

  const gold_coins = coins?.coins?.filter((option) => option.name === 'extraa gold')?.[0];
  const silver_coins = coins?.coins?.filter((option) => option.name === 'extraa silver')?.[0];
  const blue_coins = coins?.coins?.filter((option) => option.name === 'extraa blue')?.[0];
  // console.log(coins, 'coins');
  // const coin_balance = coins?.coins?.length > 0 && coins?.coins[0]?.wallets?.length > 0 && coins?.coins[0]?.wallets[0]?.balance || 0
  // console.log("couponsData", couponsData);

  useEffect(() => {
    setAllCoupons(products)
  }, [products]);
  const filterByIndustry = (ind_id, event) => {
    let sind = selectedIndustries;
    if (event.target.checked) {
      sind.push({ "industry": { "_eq": ind_id } });
    } else {
      let index = sind.findIndex(item => item.industry._eq === ind_id);
      if (index > -1) {
        sind.splice(index, 1);
      }
    }
    SetSelectedIndustries([...sind]);
    // console.log("sind", sind);
  };

  const [copyCode, setCopyCode] = useState(false);
  const copyToCode = (e, codeCopy) => {
    e.stopPropagation();
    setCopyCode(true);
    copy(codeCopy)
    setTimeout(() => setCopyCode(false), 3000)
    // console.log("coupon.coupon_code", user_coupons.coupon.coupon_code);
  }

  const today = moment().format("MM/DD/YYYY");
  // const couponnew = moment(couponsData?.created_at).format("MM/DD/YYYY");

  const [currentPage, setCurrentPage] = useState(1);
  // console.log("currentPage", currentPage);
  const { totalPages, pages, selectedPage, startPage, endPage, next, prev, setPage, maxVisiblePages } = usePagination({
    totalItems: couponsData?.user_coupons_aggregate?.aggregate?.count,
    currentPage: currentPage,
    pageSize: 10,
    maxPages: 1,
  });

  const nextPageOnClick = (() => {
    next();
    setCurrentPage(currentPage + 1);
    setOffset(offset + 10);
  });

  const onClickBackPage = (() => {
    prev();
    setCurrentPage(currentPage - 1);
    setOffset(offset - 10)
  });

  const onClickSetPage = ((page) => {
    // console.log("page", (page - 1) * 10);
    setPage(page)
    setCurrentPage(page);
    setOffset((page - 1) * 10)
  });

  const [couponOpen, setCouponOpen] = useState(false)
  const [couponitems, setCouponItems] = useState()
  // console.log("couponitems1", couponitems);
  const handleCouponOpen = ((items) => {
    // console.log(items);
    if (items?.coupon?.expiry_date && moment(items?.coupon?.expiry_date).isAfter() && !items?.redeemed) {
      modalOpen()
      document.getElementById('my_modal_2').showModal()
      setCouponItems(items)
    }
  })
  useEffect(()=>{if(!userToken){loginOpen();}},[userToken])

  return (
    <>
    <div>
      <h3
        // ref={cSection}
        style={{
          marginBottom: 0,
          color: "#4F3084",
          textAlign: "center",
          fontSize: "1.4em",
          marginTop: 20,
        }}
      >
        Your Coins
      </h3>
      <div className="flex justify-center items-center mt-7 flex-wrap gap-2" >
        {gold_coins && gold_coins?.wallets[0]?.balance && gold_coins?.wallets[0]?.balance > 0 ?
          <div className="p-2 max-w-[150px] h-[130px] flex flex-col items-center w-52 border-[1px] border-[#F6AC00] justify-between rounded-xl gap-1">
            <img src={"https://storage.extraa.in/files/gold-coins-new.png"} alt="" className="h-[30px]" />
            <h3 className="uc-sb text-base text-[#1B1C1E]">{gold_coins?.name} coins</h3>
            <h2 className="text-[#C57600] uc-sb text-xl" >
              {gold_coins?.wallets[0]?.balance}
            </h2>
          </div>:null
        }
        {silver_coins && silver_coins?.wallets[0]?.balance && silver_coins?.wallets[0]?.balance > 0 ?
          <div className="p-2 max-w-[150px] h-[130px] flex flex-col items-center w-52 border-[1px] border-[#9C99FF] justify-between rounded-xl gap-1">
            <img src={"https://storage.extraa.in/files/silver-coins-new.png"} alt="" className="h-[36px]" />
            <h3 className="uc-sb text-base text-[#1B1C1E]">{silver_coins?.name} coins</h3>
            <h2 className="text-[#9C99FF] uc-sb text-xl" >
              {silver_coins?.wallets[0]?.balance}
            </h2>
          </div>:null
        }
        {blue_coins && blue_coins?.wallets[0]?.balance && blue_coins?.wallets[0]?.balance > 0 ?
          <div className="p-2 max-w-[150px] h-[130px] flex flex-col items-center w-52 border-[1px] border-[#6B21A8] justify-between rounded-xl gap-1">
            <img src={"https://storage.extraa.in/files/blue-coins-new.png"} alt="" className="h-[30px]" />
            <h3 className="uc-sb text-base text-[#1B1C1E]">{blue_coins?.name} coins</h3>
            <h2 className="text-[#6B21A8] uc-sb text-xl" >
              {blue_coins?.wallets[0]?.balance}
            </h2>
          </div>:null
        }
      </div>
      <h3
        // ref={cSection}
        style={{
          marginBottom: 0,
          color: "#4F3084",
          textAlign: "center",
          fontSize: "1.4em",
          marginTop: 20,
        }}
      >
        Your Coupons
      </h3>

      {/* <Stack alignItems="center"> */}
      <div style={{ maxWidth: 1000, paddingLeft: 24, width: "100vw" }}>
        <h4
          style={{
            marginBottom: 0,
            color: "#4F3084",
            textAlign: "left",
            fontSize: "1em",
          }}
        >
          Filter by industries:
        </h4>
      </div>
      {/* </Stack> */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{ width: "100%", maxWidth: 1000, position: "relative" }}
        >
          {/* <div
                    style={{
                    position: "absolute",
                    right: -24,
                    top: 24,
                    zIndex: 100,
                    }}
                >
                     <ChevronRight
                    sx={{ width: 40, height: 40, opacity: 0.7 }}
                    color="primary"
                    /> *
                </div> */}
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            maxWidth: 1000,
            overflowX: "scroll",
            paddingTop: 8,
            paddingBottom: 8,
            // justifyContent: "center",
            alignItems: "flex-start"
          }}
          className="filter-scroll"
          {...events}
          ref={ref}
        >
          {allCoupons?.map((ind) => (
            <div key={ind.id} style={{
              // padding: "10px",
              width: "240px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              lineHeight: "15px"
            }}>
              <input
                type="checkbox"
                id={"inudstry" + ind.id}
                onClick={(event) => filterByIndustry(ind.id, event)}
              />
              <label htmlFor={"inudstry" + ind.id}>
                <img
                  style={{
                    width: 48,
                    height: 48,
                    marginRight: 12,
                    marginLeft: 12,
                    marginBottom: 12
                  }}
                  src={ind.logo}
                  alt=""
                />
              </label>
              <p
                style={{
                  textAlign: "center",
                  margin: 0,
                  fontSize: "0.6em",
                  textTransform: "capitalize",
                  paddingRight: 8,
                  paddingLeft: 8,
                  width: 100
                }}
              >
                {ind.name.toLowerCase().replace("and", "&")}
              </p>
            </div>
          ))}
        </div>
      </div>
      {loading ?
        <div className="flex justify-center items-center h-[80vh]">
          <Loader />
        </div> :
        <>
          {/*---------------------------- Coupons card ------------------------------------ */}

          {/* <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <div>
              <div class="infinite-scroll-component__outerdiv">
                <div class="infinite-scroll-component__outerdiv" style={{ height: "auto", overflow: "auto" }}>
                  <div style={{
                    transform: "none",
                    transition: "transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
                    display: "flex",
                    flexFlow: "column wrap",
                    marginTop: "32px",
                    marginBottom: "64px",
                    justifyContent: "center",
                    maxWidth: "1200px",
                    flexDirection: "row"
                  }}
                  >
                   

                      <div key={couponsItems.id} style={{ display: "flex", margin: "10px", width: "320px" }} >
                        <div style={{
                          backgroundColor:
                            couponsItems.coupon.expiry_date && moment(couponsItems.coupon.expiry_date).isAfter() && !couponsItems.redeemed
                              ? couponsItems.coupon.color : "grey", color: "white",
                          padding: "10px", width: "110px", display: "flex", flexDirection: "column", alignItems: "center", borderRadius: "25px 0 0 25px"
                        }} >
                          <div style={{
                            width: "80px",
                            padding: "5px",
                            borderRadius: "10px",
                            height: "80px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "white"
                          }}>
                            <img src={couponsItems.coupon.brand_logo} />
                          </div>
                          <p style={{
                            fontSize: "7px",
                            color: "white",
                            textAlign: "center",
                            margin: "8px 0",
                          }} className="font-semibold">{couponsItems.coupon.industry_name}</p>

                          <button style={{
                            backgroundColor: "white",
                            fontSize: "6px",
                            padding: "4px",
                            borderRadius: "10px",
                            color: "#000",
                            fontWeight: 900
                          }}>{couponsItems.coupon.coupon_code} </button>
                          {!copyCode ?
                            <div>
                              <Image src={copyIcon} alt="copy" className="w-5 h-5 mt-3" onClick={(e) => copyToCode(e, couponsItems.coupon.coupon_code)}
                              />
                            </div>
                            :
                            <NotificationManager message={"Copied To Clipboard"} alertType={1} />
                          }
                        </div>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor:
                            couponsItems.coupon.expiry_date && moment(couponsItems.coupon.expiry_date).isAfter() && !couponsItems.redeemed
                              ? "#FFFFBA" : "#EEEEEE",
                          padding: "10px",
                          width: "210px",
                          borderRadius: "0px 25px 25px 0px"
                        }}>
                          <div>
                            <div style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center"
                            }}>
                              <p style={{ fontSize: "12px" }}>{couponsItems.coupon.brand_name}</p>
                              {today === moment(couponsItems?.created_at).format("MM/DD/YYYY") && <snap style={{ color: "white", backgroundColor: "red", fontSize: "12px", padding: "2px 5px", borderRadius: "5px" }}>New</snap>}
                            </div>
                            <p style={{ fontSize: "12px", fontWeight: "bold" }}>{couponsItems.coupon.offer_title}</p>
                            <p style={{ fontSize: "11px" }}>{couponsItems.coupon.offer_subtitle && couponsItems.coupon.offer_subtitle.length > 24 ?
                              `${couponsItems.coupon.offer_subtitle.substring(0, 18)}...` : couponsItems.coupon.offer_subtitle}</p>
                            <p style={{ marginTop: 8, fontSize: "0.8em" }} className="my-2">
                              {couponsItems.coupon.expiry_date && moment(couponsItems.coupon.expiry_date).isAfter() && !couponsItems.redeemed ? (
                                <snap style={{ fontSize: "0.9em", fontFamily: "rota-black" }}>
                                  valid till: {moment(couponsItems.coupon.expiry_date).format("YYYY-MM-DD")}
                                </snap>
                              ) : (couponsItems.redeemed
                                ?
                                <span style={{ background: "green", padding: 8, color: "white" }}>
                                  {" "}
                                  Redeemed
                                </span>
                                :
                                <span style={{ background: "red", padding: 8, color: "white" }}>
                                  {" "}
                                  Expired
                                </span>
                              )}
                            </p>
                            <hr />
                            <div className="flex flex-row">
                              <p style={{ fontSize: "11px", marginTop: "8px", color: "#4F3084" }} className="font-semibold">Powered by</p>
                              <img src="https://mates.extraa.in/assets/extraa_logo.png" className="h-4 mt-2 ml-2" />
                            </div>
                            <p style={{ fontSize: "9px", marginTop: "8px", color: "#4F3084" }} className="font-bold text-center">www.extraa.in</p>
                          </div>
                          <div>
                            <SfIconChevronRight />
                          </div>
                        </div>

                      </div>

                    ))
                      :(userToken&&couponsData?.user_coupons?.length <= 0 &&
                      <div style={{ fontSize: "20px", fontWeight: "bold", color: "red" }}>No coupons </div>)
                    }
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          <div style={{
            transform: "none",
            transition: "transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
            display: "flex",
            flexFlow: "column wrap",
            marginTop: "32px",
            marginBottom: "64px",
            justifyContent: "center",
            flexDirection: "row",
            gap: 20
          }}
          >
            {couponsData?.user_coupons?.length > 0 ? couponsData?.user_coupons.map((couponsItems) => (
              <div key={couponsItems?.id}>
                <CouponCard couponsItems={couponsItems} handleClick={handleCouponOpen} />
              </div>
            )) :
              <div style={{ fontSize: "20px", fontWeight: "bold", color: "red" }}>No coupons </div>
            }
          </div>
          {
            <div className="z-0 relative">
              <CouponModal openModel={modalOpen} closeModel={modalClose} isModal={isModal} couponId={couponitems} />
            </div>}

          {/*------------------- pagination ----------------------- */}

          <nav
            className="flex justify-between items-end border-t border-neutral-200"
            role="navigation"
            aria-label="pagination"
          >
            <SfButton
              size="lg"
              className="gap-3 !px-3 sm:px-6"
              aria-label="Go to previous page"
              disabled={selectedPage <= 1}
              variant="tertiary"
              slotPrefix={<SfIconChevronLeft />}
              onClick={() => onClickBackPage()}
            >
              <span className="hidden sm:inline-flex">Previous</span>
            </SfButton>
            <ul className="flex justify-center">
              {!pages.includes(1) && (
                <li>
                  <div
                    className={classNames('flex pt-1 border-t-4 border-transparent', {
                      'font-medium border-t-4 !border-primary-700': selectedPage === 1,
                    })}
                  >
                    <button
                      type="button"
                      className="min-w-[38px] px-3 sm:px-4 py-3 rounded-md text-neutral-500 md:w-12 hover:bg-primary-100 hover:text-primary-800 active:bg-primary-200 active:text-primary-900"
                      aria-current={selectedPage === 1}
                      onClick={() => onClickSetPage(1)}
                    >
                      1
                    </button>
                  </div>
                </li>
              )}
              {startPage > 2 && (
                <li>
                  <div className="flex border-t-4 border-transparent">
                    <button
                      type="button"
                      disabled
                      aria-hidden="true"
                      className="px-3 sm:px-4 py-3 rounded-md text-neutral-500 md:w-12 hover:bg-primary-100 hover:text-primary-800 active:bg-primary-200 active:text-primary-900 "
                    >
                      ...
                    </button>
                  </div>
                </li>
              )}
              {pages.map((page) => (
                <Fragment key={page}>
                  {maxVisiblePages === 1 && selectedPage === totalPages && (
                    <li>
                      <div className="flex pt-1 border-t-4 border-transparent">
                        <button
                          type="button"
                          className="min-w-[38px] px-3 sm:px-4 py-3 rounded-md text-neutral-500 md:w-12 
                              hover:bg-primary-100 hover:text-primary-800 active:bg-primary-200 active:text-primary-900 "
                          aria-current={endPage - 1 === selectedPage}
                          onClick={() => onClickSetPage(endPage - 1)}
                        >
                          {endPage - 1}
                        </button>
                      </div>
                    </li>
                  )}
                  <li>
                    <div
                      className={classNames('flex pt-1 border-t-4 border-transparent', {
                        'font-medium border-t-4 !border-primary-700': selectedPage === page,
                      })}
                    >
                      <button
                        type="button"
                        className={classNames(
                          'min-w-[38px] px-3 sm:px-4 py-3 text-neutral-500 md:w-12 rounded-md hover:bg-primary-100 hover:text-primary-800 active:bg-primary-200 active:text-primary-900',
                          { '!text-neutral-900 hover:!text-primary-800 active:!text-primary-900': selectedPage === page },
                        )}
                        aria-label={`Page ${page} of ${totalPages}`}
                        aria-current={selectedPage === page}
                        onClick={() => onClickSetPage(page)}
                      >
                        {page}
                      </button>
                    </div>
                  </li>
                  {maxVisiblePages === 1 && selectedPage === 1 && (
                    <li>
                      <div className="flex pt-1 border-t-4 border-transparent">
                        <button
                          type="button"
                          className="min-w-[38px] px-3 sm:px-4 py-3 rounded-md text-neutral-500 md:w-12 
                                        hover:bg-primary-100 hover:text-primary-800 active:bg-primary-200 active:text-primary-900 "
                          aria-current={selectedPage === 1}
                          onClick={() => onClickSetPage(2)}
                        >
                          2
                        </button>
                      </div>
                    </li>
                  )}
                </Fragment>
              ))}
              {endPage < totalPages - 1 && (
                <li>
                  <div className="flex pt-1 border-t-4 border-transparent">
                    <button
                      type="button"
                      disabled
                      aria-hidden="true"
                      className="px-3 sm:px-4 py-3 rounded-md text-neutral-500 "
                    >
                      ...
                    </button>
                  </div>
                </li>
              )}
              {!pages.includes(totalPages) && (
                <li>
                  <div
                    className={classNames('flex pt-1 border-t-4 border-transparent', {
                      'font-medium border-t-4 !border-primary-700': selectedPage === totalPages,
                    })}
                  >
                    <button
                      type="button"
                      className="min-w-[38px] px-3 sm:px-4 py-3 rounded-md text-neutral-500 md:w-12 
                                    hover:bg-primary-100 hover:text-primary-800 active:bg-primary-200 active:text-primary-900 "
                      aria-current={totalPages === selectedPage}
                      onClick={() => setPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </div>
                </li>
              )}
            </ul>
            <SfButton
              size="lg"
              aria-label="Go to next page"
              disabled={selectedPage >= totalPages}
              variant="tertiary"
              slotSuffix={<SfIconChevronRight />}
              className="gap-3 !px-3 sm:px-6"
              onClick={() => nextPageOnClick()}
            >
              <span className="hidden sm:inline-flex">Next</span>
            </SfButton>
          </nav>
        </>
      }
    </div>
    <LoginModal
    openModal={loginOpen}
    closeModal={loginClose}
    isModal={loginIsOpen}
    />
    </>
  )
}

export default MyCoupons