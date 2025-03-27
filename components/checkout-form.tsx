"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { Check, CreditCard, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { clearCart } from "@/lib/features/cart/cartSlice"

export default function CheckoutForm() {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)

      // Clear cart after successful checkout
      dispatch(clearCart())
    }, 2000)
  }

  const handleClose = () => {
    setIsSuccess(false)
    router.push("/")
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="your@email.com" required />
        </div>

        <div className="space-y-2">
          <Label>Payment Method</Label>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-3 gap-2">
            <Label
              htmlFor="card"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem value="card" id="card" className="sr-only" />
              <CreditCard className="mb-3 h-6 w-6" />
              <span className="text-xs">Card</span>
            </Label>
            <Label
              htmlFor="paypal"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem value="paypal" id="paypal" className="sr-only" />
              <svg className="mb-3 h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7.4 3H16.2C17.1 3 17.9 3.5 18.2 4.3L21 13.5C21.4 14.6 20.6 15.8 19.4 15.8H14.7L15.3 18.2C15.4 18.7 15 19.1 14.5 19.1H9.2C8.8 19.1 8.4 18.8 8.3 18.4L6.7 10.1H3.8C3.3 10.1 3 9.7 3 9.3V3.8C3 3.4 3.3 3 3.8 3H7.4Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xs">PayPal</span>
            </Label>
            <Label
              htmlFor="apple"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem value="apple" id="apple" className="sr-only" />
              <svg className="mb-3 h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12.5 6.5C13.3 5.7 14.5 5.3 15.5 5.3C16.5 5.3 17.7 5.7 18.5 6.5C19.3 7.3 19.7 8.5 19.7 9.5C19.7 10.5 19.3 11.7 18.5 12.5L12 19L5.5 12.5C4.7 11.7 4.3 10.5 4.3 9.5C4.3 8.5 4.7 7.3 5.5 6.5C6.3 5.7 7.5 5.3 8.5 5.3C9.5 5.3 10.7 5.7 11.5 6.5L12 7L12.5 6.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xs">Apple Pay</span>
            </Label>
          </RadioGroup>
        </div>

        {paymentMethod === "card" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input id="card-number" placeholder="1234 5678 9012 3456" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" required />
              </div>
            </div>
          </>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Complete Order"
          )}
        </Button>
      </form>

      <Dialog open={isSuccess} onOpenChange={setIsSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-6 w-6 text-green-500" />
              Order Placed Successfully!
            </DialogTitle>
            <DialogDescription>
              Thank you for your purchase. Your order has been placed and will be processed shortly.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              A confirmation email has been sent to your email address.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={handleClose} className="w-full">
              Continue Shopping
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

