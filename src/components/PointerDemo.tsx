
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pointer } from "@/components/ui/pointer";
import { motion } from "motion/react"

export function PointerDemo() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:grid-rows-2">
      <Card className="col-span-1 row-span-1 overflow-hidden border bg-gradient-to-br from-red-50 to-red-100 transition-all dark:from-red-900 dark:to-red-800 shadow-none">
        <CardHeader className="relative pb-2">
          <CardTitle className="text-xl font-bold">Pokeball Pointer</CardTitle>
          <CardDescription className="text-sm text-red-700 dark:text-red-300">
            Animated pokeball pointer
          </CardDescription>
        </CardHeader>
        <CardContent className="relative flex h-40 items-center justify-center p-6">
          <span className="pointer-events-none text-center text-xl font-medium text-red-800 dark:text-red-200">
            Move your cursor here
          </span>
        </CardContent>
        <Pointer />
      </Card>

      <Card className="col-span-1 row-span-1 overflow-hidden border bg-gradient-to-br from-blue-50 to-blue-100 transition-all dark:from-blue-900 dark:to-blue-800 shadow-none">
        <CardHeader className="relative pb-2">
          <CardTitle className="text-xl font-bold">Rotating Pokeball</CardTitle>
          <CardDescription className="text-sm text-blue-700 dark:text-blue-300">
            A pokeball with different animation
          </CardDescription>
        </CardHeader>
        <CardContent className="relative flex h-40 items-center justify-center p-6">
          <span className="pointer-events-none text-center text-xl font-medium text-blue-800 dark:text-blue-200">
            Try me out
          </span>
        </CardContent>
        <Pointer>
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="20" cy="20" r="18" fill="#FF0000" />
              <rect x="1" y="18" width="38" height="4" fill="#000000" />
              <circle
                cx="20"
                cy="20"
                r="6"
                fill="#FFFFFF"
                stroke="#000000"
                strokeWidth="2"
              />
              <circle
                cx="20"
                cy="20"
                r="3"
                fill="#FFFFFF"
                stroke="#000000"
                strokeWidth="1"
              />
            </svg>
          </motion.div>
        </Pointer>
      </Card>

      <Card className="col-span-1 row-span-1 overflow-hidden border bg-gradient-to-br from-yellow-50 to-yellow-100 transition-all dark:from-yellow-900 dark:to-yellow-800 shadow-none">
        <CardHeader className="relative pb-2">
          <CardTitle className="text-xl font-bold">Masterball</CardTitle>
          <CardDescription className="text-sm text-yellow-700 dark:text-yellow-300">
            A custom masterball pointer
          </CardDescription>
        </CardHeader>
        <CardContent className="relative flex h-40 items-center justify-center p-6">
          <span className="pointer-events-none text-center text-xl font-medium text-yellow-800 dark:text-yellow-200">
            Hover here
          </span>
        </CardContent>
        <Pointer>
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="20" cy="20" r="18" fill="#7B2CBF" />
            <rect x="1" y="18" width="38" height="4" fill="#000000" />
            <circle
              cx="20"
              cy="20"
              r="6"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="2"
            />
            <circle cx="20" cy="20" r="2" fill="#FFFFFF" />
            <path d="M8 12 L12 8 L16 12 L12 16 Z" fill="#FF0000" />
            <path d="M28 12 L32 8 L36 12 L32 16 Z" fill="#FF0000" />
          </svg>
        </Pointer>
      </Card>

      <Card className="col-span-1 row-span-1 overflow-hidden border bg-gradient-to-br from-green-50 to-green-100 transition-all dark:from-green-900 dark:to-green-800 shadow-none">
        <CardHeader className="relative pb-2">
          <CardTitle className="text-xl font-bold">Safari Ball</CardTitle>
          <CardDescription className="text-sm text-green-700 dark:text-green-300">
            Safari ball pointer with pulsing animation
          </CardDescription>
        </CardHeader>
        <CardContent className="relative flex h-40 items-center justify-center p-6">
          <span className="pointer-events-none text-center text-xl font-medium text-green-800 dark:text-green-200">
            Check this out
          </span>
        </CardContent>
        <Pointer>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="20" cy="20" r="18" fill="#4D924B" />
              <rect x="1" y="18" width="38" height="4" fill="#000000" />
              <path d="M10 10 L14 6 L18 10 L14 14 Z" fill="#7A542E" />
              <path d="M22 10 L26 6 L30 10 L26 14 Z" fill="#7A542E" />
              <circle
                cx="20"
                cy="20"
                r="6"
                fill="#FFFFFF"
                stroke="#000000"
                strokeWidth="2"
              />
              <circle
                cx="20"
                cy="20"
                r="3"
                fill="#FFFFFF"
                stroke="#000000"
                strokeWidth="1"
              />
            </svg>
          </motion.div>
        </Pointer>
      </Card>
    </div>
  );
}
