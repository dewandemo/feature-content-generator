import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="border-b border-gray-800 bg-black">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-blue-500"
            >
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
              <path
                d="M10 16C10 12.6863 12.6863 10 16 10C19.3137 10 22 12.6863 22 16C22 19.3137 19.3137 22 16 22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="16" cy="16" r="4" fill="currentColor" />
            </svg>
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
