import React from "react";

const Accordion: React.FC = () => {
  return (
    <div>
      <div className="accordion-section">
        <div className="w-[64.375rem] rounded-[6px] bg-white my-5 items-center py-5 px-10 h-min-[16.188rem] border border-gray-300">
          <div>
            <div className="flex justify-between">
              <div className="flex items-center gap-x-4">
                <h2 className="text-xl font-bold text-black">
                  Clinical History
                </h2>
              </div>
            </div>
            <div>
              <textarea
                placeholder="Write a note"
                className="bg-white p-4 outline-none border rounded-[6px] mt-6 border-gray-300 w-full h-[10rem]"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="accordion-section">
        <div className="w-[64.375rem] rounded-[6px] bg-white my-5 items-center py-5 px-10 h-min-[16.188rem] border border-gray-300">
          <div>
            <div className="flex justify-between">
              <div className="flex items-center gap-x-4">
                <h2 className="text-xl font-bold text-black">Technique</h2>
              </div>
            </div>
            <div>
              <textarea
                placeholder="Write a note"
                className="bg-white p-4 outline-none border rounded-[6px] mt-6 border-gray-300 w-full h-[10rem]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Accordion;
