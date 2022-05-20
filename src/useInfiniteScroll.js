/* eslint-disable curly */
import { useEffect, useRef, useState } from 'react';

const defaultOptions = {
  root: null,
  threshold: 0.5,
};
const useInfiniteScroll = (
  fetchCallback,
  containerElement,

  options = defaultOptions
) => {
  const [isFetching, setIsFetching] = useState(false);
  const lastElementRef = useRef(null);
  const ioCallback = (entries, observer) => {
    entries.forEach((entry) => {
      console.log(entries);
      if (entry.isIntersecting) {
        setIsFetching(true);
      }
    });
    setIsFetching(false);
  };
  useEffect(() => {
    let io;
    if (containerElement) {
      console.log(containerElement);
      io = new IntersectionObserver(ioCallback, options);
      if (containerElement.lastElementChild !== lastElementRef.current) {
        lastElementRef.current = containerElement.lastElementChild;
        console.log(lastElementRef.current);
        if (lastElementRef.current) io.observe(lastElementRef.current);
      }
    }
    return () => io?.disconnect();
  });
  useEffect(() => {
    if (isFetching) fetchCallback();
  }, [isFetching]);
  return [isFetching, setIsFetching];
};
export default useInfiniteScroll;
