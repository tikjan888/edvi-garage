"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Building2, Users, User, Edit, Trash2, Plus } from "lucide-react"
import { useGarage } from "@/contexts/garage-context"
import { useLanguage } from "@/contexts/language-context"

interface ManageGaragesModalProps {
  isOpen: boolean
  onClose: () => void
  onAddGarage: () => void
  cars: any[]
}

export function ManageGaragesModal({ isOpen, onClose, onAddGarage, cars }: ManageGaragesModalProps) {
  const { garages, currentGarage, setCurrentGarage, deleteGarage, updateGarage } = useGarage()
  const { t } = useLanguage()
  const [deleteGarageId, setDeleteGarageId] = useState<string | null>(null)
  const [editingGarage, setEditingGarage] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const getGarageStats = (garageId: string) => {
    const garageCars = cars.filter((car) => car.garageId === garageId)
    return {
      total: garageCars.length,
      available: garageCars.filter((car) => car.status === "available").length,
      sold: garageCars.filter((car) => car.status === "sold").length,
      pending: garageCars.filter((car) => car.status === "pending").length,
    }
  }

  const handleDeleteGarage = async (garageId: string) => {
    const garageCars = cars.filter((car) => car.garageId === garageId)
    if (garageCars.length > 0) {
      alert("Cannot delete garage with cars. Please move or delete all cars first.")
      return
    }

    try {
      await deleteGarage(garageId)
      if (currentGarage?.id === garageId) {
        const remainingGarages = garages.filter((g) => g.id !== garageId)
        setCurrentGarage(remainingGarages.length > 0 ? remainingGarages[0] : null)
      }
      setDeleteGarageId(null)
    } catch (error) {
      console.error("Error deleting garage:", error)
    }
  }

  const handleEditGarage = (garage: any) => {
    setEditingGarage({ ...garage })
    setShowEditModal(true)
  }

  const handleSaveGarage = async () => {
    if (!editingGarage) return

    try {
      await updateGarage(editingGarage.id, {
        name: editingGarage.name,
        description: editingGarage.description,
        partnerInfo: editingGarage.partnerInfo,
      })
      setShowEditModal(false)
      setEditingGarage(null)
    } catch (error) {
      console.error("Error updating garage:", error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl mx-4 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold">Manage Garages</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {garages.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No Garages Yet</h3>
              <p className="text-slate-600 mb-4">Create your first garage to start managing cars</p>
              <Button
                onClick={() => {
                  onAddGarage()
                  onClose()
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Garage
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {garages.map((garage) => {
                const stats = getGarageStats(garage.id)
                const isActive = currentGarage?.id === garage.id

                return (
                  <div
                    key={garage.id}
                    className={`bg-slate-50 rounded-2xl p-4 border-2 transition-all ${
                      isActive ? "border-blue-500 bg-blue-50" : "border-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            garage.hasPartner
                              ? "bg-gradient-to-br from-emerald-500 to-green-600"
                              : "bg-gradient-to-br from-slate-500 to-gray-600"
                          }`}
                        >
                          {garage.hasPartner ? (
                            <Users className="h-6 w-6 text-white" />
                          ) : (
                            <User className="h-6 w-6 text-white" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-800">{garage.name}</h3>
                            {isActive && (
                              <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5">Active</Badge>
                            )}
                            {garage.hasPartner && (
                              <Badge className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5">
                                <Users className="h-3 w-3 mr-1" />
                                Partner
                              </Badge>
                            )}
                          </div>

                          {garage.description && <p className="text-sm text-slate-600 mb-2">{garage.description}</p>}

                          {garage.hasPartner && garage.partnerInfo && (
                            <div className="bg-white rounded-lg p-3 mb-3">
                              <p className="text-sm font-medium text-slate-800">{garage.partnerInfo.name}</p>
                              <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                                {garage.partnerInfo.email && <span>{garage.partnerInfo.email}</span>}
                                {garage.partnerInfo.phone && <span>{garage.partnerInfo.phone}</span>}
                                <span>
                                  {garage.partnerInfo.splitRatio}% / {100 - garage.partnerInfo.splitRatio}% split
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Stats */}
                          <div className="grid grid-cols-4 gap-2">
                            <div className="bg-white rounded-lg p-2 text-center">
                              <p className="text-sm font-bold text-slate-800">{stats.total}</p>
                              <p className="text-xs text-slate-500">Total</p>
                            </div>
                            <div className="bg-emerald-50 rounded-lg p-2 text-center">
                              <p className="text-sm font-bold text-emerald-600">{stats.available}</p>
                              <p className="text-xs text-emerald-500">Available</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-2 text-center">
                              <p className="text-sm font-bold text-blue-600">{stats.sold}</p>
                              <p className="text-xs text-blue-500">Sold</p>
                            </div>
                            <div className="bg-amber-50 rounded-lg p-2 text-center">
                              <p className="text-sm font-bold text-amber-600">{stats.pending}</p>
                              <p className="text-xs text-amber-500">Pending</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 ml-4">
                        {!isActive && (
                          <Button
                            size="sm"
                            onClick={() => setCurrentGarage(garage)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-xs"
                          >
                            Select
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditGarage(garage)}
                          className="p-2 hover:bg-blue-100 text-blue-600"
                          title="Edit Garage"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteGarageId(garage.id)}
                          className="p-2 hover:bg-red-100 text-red-600"
                          title="Delete Garage"
                          disabled={stats.total > 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Add New Garage Button */}
              <Button
                onClick={() => {
                  onAddGarage()
                  onClose()
                }}
                variant="outline"
                className="w-full py-3 border-dashed border-2 hover:bg-blue-50 hover:border-blue-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Garage
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Garage Modal */}
      {showEditModal && editingGarage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-60">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Edit Garage</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="garage-name">Garage Name</Label>
                <Input
                  id="garage-name"
                  value={editingGarage.name}
                  onChange={(e) => setEditingGarage({ ...editingGarage, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="garage-description">Description</Label>
                <Input
                  id="garage-description"
                  value={editingGarage.description || ""}
                  onChange={(e) => setEditingGarage({ ...editingGarage, description: e.target.value })}
                />
              </div>

              {editingGarage.hasPartner && editingGarage.partnerInfo && (
                <>
                  <div>
                    <Label htmlFor="partner-name">Partner Name</Label>
                    <Input
                      id="partner-name"
                      value={editingGarage.partnerInfo.name}
                      onChange={(e) =>
                        setEditingGarage({
                          ...editingGarage,
                          partnerInfo: { ...editingGarage.partnerInfo, name: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="split-ratio">Your Share (%)</Label>
                    <Input
                      id="split-ratio"
                      type="number"
                      min="0"
                      max="100"
                      value={editingGarage.partnerInfo.splitRatio}
                      onChange={(e) =>
                        setEditingGarage({
                          ...editingGarage,
                          partnerInfo: {
                            ...editingGarage.partnerInfo,
                            splitRatio: Number.parseInt(e.target.value) || 50,
                          },
                        })
                      }
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Partner gets {100 - (editingGarage.partnerInfo.splitRatio || 50)}%
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="partner-email">Partner Email</Label>
                    <Input
                      id="partner-email"
                      value={editingGarage.partnerInfo.email || ""}
                      onChange={(e) =>
                        setEditingGarage({
                          ...editingGarage,
                          partnerInfo: { ...editingGarage.partnerInfo, email: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="partner-phone">Partner Phone</Label>
                    <Input
                      id="partner-phone"
                      value={editingGarage.partnerInfo.phone || ""}
                      onChange={(e) =>
                        setEditingGarage({
                          ...editingGarage,
                          partnerInfo: { ...editingGarage.partnerInfo, phone: e.target.value },
                        })
                      }
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditModal(false)
                  setEditingGarage(null)
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveGarage}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteGarageId && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-60">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Delete Garage</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this garage? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDeleteGarageId(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteGarage(deleteGarageId)}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
