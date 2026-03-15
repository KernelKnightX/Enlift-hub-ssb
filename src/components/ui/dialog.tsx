import * as React from "react"
import { cn } from "@/lib/utils"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange?.(false)}
      />
      <div className="relative z-50">
        {children}
      </div>
    </div>
  )
}

const DialogContent: React.FC<{
  className?: string
  children?: React.ReactNode
  onClose?: () => void
}> = ({ className, children, onClose }) => (
  <div className={cn("bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto", className)}>
    {children}
  </div>
)

const DialogHeader: React.FC<{
  className?: string
  children?: React.ReactNode
}> = ({ className, children }) => (
  <div className={cn("p-6 pb-0", className)}>
    {children}
  </div>
)

const DialogFooter: React.FC<{
  className?: string
  children?: React.ReactNode
}> = ({ className, children }) => (
  <div className={cn("p-6 pt-4 flex justify-end gap-2", className)}>
    {children}
  </div>
)

const DialogTitle: React.FC<{
  className?: string
  children?: React.ReactNode
}> = ({ className, children }) => (
  <h2 className={cn("text-lg font-semibold", className)}>
    {children}
  </h2>
)

const DialogDescription: React.FC<{
  className?: string
  children?: React.ReactNode
}> = ({ className, children }) => (
  <p className={cn("text-sm text-muted-foreground mt-1", className)}>
    {children}
  </p>
)

const DialogTrigger = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
)

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
}
