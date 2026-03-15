import * as React from "react"
import { cn } from "@/lib/utils"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children?: React.ReactNode
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = "Select"

export function SelectTrigger({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Select className={className} {...props}>
      {children}
    </Select>
  )
}

export function SelectContent({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <option value={value}>{children}</option>
}

export function SelectValue({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}

export function SelectGroup({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}

export function SelectLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}>{children}</label>
}

export function SelectSeparator({ className }: { className?: string }) {
  return <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />
}
