/* eslint-disable curly */
import { useEffect, useRef, useState } from 'react';

const defaultOptions = {
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
      if (entry.isIntersecting) {
        setIsFetching(true);
      }
    });
    setIsFetching(false);
  };
  useEffect(() => {
    let io;
    if (containerElement) {
      io = new IntersectionObserver(ioCallback, options);
      if (containerElement.lastElementChild !== lastElementRef.current) {
        lastElementRef.current = containerElement.lastElementChild;
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
