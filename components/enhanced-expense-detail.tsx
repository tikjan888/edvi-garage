"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Trash2, Calendar, DollarSign, FileText, Tag } from "lucide-react"

interface ExpenseDetailProps {
  expense: {
    id: string
    description: string
    amount: number
    category: string
    date: string
    receipt?: string
    notes?: string
  }
  onBack: () => void
  onEdit: (expense: any) => void
  onDelete: (id: string) => void
}

export function EnhancedExpenseDetail({ expense, onBack, onEdit, onDelete }: ExpenseDetailProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = () => {
    onDelete(expense.id)
    onBack()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-slate-100 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Expenses
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(expense)}
            className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-gray-900">{expense.description}</CardTitle>
              <Badge variant="secondary" className="w-fit">
                <Tag className="h-3 w-3 mr-1" />
                {expense.category}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{formatCurrency(expense.amount)}</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Date */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p className="text-lg font-semibold text-gray-900">{formatDate(expense.date)}</p>
            </div>
          </div>

          <Separator />

          {/* Amount Breakdown */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Amount</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
            </div>
          </div>

          {/* Notes Section */}
          {expense.notes && (
            <>
              <Separator />
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-2">Notes</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">{expense.notes}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Receipt Section */}
          {expense.receipt && (
            <>
              <Separator />
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-500">Receipt</p>
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                  <p className="text-center text-gray-600">Receipt: {expense.receipt}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-red-600">Delete Expense</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Are you sure you want to delete this expense? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
