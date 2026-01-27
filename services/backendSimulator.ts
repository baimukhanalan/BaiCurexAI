
/**
 * BaiCurex Expert-Level Backend Simulator.
 * Implements Clinical Physician-in-the-loop EEG Protocol.
 */

import { GoogleGenAI } from "@google/genai";
import { StudyType, QuantitativeData, ProcessedResponse, TriageStatus, RiskLevel, TaskStatus } from "../types";

const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const runMathematicalAnalysis = async (type: StudyType, onProgress: (msg: string) => void): Promise<QuantitativeData> => {
  onProgress("Выполнение автоматизированного спектрального анализа...");
  await new Promise(r => setTimeout(r, 600));
  
  onProgress("Картирование пространственного распределения потенциалов...");
  await new Promise(r => setTimeout(r, 800));

  onProgress("Оценка межполушарной симметрии и временных характеристик...");
  await new Promise(r => setTimeout(r, 1000));

  if (type === StudyType.EEG) {
    const hasPathology = Math.random() > 0.4; 
    
    return {
      quality_index: 0.99,
      snr_db: 22.4,
      artifact_types: ["окулографические", "миографические"],
      acquisition_length_min: 25,
      sampling_rate_hz: 500,
      electrode_system: "10-20",
      channels_count: 19,
      triage_reasons: [], 
      dominant_rhythm: "Альфа-ритм",
      alpha_frequency_hz: 9.8,
      alpha_amplitude_uv: "60-90",
      alpha_reactivity: "блокируется (аттенуация)",
      alpha_percent: 88,
      theta_percent: 7,
      delta_percent: 3,
      beta_percent: 2,
      spectral_alpha_theta_ratio: 12.5,
      interhemispheric_symmetry: "96% (значимой латерализации не выявлено)",
      sleep_detected: true,
      sleep_stages: ["N1", "N2", "N3"],
      sleep_spindles: true,
      k_complexes: true,
      sleep_stage_epochs_percent: { "N1": 15, "N2": 55, "N3": 30 },
      photic_stimulation_response: "значимых изменений не зарегистрировано", 
      hyperventilation_response: "значимых изменений не зарегистрировано", 
      epileptiform_activity: hasPathology,
      paroxysm_type: hasPathology ? "остроподобные графоэлементы" : undefined,
      localization_regional: hasPathology ? "передне-височные регионы правого полушария" : undefined,
      paroxysm_frequency_desc: hasPathology ? 'кратковременные эпизоды' : undefined,
      paroxysm_duration_desc: hasPathology ? 'единичные включения' : undefined,
      secondary_generalization: false,
      video_correlation: "двигательных феноменов не зарегистрировано"
    };
  } else {
    return {
      quality_index: 0.99,
      triage_reasons: [],
      hr: 72,
      hrv: 61.5,
      rr_variance: 0.008,
      arrhythmia_pattern: null
    };
  }
};

const computeTriage = (type: StudyType, data: QuantitativeData): { triage: TriageStatus, risk: RiskLevel, audit: boolean } => {
  const reasons: string[] = [];
  
  if (type === StudyType.EEG) {
    if (data.secondary_generalization) {
      reasons.push("ЗАРЕГИСТРИРОВАНА ВТОРИЧНАЯ ГЕНЕРАЛИЗАЦИЯ");
      data.triage_reasons = reasons;
      return { triage: TriageStatus.RED, risk: RiskLevel.HIGH, audit: true };
    }
    
    if (data.epileptiform_activity) {
      reasons.push(`ВЫЯВЛЕНЫ СПЕЦИФИЧЕСКИЕ ПАТТЕРНЫ (${data.paroxysm_type})`);
      data.triage_reasons = reasons;
      return { triage: TriageStatus.YELLOW, risk: RiskLevel.MODERATE, audit: true };
    }

    reasons.push("ФОНОВАЯ АКТИВНОСТЬ В ПРЕДЕЛАХ РАСЧЕТНЫХ ЗНАЧЕНИЙ");
    data.triage_reasons = reasons;
    return { triage: TriageStatus.GREEN, risk: RiskLevel.LOW, audit: false };
  } else {
    if ((data.hr || 0) > 130) {
      reasons.push("ВЫРАЖЕННАЯ ТАХИКАРДИЯ");
      data.triage_reasons = reasons;
      return { triage: TriageStatus.RED, risk: RiskLevel.HIGH, audit: true };
    }
    reasons.push("НОРМАЛЬНЫЙ СИНУСОВЫЙ РИТМ");
    data.triage_reasons = reasons;
    return { triage: TriageStatus.GREEN, risk: RiskLevel.LOW, audit: false };
  }
};

