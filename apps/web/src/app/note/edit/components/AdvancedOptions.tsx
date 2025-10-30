export function AdvancedOptions() {
  return (
    <div className="border-t pt-4">
      <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
        Advanced Options
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-1">Access Control</h4>
          <p className="text-sm text-muted-foreground">
            Set password protection, IP restrictions, etc.
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-1">Self-Destruct</h4>
          <p className="text-sm text-muted-foreground">
            Automatically destroy after reading
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-1">Attachments</h4>
          <p className="text-sm text-muted-foreground">
            Upload and manage article attachments
          </p>
        </div>
      </div>
    </div>
  )
}
