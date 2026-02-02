import React, { useState } from "react";
import { strcmp } from "@/utils/utils";

interface ImageProps {
  output_image: string;
  fracture_flag: string;
}
interface Props {
  images: ImageProps[];
}

const ImageSlider: React.FC<Props> = ({ images }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className="flex flex-col gap-y-3">
      {images
        .filter((item) => strcmp(item.output_image) !== "failure")
        .map((item, index) => {
          return (
            <div
              className="relative w-full max-w-lg md:max-w-3xl h-[300px] md:h-[500px] rounded border border-purple-700 my-1 p-1 mx-auto lg:mx-0"
              key={index}
            >
              {!isLoaded && (
                <div className="absolute inset-0 bg-[#00000080] flex items-center  justify-center">
                  <span className="text-white font-bold text-sm">
                    ...loading, please wait
                  </span>
                </div>
              )}
              <img
                onLoad={() => setIsLoaded(true)}
                src={item.output_image}
                className="w-full h-[250px] md:h-full object-cover rounded"
                alt=""
              />
              <div className="mt-2 w-full text-right">
                <button className="w-full focus:outline-none text-white bg-purple-700 hover:bg-purple-800 font-bold rounded-lg text-xs md:text-sm px-4 py-1">
                  {item.fracture_flag}
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ImageSlider;