export const processStudyTask = async (
  type: StudyType,
  patientName: string,
  dob: string,
  gender: string,
  fileName: string,
  onStatusChange: (status: TaskStatus, progressMsg: string) => void
): Promise<ProcessedResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const age = calculateAge(dob);
  const formattedDob = new Date(dob).toLocaleDateString('ru-RU');

  onStatusChange('ANALYZING', "Выполнение экспертной нейрофизиологической оценки...");
  const quantData = await runMathematicalAnalysis(type, (msg) => onStatusChange('ANALYZING', msg));

  const triageResult = computeTriage(type, quantData);

  onStatusChange('GENERATING_REPORT', "Формирование клинического заключения...");

  const prompt = `
PATIENT: ${patientName}
DOB: ${formattedDob}
AGE: ${age}
GENDER: ${gender}
ACQUISITION: Анализ EEG-сигнала. Sampling rate ${quantData.sampling_rate_hz} Hz, ${quantData.electrode_system} system, ${quantData.channels_count} channels.
QUALITY: SNR ${quantData.snr_db} dB, artifacts: ${quantData.artifact_types?.join(', ')}.
BACKGROUND: Rhythm ${quantData.dominant_rhythm}, Freq ${quantData.alpha_frequency_hz} Hz, Amp ${quantData.alpha_amplitude_uv} uV. Symmetry ${quantData.interhemispheric_symmetry}.
SPECTRAL: Alpha (${quantData.alpha_percent}%), Theta (${quantData.theta_percent}%), Delta (${quantData.delta_percent}%), Beta (${quantData.beta_percent}%). Ratio A/T: ${quantData.spectral_alpha_theta_ratio}.
REACTIVITY_EYE: ${quantData.alpha_reactivity}.
REACTIVITY_STIMULI: ${quantData.photic_stimulation_response}.
SLEEP: Stages ${quantData.sleep_stages?.join(', ')}, Mark: Spindles (${quantData.sleep_spindles ? 'Yes' : 'No'}), K-complexes (${quantData.k_complexes ? 'Yes' : 'No'}). Epochs: ${JSON.stringify(quantData.sleep_stage_epochs_percent)}.
PATTERNS: ${quantData.epileptiform_activity ? quantData.paroxysm_type : 'None'}. Regional: ${quantData.localization_regional}. Dynamics: ${quantData.paroxysm_frequency_desc}, ${quantData.paroxysm_duration_desc}.
VIDEO: ${quantData.video_correlation}.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: `РОЛЬ:
Вы — клинический ассистент врача-невролога / врача функциональной диагностики. Вы формируете проект клинического заключения ЭЭГ.

ВАЖНОЕ ТРЕБОВАНИЕ:
СТРОГО ЗАПРЕЩЕНО использовать названия разделов (например, "Раздел 1", "Описание фоновой ЭЭГ"), нумерацию пунктов или заголовки.
Текст должен представлять собой последовательное повествование, разделенное только на абзацы.

СТРУКТУРА ПОВЕСТВОВАНИЯ (БЕЗ ЗАГОЛОВКОВ):
1. Идентификационные данные пациента и условия регистрации (схема 10-20, число каналов, бодрствование/сон).
2. Описание фоновой ритмики (основной корковый ритм, частота, амплитуда, индекс выраженности, зональные различия, реактивность).
3. Функциональные пробы (реакция на ФС и ГВ).
4. Описание структуры сна (веретена сна, К-комплексы, дельта-активность, если зарегистрированы).
5. Анализ специфических паттернов и патологической активности (типы волн, локализация, условия возникновения). Указывайте их как клинические наблюдения.
6. Видео-корреляция (наличие/отсутствие двигательных феноменов).
7. Обобщающее клиническое заключение (формулируйте от лица врача: "Биоэлектрическая активность характеризуется...", "Организация корковой ритмики соответствует/не соответствует...").
8. Клинический прогноз и вероятностные выводы.
9. Рекомендации по дальнейшему наблюдению или обследованию.

СТИЛЬ:
- Сугубо клинический, профессиональный язык.
- Никакой нумерации, никаких символов Markdown (# или * для заголовков).
- Только сплошной текст с абзацами.
- В конце обязательно: "Данное заключение является клиническим врачебным проектом, сформированным на основании данных ЭЭГ. Интерпретация должна осуществляться в совокупности с клиникой."`
    }
  });

  onStatusChange('COMPLETED', "Клиническое заключение сформировано.");
  return {
    study_type: type,
    triage_status: triageResult.triage,
    risk_level: triageResult.risk,
    ai_report: response.text || "Ошибка генерации отчета.",
    quantitative_data: quantData,
    auditor_required: triageResult.audit,
    pdf_url: `protocol_${Date.now()}.pdf`
  };
};
