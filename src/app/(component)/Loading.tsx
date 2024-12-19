import React from "react";
import Image from "next/image";

const Loader = () => {
    return (
        <div className="flex flex-col justify-center items-center bg-white opacity-80 w-full h-screen">
            <Image src="/svgs/loader.svg" alt="Loading" height={100} width={100} />
            <p className="mt-4 ml-2 text-white text-xl">Loading...</p>
        </div>
    );
};

export default Loader;