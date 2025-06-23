import { CreditCard } from "lucide-react"

import { PaymentSettings } from "./payment-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AdminPanel() {
  return (
    <Tabs defaultValue="payments" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="payments" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Платежи
        </TabsTrigger>
      </TabsList>
      <TabsContent value="payments">
        <PaymentSettings />
      </TabsContent>
    </Tabs>
  )
}
