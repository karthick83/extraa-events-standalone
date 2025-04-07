const CardsEvent = () => {
  const cards = [
    {
      Image: "assets/eventsimages/Chennai_party.jpg",
      title: "Event Name",
      Date: "23 januray 2025 | 07:00pm | chennai",
      location: "venue :",
      Venue: "Lorem ipsum dolor sit amet asas",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos harum explicabo ab excepturi deserunt corrupti perspiciatis, fugit est nostrum voluptas.",
    },
    {
      Image: "assets/eventsimages/dj.jpg",
      title: "Event Name",
      Date: "23 januray 2025 | 07:00pm | chennai",
      location: "venue :",
      Venue: "Lorem ipsum dolor sit ",
      description:
        "Amet consectetur adipisicing elit. Quos harum explicabo ab excepturi deserunt corrupti perspiciatis, fugit est nostrum voluptas.",
    },
    {
      Image: "assets/eventsimages/kicks.jpg",
      title: "Event Name",
      Date: "23 januray 2025 | 07:00pm | chennai",
      location: "venue :",
      Venue: "Lorem ipsum dolor sit voluptas.",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos harum explicabo ab excepturi deserunt corrupti perspiciatis, fugit est nostrum voluptas.",
    },
    {
      Image: "assets/eventsimages/Chennai_party.jpg",
      title: "Event Name",
      Date: "23 januray 2025 | 07:00pm | chennai",
      location: "venue :",
      Venue: "Lorem ipsum dolor.",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos harum explicabo ab excepturi deserunt corrupti perspiciatis, fugit est nostrum voluptas.",
    },
    {
      Image: "assets/eventsimages/dj.jpg",
      title: "Event Name",
      Date: "23 januray 2025 | 07:00pm | chennai",
      location: "venue :",
      Venue: "Lorem ipsum dolor sit amet consectetur",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos harum explicabo ab excepturi deserunt corrupti perspiciatis, fugit est nostrum voluptas.",
    },
    {
      Image: "assets/eventsimages/Nit_party.jpeg",
      title: "Event Name",
      Date: "23 januray 2025 | 07:00pm | chennai",
      location: "venue :",
      Venue: "ipsum dolor sit amet",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos harum explicabo ab excepturi deserunt corrupti perspiciatis, fugit est nostrum voluptas.",
    },
  ];

  //   const cards1 = [
  //     {
  //       Image: "src/assets/monkeybar.jpg",
  //       title: "Event Name",
  //       Date: "23 januray 2025 | 07:00pm | chennai",
  //       location: "venue :",
  //       Venue:
  //         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos harum explicabo ab excepturi deserunt corrupti perspiciatis, fugit est nostrum voluptas.",
  //     },
  //     {
  //       Image: "src/assets/clubNighty.jpg",
  //       title: "Event Name",
  //       Date: "23 januray 2025 | 07:00pm | chennai",
  //       location: "venue :",
  //       Venue:
  //         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos harum explicabo ab excepturi deserunt corrupti perspiciatis, fugit est nostrum voluptas.",
  //     },
  //     {
  //       Image: "src/assets/monkeybar.jpg",
  //       title: "Event Name",
  //       Date: "23 januray 2025 | 07:00pm | chennai",
  //       location: "venue :",
  //       Venue:
  //         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos harum explicabo ab excepturi deserunt corrupti perspiciatis, fugit est nostrum voluptas.",
  //     },
  //     {
  //       Image: "src/assets/empty.jpg",
  //       title: "Event Name",
  //       Date: "23 januray 2025 | 07:00pm | chennai",
  //       location: "venue :",
  //       Venue:
  //         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos harum explicabo ab excepturi deserunt corrupti perspiciatis, fugit est nostrum voluptas.",
  //     },
  //     {
  //       Image: "src/assets/monkeybar.jpg",
  //       title: "Event Name",
  //       Date: "23 januray 2025 | 07:00pm | chennai",
  //       location: "venue :",
  //       Venue:
  //         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos harum explicabo ab excepturi deserunt corrupti perspiciatis, fugit est nostrum voluptas.",
  //     },
  //     {
  //       Image: "src/assets/clubNighty.jpg",
  //       title: "Event Name",
  //       Date: "23 januray 2025 | 07:00pm | chennai",
  //       location: "venue :",
  //       Venue:
  //         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos harum explicabo ab excepturi deserunt corrupti perspiciatis, fugit est nostrum voluptas.",
  //     },
  //   ];
  const cat = [
    {
      image: "assets/eventsimages/monkeylogo.jpeg",
      para: "lorem ipsum",
    },
    {
      image: "assets/eventsimages/lion.png",
      para: "lorem ipsum",
    },
    {
      image: "/assets/eventsimages/djblack.jpeg",
      para: "lorem ipsum",
    },
    {
      image: "assets/eventsimages/faceclub.jpeg",
      para: "lorem ipsum",
    },
    {
      image: "assets/eventsimages/lion.png",
      para: "lorem ipsum",
    },
    {
      image: "assets/eventsimages/monkeylogo.jpeg",
      para: "lorem ipsum",
    },
    // {
    //   image: "assets/eventsimages/monkeylogo.jpeg",
    //   para: "lorem ipsum",
    // },{
    //   image: "assets/eventsimages/monkeylogo.jpeg",
    //   para: "lorem ipsum",
    // },
  ];
  return (
    <div>
      {/* <div className="w-full space-y-3">
        <img src="src/assets/extraa-logo.png" className="w-28 h-14 ml-8 mt-4" />
        <img src="src/assets/deals.png" className="ml-24" />
      </div> */}
      <div className="mt-6  ml-8 lg:w-full">
        <div className="text-2xl mb-8 font-bold">Categories</div>
        <div className="flex overflow-x-auto w-full md:space-x-32">
          {cat.map((cat, index) => (
            <div key={index} className="flex flex-col ">
              <div className="w-16 h-16">
                <img
                  src={cat.image}
                  className="rounded-full shadow-md justify-item-center"
                  alt={cat.image}
                />
              </div>
              <div>
                <p>{cat.para}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="mt-6 ml-9 space-y-3">
          <h1 className="text-2xl font-bold">Upcomming Events</h1>
          {/* <div className="space-x-4 ml-3" >
                        <a href="" className="hover:text-amber-700">All</a>
                        <a href="" className="hover:text-amber-700">This week</a>
                        <a href="" className="hover:text-amber-700">This Weekend</a>
                        <a href="" className="hover:text-amber-700">Next Week</a>
                        <a href="" className="hover:text-amber-700">Next Weekend</a>
                        <a href="" className="hover:text-amber-700">Next Month</a>
                    </div> */}
        </div>
        <hr className="mr-4 mt-2 ml-6" />
        {/* <div className="flex space-x-4 pt-3 pb-3 pl-2 ml-3 rounded-2xl border border-amber-800">
                    <div className="w-60 border border-e-red-700 rounded-2xl p-2">
                    <div >
                        <img className="rounded-2xl" src="src/assets/Chennai_party.jpg" alt="" />
                    </div>
                    <h1 className="text-2xl font-bold ">Event Name</h1>
                    <p>23 januray 2025 | 07:00pm | chennai</p>
                    <p>venue:</p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos harum explicabo ab excepturi deserunt corrupti perspiciatis, fugit est nostrum voluptas.</p>
                    <button className="">Book Tickets</button>
                    </div>
                    <div className="w-80">
                        <img src="src/assets/Chennai_party.jpg" className="rounded-2xl"  alt="" />
                    </div>
                </div> */}
        <div className="bg-extraa-black-light text-extraa-white-primary lg:grid lg:grid-cols-3 lg:grid-rows-2 sm:flex sm:flex-wrap w-full p-[50px]  md:w-full ">
          {cards.map((cards, index) => (
            <div key={index} className="border rounded-md m-2 shadow-md hover:scale-90 transition-transform">
                <div className="rounded m-2 p-6">
                  <img
                    src={cards.Image}
                    className="rounded shadow-md h-[222px] w-[389px] object-cover"
                    alt={cards.Image}
                  />
                </div>
                <div className="m-5 ml-7 flex flex-col">
                  <p className="text-2xl font-bold ">{cards.title}</p>
                  <p className="mt-2">{cards.Date}</p>
                  <hr className="mr-4 mt-2" />
                  <div className="mt-3">
                    <div className="flex flex-row space-x-3">
                      <p className="w-46 text-sm">{cards.location}</p>
                      <br />
                      <p className="text-sm">
                        {cards.Venue.length > 25
                          ? `${cards.Venue.slice(0, 25)}...`
                          : cards.Venue}
                      </p>
                    </div>
                    <p className="text-sm">
                      {/* {cards.description} */}
                      {cards.description.length > 20
                        ? `${cards.description.slice(0, 50)}...`
                        : cards.description}
                    </p>
                  </div>
                  <button className="bg-red-400 hover:bg-red-500 text-white px-2 py-2 rounded mt-4 mb-2">
                    Book Ticket
                  </button>
                </div>
            </div>
          ))}
        </div>
        {/* <div className="bg-gray-100 text-extraa-white-primary flex overflow-x-auto w-full p-[20px] " >
                    {cards1.map((cards1, index) => (<div key={index} className="border rounded-md m-2 shadow-md" >
                        <div className="rounded m-2 p-6">
                            <img src={cards1.Image} className="rounded shadow-md h-[222px] w-[389px]" alt={cards.Image} />
                        </div>
                        <div className="ml-8 ">
                            <p className="text-2xl font-bold">{cards1.title}</p>
                            <p className=" w-96">{cards1.Date}</p>
                            <hr />
                            <p>{cards1.location}</p>
                            <p>{cards1.Venue}</p>
                            <button className="bg-green-200 hover:bg-green-500 text-black px-4 py-2 rounded m-2">Show Photo</button>
                        </div>
                    </div>))}
                </div> */}
      </div>
    </div>
  );
};

export default CardsEvent;
