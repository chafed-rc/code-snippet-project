import { Metadata } from "next"



export const metadata: Metadata= {
    title: 'Codebase | Preview'
}

const PublicLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className="min-h-scree bg-[#1f1f1f]">
            {children}
        </div>
    )
}

export default PublicLayout;