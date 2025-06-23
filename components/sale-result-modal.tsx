"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, DollarSign, Calculator, TrendingUp } from "lucide-react"
import type { SaleResult } from "@/app/page"
import { useLanguage } from "@/contexts/language-context"
import { useNames } from "@/contexts/names-context"
import { useGarage } from "@/contexts/garage-context"

interface SaleResultModalProps {
  saleResult: SaleResult
  onClose: () => void
}

export function SaleResultModal({ saleResult, onClose }: SaleResultModalProps) {
  const { t } = useLanguage()
  const { meName, partnerName } = useNames()
  const { currentGarage } = useGarage()
  const profitMargin = ((saleResult.totalProfit / saleResult.salePrice) * 100).toFixed(1)

  const hasPartner = currentGarage?.hasPartner || false

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm mx-4 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-4 text-white text-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-lg font-bold mb-1">{t("saleCompleted")}</h2>
          <p className="text-emerald-100 text-sm">{t("transactionProcessed")}</p>
        </div>

        {/* Sale Summary */}
        <div className="p-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-600">{t("salePrice")}</p>
                  <p className="text-lg font-bold text-slate-800">€{saleResult.salePrice.toFixed(2)}</p>
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs">
                {profitMargin}% {t("margin")}
              </Badge>
            </div>
          </div>

          {/* Financial Details */}
          <div className="space-y-3 mb-4">
            {/* Basic Info */}
            <div className="bg-slate-50 rounded-2xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-4 w-4 text-slate-600" />
                <h3 className="font-semibold text-slate-800 text-sm">{t("financialBreakdown")}</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Цена продажи:</span>
                  <span className="font-medium text-green-600">€{saleResult.salePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Общие затраты:</span>
                  <span className="font-medium text-red-600">€{saleResult.totalExpenses.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-slate-600">Общая прибыль:</span>
                  <span className="font-medium text-emerald-600">€{saleResult.totalProfit.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Partner Expenses - только если есть партнер */}
            {hasPartner && (
              <div className="bg-blue-50 rounded-2xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <h3 className="font-semibold text-slate-800 text-sm">Затраты партнеров</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-lg p-2">
                    <p className="text-xs text-slate-500 mb-1">Мои затраты</p>
                    <p className="font-bold text-blue-600 text-sm">€{saleResult.yourExpenses.toFixed(2)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <p className="text-xs text-slate-500 mb-1">Затраты партнера</p>
                    <p className="font-bold text-purple-600 text-sm">€{saleResult.partnerExpenses.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Profit Split - только если есть партнер */}
            {hasPartner && (
              <div className="bg-green-50 rounded-2xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <h3 className="font-semibold text-slate-800 text-sm">
                    Прибыль партнеров
                    {currentGarage?.partnerInfo?.splitRatio && (
                      <span className="text-xs text-slate-500 ml-1">
                        ({currentGarage.partnerInfo.splitRatio}% / {100 - currentGarage.partnerInfo.splitRatio}%)
                      </span>
                    )}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-lg p-2">
                    <p className="text-xs text-slate-500 mb-1">
                      Моя прибыль{" "}
                      {currentGarage?.partnerInfo?.splitRatio && `(${currentGarage.partnerInfo.splitRatio}%)`}
                    </p>
                    <p className="font-bold text-green-600 text-sm">€{saleResult.yourProfit.toFixed(2)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <p className="text-xs text-slate-500 mb-1">
                      Прибыль партнера{" "}
                      {currentGarage?.partnerInfo?.splitRatio && `(${100 - currentGarage.partnerInfo.splitRatio}%)`}
                    </p>
                    <p className="font-bold text-green-600 text-sm">€{saleResult.partnerProfit.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Final Payout */}
            <div className="bg-emerald-50 rounded-2xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                <h3 className="font-semibold text-slate-800 text-sm">
                  {hasPartner ? "Итого к получению" : "Итого прибыль"}
                </h3>
              </div>
              {hasPartner ? (
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-lg p-2">
                    <p className="text-xs text-slate-500 mb-1">Я получаю</p>
                    <p className="font-bold text-emerald-600 text-sm">€{saleResult.youReceive.toFixed(2)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <p className="text-xs text-slate-500 mb-1">Партнер получает</p>
                    <p className="font-bold text-emerald-600 text-sm">€{saleResult.partnerReceives.toFixed(2)}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-500 mb-1">Общая прибыль</p>
                  <p className="font-bold text-emerald-600 text-xl">€{saleResult.youReceive.toFixed(2)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-2xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
          >
            {t("continue")}
          </Button>
        </div>
      </div>

      {/* Success Toast - Bottom */}
    </div>
  )
}
