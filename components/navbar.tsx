import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="border-b border-gray-800 bg-black">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center">
          <img
  src="/harness-logo.svg"
  alt="Harness logo"
  width={50}
  height={50}
  className="text-blue-500"
/>
            <span className="ml-2 text-xl font-semibold">harness</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="#" className="text-sm hover:text-blue-400">
              Product
            </Link>
            <Link href="#" className="text-sm hover:text-blue-400">
              Customers
            </Link>
            <Link href="#" className="text-sm hover:text-blue-400">
              Open Source
            </Link>
            <Link href="#" className="text-sm hover:text-blue-400">
              Pricing
            </Link>
            <Link href="#" className="text-sm hover:text-blue-400">
              Learn
            </Link>
            <Link href="#" className="text-sm hover:text-blue-400">
              Company
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-300 hover:text-white">
            <Search size={20} />
          </button>
          <Link href="#" className="hidden md:block text-sm hover:text-blue-400">
            Contact us
          </Link>
          <Button className="bg-white text-black hover:bg-gray-200">Get started</Button>
        </div>
      </div>
    </nav>
  )
}
