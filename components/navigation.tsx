import { Dog, Network, Book, Github, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  return (
    <div className="flex flex-col gap-1">
      <Button variant="ghost" className="w-full justify-start gap-2">
        <Dog className="h-4 w-4" />
        <span>抱抱狗HuggingDog</span>
      </Button>

      <Button variant="ghost" className="w-full justify-start gap-2">
        <Github className="h-4 w-4" />
        <span>问问GitHub</span>
      </Button>

      <Button variant="ghost" className="w-full justify-start gap-2">
        <Network className="h-4 w-4" />
        <span>模型</span>
      </Button>

      <Button variant="ghost" className="w-full justify-start gap-2">
        <Book className="h-4 w-4" />
        <span>活书LiveBook</span>
      </Button>

      <Button variant="ghost" className="w-full justify-start gap-2">
        <MoreHorizontal className="h-4 w-4" />
        <span>更多</span>
      </Button>
    </div>
  )
} 