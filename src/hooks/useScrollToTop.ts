import { useEffect } from 'react';

/**
 * Custom hook that scrolls to the top of the page when the component mounts
 * Use this in all page components to ensure they start at the top when navigated to
 */
export const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
};

export default useScrollToTop;
