import { SfButton } from '@storefront-ui/react'
import dayjs from 'dayjs'
import React from 'react'

const Ticket = ({allTickets}) => {
  return (
    <>
        <div className=''>
          
            <h2 className='rota-bold text-4xl  text-[#3635A6] text-center p-4 md:p-10'> TICKETS</h2>
            <swiper-container navigation="true" grab-cursor="true" pagination="true"
              slides-per-view="1" breakpoints='{"1024": {"slidesPerView": 3}, "768" : {"slidesPerView": 2}}'
            // slides-per-view="auto"
            >
              {allTickets&&allTickets?.map(({ id, metadata, name, type, category, images, product_variants, }) =>

                // EVENT CARD ------------------------
                <swiper-slide key={id} >
                  <div className='flex justify-center'>
                    <div className="flex flex-col mb-12 md:mx-10  sm:mx-6 m-2.5 min-h-[400px] max-w-[320px] relative border border-neutral-200 rounded-md hover:shadow-xl p-2.5">

                      <a
                        className=""
                        href={`/tickets/${id}`}
                        aria-label={name}
                      >
                        <img src={images} alt={name || "event"} className="  object-contain  rounded-t-md  rounded-lg" />
                      </a>
                      <div className="flex flex-col items-start grow">
                        <p className="font-medium typography-text-base pt-4 pl-2">{dayjs(metadata?.eventStartDate)?.format('ddd, MMM D')}</p>
                        <p className="mt-1 mb-4 font-normal typography-text-base text-neutral-700 pl-2 pr-16 min-h-[48px]">{name}</p>

                        <div className='flex flex-row justify-center items-center w-full pb-5  inset-x-0 bottom-0'>
                          <SfButton size="sm" variant="tertiary" as="a" href={`/tickets/${id}`} className="relative mt-auto bg-indigo-700 text-white w-[173px] h-[34px] text-base font-semibold">

                            Tickets from ₹{product_variants?.length > 0 && product_variants[0]?.sale_price || ""}
                          </SfButton>
                        </div>


                      </div>
                    </div>
                  </div>
                </swiper-slide>
                // -----------------------------------
              )}
            </swiper-container>

          </div>
    </>
  )
}

export default Ticket