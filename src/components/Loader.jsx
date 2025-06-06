import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-800" />
      <p className="text-lg font-medium text-black animate-pulse">
        Cultivando resultados... 🍐
      </p>
    </div>
  );
};

export default Loader;
