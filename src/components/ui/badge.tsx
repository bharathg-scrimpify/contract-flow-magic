
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: 
          "border-transparent bg-green-100 text-green-800 hover:bg-green-200/90",
        warning: 
          "border-transparent bg-amber-100 text-amber-800 hover:bg-amber-200/90",
        danger: 
          "border-transparent bg-red-100 text-red-800 hover:bg-red-200/90",
        info: 
          "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200/90",
        purple: 
          "border-transparent bg-purple-100 text-purple-800 hover:bg-purple-200/90",
        // Enhanced status colors
        pending: 
          "border-transparent bg-amber-50 text-amber-700 hover:bg-amber-100/90",
        accepted: 
          "border-transparent bg-emerald-50 text-emerald-700 hover:bg-emerald-100/90",
        rejected: 
          "border-transparent bg-rose-50 text-rose-700 hover:bg-rose-100/90",
        contracted: 
          "border-transparent bg-violet-50 text-violet-700 hover:bg-violet-100/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
