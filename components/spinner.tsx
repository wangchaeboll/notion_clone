import { Loader } from "lucide-react"
import { cva, type VariantProps} from "class-variance-authority";
import {cn} from "@/lib/utils";

const spinnerVariants = cva(
    "text-muted-foreground animate-spin",
    {
        variants: {
            size: {
                default: "h-4 h-4",
                sm: "h-2 h-2",
                lg: "h-6 h-6",
                icon: "h-10 h-10",
            }
        },
        defaultVariants: {
            size: "default"
        }
    }
)

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {}

export const Spinner = ({ size }:SpinnerProps) => {
    return (
        <Loader className={cn(spinnerVariants({size}))}/>
    )
}