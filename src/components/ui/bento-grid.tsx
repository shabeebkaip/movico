import { ComponentPropsWithoutRef, ReactNode } from "react"
import { ArrowRightIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

interface BentoCardProps {
  name: string
  className?: string
  background: ReactNode
  Icon: any
  description: string
  href: string
  cta: string
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: BentoCardProps) => {
  const IconComponent = Icon;
  
  return (
    <div
      key={name}
      className={cn(
        "group relative col-span-3 flex flex-col justify-end overflow-hidden rounded-3xl border border-border/50",
        "bg-background/40 backdrop-blur-sm",
        "hover:border-primary/50 transition-all duration-500",
        className
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
        {background}
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="relative z-10 p-8 space-y-4">
        <IconComponent className="h-10 w-10 text-primary mb-2 transition-transform duration-500 group-hover:scale-110" />
        
        <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
          {name}
        </h3>
        
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
          {description}
        </p>

        <Button
          variant="link"
          asChild
          size="sm"
          className="p-0 text-primary hover:text-primary/80 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <a href={href}>
            {cta}
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </Button>
      </div>
    </div>
  );
}

export { BentoCard, BentoGrid }
