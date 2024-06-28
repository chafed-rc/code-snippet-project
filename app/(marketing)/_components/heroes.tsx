import Image from "next/image"

export const Heroes = () => {
    return (
        <div className="flex flex-col items-center justify-center max-w-5xl">
            <div className="flex items-center space-x-16">
                <div className=" relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px md:h-[400px]">
                    <Image src="/code.svg" fill alt="documents" className=" object-contain"/>
                </div>
                <div className="relative h-[400px] w-[400px] hidden md:block">
                    <Image src="/source.svg" fill alt="documents" className=" object-contain"/>
                </div>
            </div>
        </div>
    )
}