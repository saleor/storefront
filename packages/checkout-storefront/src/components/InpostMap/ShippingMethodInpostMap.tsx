import Script from "next/script";
import { useEffect } from "react";

export interface InpostEventData {
  name: String;
}
const geoToken =
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJkVzROZW9TeXk0OHpCOHg4emdZX2t5dFNiWHY3blZ0eFVGVFpzWV9TUFA4In0.eyJleHAiOjIwMDY1MTQzODMsImlhdCI6MTY5MTE1NDM4MywianRpIjoiZDNkOGMyMjEtNDA3Zi00NGQ3LWI5NDctNzQzMjkzN2UzZjkwIiwiaXNzIjoiaHR0cHM6Ly9zYW5kYm94LWxvZ2luLmlucG9zdC5wbC9hdXRoL3JlYWxtcy9leHRlcm5hbCIsInN1YiI6ImY6N2ZiZjQxYmEtYTEzZC00MGQzLTk1ZjYtOThhMmIxYmFlNjdiOlVMQjVNUi1LLW1JUE9JWV83cTYxSS1jOTl3ck9OVXpRTl9YS2tuQlBiZTgiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzaGlweCIsInNlc3Npb25fc3RhdGUiOiI5ODAxZjdjNS0yZWUyLTRlYjAtOThkNC1kMWY2NmQxYzQyZmUiLCJzY29wZSI6Im9wZW5pZCBhcGk6YXBpcG9pbnRzIiwic2lkIjoiOTgwMWY3YzUtMmVlMi00ZWIwLTk4ZDQtZDFmNjZkMWM0MmZlIiwiYWxsb3dlZF9yZWZlcnJlcnMiOiIiLCJ1dWlkIjoiMDYzY2RjMTYtZDIxOC00Njk5LWIyNzUtMGIxZGU1MmRjYmEyIn0.KoZwTXARL2WaxCrVm8SpVAQ7ocbB1wmP9lJmRD27Yx_1a0FHjhxhy77VEDoqRxloqL8cABvu9nCnJ90nckq09F2BO1_KHJvW_qVyfShjBNrXlJwrVCn7r4L1vt7aL36oKeZ3V8UUuwfroLqacYEqUEge7M7-jfZRWSqZ7bIgxgBqiZukv4to-C9jDPGw8NrtwXwbolMCQAL3v2b7oNVa4hiYmrTlyKT8guPPARjO6O4e2IeXiTDaP9gBV6_BhuPdhroejsI1IitQIEg5sxpPdHHYfkg_Rhu5c_ZxyWoyF3cgVas52Kh46ys7jrsjfI36t98Yoj_zDrBeWfffbRbZDQ";

export function ShippingMethodInpostMap({
  onInpostDataChange,
}: {
  onInpostDataChange: (data: InpostEventData | null) => void;
}) {
  const inpostDiv = `<inpost-geowidget onpoint="onpointselect" token='${geoToken}' language='pl' config='parcelcollect'></inpost-geowidget>
    `;

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
      <link
        href="https://sandbox-easy-geowidget-sdk.easypack24.net/inpost-geowidget.css"
        rel="stylesheet"
      />
      <Script
        src="https://sandbox-easy-geowidget-sdk.easypack24.net/inpost-geowidget.js"
        defer
        strategy="lazyOnload"
      />
      <div
        className="text-container w-full"
        style={{ height: "500px" }}
        dangerouslySetInnerHTML={{ __html: inpostDiv }}
      />
    </div>
  );
}

export default ShippingMethodInpostMap;
