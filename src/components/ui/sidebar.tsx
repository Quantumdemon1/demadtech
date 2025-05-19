
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export interface SidebarContextProps {
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  collapsedWidth?: number
  onCollapseChange?: (collapsed: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(
  undefined
)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultCollapsed?: boolean
  collapsedWidth?: number
  onCollapseChange?: (collapsed: boolean) => void
}

export function SidebarProvider({
  children,
  defaultCollapsed = false,
  collapsedWidth = 16,
  onCollapseChange,
}: SidebarProviderProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)

  React.useEffect(() => {
    onCollapseChange?.(collapsed)
  }, [collapsed, onCollapseChange])

  return (
    <SidebarContext.Provider
      value={{ collapsed, setCollapsed, collapsedWidth, onCollapseChange }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  collapsible?: boolean
  onCollapseChange?: (collapsed: boolean) => void
}

const sidebarVariants = cva("h-full max-h-screen flex flex-col", {
  variants: {
    variant: {
      default: "shrink-0 border-r bg-background",
      float: "fixed inset-y-0 left-0 z-50 bg-background shadow-xl transition-transform",
    },
    size: {
      default: "w-60",
      sm: "w-56",
      md: "w-64",
      lg: "w-72",
      xl: "w-80",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      variant,
      size,
      className,
      children,
      collapsible = false,
      onCollapseChange,
      ...props
    },
    ref
  ) => {
    const context = React.useContext(SidebarContext)

    if (collapsible && !context) {
      throw new Error(
        "Sidebar with collapsible={true} must be wrapped in a SidebarProvider"
      )
    }

    return (
      <div
        ref={ref}
        className={cn(sidebarVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Sidebar.displayName = "Sidebar"

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-16 items-center px-4", className)}
    {...props}
  />
))

SidebarHeader.displayName = "SidebarHeader"

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex border-t px-4 py-2 mt-auto", className)}
    {...props}
  />
))

SidebarFooter.displayName = "SidebarFooter"

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex-1 overflow-y-auto", className)} {...props} />
))

SidebarContent.displayName = "SidebarContent"

export interface SidebarTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  SidebarTriggerProps
>(({ className, ...props }, ref) => {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("SidebarTrigger must be used within a SidebarProvider")
  }

  const { collapsed, setCollapsed } = context

  return (
    <button
      ref={ref}
      onClick={() => setCollapsed(!collapsed)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9",
        className
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          "transition-transform duration-200",
          collapsed ? "rotate-180 transform" : "rotate-0 transform"
        )}
      >
        {collapsed ? (
          <path d="m9 18 6-6-6-6" />
        ) : (
          <path d="m15 18-6-6 6-6" />
        )}
      </svg>
    </button>
  )
})

SidebarTrigger.displayName = "SidebarTrigger"

export interface SidebarGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  SidebarGroupProps
>(({ className, children, open, defaultOpen, onOpenChange, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen || false)
  const isControlled = open !== undefined

  React.useEffect(() => {
    if (isControlled) {
      setIsOpen(open)
    }
  }, [isControlled, open])

  const handleToggle = () => {
    if (!isControlled) {
      setIsOpen(!isOpen)
    }
    onOpenChange?.(!isOpen)
  }

  return (
    <div
      ref={ref}
      className={cn("space-y-2 px-4 py-2", className)}
      data-open={isOpen}
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (index === 0) {
          // First child is the group label/header
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              onClick: (e: React.MouseEvent) => {
                handleToggle()
                if (child.props.onClick) {
                  child.props.onClick(e)
                }
              },
              "data-state": isOpen ? "open" : "closed",
            })
          }
          return child
        }
        // Hide all other children when closed
        return isOpen ? child : null
      })}
    </div>
  )
})

SidebarGroup.displayName = "SidebarGroup"

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex cursor-pointer items-center justify-between font-medium hover:text-foreground text-muted-foreground",
      className
    )}
    {...props}
  />
))

SidebarGroupLabel.displayName = "SidebarGroupLabel"

export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-1", className)} {...props} />
))

SidebarGroupContent.displayName = "SidebarGroupContent"

export const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-1", className)} {...props} />
))

SidebarMenu.displayName = "SidebarMenu"

export const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))

SidebarMenuItem.displayName = "SidebarMenuItem"

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean
  }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "button"
  const context = React.useContext(SidebarContext)
  const collapsed = context?.collapsed || false

  return (
    // @ts-ignore
    <Comp
      ref={ref}
      className={cn(
        "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted/50 ring-offset-background transition-colors hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        collapsed && "justify-center px-0",
        className
      )}
      {...props}
    />
  )
})

SidebarMenuButton.displayName = "SidebarMenuButton"
