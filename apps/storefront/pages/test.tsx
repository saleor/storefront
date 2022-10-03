import { useRouter } from "next/router";

// eslint-disable-next-line react/display-name
export default () => {
  const r = useRouter();

  console.log(r.query);

  return <div>test</div>;
};
