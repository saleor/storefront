import Image, { StaticImageData } from "next/image";

interface AdvantagesBlockItemProps {
  title: string;
  text: string;
  image: StaticImageData;
}

export const AdvantagesBlockItem: React.FC<AdvantagesBlockItemProps> = ({ title, text, image }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 bg-white p-4 rounded-xl shadow-md w-16 h-16">
        <Image src={image} alt="" />
      </div>
      <h3 className="mb-2 font-semibold text-[24px] text-black">{title}</h3>
      <p className="text-[18px] font-medium text-[#4F4F4F]">{text}</p>
    </div>
  );
};
