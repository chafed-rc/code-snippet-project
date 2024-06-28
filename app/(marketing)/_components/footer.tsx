import { Button } from "@/components/ui/button"

export const Footer = () => {
    return (
        <div className="flex items-center w-full p-6 bg-[#1F1F1F] z-50">
            <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">
                <Button variant='ghost' size={'sm'}>
                    Privacy Policy
                </Button>
                <Button variant='ghost' size={'sm'}>
                    Terms and Conditions
                </Button>
            </div>
        </div>
    )
}