import { debounce } from "lodash-es";
import { useEffect, useMemo, useState } from "react";

// once we add custom heights etc. we'll need to calculate
// this from rendered elements
const ITEM_HEIGHT = 104;
const MARGINS_HEIGHT = 456;

const LG_BREAKPOINT = 1024;

interface UseSummaryHeightCalc {
  linesCount: number;
  onBreakpointChange: (breakpoint: "lg" | "md") => void;
}

export const useSummaryHeightCalc = ({ linesCount, onBreakpointChange }: UseSummaryHeightCalc) => {
  const [maxSummaryHeight, setMaxSummaryHeight] = useState<number>(0);

  useEffect(() => {
    const handleWindowResize = () => {
      const isLg = window.innerWidth > LG_BREAKPOINT;

      debounce(() => {
        onBreakpointChange(isLg ? "lg" : "md");
      }, 500)();

      const maxHeight = isLg
        ? // function based on on the best result visually
          // rather than mathematically
          0.97 * window.innerHeight - MARGINS_HEIGHT
        : linesCount * ITEM_HEIGHT;

      // always set at least one line item height
      setMaxSummaryHeight(Math.max(ITEM_HEIGHT, maxHeight));
    };

    window.addEventListener("resize", handleWindowResize, { passive: true });
    handleWindowResize();

    return () => window.removeEventListener("resize", handleWindowResize);
  }, [linesCount, onBreakpointChange]);

  const allItemsHeight = useMemo(() => linesCount * ITEM_HEIGHT, [linesCount]);

  return useMemo(
    () => ({
      maxSummaryHeight,
      allItemsHeight,
    }),
    [allItemsHeight, maxSummaryHeight]
  );
};
