import { STOREFRONT_NAME } from "@/lib/const";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { socialMediaLinks } from "@/lib/brandingConstants";
import Link from "next/link";

export const UnderConstruction = () => {
  return (
    <div className="flex flex-col items-center overflow-y-hidden bg-cover bg-no-repeat bg-center relative justify-center bg-under-construction-pattern min-h-screen">
      <main className="text-center flex flex-col gap-6 justify-center items-center">
        <h1 className="text-[36px] text-white flex flex-col items-center text-center font-family-Bittermilk">
          Sklep aktualnie przechodzi<span className="text-[#84d9d8]">prace serwisowe</span>
        </h1>
        <p className="text-white text-[18px] mt-[22px] text-center font-family-Bittermilk line-height-50px w-[750px]">
          Chcielibyśmy Was poinformować, że nasza strona jest obecnie w trakcie prac serwisowych,
          aby dostarczyć Wam jeszcze lepsze doświadczenie. Przepraszamy za wszelkie niedogodności,
          jakie może to spowodować. Wracamy do Was za kilka chwil.
        </p>
        <span className="text-white font-family-Bittermilk text-[18px] line-height-35px mt-[16px]">
          Pozdrawiamy - zespół {STOREFRONT_NAME}
        </span>
      </main>
      <div className="absolute left-0 bottom-[52px]" style={{ bottom: "52px" }}>
        <div
          className="bg-[#84d9d8] py-[12px] px-[36px] text-[#104f5c] font-family-Archivo-bold font-weight-bold"
          style={{ borderRadius: "0 45px 45px 0" }}
        >
          Znajdziesz nas na:
        </div>
        <div className="flex items-center gap-6 ml-8 mt-3">
          <Link href={socialMediaLinks.facebook} target="_blank">
            <FontAwesomeIcon icon={faFacebook} size="2xl" style={{ color: "#fff" }} />{" "}
          </Link>
          <Link href={socialMediaLinks.instagram} target="_blank">
            <FontAwesomeIcon icon={faInstagram} size="2xl" style={{ color: "#fff" }} />
          </Link>
        </div>
      </div>
    </div>
  );
};
