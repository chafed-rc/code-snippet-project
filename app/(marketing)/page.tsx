import { Footer } from "./_components/footer";
import { Heading } from "./_components/heading";

const MarketingPage = () => {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-grow flex flex-col items-center justify-center md:justify-start text-center gap-y-8 px-6 pb-10">
          <Heading />
        </div>
        <Footer />
      </div>
    );
  };

export default MarketingPage;
