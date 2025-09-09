interface LocationDisplayProps {
  gardenName?: string
  row: number | null
  column: number | null
  totalRows?: number
  totalColumns?: number
}

export default function LocationDisplay({ 
  gardenName, 
  row, 
  column,
  totalRows = 4,
  totalColumns = 4
}: LocationDisplayProps) {
  if (row === null || column === null) return null
  
  // Display values are 1-indexed for users
  const displayRow = row + 1
  const displayColumn = column + 1
  
  return (
    <div className="flex items-center gap-3">
      {/* Text display */}
      <div>
        {gardenName && (
          <div className="text-sm font-medium text-gray-700">{gardenName}</div>
        )}
        <div className="text-sm text-gray-600">
          Row {displayRow}, Column {displayColumn}
        </div>
      </div>
      
      {/* Visual grid */}
      <div className="flex-shrink-0">
        <div className="relative">
          {/* Y-axis label */}
          <div className="absolute -left-3 top-0 bottom-0 flex items-center">
            <div className="text-xs text-gray-400 -rotate-90">Row</div>
          </div>
          {/* Grid */}
          <div 
            className="grid gap-0.5 p-1 bg-gray-100 rounded"
            style={{ 
              gridTemplateRows: `repeat(${Math.min(totalRows, 4)}, 1fr)`,
              gridTemplateColumns: `repeat(${Math.min(totalColumns, 4)}, 1fr)`
            }}
          >
          {/* Reverse row order so row 1 is at bottom */}
          {Array.from({ length: Math.min(totalRows, 4) }).map((_, r) => {
            // Flip the row index for display
            const displayR = Math.min(totalRows, 4) - 1 - r
            return Array.from({ length: Math.min(totalColumns, 4) }).map((_, c) => (
              <div
                key={`${displayR}-${c}`}
                className={`w-3 h-3 rounded-sm ${
                  displayR === Math.min(row, 3) && c === Math.min(column, 3)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
                title={`Row ${displayR + 1}, Column ${c + 1}`}
              />
            ))
          }).flat()}
          </div>
          {/* X-axis label */}
          <div className="text-xs text-gray-400 text-center mt-0.5">Col</div>
        </div>
        {(totalRows > 4 || totalColumns > 4) && (
          <div className="text-xs text-gray-500 text-center mt-1">
            {totalRows}×{totalColumns}
          </div>
        )}
      </div>
    </div>
  )
}