
/**
 * BaiCurex Expert-Level Backend Simulator.
 * Implements Hard-Flag Triage Logic (Invariants).
 */

import { GoogleGenAI } from "@google/genai";
import { StudyType, QuantitativeData, ProcessedResponse, TriageStatus, RiskLevel, TaskStatus } from "../types";

const runMathematicalAnalysis = async (type: StudyType, onProgress: (msg: string) => void): Promise<QuantitativeData> => {
  onProgress("Анализ состояний и стадий сна...");
  await new Promise(r => setTimeout(r, 600));
  
  onProgress("Детекция пароксизмальной активности (Hard-Flag Logic)...");
  await new Promise(r => setTimeout(r, 1000));

  if (type === StudyType.EEG) {
    const hasPathology = Math.random() > 0.4; 
    
    return {
      quality_index: 0.96,
      triage_reasons: [], // Will be populated in computeTriage
      dominant_rhythm: "Альфа-ритм",
      alpha_frequency_hz: 8.0,
      alpha_amplitude_uv: "50-70",
      alpha_reactivity: "blocked",
      alpha_percent: 82,
      theta_percent: 12,
      delta_percent: 4,
      beta_percent: 5,
      sleep_detected: true,
      sleep_stages: ["N1", "N2", "N3"],
      sleep_spindles: true,
      k_complexes: true,
      photic_stimulation_response: "без значимых изменений фона",
      hyperventilation_response: "без значимых изменений фона",
      epileptiform_activity: hasPathology,
      paroxysm_type: hasPathology ? "комплексы острая-медленная волна" : undefined,
      localization: hasPathology ? "передневисочные, лобные, центральные отведения справа" : undefined,
      paroxysm_states: hasPathology ? ["бодрствование", "сон"] : undefined,
      paroxysm_frequency: hasPathology ? 'recurrent' : undefined,
      secondary_generalization: false,
      video_correlation: "двигательная активность не зафиксирована"
    };
  } else {
    return {
      quality_index: 0.98,
      triage_reasons: [],
      hr: 72,
      hrv: 55.4,
      rr_variance: 0.012,
      arrhythmia_pattern: null
    };
  }
};

const computeTriage = (type: StudyType, data: QuantitativeData): { triage: TriageStatus, risk: RiskLevel, audit: boolean } => {
  const reasons: string[] = [];
  
  if (type === StudyType.EEG) {
    // INVARIANT 1: Generalization is always RED
    if (data.secondary_generalization) {
      reasons.push("ВТОРИЧНАЯ ГЕНЕРАЛИЗАЦИЯ");
      data.triage_reasons = reasons;
      return { triage: TriageStatus.RED, risk: RiskLevel.HIGH, audit: true };
    }
    
    // INVARIANT 2: Epileptiform activity is MINIMUM YELLOW, never GREEN
    if (data.epileptiform_activity) {
      reasons.push(`ЭПИЛЕПТИФОРМНАЯ АКТИВНОСТЬ (${data.paroxysm_type})`);
      data.triage_reasons = reasons;
      return { triage: TriageStatus.YELLOW, risk: RiskLevel.MODERATE, audit: true };
    }

    reasons.push("ОТКЛОНЕНИЙ НЕ ВЫЯВЛЕНО");
    data.triage_reasons = reasons;
    return { triage: TriageStatus.GREEN, risk: RiskLevel.LOW, audit: false };
  } else {
    if ((data.hr || 0) > 130) {
      reasons.push("ВЫРАЖЕННАЯ ТАХИКАРДИЯ");
      data.triage_reasons = reasons;
      return { triage: TriageStatus.RED, risk: RiskLevel.HIGH, audit: true };
    }
    reasons.push("НОРМАЛЬНЫЙ РИТМ");
    data.triage_reasons = reasons;
    return { triage: TriageStatus.GREEN, risk: RiskLevel.LOW, audit: false };
  }
};

export const processStudyTask = async (
  type: StudyType,
  patientName: string,
  age: number,
  gender: string,
  fileName: string,
  onStatusChange: (status: TaskStatus, progressMsg: string) => void
): Promise<ProcessedResponse> => {
  // Always initialize GoogleGenAI inside the function right before making an API call to ensure use of the correct environment variable.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  onStatusChange('ANALYZING', "Глубокая аналитика сигнала...");
  const quantData = await runMathematicalAnalysis(type, (msg) => onStatusChange('ANALYZING', msg));

  const triageResult = computeTriage(type, quantData);

  onStatusChange('GENERATING_REPORT', "Формирование экспертного заключения...");
  
  const genderRu = gender === 'male' ? 'Мужской' : 'Женский';
  const prompt = `
    ЗАДАЧА: Сформируй экспертное заключение ЭЭГ.
    ДАННЫЕ ПАЦИЕНТА: ${patientName}, ${age} лет, ${genderRu}.
    ДАННЫЕ АНАЛИЗА: ${JSON.stringify(quantData)}.
    
    СТРИКТНЫЕ ПРАВИЛА (HARD CONSTRAINTS):
    1. Если epileptiform_activity: true, ЗАПРЕЩЕНО писать "типичная эпилептиформная активность не зарегистрирована" или "в пределах нормы".
    2. Описание патологии ДОЛЖНО быть первым пунктом после фоновой ЭЭГ.
    3. Используй структуру: Описание фона -> Пробы -> Сон -> Пароксизмы -> Заключение -> Рекомендации.
    4. В ЗАКЛЮЧЕНИИ четко укажи: "Зарегистрирована ${quantData.paroxysm_type} в ${quantData.localization}".
    
    ФОРМАТ: ТОЛЬКО ПРОСТОЙ ТЕКСТ. НИКАКОГО MARKDOWN (*, #, _).
    ЯЗЫК: РУССКИЙ.
  `;

  const aiResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: "Вы — врач экспертного уровня. Вы никогда не игнорируете патологические флаги в данных. Если флаг epileptiform_activity установлен в true, вы обязаны детально описать его, даже если остальные параметры в норме. Вы выдаете только чистый текст без спецсимволов."
    }
  });

  onStatusChange('COMPLETED', "Завершено успешно.");
  return {
    study_type: type,
    triage_status: triageResult.triage,
    risk_level: triageResult.risk,
    ai_report: aiResponse.text || "Ошибка.",
    quantitative_data: quantData,
    auditor_required: triageResult.audit,
    pdf_url: `report_${Date.now()}.pdf`
  };
};