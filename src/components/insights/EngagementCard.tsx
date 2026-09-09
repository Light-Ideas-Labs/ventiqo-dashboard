import { Card, CardContent } from "@/components/ui/card"

export default function EngagementCard() {
  return (
    <Card>
      <CardContent className="p-5 space-y-4">

        <h3 className="font-medium">Engagement & Social Media</h3>

        <div className="flex justify-between">
          <span>Instagram Mentions</span>
          <span className="font-semibold">5,200</span>
        </div>

        <div className="flex justify-between">
          <span>Facebook Shares</span>
          <span className="font-semibold">3,800</span>
        </div>

        <div className="flex justify-between">
          <span>Twitter Tweets</span>
          <span className="font-semibold">1,200</span>
        </div>

        <div className="flex justify-between">
          <span>QR Check-ins</span>
          <span className="font-semibold">9,500</span>
        </div>

        <div className="text-right font-bold text-primary">
          TOTAL: 19,700
        </div>

      </CardContent>
    </Card>
  )
}