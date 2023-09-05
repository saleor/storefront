import { Loader } from "@/ui/atoms/Loader";

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Loader />
    </div>
  )
}