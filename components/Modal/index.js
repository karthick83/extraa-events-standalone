import { SfButton, SfIconClose, SfModal, useDisclosure } from '@storefront-ui/react';
import React, { useId, useRef } from 'react'
import { CSSTransition } from 'react-transition-group';
import { SfIconCall, SfInput, SfSelect } from '@storefront-ui/react';

const ModalWrapper = ({formData,formSubmit,handleChange,isOpen,open,close}) => {
    const headingId = useId();
    const descriptionId = useId();
    const modalRef = useRef();
    const backdropRef = useRef();
    const states =  [
      "Andaman and Nicobar Islands",
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chandigarh",
      "Chhattisgarh",
      "Dadra and Nagar Haveli and Daman and Diu",
      "Delhi",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jammu and Kashmir",
      "Jharkhand",
      "Karnataka",
      "Kerala",
      "Ladakh",
      "Lakshadweep",
      "Madhya Pradesh",
      "Maharashtra",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Puducherry",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Telangana",
      "Tripura",
      "Uttar Pradesh",
      "Uttarakhand",
      "West Bengal"
    ];

  return (
    <>
        {/* Modal TriggerButton */}
      {/* <SfButton onClick={open} className='!text-extraa-blue !bg-[#FAB516] h-12 !text-lg !font-bold'>+ Add New Address</SfButton> */}

      {/* Backdrop */}
      <CSSTransition
        in={isOpen}
        nodeRef={backdropRef}
        timeout={200}
        unmountOnExit
        classNames={{
          enter: 'opacity-0',
          enterDone: 'opacity-100 transition duration-200 ease-out',
          exitActive: 'opacity-0 transition duration-200 ease-out',
        }}
      >
        <div ref={backdropRef} className="fixed inset-0 bg-neutral-700 bg-opacity-50" />
      </CSSTransition>

      {/* Modal */}
      <CSSTransition
        in={isOpen}
        nodeRef={modalRef}
        timeout={200}
        unmountOnExit
        classNames={{
          enter: 'translate-y-10 opacity-0',
          enterDone: 'translate-y-0 opacity-100 transition duration-200 ease-out',
          exitActive: 'translate-y-10 opacity-0 transition duration-200 ease-out',
        }}
        
      >
        <SfModal
          open
          onClose={close}
          ref={modalRef}
          as="section"
          role="alertdialog"
          aria-labelledby={headingId}
          aria-describedby={descriptionId}
          className="max-w-[90%] md:max-w-lg max-h-[90%] overflow-y-scroll"
        >
          <header>
            <SfButton square variant="tertiary" className="absolute right-2 top-2" onClick={close}>
              <SfIconClose />
            </SfButton>
            </header>
            {/* Content inside the Modal */}
            <div >
                    <form className="md:px-12 p-4 flex gap-4 flex-wrap text-neutral-900 bg-slate-100 pb-6"  onSubmit={(e)=>formSubmit(e)} onChange={handleChange} >
                      <h2 className="w-full text-xl mt-6 font-bold">Billing address</h2>
                      <label className="w-full md:w-auto flex-grow flex flex-col gap-0.5 mt-4 md:mt-0">
                        <span className="typography-text-sm font-medium">Full Name</span>
                        <SfInput name="name" autoComplete="name" required className='bg-transparent'  defaultValue={formData?.full_name}/>
                      </label>
                      <label className="w-full md:w-auto flex-grow flex flex-col gap-0.5">
                        <span className="typography-text-sm font-medium">Phone Number</span>
                        <SfInput slotPrefix={<SfIconCall />} name="phone" maxLength={10}  type="tel" className='bg-transparent' autoComplete="tel" required defaultValue={formData?.phone_number}/>
                      </label>


                      <div className="w-full  flex-grow flex flex-col gap-0.5">
                        <label>
                          <span className="typography-text-sm font-medium ">Address Line 1</span>
                          <SfInput
                            name="address_1"
                            autoComplete="address-line1"
                            className="mt-0.5 bg-transparent"
                            defaultValue={formData?.address_line_1||""}
                            required
                            

                          />
                        </label>
                        <div className="flex flex-col mt-0.5">

                          <small className="typography-hint-xs text-neutral-500 mt-0.5">Door no. & Street address</small>
                        </div>
                      </div>
                      <div className="w-full flex-grow flex flex-col gap-0.5">
                        <label>
                          <span className="typography-text-sm font-medium">Address Line 2</span>
                          <SfInput
                            name="address_2"
                            autoComplete="address-line2"
                            className="mt-0.5 bg-transparent"
                            defaultValue={formData?.address_line_2||""}
                          />
                        </label>
                        <div className="flex flex-col mt-0.5">

                          <small className="typography-hint-xs text-neutral-500 mt-0.5">Area & Locality</small>
                        </div>
                      </div>

                      <div className="w-full  flex-grow flex flex-col gap-0.5">
                        <label>
                          <span className="typography-text-sm font-medium">Landmark</span>
                          <SfInput
                            name="landmark"
                            autoComplete="landmark"
                            className="mt-0.5 bg-transparent"
                            defaultValue={formData?.landmark}
                          />
                        </label>
                        <div className="flex flex-col mt-0.5">

                          <small className="typography-hint-xs text-neutral-500 mt-0.5">Nearby landmark</small>
                        </div>
                      </div>

                      <div className="w-full  flex-grow flex flex-col gap-0.5">
                        <label className="w-full md:w-auto flex flex-col gap-0.5 flex-grow">
                          <span className="typography-text-sm font-medium">State</span>
                          <SfSelect name="state" placeholder="-- Select --"  defaultValue={formData?.state || "-- Select --"} autoComplete="address-level1" required >
                            {states.map((stateName) => (
                              <option key={stateName}>{stateName}</option>
                            ))}
                          </SfSelect>
                        </label>
                      </div>

                      <div className="w-full md:w-auto flex-grow flex flex-col gap-0.5">
                        <label className="w-full flex flex-col gap-0.5">
                          <span className="typography-text-sm font-medium">City</span>
                          <SfInput className='bg-transparent' name="city" autoComplete="address-level2" required defaultValue={formData?.city} />
                        </label>
                      </div>

                      <div className="w-full md:w-auto flex-grow flex flex-col gap-0.5">
                        <label className="w-full flex flex-col gap-0.5 md:w-[120px]">
                          <span className="typography-text-sm font-medium">ZIP Code</span>
                          <SfInput name="zipCode" className='bg-transparent' autoComplete="postal-code" required defaultValue={formData?.pincode} />
                        </label>
                      </div>
                      {/* <div className="w-full">
              <input defaultChecked={true} type="checkbox" id="saveAddr" name="saveAddr" value="saveAddress" />
              <label htmlFor="saveAddr"> Save this Address</label>
            </div> */}
                      <div className="w-full flex gap-4 mt-4">
                        <SfButton variant="primary" className="bg-extraa-purple-btn  w-48 " type="submit">
                          <p className='text-MFC-White'>Save</p>
                          
                        </SfButton>
                        <SfButton variant="primary" className="bg-red-700 text-white w-48 " onClick={close}>
                          Close
                        </SfButton>
                      </div>
                    </form>
                  </div>
            {/* Content inside the Modal */}
        </SfModal>
      </CSSTransition>
    </>
  )
}

export default ModalWrapper;