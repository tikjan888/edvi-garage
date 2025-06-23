"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Cloud, Download, Upload, Shield, Clock, CheckCircle, AlertCircle, HardDrive, Zap } from "lucide-react"

interface CloudBackupModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CloudBackupModal({ isOpen, onClose }: CloudBackupModalProps) {
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)

  if (!isOpen) return null

  const backupData = {
    lastBackup: "2024-01-15 14:30",
    backupSize: "2.4 MB",
    autoBackup: true,
    backupHistory: [
      { date: "2024-01-15 14:30", size: "2.4 MB", status: "success" },
      { date: "2024-01-14 14:30", size: "2.3 MB", status: "success" },
      { date: "2024-01-13 14:30", size: "2.2 MB", status: "success" },
      { date: "2024-01-12 14:30", size: "2.1 MB", status: "failed" },
      { date: "2024-01-11 14:30", size: "2.0 MB", status: "success" },
    ],
  }

  const handleBackup = async () => {
    setIsBackingUp(true)
    // Симуляция процесса бэкапа
    setTimeout(() => {
      setIsBackingUp(false)
      alert("Бэкап успешно создан!")
    }, 3000)
  }

  const handleRestore = async (backupDate: string) => {
    setIsRestoring(true)
    // Симуляция процесса восстановления
    setTimeout(() => {
      setIsRestoring(false)
      alert(`Данные восстановлены из бэкапа от ${backupDate}`)
    }, 2000)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      style={{
        zIndex: 9999,
        pointerEvents: "auto",
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ pointerEvents: "auto" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Cloud className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Облачные бэкапы</h2>
                <p className="text-blue-100">Pro функция - Автоматическое резервное копирование</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
              style={{ pointerEvents: "auto" }}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]" style={{ pointerEvents: "auto" }}>
          {/* Status Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold">Последний бэкап</div>
                <div className="text-sm text-gray-500">{backupData.lastBackup}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <HardDrive className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="font-semibold">Размер данных</div>
                <div className="text-sm text-gray-500">{backupData.backupSize}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="font-semibold">Автобэкап</div>
                <Badge className={backupData.autoBackup ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                  {backupData.autoBackup ? "Включен" : "Выключен"}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <Button
              onClick={handleBackup}
              disabled={isBackingUp}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
            >
              {isBackingUp ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Создание бэкапа...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Создать бэкап сейчас
                </>
              )}
            </Button>
            <Button variant="outline" className="flex-1">
              <Shield className="h-4 w-4 mr-2" />
              Настройки автобэкапа
            </Button>
          </div>

          {/* Backup History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                История бэкапов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {backupData.backupHistory.map((backup, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {backup.status === "success" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <div className="font-medium">{backup.date}</div>
                        <div className="text-sm text-gray-500">Размер: {backup.size}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          backup.status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }
                      >
                        {backup.status === "success" ? "Успешно" : "Ошибка"}
                      </Badge>
                      {backup.status === "success" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRestore(backup.date)}
                          disabled={isRestoring}
                        >
                          {isRestoring ? (
                            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <Download className="h-3 w-3 mr-1" />
                              Восстановить
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-semibold text-blue-800">Безопасность данных</div>
                <div className="text-sm text-blue-700 mt-1">
                  Все бэкапы шифруются с использованием AES-256 и хранятся в защищенном облачном хранилище.
                  Автоматические бэкапы создаются ежедневно в 14:30.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
