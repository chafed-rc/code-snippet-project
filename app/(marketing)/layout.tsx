import { Navbar } from "./_components/navbar";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="flex flex-col h-full bg-[#1F1F1F] min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20 md:pt-40">
          {children}
        </main>
      </div>
    );
  };

export default MarketingLayout;
