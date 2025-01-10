import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center min-h-screen flex-col space-y-5">
      <div className="relative w-40 h-40 bg-black rounded-full animate-pulse">
        <div className="relative w-40 h-40 bg-red-600 rounded-full animate-pulse">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex space-x-6">
              <div className="w-10 h-10 bg-gray-400 animate-pulse rounded-lg"></div>{" "}
              <div className="w-10 h-10 bg-gray-400 animate-pulse rounded-lg"></div>{" "}
            </div>
            <div className="flex flex-col items-center mt-5">
              <div className="w-14 h-10 bg-gray-400 animate-pulse rounded-b-full"></div>{" "}
            </div>
          </div>
        </div>
      </div>
      <div className="text-center text-xl text-red-600 font-bold animate-pulse mt-8">
        Loading...
      </div>
    </div>
  );
};

export default LoadingSpinner;
