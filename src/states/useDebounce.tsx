import { useState, useEffect } from "react";

function useDebounce(func: Function, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState<any>(null);
  
    useEffect(() => {
      // if (debouncedValue !== null) {
      //   console.log("Triggering debounced function with value:", debouncedValue);
      // }
      const handler = setTimeout(() => {
        if (debouncedValue !== null) {
          func(debouncedValue);
        }
      }, delay);
  
      return () => {
        clearTimeout(handler);
      };
    }, [debouncedValue, delay]);
  
    return (value: any) => {
      // console.log("Updating debounced value to:", value);
      setDebouncedValue(value);
    };
  }


export default useDebounce;