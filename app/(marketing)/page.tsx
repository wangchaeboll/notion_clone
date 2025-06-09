import Image from "next/image";
import Heading from "@/app/_component/Heading";
import Heroes from "@/app/_component/Heroes";
import Footer from "@/app/_component/Footer";


export default function MarketingPage() {
  return (
      <div className="min-h-full flex flex-col">
        <div className="flex flex-col items-center justify-center mt-4 md:justify-start text-center gap-y-8 flex-1">
          <Heading/><Heroes/>
        </div>
          <Footer/>
      </div>
  );
}
