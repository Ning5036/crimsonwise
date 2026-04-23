import * as XLSX from 'xlsx'
import { getAllSessions } from '../store/statsStore'
import { GUIDELINES } from '../data/guidelines'

export function exportToExcel() {
  const wb = XLSX.utils.book_new()
  const sessions = getAllSessions()

  // ── Sheet 1: Q&A Records ──────────────────────────────────
  const sheet1Data = sessions.map((s, i) => ({
    '序號': i + 1,
    '時間戳記': s.timestamp,
    '語言': s.lang,
    '年齡': s.age,
    '性別': s.sex,
    '素食者': s.isVegetarian ? '是' : '否',
    '體重(kg)': s.weightKg,
    '身高(cm)': s.heightCm,
    '過去病史': s.medicalHistory,
    '用藥史': s.medications,
    'Hb (g/dL)': s.hb,
    'PLT (×10³/μL)': s.plt,
    'PT INR': s.ptInr,
    'aPTT INR': s.apttInr,
    '白蛋白 (g/dL)': s.albumin,
    'eGFR': s.gfr,
    '貧血症狀': s.symptoms,
    '其他症狀': s.symptomsOther,
    '臨床情境': s.clinicalScenarios,
    '其他情境': s.clinicalOther,
    '醫護人員': s.physicianName,
  }))
  const ws1 = XLSX.utils.json_to_sheet(sheet1Data.length ? sheet1Data : [{ '訊息': '尚無資料' }])
  XLSX.utils.book_append_sheet(wb, ws1, '問答紀錄')

  // ── Sheet 2: Decision Results ─────────────────────────────
  const sheet2Data = sessions.map((s, i) => ({
    '序號': i + 1,
    '時間戳記': s.timestamp,
    '決定': s.decision === 'transfuse' ? '輸血' : s.decision === 'no_transfuse' ? '不輸血' : '未決定',
    '決定原因': s.decisionReason,
    '風險等級': s.riskLevel,
    '輸注RLRBC袋數': s.hbUnitsChosen,
    '預測輸後Hb (g/dL)': s.predictedHb,
    '血小板種類': s.pltType,
    '輸注血小板袋數': s.pltUnitsChosen,
    '預測輸後PLT (×10³/μL)': s.predictedPlt,
    '體重(kg)': s.weightKg,
    '身高(cm)': s.heightCm,
  }))
  const ws2 = XLSX.utils.json_to_sheet(sheet2Data.length ? sheet2Data : [{ '訊息': '尚無資料' }])
  XLSX.utils.book_append_sheet(wb, ws2, '決策結果')

  // ── Sheet 3: Guidelines Reference ────────────────────────
  const sheet3Data = GUIDELINES.map(g => ({
    '指引': g.authors,
    '標題': g.title,
    '期刊': g.journal,
    '年份': g.year,
    'DOI/連結': g.doi ? `https://doi.org/${g.doi}` : (g.url ?? ''),
    '建議Hb閾值 (g/dL)': g.hbThreshold ?? '',
    '地區': g.region,
  }))
  const ws3 = XLSX.utils.json_to_sheet(sheet3Data)
  XLSX.utils.book_append_sheet(wb, ws3, '指引對照')

  // ── Sheet 4: Survey Statistics ────────────────────────────
  const surveyed = sessions.filter(s => s.satisfaction !== null)
  const totalSurveyed = surveyed.length
  const avgSatisfaction = totalSurveyed > 0
    ? Math.round((surveyed.reduce((a, s) => a + (s.satisfaction ?? 0), 0) / totalSurveyed) * 10) / 10
    : 0
  const better = surveyed.filter(s => s.betterUnderstanding === 'yes').length
  const partial = surveyed.filter(s => s.betterUnderstanding === 'partial').length
  const no = surveyed.filter(s => s.betterUnderstanding === 'no').length

  const sheet4Summary = [
    { '項目': '填寫問卷人數', '數值': totalSurveyed },
    { '項目': '平均滿意度 (1-5)', '數值': avgSatisfaction },
    { '項目': '★5 非常滿意', '數值': surveyed.filter(s => s.satisfaction === 5).length },
    { '項目': '★4 滿意', '數值': surveyed.filter(s => s.satisfaction === 4).length },
    { '項目': '★3 普通', '數值': surveyed.filter(s => s.satisfaction === 3).length },
    { '項目': '★2 不滿意', '數值': surveyed.filter(s => s.satisfaction === 2).length },
    { '項目': '★1 非常不滿意', '數值': surveyed.filter(s => s.satisfaction === 1).length },
    { '項目': '觀念更正確：是', '數值': better },
    { '項目': '觀念更正確：部分', '數值': partial },
    { '項目': '觀念更正確：沒有', '數值': no },
  ]
  const sheet4Detail = surveyed.map((s, i) => ({
    '序號': i + 1,
    '時間戳記': s.timestamp,
    '滿意度': s.satisfaction,
    '觀念更正確': s.betterUnderstanding,
    '建議': s.suggestions,
  }))

  const ws4 = XLSX.utils.json_to_sheet(sheet4Summary)
  XLSX.utils.sheet_add_json(ws4, [{}], { origin: -1, skipHeader: true })
  XLSX.utils.sheet_add_json(ws4, sheet4Detail, { origin: -1 })
  XLSX.utils.book_append_sheet(wb, ws4, '滿意度統計')

  // ── Export ────────────────────────────────────────────────
  const date = new Date().toISOString().split('T')[0]
  XLSX.writeFile(wb, `CrimsonWise_Report_${date}.xlsx`)
}
