'use client'

import { useState } from 'react'

interface GardenCreatorProps {
  onGardenCreated: () => void
}

export default function GardenCreator({ onGardenCreated }: GardenCreatorProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [name, setName] = useState('')
  const [rows, setRows] = useState('3')
  const [columnsPerRow, setColumnsPerRow] = useState('4')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{
    rows?: string
    columnsPerRow?: string
  }>({})

  const validateInputs = () => {
    const newErrors: typeof errors = {}
    const rowNum = parseInt(rows)
    const colNum = parseInt(columnsPerRow)

    if (isNaN(rowNum) || rowNum < 1 || rowNum > 10) {
      newErrors.rows = 'Must be between 1 and 10'
    }
    if (isNaN(colNum) || colNum < 1 || colNum > 10) {
      newErrors.columnsPerRow = 'Must be between 1 and 10'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateInputs() || !name.trim()) {
      if (!name.trim()) {
        alert('Please enter a garden name')
      }
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/gardens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          rows: parseInt(rows), 
          columnsPerRow: parseInt(columnsPerRow) 
        })
      })

      if (response.ok) {
        setName('')
        setRows('3')
        setColumnsPerRow('4')
        setErrors({})
        setIsCreating(false)
        onGardenCreated()
      } else {
        alert('Failed to create garden')
      }
    } catch (error) {
      alert('Error creating garden')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isCreating) {
    return (
      <button
        onClick={() => setIsCreating(true)}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-green-500 hover:text-green-600 transition-colors"
      >
        + Create New Garden
      </button>
    )
  }

  const handleCreate = () => {
    handleSubmit()
  }

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-white">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Garden Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Kitchen Window Garden"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Rows
          </label>
          <input
            type="text"
            value={rows}
            onChange={(e) => {
              setRows(e.target.value)
              if (errors.rows) setErrors({ ...errors, rows: undefined })
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.rows 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-green-500'
            } text-black`}
          />
          {errors.rows && (
            <p className="text-xs text-red-500 mt-1">{errors.rows}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Columns per Row
          </label>
          <input
            type="text"
            value={columnsPerRow}
            onChange={(e) => {
              setColumnsPerRow(e.target.value)
              if (errors.columnsPerRow) setErrors({ ...errors, columnsPerRow: undefined })
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.columnsPerRow 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-green-500'
            } text-black`}
          />
          {errors.columnsPerRow && (
            <p className="text-xs text-red-500 mt-1">{errors.columnsPerRow}</p>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg">
        {(() => {
          const rowNum = parseInt(rows) || 0
          const colNum = parseInt(columnsPerRow) || 0
          const isValid = rowNum > 0 && rowNum <= 10 && colNum > 0 && colNum <= 10
          
          return (
            <>
              <p className="text-sm text-gray-600">
                {isValid 
                  ? `Preview: ${rowNum} rows × ${colNum} columns = ${rowNum * colNum} positions`
                  : 'Enter valid numbers to see preview'
                }
              </p>
              {isValid && (
                <div className="mt-2 grid gap-1" style={{ gridTemplateRows: `repeat(${rowNum}, 1fr)` }}>
                  {Array.from({ length: rowNum }).map((_, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="grid gap-1"
                      style={{ gridTemplateColumns: `repeat(${colNum}, 1fr)` }}
                    >
                      {Array.from({ length: colNum }).map((_, colIndex) => (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className="h-8 bg-gray-200 rounded"
                        />
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </>
          )
        })()}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCreate}
          disabled={isSubmitting}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Garden'}
        </button>
        <button
          type="button"
          onClick={() => setIsCreating(false)}
          className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}