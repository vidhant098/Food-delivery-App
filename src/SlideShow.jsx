import React, { useEffect, useState } from 'react';

const images = [
  'https://media.gettyimages.com/id/1457889029/photo/group-of-food-with-high-content-of-dietary-fiber-arranged-side-by-side.jpg?s=612x612&w=gi&k=20&c=YiNatAP0CzFSalhnkzSUFyy6XpVhBe3WSnRpu1W3pV4=',
  'https://www.awesomecuisine.com/wp-content/uploads/2018/10/Methi-Idly-Fenugreek-Leaves-Idli.jpg',
  'https://www.summahealth.org/-/media/project/summahealth/website/page-content/flourish/2_18a_fl_fastfood_400x400.webp?la=en&h=400&w=400&hash=145DC0CF6234A159261389F18A36742',
  'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_900/COLLECTIONS/IMAGES/MERCH/2024/7/2/f14add80-0688-4ec5-b436-450e5207091b_pic',
];

const SlideShow = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[240px] w-full overflow-hidden sm:h-[300px] lg:h-full lg:min-h-[420px]">
      {images.map((img, index) => (
        <img
          key={img}
          src={img}
          alt={`Featured food ${index + 1}`}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 flex gap-2">
        {images.map((img, index) => (
          <span
            key={`${img}-dot`}
            className={`h-2 flex-1 rounded-full ${
              index === currentImage ? 'bg-white' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SlideShow;
