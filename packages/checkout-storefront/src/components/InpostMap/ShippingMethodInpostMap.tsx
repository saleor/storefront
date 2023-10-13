import Script from "next/script";
import { useEffect } from "react";
import { sanitize } from "isomorphic-dompurify";

export interface InpostEventData {
  name: string;
}

const geoToken = process.env.NEXT_PUBLIC_INPOST_WIDGET_GEOTOKEN || "";
const widgetUrl = process.env.NEXT_PUBLIC_INPOST_WIDGET_URL || "";

export function ShippingMethodInpostMap({
  onInpostDataChange,
}: {
  onInpostDataChange: (data: InpostEventData | null) => void;
}) {
  const inpostDiv = `<inpost-geowidget onpoint="onpointselect" token='${geoToken}' language='pl' config='parcelcollect'></inpost-geowidget>`;

  const sanitizedInpostDiv = sanitize(inpostDiv, {
    ALLOWED_TAGS: ["inpost-geowidget"],
    ALLOWED_ATTR: ["onpoint", "token", "language", "config"],
  });

  useEffect(() => {
    const handlePointSelect = (event: Event) => {
      const customEvent = event as CustomEvent;
      onInpostDataChange(customEvent.detail);
    };
    document.addEventListener("onpointselect", handlePointSelect);

    return () => {
      document.removeEventListener("onpointselect", handlePointSelect);
    };
  }, [onInpostDataChange]);

  return (
    <div>
      <link href={widgetUrl + ".css"} rel="stylesheet" />
      <Script src={widgetUrl + ".js"} defer strategy="lazyOnload" />
      <div
        className="text-container w-full"
        style={{ height: "550px" }}
        dangerouslySetInnerHTML={{ __html: sanitizedInpostDiv }}
      />
    </div>
  );
}

export default ShippingMethodInpostMap;
