import { MessageCircle } from "lucide-react"
import Link from "next/link"

export function AuthLogo() {
    return (
        <Link href="/" className="inline-block">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-700">
                <MessageCircle className="h-5 w-5 text-white" />
            </div>
        </Link>
    )
}

