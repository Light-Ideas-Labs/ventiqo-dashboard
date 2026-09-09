export default function VoucherCard() {
  return (
    <div className="rounded-2xl border bg-card p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">

      {/* LEFT IMAGE */}
      <div className="rounded-xl overflow-hidden h-48 bg-muted" />

      {/* INFO */}
      <div className="space-y-2 text-sm">

        <p><strong>Name:</strong> Jackson Moore</p>
        <p><strong>Invoice ID:</strong> INV202945</p>
        <p><strong>Category:</strong> Platinum</p>
        <p><strong>Seat:</strong> B12</p>
        <p><strong>Gate:</strong> 3</p>

        <p><strong>Location:</strong> LA</p>
        <p><strong>Date:</strong> April 20, 2029</p>
        <p><strong>Time:</strong> 12:00 PM</p>

      </div>

      {/* QR / BARCODE */}
      <div className="flex flex-col items-center justify-center border-l">

        <div className="h-20 w-full bg-muted mb-2" />

        <p className="text-xs text-muted-foreground text-center">
          Scan to enter
        </p>

      </div>

    </div>
  )
}