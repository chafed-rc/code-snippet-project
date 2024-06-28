"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Ensure you have a Button component or use a standard HTML button
import { ArrowLeft } from "lucide-react"; // Assuming you use lucide-react for icons

const Custom404 = () => {
  const router = useRouter();

  const redirectToHome = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-8">
        Well, this is embarrassing
      </h2>
      <p className="text-lg mb-8">
        The page you are looking for does not exist.
      </p>
      <Button
        onClick={redirectToHome}
        className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded flex items-center"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Go back home
      </Button>
    </div>
  );
};

export default Custom404;
