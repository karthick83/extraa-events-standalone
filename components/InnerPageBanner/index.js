import React from 'react'

const InnerPageBanner = ({ img }) => {
  return (
  //  Video or GIF Content 
  //   <swiper-container navigation="true" pagination="true" >
  //   <swiper-slide>
  //   <div className="w-full px-5 md:px-0">
  //         <video
  //           autoPlay
  //           loop
  //           muted
  //           playsInline
  //           preload="auto"
  //           className="w-full object-cover p-5 rounded-lg"
  //           aria-label="Video banner"
  //         >
  //           <source src={img} type="video/mp4"  />
  //           Your browser does not support the video tag.
  //         </video>
  //       </div> 
  //   </swiper-slide>

  // </swiper-container>

  // Image Content 
  <swiper-container navigation="true" pagination="true" >
  <swiper-slide>
    <div className="w-full rounded-lg  ">
      <img src={img} alt='home banner' className='w-full object-cover' />
    </div>
  </swiper-slide>

</swiper-container>
)
                  
}

export default InnerPageBanner