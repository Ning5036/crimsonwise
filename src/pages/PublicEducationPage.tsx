import { useEffect, useMemo, useRef, useState } from "react";
import { sbInsert, supabaseConfigured } from "../utils/supabaseClient";

/* ── i18n ────────────────────────────────────────────────────────────── */
type Lang = "zh-TW" | "en" | "id" | "vi";

const LANG_ORDER: Lang[] = ["zh-TW", "en", "id", "vi"];
const LANG_LABEL: Record<Lang, string> = {
  "zh-TW": "繁中",
  en: "EN",
  id: "Bahasa",
  vi: "Tiếng Việt",
};

function LangPills({
  current,
  onChange,
  variant,
}: {
  current: Lang;
  onChange: (l: Lang) => void;
  variant: "light" | "dark";
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        flexWrap: "wrap",
        justifyContent: "flex-end",
      }}
    >
      {LANG_ORDER.map((lng) => {
        const isActive = lng === current;
        const isLight = variant === "light";
        const styles: React.CSSProperties = isLight
          ? {
              padding: "5px 11px",
              borderRadius: 14,
              border: `1.5px solid ${isActive ? "var(--crimson-500)" : "var(--crimson-100)"}`,
              background: isActive ? "var(--crimson-500)" : "#fff",
              color: isActive ? "#fff" : "var(--crimson-600)",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s ease",
              whiteSpace: "nowrap",
            }
          : {
              padding: "4px 10px",
              borderRadius: 12,
              border: `1.5px solid ${isActive ? "#fff" : "rgba(255,255,255,0.35)"}`,
              background: isActive ? "#fff" : "rgba(255,255,255,0.12)",
              color: isActive ? "var(--crimson-600)" : "#fff",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s ease",
              whiteSpace: "nowrap",
            };
        return (
          <button
            key={lng}
            onClick={() => onChange(lng)}
            aria-pressed={isActive}
            style={styles}
          >
            {LANG_LABEL[lng]}
          </button>
        );
      })}
    </div>
  );
}

type Alt = { icon: string; t: string; d: string };
type Myth = { m: string; f: string; r: string };
type Fact = { icon: string; v: string; d: string };

interface Strings {
  appName: string;
  appSub: string;
  home: string;
  homeDesc: string;
  start: string;
  restart: string;
  next: string;
  prev: string;
  langBtn: string;
  disc: string;
  estTime: string;
  stagesFull: string[];
  mythsIntro: string;
  s1intro: string;
  alts: Alt[];
  myths: Myth[];
  guideTitle: string;
  guideNote: string;
  thresholds: [string, string][];
  refs: string[];
  tsbt: string;
  bloodHero: string;
  bloodSub: string;
  facts: Fact[];
  progress: string;
  unanswered: string;
  unanswered2: string;
  submitBtn: string;
  submitDisabled: string;
  correct: string;
  wrong: string;
  explanation: string;
  score3: string;
  score2: string;
  scoreElse: string;
  keyPoints: string;
  keyList: [string, string][];
  nextAfterQuiz: string;
  quizBackWarn: string;
  shareBtn: string;
  shareCopied: string;
  shareTitle: string;
  shareText: string;
  satTitle: string;
  satQ: string;
  satOpts: string[];
  satSug: string;
  satPh: string;
  satBtn: string;
  satTy: string;
  satFin: string;
  slogans: string[];
  offlineNotice: string;
}

const T: Record<Lang, Strings> = {
  "zh-TW": {
    appName: "CrimsonWise",
    appSub: "輸血明智選擇・民眾衛教版",
    home: "🩸 輸血，你了解多少？",
    homeDesc:
      "透過這個互動工具，5 分鐘了解常見迷思、輸血的替代方案、國際指引與血品知識，最後完成小測驗！",
    start: "開始學習 →",
    restart: "重新開始",
    next: "下一頁 →",
    prev: "← 上一頁",
    langBtn: "EN",
    disc: "本工具為衛教用途，非診斷工具。如有疑問請諮詢醫療專業人員。",
    estTime: "預計完成時間：約 5 分鐘",
    stagesFull: [
      "🔍 破除輸血迷思",
      "💊 輸血替代方案",
      "📚 國內外輸血指引",
      "🩸 血品得來不易",
      "📝 輸血知識小測驗",
      "⭐ 滿意度回饋",
    ],
    mythsIntro:
      "以下是民眾最常對輸血產生的錯誤認知，了解這些迷思有助於您做出更明智的醫療決策。",
    s1intro: "輸血並非唯一選擇！以下替代方案可能更適合您，請與醫師討論。",
    alts: [
      {
        icon: "💊",
        t: "鐵劑補充",
        d: "口服或靜脈鐵劑,適合缺鐵性貧血,見效約 2–4 週。",
      },
      {
        icon: "💉",
        t: "紅血球生成素(EPO)",
        d: "刺激骨髓自行造血,適合腎性貧血或化療引起的貧血。",
      },
      {
        icon: "🥦",
        t: "飲食調整",
        d: "多攝取富含鐵質食物(紅肉、豆類、深綠葉蔬菜)並搭配維他命 C 促進吸收。",
      },
      {
        icon: "🩸",
        t: "術中自體血回輸",
        d: "手術時回收自身血液再輸回,降低異體輸血的風險。",
      },
      {
        icon: "🧪",
        t: "止血藥物(TXA)",
        d: "氨甲環酸可有效減少手術或外傷的出血量。",
      },
      {
        icon: "🌿",
        t: "葉酸 ／ 維他命 B12",
        d: "改善造血功能,適合巨球性貧血或長期素食者。",
      },
    ],
    myths: [
      {
        m: "輸血越多越好，補血就補元氣",
        f: "過多輸血增加免疫反應、感染及心肺過負荷風險。研究顯示限制性輸血策略效果相當甚至更好。",
        r: "TRICC Trial · NEJM 1999",
      },
      {
        m: "血色素低就一定要輸血",
        f: "輸血決策應綜合考量症狀、臨床狀況及個人耐受性，而非單看數字。",
        r: "Carson et al. · JAMA 2016",
      },
      {
        m: "輸血很安全，完全沒有風險",
        f: "輸血可能引發過敏、發燒、TRALI(急性肺損傷)、TACO(循環過負荷)等嚴重反應。",
        r: "WHO PBM Policy Brief 2021",
      },
      {
        m: "輸血馬上就會好",
        f: "紅血球壽命約 80–120 天，症狀改善需要時間，根本原因仍需積極治療。",
        r: "AABB Technical Manual 2023",
      },
    ],
    guideTitle: "國際輸血閾值參考",
    guideNote: "以下閾值為參考依據，實際決策需由醫師綜合評估。",
    thresholds: [
      ["一般成人", "Hb < 7 g/dL"],
      ["心臟病患者", "Hb < 8 g/dL"],
      ["急性冠心症", "Hb < 8–10 g/dL"],
      ["大量出血休克", "依臨床判斷"],
      ["慢性腎臟病", "Hb < 7–8 g/dL"],
    ],
    refs: [
      "AABB Clinical Practice Guidelines · JAMA 2023",
      "British Society for Haematology (BSH) · 2023",
      "WHO Patient Blood Management · 2021",
      "TRISS Trial · NEJM 2014",
      "TRICC Trial · NEJM 1999",
    ],
    tsbt: "台灣輸血學會 — 下載專區 ↗",
    bloodHero: "每一袋血，都是生命的禮物",
    bloodSub: "珍惜使用，讓每一滴血都用得值得",
    facts: [
      { icon: "🕐", v: "每 1.2 秒", d: "台灣就使用一袋血液" },
      { icon: "🩸", v: "400–500 mL", d: "每次捐血的量" },
      { icon: "⏳", v: "35–42 天", d: "紅血球最長保存期" },
      { icon: "👤", v: "1 位捐血者", d: "最多可幫助 3 位病患" },
      { icon: "🧪", v: "9 項篩檢", d: "每袋血嚴格把關" },
      { icon: "❤️", v: "無償捐血", d: "全靠愛心志願者" },
    ],
    progress: "作答進度",
    unanswered: "還有",
    unanswered2: "題未作答",
    submitBtn: "送出答案 →",
    submitDisabled: "請先完成所有題目",
    correct: "✅ 答對了！",
    wrong: "❌ 答錯了，正確答案為",
    explanation: "解析",
    score3: "全對！太厲害了！",
    score2: "答對 2 題，不錯！",
    scoreElse: "繼續加油！",
    keyPoints: "重點複習",
    keyList: [
      ["🩸", "一般成人 Hb < 7 g/dL 且有症狀才建議輸血；心臟病患 Hb < 8 g/dL。"],
      ["🔍", "「輸越多越好」是迷思——限制性輸血策略效果不劣於大量輸血。"],
      [
        "❤️",
        "紅血球保存期 35–42 天，台灣血液 100% 來自無償志願捐血者，每位最多救助 3 人。",
      ],
    ],
    nextAfterQuiz: "繼續 →",
    quizBackWarn: "測驗結果將仍可在此頁查看，確定返回上一頁？",
    shareBtn: "分享此工具 🔗",
    shareCopied: "✅ 連結已複製！",
    shareTitle: "CrimsonWise 輸血明智選擇",
    shareText: "透過這個互動工具了解輸血相關知識，並完成小測驗！",
    satTitle: "整體滿意度",
    satQ: "透過本工具，您對輸血是否有更正確的觀念？",
    satOpts: ["非常沒有幫助", "沒幫助", "普通", "有幫助", "非常有幫助"],
    satSug: "您的意見或建議(非必填)",
    satPh: "請填寫您的意見…",
    satBtn: "完成送出",
    satTy: "🎉 感謝您的參與！",
    satFin:
      "您的回答已記錄。輸血是重要的醫療決策，請務必與您的醫療團隊充分溝通，做出最適合您的選擇。",
    slogans: [
      "🩸 減血一袋 救人一命",
      "💡 謹慎用血 才能救命",
      "🎯 有7就好 不比感到7上8下",
    ],
    offlineNotice: "網路忙碌，已暫存於本機並將於下次上線時送出。",
  },
  en: {
    appName: "CrimsonWise",
    appSub: "Patient Blood Education · Public Edition",
    home: "🩸 How Much Do You Know About Transfusion?",
    homeDesc:
      "Learn about common myths, transfusion alternatives, international guidelines, and blood facts — then test your knowledge in 5 minutes!",
    start: "Start Learning →",
    restart: "Start Over",
    next: "Next →",
    prev: "← Back",
    langBtn: "Bahasa",
    disc: "For educational purposes only — not a diagnostic tool. Always consult your healthcare provider.",
    estTime: "Estimated time: ~5 minutes",
    stagesFull: [
      "🔍 Myth Busters",
      "💊 Transfusion Alternatives",
      "📚 Clinical Guidelines",
      "🩸 Blood Is Precious",
      "📝 Knowledge Quiz",
      "⭐ Feedback",
    ],
    mythsIntro:
      "These are the most common misconceptions about blood transfusion. Understanding them will help you make more informed medical decisions.",
    s1intro:
      "Transfusion is not the only option! Discuss these alternatives with your doctor.",
    alts: [
      {
        icon: "💊",
        t: "Iron Supplementation",
        d: "Oral or IV iron for iron-deficiency anemia. Effects in 2–4 weeks.",
      },
      {
        icon: "💉",
        t: "Erythropoietin (EPO)",
        d: "Stimulates bone marrow production for renal or chemo-related anemia.",
      },
      {
        icon: "🥦",
        t: "Dietary Optimization",
        d: "Iron-rich foods (red meat, legumes, dark greens) + Vitamin C to boost absorption.",
      },
      {
        icon: "🩸",
        t: "Cell Salvage",
        d: "Recycle your own blood during surgery to reduce the need for donor blood.",
      },
      {
        icon: "🧪",
        t: "Hemostatic Agents (TXA)",
        d: "Tranexamic acid reduces blood loss in surgery or trauma.",
      },
      {
        icon: "🌿",
        t: "Folate / Vitamin B12",
        d: "Restores hematopoiesis; especially for megaloblastic anemia or vegetarians.",
      },
    ],
    myths: [
      {
        m: "More transfusion = faster recovery",
        f: "Excess transfusion raises risk of immune reactions, infections, TRALI and TACO. Restrictive strategy is non-inferior or superior.",
        r: "TRICC Trial · NEJM 1999",
      },
      {
        m: "Low Hb always requires transfusion",
        f: "Decisions must consider symptoms, clinical context, and tolerance — not numbers alone.",
        r: "Carson et al. · JAMA 2016",
      },
      {
        m: "Transfusion is completely safe",
        f: "Risks include allergic reactions, fever, TRALI (acute lung injury), TACO (circulatory overload) and rare infections.",
        r: "WHO PBM Policy Brief 2021",
      },
      {
        m: "Transfusion works immediately",
        f: "Transfused RBCs have a limited lifespan (80–120 days). Recovery takes time and the underlying cause still requires treatment.",
        r: "AABB Technical Manual 2023",
      },
    ],
    guideTitle: "International Transfusion Thresholds",
    guideNote:
      "These thresholds are reference values. Actual decisions require physician assessment.",
    thresholds: [
      ["General Adults", "Hb < 7 g/dL"],
      ["Cardiac Disease", "Hb < 8 g/dL"],
      ["Acute MI", "Hb < 8–10 g/dL"],
      ["Hemorrhagic Shock", "Clinical Judgment"],
      ["CKD", "Hb < 7–8 g/dL"],
    ],
    refs: [
      "AABB Clinical Practice Guidelines · JAMA 2023",
      "British Society for Haematology (BSH) · 2023",
      "WHO Patient Blood Management · 2021",
      "TRISS Trial · NEJM 2014",
      "TRICC Trial · NEJM 1999",
    ],
    tsbt: "Taiwan Society of Blood Transfusion — Downloads ↗",
    bloodHero: "Every Unit of Blood Is a Gift of Life",
    bloodSub: "Use it wisely — make every drop count",
    facts: [
      { icon: "🕐", v: "Every 1.2 sec", d: "A unit is used in Taiwan" },
      { icon: "🩸", v: "400–500 mL", d: "Per donation" },
      { icon: "⏳", v: "35–42 days", d: "Max RBC storage life" },
      { icon: "👤", v: "1 donor", d: "Can help up to 3 patients" },
      { icon: "🧪", v: "9 screenings", d: "Per unit — rigorous testing" },
      { icon: "❤️", v: "100% voluntary", d: "Taiwan's blood supply" },
    ],
    progress: "Progress",
    unanswered: "",
    unanswered2: "question(s) remaining",
    submitBtn: "Submit Answers →",
    submitDisabled: "Please answer all questions first",
    correct: "✅ Correct!",
    wrong: "❌ Incorrect. Correct answer:",
    explanation: "Explanation",
    score3: "Perfect score! 🎉",
    score2: "2 out of 3 — well done!",
    scoreElse: "Keep learning!",
    keyPoints: "Key Takeaways",
    keyList: [
      [
        "🩸",
        "General adults: transfuse at Hb < 7 g/dL with symptoms; cardiac patients at Hb < 8 g/dL.",
      ],
      [
        "🔍",
        "More transfusion ≠ better outcomes — restrictive strategy is non-inferior to liberal.",
      ],
      [
        "❤️",
        "RBCs last 35–42 days. Taiwan's supply is 100% voluntary — one donor helps up to 3 patients.",
      ],
    ],
    nextAfterQuiz: "Continue →",
    quizBackWarn:
      "Your quiz results will still be visible on this page. Go back anyway?",
    shareBtn: "Share This Tool 🔗",
    shareCopied: "✅ Link Copied!",
    shareTitle: "CrimsonWise – Transfusion Decision Support",
    shareText:
      "Learn about blood transfusion through this interactive tool and take a knowledge quiz!",
    satTitle: "Overall Satisfaction",
    satQ: "Did this tool improve your understanding of blood transfusion?",
    satOpts: [
      "Not helpful at all",
      "Not helpful",
      "Neutral",
      "Helpful",
      "Very helpful",
    ],
    satSug: "Suggestions (optional)",
    satPh: "Share your thoughts…",
    satBtn: "Submit",
    satTy: "🎉 Thank You for Participating!",
    satFin:
      "Your response is recorded. Transfusion is an important medical decision — always discuss with your healthcare team.",
    slogans: [
      "🩸 Save a Unit, Save a Life",
      "💡 Wise Transfusion Saves Lives",
      "🎯 Hb 7 Is Enough",
    ],
    offlineNotice: "Network busy — saved locally, will retry on next visit.",
  },
  id: {
    appName: "CrimsonWise",
    appSub: "Pilihan Bijak Transfusi · Edukasi Publik",
    home: "🩸 Seberapa banyak Anda tahu tentang transfusi darah?",
    homeDesc:
      "Pelajari mitos umum, alternatif transfusi, pedoman internasional, dan fakta tentang darah melalui alat interaktif ini — selesaikan kuis singkat dalam 5 menit!",
    start: "Mulai Belajar →",
    restart: "Mulai Ulang",
    next: "Berikutnya →",
    prev: "← Kembali",
    langBtn: "Tiếng Việt",
    disc: "Hanya untuk tujuan edukasi — bukan alat diagnosis. Selalu konsultasikan dengan tenaga medis Anda.",
    estTime: "Perkiraan waktu: ~5 menit",
    stagesFull: [
      "🔍 Mitos vs Fakta",
      "💊 Alternatif Transfusi",
      "📚 Pedoman Klinis",
      "🩸 Darah Sangat Berharga",
      "📝 Kuis Pengetahuan",
      "⭐ Umpan Balik",
    ],
    mythsIntro:
      "Berikut adalah miskonsepsi paling umum tentang transfusi darah. Memahaminya membantu Anda membuat keputusan medis yang lebih bijak.",
    s1intro:
      "Transfusi bukan satu-satunya pilihan! Diskusikan alternatif berikut dengan dokter Anda.",
    alts: [
      {
        icon: "💊",
        t: "Suplementasi Zat Besi",
        d: "Zat besi oral atau intravena untuk anemia defisiensi besi. Efek terlihat dalam 2–4 minggu.",
      },
      {
        icon: "💉",
        t: "Eritropoietin (EPO)",
        d: "Merangsang sumsum tulang memproduksi sel darah merah; cocok untuk anemia karena penyakit ginjal atau kemoterapi.",
      },
      {
        icon: "🥦",
        t: "Optimasi Pola Makan",
        d: "Makanan kaya zat besi (daging merah, kacang-kacangan, sayuran hijau) ditambah Vitamin C untuk meningkatkan penyerapan.",
      },
      {
        icon: "🩸",
        t: "Cell Salvage",
        d: "Mengumpulkan kembali darah pasien selama operasi untuk mengurangi kebutuhan darah donor.",
      },
      {
        icon: "🧪",
        t: "Agen Hemostatik (TXA)",
        d: "Asam traneksamat mengurangi kehilangan darah saat operasi atau trauma.",
      },
      {
        icon: "🌿",
        t: "Folat / Vitamin B12",
        d: "Memulihkan pembentukan sel darah; terutama untuk anemia megaloblastik atau vegetarian.",
      },
    ],
    myths: [
      {
        m: "Transfusi lebih banyak = pemulihan lebih cepat",
        f: "Transfusi berlebihan meningkatkan risiko reaksi imun, infeksi, TRALI dan TACO. Strategi restriktif setara atau lebih unggul.",
        r: "TRICC Trial · NEJM 1999",
      },
      {
        m: "Hb rendah selalu memerlukan transfusi",
        f: "Keputusan harus mempertimbangkan gejala, konteks klinis, dan toleransi pasien — bukan sekadar angka.",
        r: "Carson et al. · JAMA 2016",
      },
      {
        m: "Transfusi sepenuhnya aman",
        f: "Risiko meliputi reaksi alergi, demam, TRALI (cedera paru akut), TACO (kelebihan beban sirkulasi), dan infeksi langka.",
        r: "WHO PBM Policy Brief 2021",
      },
      {
        m: "Transfusi langsung memberi efek instan",
        f: "Sel darah merah yang ditransfusi memiliki masa hidup terbatas (80–120 hari). Pemulihan butuh waktu, dan penyebab dasar tetap perlu diobati.",
        r: "AABB Technical Manual 2023",
      },
    ],
    guideTitle: "Ambang Batas Transfusi Internasional",
    guideNote:
      "Ambang ini hanya referensi. Keputusan akhir harus melalui penilaian dokter.",
    thresholds: [
      ["Dewasa Umum", "Hb < 7 g/dL"],
      ["Penyakit Jantung", "Hb < 8 g/dL"],
      ["Infark Miokard Akut", "Hb < 8–10 g/dL"],
      ["Syok Hemoragik", "Penilaian Klinis"],
      ["Penyakit Ginjal Kronis", "Hb < 7–8 g/dL"],
    ],
    refs: [
      "AABB Clinical Practice Guidelines · JAMA 2023",
      "British Society for Haematology (BSH) · 2023",
      "WHO Patient Blood Management · 2021",
      "TRISS Trial · NEJM 2014",
      "TRICC Trial · NEJM 1999",
    ],
    tsbt: "Taiwan Society of Blood Transfusion — Unduhan ↗",
    bloodHero: "Setiap Kantong Darah Adalah Hadiah Kehidupan",
    bloodSub: "Gunakan dengan bijak — buat setiap tetes berarti",
    facts: [
      {
        icon: "🕐",
        v: "Setiap 1.2 detik",
        d: "Satu kantong digunakan di Taiwan",
      },
      { icon: "🩸", v: "400–500 mL", d: "Per donasi" },
      {
        icon: "⏳",
        v: "35–42 hari",
        d: "Masa simpan maksimum sel darah merah",
      },
      { icon: "👤", v: "1 pendonor", d: "Dapat membantu hingga 3 pasien" },
      { icon: "🧪", v: "9 skrining", d: "Per kantong — pengujian ketat" },
      { icon: "❤️", v: "100% sukarela", d: "Pasokan darah Taiwan" },
    ],
    progress: "Progres",
    unanswered: "",
    unanswered2: "pertanyaan tersisa",
    submitBtn: "Kirim Jawaban →",
    submitDisabled: "Mohon jawab semua pertanyaan terlebih dahulu",
    correct: "✅ Benar!",
    wrong: "❌ Salah. Jawaban yang benar:",
    explanation: "Penjelasan",
    score3: "Skor sempurna! 🎉",
    score2: "2 dari 3 — bagus sekali!",
    scoreElse: "Terus belajar!",
    keyPoints: "Poin Penting",
    keyList: [
      [
        "🩸",
        "Dewasa umum: transfusi pada Hb < 7 g/dL bila bergejala; pasien jantung pada Hb < 8 g/dL.",
      ],
      [
        "🔍",
        "Transfusi lebih banyak ≠ hasil lebih baik — strategi restriktif setara dengan strategi liberal.",
      ],
      [
        "❤️",
        "Sel darah merah bertahan 35–42 hari. Pasokan Taiwan 100% sukarela — satu pendonor membantu hingga 3 pasien.",
      ],
    ],
    nextAfterQuiz: "Lanjutkan →",
    quizBackWarn:
      "Hasil kuis Anda akan tetap terlihat di halaman ini. Tetap kembali?",
    shareBtn: "Bagikan Alat Ini 🔗",
    shareCopied: "✅ Tautan Disalin!",
    shareTitle: "CrimsonWise – Dukungan Keputusan Transfusi",
    shareText:
      "Pelajari tentang transfusi darah melalui alat interaktif ini dan ikuti kuis pengetahuan!",
    satTitle: "Kepuasan Keseluruhan",
    satQ: "Apakah alat ini meningkatkan pemahaman Anda tentang transfusi darah?",
    satOpts: [
      "Sama sekali tidak membantu",
      "Tidak membantu",
      "Netral",
      "Membantu",
      "Sangat membantu",
    ],
    satSug: "Saran (opsional)",
    satPh: "Bagikan pemikiran Anda…",
    satBtn: "Kirim",
    satTy: "🎉 Terima Kasih atas Partisipasi Anda!",
    satFin:
      "Tanggapan Anda telah direkam. Transfusi adalah keputusan medis penting — selalu diskusikan dengan tim medis Anda.",
    slogans: [
      "🩸 Selamatkan Satu Kantong, Selamatkan Satu Nyawa",
      "💡 Transfusi Bijak Menyelamatkan Nyawa",
      "🎯 Hb 7 Sudah Cukup",
    ],
    offlineNotice:
      "Jaringan sibuk — disimpan lokal, akan dicoba lagi pada kunjungan berikutnya.",
  },
  vi: {
    appName: "CrimsonWise",
    appSub: "Lựa chọn Truyền máu Sáng suốt · Phiên bản Cộng đồng",
    home: "🩸 Bạn hiểu bao nhiêu về truyền máu?",
    homeDesc:
      "Tìm hiểu về những hiểu lầm phổ biến, các phương pháp thay thế truyền máu, hướng dẫn quốc tế và kiến thức về máu — hoàn thành bài kiểm tra ngắn trong 5 phút!",
    start: "Bắt đầu học →",
    restart: "Bắt đầu lại",
    next: "Tiếp theo →",
    prev: "← Quay lại",
    langBtn: "繁中",
    disc: "Chỉ dành cho mục đích giáo dục — không phải công cụ chẩn đoán. Vui lòng tham vấn nhân viên y tế của bạn.",
    estTime: "Thời gian ước tính: khoảng 5 phút",
    stagesFull: [
      "🔍 Phá vỡ hiểu lầm",
      "💊 Phương pháp thay thế",
      "📚 Hướng dẫn lâm sàng",
      "🩸 Máu rất quý giá",
      "📝 Bài kiểm tra",
      "⭐ Đánh giá",
    ],
    mythsIntro:
      "Đây là những hiểu lầm phổ biến nhất về truyền máu. Hiểu rõ chúng giúp bạn đưa ra quyết định y tế sáng suốt hơn.",
    s1intro:
      "Truyền máu không phải là lựa chọn duy nhất! Hãy thảo luận các phương pháp thay thế sau với bác sĩ của bạn.",
    alts: [
      {
        icon: "💊",
        t: "Bổ sung sắt",
        d: "Sắt uống hoặc tiêm tĩnh mạch cho thiếu máu thiếu sắt. Hiệu quả sau 2–4 tuần.",
      },
      {
        icon: "💉",
        t: "Erythropoietin (EPO)",
        d: "Kích thích tủy xương sản xuất hồng cầu, phù hợp cho thiếu máu do bệnh thận hoặc hóa trị.",
      },
      {
        icon: "🥦",
        t: "Tối ưu chế độ ăn",
        d: "Thực phẩm giàu sắt (thịt đỏ, đậu, rau lá xanh đậm) cùng Vitamin C để tăng hấp thu.",
      },
      {
        icon: "🩸",
        t: "Tái sử dụng máu (Cell Salvage)",
        d: "Thu lại máu của chính bệnh nhân trong phẫu thuật để giảm nhu cầu máu hiến.",
      },
      {
        icon: "🧪",
        t: "Thuốc cầm máu (TXA)",
        d: "Acid tranexamic giảm mất máu trong phẫu thuật hoặc chấn thương.",
      },
      {
        icon: "🌿",
        t: "Folate / Vitamin B12",
        d: "Phục hồi tạo máu, đặc biệt cho thiếu máu hồng cầu khổng lồ hoặc người ăn chay.",
      },
    ],
    myths: [
      {
        m: "Truyền máu càng nhiều = hồi phục càng nhanh",
        f: "Truyền máu quá mức làm tăng nguy cơ phản ứng miễn dịch, nhiễm trùng, TRALI và TACO. Chiến lược hạn chế không thua kém hoặc tốt hơn.",
        r: "TRICC Trial · NEJM 1999",
      },
      {
        m: "Hb thấp luôn cần truyền máu",
        f: "Quyết định phải dựa trên triệu chứng, bối cảnh lâm sàng và sức chịu đựng — không chỉ con số.",
        r: "Carson et al. · JAMA 2016",
      },
      {
        m: "Truyền máu hoàn toàn an toàn",
        f: "Nguy cơ bao gồm phản ứng dị ứng, sốt, TRALI (tổn thương phổi cấp), TACO (quá tải tuần hoàn) và nhiễm trùng hiếm gặp.",
        r: "WHO PBM Policy Brief 2021",
      },
      {
        m: "Truyền máu có tác dụng tức thì",
        f: "Hồng cầu truyền vào có tuổi thọ giới hạn (80–120 ngày). Phục hồi cần thời gian, và nguyên nhân nền vẫn cần được điều trị.",
        r: "AABB Technical Manual 2023",
      },
    ],
    guideTitle: "Ngưỡng Truyền máu Quốc tế",
    guideNote:
      "Các ngưỡng này chỉ mang tính tham khảo. Quyết định cuối cùng cần đánh giá của bác sĩ.",
    thresholds: [
      ["Người lớn nói chung", "Hb < 7 g/dL"],
      ["Bệnh tim", "Hb < 8 g/dL"],
      ["Nhồi máu cơ tim cấp", "Hb < 8–10 g/dL"],
      ["Sốc mất máu", "Đánh giá lâm sàng"],
      ["Bệnh thận mạn", "Hb < 7–8 g/dL"],
    ],
    refs: [
      "AABB Clinical Practice Guidelines · JAMA 2023",
      "British Society for Haematology (BSH) · 2023",
      "WHO Patient Blood Management · 2021",
      "TRISS Trial · NEJM 2014",
      "TRICC Trial · NEJM 1999",
    ],
    tsbt: "Hội Truyền máu Đài Loan — Tải xuống ↗",
    bloodHero: "Mỗi Đơn vị Máu là Một Món Quà Sự Sống",
    bloodSub: "Sử dụng khôn ngoan — trân trọng từng giọt",
    facts: [
      { icon: "🕐", v: "Mỗi 1.2 giây", d: "Một đơn vị được dùng tại Đài Loan" },
      { icon: "🩸", v: "400–500 mL", d: "Mỗi lần hiến" },
      { icon: "⏳", v: "35–42 ngày", d: "Hạn bảo quản tối đa của hồng cầu" },
      { icon: "👤", v: "1 người hiến", d: "Có thể giúp tối đa 3 bệnh nhân" },
      { icon: "🧪", v: "9 xét nghiệm", d: "Mỗi đơn vị — kiểm tra nghiêm ngặt" },
      { icon: "❤️", v: "100% tự nguyện", d: "Nguồn máu của Đài Loan" },
    ],
    progress: "Tiến độ",
    unanswered: "",
    unanswered2: "câu hỏi còn lại",
    submitBtn: "Gửi câu trả lời →",
    submitDisabled: "Vui lòng trả lời tất cả các câu hỏi trước",
    correct: "✅ Chính xác!",
    wrong: "❌ Sai. Đáp án đúng:",
    explanation: "Giải thích",
    score3: "Điểm tuyệt đối! 🎉",
    score2: "Đúng 2 trên 3 — rất tốt!",
    scoreElse: "Hãy tiếp tục học hỏi!",
    keyPoints: "Điểm chính",
    keyList: [
      [
        "🩸",
        "Người lớn nói chung: truyền khi Hb < 7 g/dL có triệu chứng; bệnh nhân tim mạch khi Hb < 8 g/dL.",
      ],
      [
        "🔍",
        "Truyền nhiều hơn ≠ kết quả tốt hơn — chiến lược hạn chế không thua kém chiến lược tự do.",
      ],
      [
        "❤️",
        "Hồng cầu sống được 35–42 ngày. Nguồn máu Đài Loan 100% tự nguyện — một người hiến giúp tối đa 3 bệnh nhân.",
      ],
    ],
    nextAfterQuiz: "Tiếp tục →",
    quizBackWarn:
      "Kết quả bài kiểm tra của bạn vẫn sẽ được hiển thị trên trang này. Vẫn quay lại?",
    shareBtn: "Chia sẻ công cụ này 🔗",
    shareCopied: "✅ Đã sao chép liên kết!",
    shareTitle: "CrimsonWise – Hỗ trợ Quyết định Truyền máu",
    shareText:
      "Tìm hiểu về truyền máu qua công cụ tương tác này và làm bài kiểm tra kiến thức!",
    satTitle: "Mức độ hài lòng tổng thể",
    satQ: "Công cụ này có cải thiện hiểu biết của bạn về truyền máu không?",
    satOpts: [
      "Hoàn toàn không hữu ích",
      "Không hữu ích",
      "Bình thường",
      "Hữu ích",
      "Rất hữu ích",
    ],
    satSug: "Góp ý (tùy chọn)",
    satPh: "Chia sẻ suy nghĩ của bạn…",
    satBtn: "Gửi",
    satTy: "🎉 Cảm ơn bạn đã tham gia!",
    satFin:
      "Phản hồi của bạn đã được ghi nhận. Truyền máu là một quyết định y tế quan trọng — luôn thảo luận với đội ngũ y tế của bạn.",
    slogans: [
      "🩸 Cứu một đơn vị, cứu một mạng người",
      "💡 Truyền máu khôn ngoan cứu mạng",
      "🎯 Hb 7 là đủ",
    ],
    offlineNotice:
      "Mạng đang bận — đã lưu cục bộ, sẽ thử lại trong lần truy cập tiếp theo.",
  },
};

type QuizItem = {
  id: number;
  q: string;
  opts: { l: string; t: string }[];
  ans: string;
  exp: string;
  src: string;
};

const QUIZ: Record<Lang, QuizItem[]> = {
  "zh-TW": [
    {
      id: 1,
      q: "根據國際輸血指引，一般成人在什麼情況下才建議考慮輸血？",
      opts: [
        { l: "A", t: "血色素 Hb < 10 g/dL，感覺有點疲倦時" },
        { l: "B", t: "血色素 Hb < 7 g/dL，且合併有貧血症狀時" },
        { l: "C", t: "只要血色素偏低，醫師就應立即安排輸血" },
        { l: "D", t: "輸血越早越好，可預防病情惡化" },
      ],
      ans: "B",
      exp: "根據 AABB(2023)等國際指引,一般成人輸血閾值為 Hb < 7 g/dL,且須合併有症狀性貧血才建議輸血。心臟病患者閾值稍放寬至 Hb < 8 g/dL。單純數字偏低並非唯一依據。",
      src: "AABB Clinical Practice Guidelines · JAMA 2023",
    },
    {
      id: 2,
      q: "以下哪一項是常見的「輸血迷思」，實際上並不正確？",
      opts: [
        { l: "A", t: "輸血可能引發過敏反應、發燒或急性肺損傷" },
        { l: "B", t: "輸越多血，恢復越快，補血就補元氣" },
        { l: "C", t: "鐵劑補充、EPO 注射可作為輸血的替代方案" },
        { l: "D", t: "限制性輸血策略的效果不劣於大量輸血" },
      ],
      ans: "B",
      exp: "「輸血越多越好」是常見迷思。TRICC Trial(NEJM 1999)顯示,限制性輸血策略的 30 天死亡率與開放性相當,部分族群甚至更好。過多輸血反而增加免疫反應、感染及心肺過負荷風險。",
      src: "Hébert et al., NEJM 1999 · TRICC Trial",
    },
    {
      id: 3,
      q: "關於血液資源，下列哪一個敘述是正確的？",
      opts: [
        { l: "A", t: "紅血球可以無限期冷藏保存，不用擔心過期" },
        { l: "B", t: "每位捐血者最多只能幫助 1 位病患" },
        { l: "C", t: "台灣的血液來源完全依靠政府強制徵集" },
        { l: "D", t: "紅血球保存期限為 35–42 天，且全程仰賴無償志願捐血者" },
      ],
      ans: "D",
      exp: "紅血球最長保存期為 35–42 天。台灣血液 100% 來自無償志願捐血者,每人捐出 400–500 mL,最多可幫助 3 位病患,每袋血均須經過 9 項嚴格篩檢。",
      src: "CrimsonWise 衛教內容 · 台灣血液基金會",
    },
  ],
  en: [
    {
      id: 1,
      q: "According to international guidelines, when should transfusion be considered for general adults?",
      opts: [
        { l: "A", t: "When Hb < 10 g/dL and the patient feels tired" },
        { l: "B", t: "When Hb < 7 g/dL with symptomatic anemia" },
        { l: "C", t: "Immediately whenever hemoglobin is below normal" },
        { l: "D", t: "As early as possible to prevent deterioration" },
      ],
      ans: "B",
      exp: "According to AABB (2023), the threshold is Hb < 7 g/dL with symptomatic anemia. Cardiac patients: Hb < 8 g/dL. Numbers alone are insufficient.",
      src: "AABB Clinical Practice Guidelines · JAMA 2023",
    },
    {
      id: 2,
      q: "Which of the following is a common transfusion myth that is actually incorrect?",
      opts: [
        {
          l: "A",
          t: "Transfusion can cause allergic reactions, fever, or TRALI",
        },
        { l: "B", t: "More transfusion means faster recovery and more energy" },
        {
          l: "C",
          t: "Iron supplementation and EPO can be alternatives to transfusion",
        },
        {
          l: "D",
          t: "Restrictive transfusion strategy is non-inferior to liberal strategy",
        },
      ],
      ans: "B",
      exp: "The TRICC Trial (NEJM 1999) showed restrictive strategy had similar 30-day mortality, with some subgroups doing better. Excess transfusion increases risks.",
      src: "Hébert et al., NEJM 1999 · TRICC Trial",
    },
    {
      id: 3,
      q: "Which statement about blood resources is correct?",
      opts: [
        { l: "A", t: "Red blood cells can be stored indefinitely" },
        { l: "B", t: "Each donor can only help one patient" },
        {
          l: "C",
          t: "Taiwan's blood supply depends on government-mandated collection",
        },
        { l: "D", t: "RBCs last 35–42 days and supply is 100% voluntary" },
      ],
      ans: "D",
      exp: "RBCs last 35–42 days. Taiwan's supply is 100% voluntary — each donor helps up to 3 patients, and every unit undergoes 9 screening tests.",
      src: "CrimsonWise Education · Taiwan Blood Services Foundation",
    },
  ],
  id: [
    {
      id: 1,
      q: "Menurut pedoman internasional, kapan transfusi sebaiknya dipertimbangkan untuk dewasa umum?",
      opts: [
        { l: "A", t: "Saat Hb < 10 g/dL dan pasien merasa lelah" },
        { l: "B", t: "Saat Hb < 7 g/dL dengan gejala anemia" },
        { l: "C", t: "Segera saat hemoglobin di bawah normal" },
        { l: "D", t: "Sedini mungkin untuk mencegah perburukan" },
      ],
      ans: "B",
      exp: "Menurut AABB (2023), ambangnya adalah Hb < 7 g/dL dengan gejala anemia. Pasien jantung: Hb < 8 g/dL. Angka saja tidak cukup.",
      src: "AABB Clinical Practice Guidelines · JAMA 2023",
    },
    {
      id: 2,
      q: "Manakah dari pernyataan berikut yang merupakan mitos transfusi yang sebenarnya tidak benar?",
      opts: [
        {
          l: "A",
          t: "Transfusi dapat menyebabkan reaksi alergi, demam, atau TRALI",
        },
        {
          l: "B",
          t: "Lebih banyak transfusi berarti pemulihan lebih cepat dan lebih bertenaga",
        },
        {
          l: "C",
          t: "Suplemen zat besi dan EPO dapat menjadi alternatif transfusi",
        },
        {
          l: "D",
          t: "Strategi transfusi restriktif tidak kalah dengan strategi liberal",
        },
      ],
      ans: "B",
      exp: "TRICC Trial (NEJM 1999) menunjukkan strategi restriktif memiliki mortalitas 30 hari yang setara, dengan beberapa subkelompok lebih baik. Transfusi berlebihan meningkatkan risiko.",
      src: "Hébert et al., NEJM 1999 · TRICC Trial",
    },
    {
      id: 3,
      q: "Pernyataan manakah tentang sumber daya darah yang benar?",
      opts: [
        { l: "A", t: "Sel darah merah dapat disimpan tanpa batas waktu" },
        { l: "B", t: "Setiap pendonor hanya dapat membantu satu pasien" },
        {
          l: "C",
          t: "Pasokan darah Taiwan bergantung pada pengumpulan yang diwajibkan pemerintah",
        },
        {
          l: "D",
          t: "Sel darah merah bertahan 35–42 hari dan pasokan 100% sukarela",
        },
      ],
      ans: "D",
      exp: "Sel darah merah bertahan 35–42 hari. Pasokan Taiwan 100% sukarela — setiap pendonor membantu hingga 3 pasien, dan setiap kantong melalui 9 uji skrining.",
      src: "CrimsonWise Education · Taiwan Blood Services Foundation",
    },
  ],
  vi: [
    {
      id: 1,
      q: "Theo hướng dẫn quốc tế, khi nào nên cân nhắc truyền máu cho người lớn nói chung?",
      opts: [
        { l: "A", t: "Khi Hb < 10 g/dL và bệnh nhân cảm thấy mệt mỏi" },
        { l: "B", t: "Khi Hb < 7 g/dL kèm triệu chứng thiếu máu" },
        { l: "C", t: "Ngay khi hemoglobin dưới mức bình thường" },
        { l: "D", t: "Càng sớm càng tốt để ngăn diễn tiến xấu" },
      ],
      ans: "B",
      exp: "Theo AABB (2023), ngưỡng là Hb < 7 g/dL kèm triệu chứng thiếu máu. Bệnh nhân tim mạch: Hb < 8 g/dL. Chỉ con số là không đủ.",
      src: "AABB Clinical Practice Guidelines · JAMA 2023",
    },
    {
      id: 2,
      q: "Phát biểu nào sau đây là một hiểu lầm phổ biến về truyền máu thực tế là sai?",
      opts: [
        { l: "A", t: "Truyền máu có thể gây phản ứng dị ứng, sốt hoặc TRALI" },
        {
          l: "B",
          t: "Truyền máu càng nhiều thì hồi phục càng nhanh và khỏe hơn",
        },
        {
          l: "C",
          t: "Bổ sung sắt và EPO có thể là phương pháp thay thế truyền máu",
        },
        {
          l: "D",
          t: "Chiến lược truyền máu hạn chế không thua kém chiến lược tự do",
        },
      ],
      ans: "B",
      exp: "TRICC Trial (NEJM 1999) cho thấy chiến lược hạn chế có tỷ lệ tử vong 30 ngày tương đương, một số phân nhóm còn tốt hơn. Truyền quá nhiều làm tăng nguy cơ.",
      src: "Hébert et al., NEJM 1999 · TRICC Trial",
    },
    {
      id: 3,
      q: "Phát biểu nào sau đây về nguồn máu là đúng?",
      opts: [
        { l: "A", t: "Hồng cầu có thể bảo quản vô thời hạn" },
        { l: "B", t: "Mỗi người hiến chỉ có thể giúp một bệnh nhân" },
        {
          l: "C",
          t: "Nguồn máu Đài Loan dựa vào thu thập bắt buộc của chính phủ",
        },
        { l: "D", t: "Hồng cầu sống 35–42 ngày và nguồn cung 100% tự nguyện" },
      ],
      ans: "D",
      exp: "Hồng cầu sống 35–42 ngày. Nguồn máu Đài Loan 100% tự nguyện — mỗi người hiến giúp tối đa 3 bệnh nhân, và mỗi đơn vị qua 9 xét nghiệm sàng lọc.",
      src: "CrimsonWise Education · Taiwan Blood Services Foundation",
    },
  ],
};

/* ── Submission handling (Supabase + local fallback queue) ────────────── */
const QUEUE_KEY = "cw_pub_pending";

type Feedback = {
  client_id: string;
  ts: string;
  lang: Lang;
  stars: number;
  concept: string;
  suggestion: string;
  quiz_score: number | null;
  quiz_total: number | null;
};

function newClientId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`;
}

async function flushQueue(): Promise<void> {
  if (!supabaseConfigured()) return;
  let queue: Feedback[] = [];
  try {
    queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
  } catch {
    queue = [];
  }
  if (!queue.length) return;
  const remaining: Feedback[] = [];
  for (const row of queue) {
    const withId: Feedback = row.client_id
      ? row
      : { ...row, client_id: newClientId() };
    try {
      await sbInsert("public_feedback", withId);
    } catch {
      remaining.push(withId);
    }
  }
  localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
}

async function saveSubmission(
  stars: number,
  concept: string,
  suggestion: string,
  lang: Lang,
  quizScore: number | null,
  quizTotal: number | null,
): Promise<{ ok: boolean; queued: boolean }> {
  const row: Feedback = {
    client_id: newClientId(),
    ts: new Date().toISOString(),
    lang,
    stars,
    concept,
    suggestion,
    quiz_score: quizScore,
    quiz_total: quizTotal,
  };
  if (!supabaseConfigured()) {
    const q: Feedback[] = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
    q.push(row);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
    return { ok: true, queued: true };
  }
  try {
    await sbInsert("public_feedback", row);
    return { ok: true, queued: false };
  } catch {
    const q: Feedback[] = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
    q.push(row);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
    return { ok: true, queued: true };
  }
}

/* ── Hook: keyboard-aware bottom inset ────────────────────────────────── */
function useBottomInset(): number {
  const [inset, setInset] = useState(0);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () =>
      setInset(Math.max(0, window.innerHeight - vv.height - vv.offsetTop));
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);
  return inset;
}

/* ── Shared UI ────────────────────────────────────────────────────────── */
function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 18,
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        marginBottom: 13,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SecTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        marginBottom: 12,
      }}
    >
      <span
        style={{
          width: 3,
          height: 17,
          background: "var(--crimson-500)",
          borderRadius: 2,
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 13,
          fontWeight: 800,
          color: "var(--crimson-600)",
          textTransform: "uppercase",
          letterSpacing: 0.4,
        }}
      >
        {children}
      </span>
    </div>
  );
}

/* ── Stages ──────────────────────────────────────────────────────────── */
function SMyths({ t }: { t: Strings }) {
  return (
    <div>
      <div
        style={{
          background: "var(--crimson-50)",
          borderRadius: 13,
          padding: "12px 15px",
          marginBottom: 14,
          display: "flex",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 20, flexShrink: 0 }}>🔍</span>
        <span
          style={{ fontSize: 14, color: "var(--crimson-700)", lineHeight: 1.6 }}
        >
          {t.mythsIntro}
        </span>
      </div>
      {t.myths.map((m, i) => (
        <Card key={i} style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              background: "var(--crimson-50)",
              padding: "12px 15px",
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                background: "var(--crimson-100)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                flexShrink: 0,
              }}
            >
              ❌
            </div>
            <div
              style={{
                fontWeight: 600,
                fontSize: 13,
                color: "var(--crimson-600)",
                lineHeight: 1.5,
              }}
            >
              迷思 / Myth：{m.m}
            </div>
          </div>
          <div
            style={{
              background: "#f0fdf4",
              padding: "12px 15px",
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                background: "#bbf7d0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                flexShrink: 0,
              }}
            >
              ✅
            </div>
            <div>
              <div style={{ fontSize: 13, color: "#166534", lineHeight: 1.6 }}>
                {m.f}
              </div>
              <div
                style={{ fontSize: 11, color: "var(--gray-400)", marginTop: 4 }}
              >
                📖 {m.r}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function SAlts({ t }: { t: Strings }) {
  return (
    <div>
      <div
        style={{
          background: "#fffbeb",
          borderRadius: 13,
          padding: "12px 15px",
          marginBottom: 14,
          display: "flex",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
        <span style={{ fontSize: 14, color: "#92400e", lineHeight: 1.6 }}>
          {t.s1intro}
        </span>
      </div>
      {t.alts.map((a, i) => (
        <Card
          key={i}
          style={{
            display: "flex",
            gap: 13,
            alignItems: "flex-start",
            padding: 15,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "var(--crimson-50)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            {a.icon}
          </div>
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: "var(--crimson-600)",
                marginBottom: 3,
              }}
            >
              {a.t}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--gray-500)",
                lineHeight: 1.6,
              }}
            >
              {a.d}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function SGuide({ t }: { t: Strings }) {
  return (
    <div>
      <Card>
        <SecTitle>{t.guideTitle}</SecTitle>
        <div
          style={{
            background: "#fef9c3",
            borderRadius: 10,
            padding: "9px 12px",
            fontSize: 12,
            color: "#92400e",
            marginBottom: 13,
          }}
        >
          {t.guideNote}
        </div>
        {t.thresholds.map(([grp, val], i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom:
                i < t.thresholds.length - 1 ? "1px solid #f3f4f6" : "none",
            }}
          >
            <span style={{ fontSize: 14, color: "var(--gray-700)" }}>
              {grp}
            </span>
            <span
              style={{
                fontWeight: 800,
                fontSize: 13,
                color: "var(--crimson-500)",
                background: "var(--crimson-50)",
                padding: "4px 13px",
                borderRadius: 20,
              }}
            >
              {val}
            </span>
          </div>
        ))}
      </Card>
      <Card>
        <SecTitle>參考文獻 / References</SecTitle>
        <a
          href="https://www.tsbt.org.tw/downloads/Downloads"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            padding: "10px 0",
            borderBottom: "1px solid #f3f4f6",
            textDecoration: "none",
          }}
        >
          <span style={{ fontSize: 20 }}>🇹🇼</span>
          <span style={{ fontSize: 13, color: "#1d4ed8", fontWeight: 700 }}>
            {t.tsbt}
          </span>
        </a>
        {t.refs.map((r, i) => (
          <div
            key={i}
            style={{
              padding: "9px 0",
              borderBottom:
                i < t.refs.length - 1 ? "1px solid #f3f4f6" : "none",
              fontSize: 13,
              color: "var(--gray-500)",
              display: "flex",
              gap: 8,
            }}
          >
            <span style={{ flexShrink: 0 }}>📖</span>
            <span>{r}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function SBlood({ t }: { t: Strings }) {
  return (
    <div>
      <div
        style={{
          background:
            "linear-gradient(135deg,var(--crimson-600),var(--crimson-700))",
          borderRadius: 16,
          padding: 22,
          marginBottom: 14,
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 17, fontWeight: 900, marginBottom: 6 }}>
          {t.bloodHero}
        </div>
        <div style={{ fontSize: 13, opacity: 0.85 }}>{t.bloodSub}</div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 10,
          marginBottom: 13,
        }}
      >
        {t.facts.map((f, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: "14px 8px",
              border: "1.5px solid var(--crimson-100)",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 4 }}>{f.icon}</div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 12,
                color: "var(--crimson-500)",
                marginBottom: 2,
              }}
            >
              {f.v}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--gray-500)",
                lineHeight: 1.3,
              }}
            >
              {f.d}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          background: "var(--crimson-50)",
          borderRadius: 13,
          padding: "13px 15px",
          fontSize: 13,
          color: "var(--crimson-700)",
          lineHeight: 1.7,
          textAlign: "center",
        }}
      >
        🙏 每一袋血都來自他人的愛心，請珍惜使用！
        <br />
        <span style={{ fontSize: 12, opacity: 0.8 }}>
          Every unit of blood is a selfless gift. Use it wisely.
        </span>
      </div>
    </div>
  );
}

function SQuiz({
  lang,
  t,
  onDone,
  onSubmitted,
}: {
  lang: Lang;
  t: Strings;
  onDone: () => void;
  onSubmitted: (score: number, total: number) => void;
}) {
  const questions = QUIZ[lang];
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSub] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const allAnswered = questions.every((q) => answers[q.id]);
  const unanswered = questions.filter((q) => !answers[q.id]).map((q) => q.id);
  const score = questions.filter((q) => answers[q.id] === q.ans).length;
  const scoreMsg =
    score === 3 ? t.score3 : score === 2 ? t.score2 : t.scoreElse;
  const scoreEmoji = score === 3 ? "🎉" : score === 2 ? "👍" : "📖";

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSub(true);
    onSubmitted(score, questions.length);
    setTimeout(() => {
      anchorRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
      document.querySelector("[data-scroll]")?.scrollTo(0, 0);
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 50);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const nav = navigator as Navigator & {
      share?: (d: ShareData) => Promise<void>;
    };
    if (nav.share) {
      try {
        await nav.share({ title: t.shareTitle, text: t.shareText, url });
      } catch {
        /* user cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2500);
      } catch {
        /* clipboard blocked */
      }
    }
  };

  const optStyle = (q: QuizItem, opt: { l: string; t: string }) => {
    if (!submitted)
      return answers[q.id] === opt.l
        ? {
            bg: "var(--crimson-50)",
            border: "var(--crimson-500)",
            text: "var(--crimson-600)",
          }
        : {
            bg: "var(--gray-25)",
            border: "var(--gray-200)",
            text: "var(--gray-700)",
          };
    if (opt.l === q.ans)
      return { bg: "#f0fdf4", border: "#86efac", text: "#15803d" };
    if (answers[q.id] === opt.l)
      return {
        bg: "var(--crimson-50)",
        border: "var(--crimson-200)",
        text: "var(--crimson-600)",
      };
    return {
      bg: "var(--gray-25)",
      border: "var(--gray-200)",
      text: "var(--gray-400)",
    };
  };

  return (
    <div>
      <div ref={anchorRef} />
      {submitted && (
        <Card style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>{scoreEmoji}</div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 900,
              color: "var(--crimson-600)",
              marginBottom: 6,
            }}
          >
            {scoreMsg}
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: "var(--crimson-500)",
            }}
          >
            {score}{" "}
            <span
              style={{
                fontSize: 16,
                color: "var(--gray-400)",
                fontWeight: 600,
              }}
            >
              / 3
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 10,
              marginTop: 14,
            }}
          >
            {questions.map((q) => {
              const ok = answers[q.id] === q.ans;
              return (
                <div
                  key={q.id}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: ok ? "#f0fdf4" : "var(--crimson-50)",
                    border: `2px solid ${ok ? "#86efac" : "var(--crimson-200)"}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <span style={{ fontSize: 18 }}>{ok ? "✅" : "❌"}</span>
                  <span
                    style={{
                      fontSize: 9,
                      color: "var(--gray-400)",
                      fontWeight: 700,
                    }}
                  >
                    Q{q.id}
                  </span>
                </div>
              );
            })}
          </div>
          <button
            onClick={handleShare}
            style={{
              marginTop: 16,
              width: "100%",
              padding: "10px 0",
              borderRadius: 12,
              border: "2px solid #e5e7eb",
              background: linkCopied ? "#f0fdf4" : "#fff",
              color: linkCopied ? "#15803d" : "var(--gray-700)",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              transition: "all .2s",
            }}
          >
            {linkCopied ? t.shareCopied : t.shareBtn}
          </button>
        </Card>
      )}

      {!submitted && (
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: "12px 15px",
            marginBottom: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 7,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--gray-700)",
              }}
            >
              {t.progress}
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--crimson-500)",
              }}
            >
              {Object.keys(answers).length} / 3
            </span>
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 4,
              background: "var(--gray-100)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 4,
                background:
                  "linear-gradient(90deg,var(--crimson-500),var(--crimson-400))",
                width: `${(Object.keys(answers).length / 3) * 100}%`,
                transition: "width .3s",
              }}
            />
          </div>
        </div>
      )}

      {questions.map((q) => {
        const ok = answers[q.id] === q.ans;
        return (
          <div
            key={q.id}
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
              marginBottom: 14,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: submitted
                  ? ok
                    ? "#f0fdf4"
                    : "var(--crimson-50)"
                  : answers[q.id]
                    ? "linear-gradient(135deg,#fef2f2,#fff7ed)"
                    : "var(--gray-25)",
                padding: "13px 16px",
                borderBottom: "2px solid #f3f4f6",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
              >
                <span
                  style={{
                    width: 27,
                    height: 27,
                    borderRadius: 9,
                    background: submitted
                      ? ok
                        ? "#16a34a"
                        : "var(--crimson-500)"
                      : answers[q.id]
                        ? "var(--crimson-500)"
                        : "var(--gray-300)",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 1,
                    transition: "all .2s",
                  }}
                >
                  {submitted
                    ? ok
                      ? "✓"
                      : "✗"
                    : answers[q.id]
                      ? "✓"
                      : `Q${q.id}`}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--gray-800)",
                    lineHeight: 1.6,
                  }}
                >
                  {q.q}
                </span>
              </div>
            </div>
            <div
              style={{
                padding: "11px 13px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {q.opts.map((opt) => {
                const s = optStyle(q, opt);
                const isAns = opt.l === q.ans;
                const isSel = answers[q.id] === opt.l;
                const fw = submitted
                  ? isAns || isSel
                    ? 700
                    : 400
                  : isSel
                    ? 700
                    : 400;
                return (
                  <button
                    key={opt.l}
                    onClick={() => {
                      if (!submitted)
                        setAnswers((a) => ({ ...a, [q.id]: opt.l }));
                    }}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 11,
                      border: `2px solid ${s.border}`,
                      background: s.bg,
                      color: s.text,
                      fontSize: 13,
                      textAlign: "left",
                      fontWeight: fw,
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      transition: "all .15s",
                      width: "100%",
                      cursor: submitted ? "default" : "pointer",
                    }}
                  >
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 7,
                        background: submitted
                          ? isAns
                            ? "#16a34a"
                            : isSel
                              ? "var(--crimson-500)"
                              : "var(--gray-100)"
                          : isSel
                            ? "var(--crimson-500)"
                            : "var(--gray-100)",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 900,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "all .15s",
                      }}
                    >
                      {submitted ? (isAns ? "✓" : isSel ? "✗" : opt.l) : opt.l}
                    </span>
                    <span style={{ lineHeight: 1.5 }}>{opt.t}</span>
                  </button>
                );
              })}
            </div>
            {submitted && (
              <div
                style={{
                  margin: "0 13px 13px",
                  borderRadius: 11,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: "#1e3a5f",
                    padding: "7px 12px",
                    display: "flex",
                    gap: 6,
                    alignItems: "center",
                  }}
                >
                  <span>💡</span>
                  <span
                    style={{ color: "#fff", fontWeight: 800, fontSize: 12 }}
                  >
                    {t.explanation}
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 12,
                      fontWeight: 700,
                      color: ok ? "#86efac" : "var(--crimson-200)",
                    }}
                  >
                    {ok ? t.correct : `${t.wrong} ${q.ans}`}
                  </span>
                </div>
                <div
                  style={{
                    background: "#f0f6ff",
                    padding: "11px 13px",
                    border: "2px solid #bfdbfe",
                    borderTop: "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      color: "#1e3a5f",
                      lineHeight: 1.7,
                      marginBottom: 4,
                    }}
                  >
                    {q.exp}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--gray-400)" }}>
                    📖 {q.src}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {submitted && (
        <Card style={{ marginBottom: 14 }}>
          <SecTitle>{t.keyPoints}</SecTitle>
          {t.keyList.map(([icon, text], i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                padding: "8px 0",
                borderBottom: i < 2 ? "1px solid #f3f4f6" : "none",
              }}
            >
              <span style={{ fontSize: 17, flexShrink: 0 }}>{icon}</span>
              <span
                style={{
                  fontSize: 13,
                  color: "var(--gray-700)",
                  lineHeight: 1.6,
                }}
              >
                {text}
              </span>
            </div>
          ))}
        </Card>
      )}

      {!submitted ? (
        <div>
          {!allAnswered && (
            <div
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "var(--gray-400)",
                marginBottom: 8,
              }}
            >
              {t.unanswered}{" "}
              <strong style={{ color: "var(--crimson-500)" }}>
                {unanswered.length}
              </strong>{" "}
              {t.unanswered2}(Q{unanswered.join("、Q")})
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            style={{
              width: "100%",
              padding: 15,
              borderRadius: 14,
              border: "none",
              background: allAnswered
                ? "linear-gradient(135deg,var(--crimson-500),var(--crimson-600))"
                : "var(--gray-200)",
              color: "#fff",
              fontWeight: 800,
              fontSize: 15,
              cursor: allAnswered ? "pointer" : "not-allowed",
              boxShadow: allAnswered
                ? "0 4px 16px rgba(200,65,50,0.18)"
                : "none",
              transition: "all .25s",
            }}
          >
            {allAnswered
              ? t.submitBtn
              : `${t.submitDisabled}(${Object.keys(answers).length}/3)`}
          </button>
        </div>
      ) : (
        <button
          onClick={onDone}
          style={{
            width: "100%",
            padding: 15,
            borderRadius: 14,
            border: "none",
            background:
              "linear-gradient(135deg,var(--crimson-500),var(--crimson-600))",
            color: "#fff",
            fontWeight: 800,
            fontSize: 15,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(200,65,50,0.18)",
          }}
        >
          {t.nextAfterQuiz}
        </button>
      )}
    </div>
  );
}

function SSat({
  lang,
  t,
  onRestart,
  quizScore,
  quizTotal,
}: {
  lang: Lang;
  t: Strings;
  onRestart: () => void;
  quizScore: number | null;
  quizTotal: number | null;
}) {
  const [stars, setStars] = useState(0);
  const [concept, setConcept] = useState("");
  const [sug, setSug] = useState("");
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [queued, setQueued] = useState(false);
  const ready = stars > 0 && concept !== "";

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "30px 10px" }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 900,
            color: "var(--crimson-600)",
            marginBottom: 10,
          }}
        >
          {t.satTy}
        </div>
        <div
          style={{
            fontSize: 14,
            color: "var(--gray-500)",
            lineHeight: 1.8,
            maxWidth: 300,
            margin: "0 auto 24px",
          }}
        >
          {t.satFin}
        </div>
        {queued && (
          <div
            style={{
              fontSize: 12,
              color: "#92400e",
              background: "#fffbeb",
              padding: "8px 14px",
              borderRadius: 10,
              maxWidth: 320,
              margin: "0 auto 20px",
            }}
          >
            ℹ️ {t.offlineNotice}
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 7,
            marginBottom: 28,
          }}
        >
          {t.slogans.map((s, i) => (
            <span
              key={i}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                background: "var(--crimson-50)",
                color: "var(--crimson-600)",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {s}
            </span>
          ))}
        </div>
        <button
          onClick={onRestart}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 14,
            border: "none",
            background:
              "linear-gradient(135deg,var(--crimson-500),var(--crimson-600))",
            color: "#fff",
            fontWeight: 800,
            fontSize: 15,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(200,65,50,0.18)",
          }}
        >
          🔄 {t.restart}
        </button>
      </div>
    );

  const handleSubmit = async () => {
    if (!ready || sending) return;
    setSending(true);
    const res = await saveSubmission(
      stars,
      concept,
      sug,
      lang,
      quizScore,
      quizTotal,
    );
    setQueued(res.queued);
    setDone(true);
    setSending(false);
  };

  return (
    <div>
      <Card>
        <SecTitle>{t.satTitle}</SecTitle>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginTop: 4,
          }}
        >
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onClick={() => setStars(s)}
              style={{
                width: 50,
                height: 50,
                borderRadius: 13,
                border: `2px solid ${stars >= s ? "#fbbf24" : "var(--gray-200)"}`,
                background: stars >= s ? "#fffbeb" : "var(--gray-25)",
                fontSize: 26,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all .15s",
              }}
            >
              {stars >= s ? "⭐" : "☆"}
            </button>
          ))}
        </div>
      </Card>
      <Card>
        <SecTitle>{t.satQ}</SecTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {t.satOpts.map((o, i) => (
            <button
              key={i}
              onClick={() => setConcept(o)}
              style={{
                padding: "12px 14px",
                borderRadius: 12,
                border: `2px solid ${concept === o ? "var(--crimson-500)" : "var(--gray-200)"}`,
                background:
                  concept === o ? "var(--crimson-50)" : "var(--gray-25)",
                color: concept === o ? "var(--crimson-600)" : "var(--gray-700)",
                fontSize: 14,
                cursor: "pointer",
                textAlign: "left",
                fontWeight: concept === o ? 700 : 400,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 20,
                  border: `2px solid ${concept === o ? "var(--crimson-500)" : "var(--gray-300)"}`,
                  background: concept === o ? "var(--crimson-500)" : "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {concept === o && (
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 8,
                      background: "#fff",
                      display: "block",
                    }}
                  />
                )}
              </span>
              {o}
            </button>
          ))}
        </div>
      </Card>
      <Card>
        <SecTitle>{t.satSug}</SecTitle>
        <textarea
          value={sug}
          onChange={(e) => setSug(e.target.value)}
          rows={3}
          placeholder={t.satPh}
          style={{
            width: "100%",
            borderRadius: 10,
            border: "2px solid #e5e7eb",
            padding: "10px 12px",
            fontSize: 14,
            resize: "vertical",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
        />
      </Card>
      <button
        onClick={handleSubmit}
        disabled={!ready || sending}
        style={{
          width: "100%",
          padding: 15,
          borderRadius: 14,
          border: "none",
          background:
            ready && !sending
              ? "linear-gradient(135deg,var(--crimson-500),var(--crimson-600))"
              : "var(--gray-200)",
          color: "#fff",
          fontWeight: 800,
          fontSize: 16,
          cursor: ready && !sending ? "pointer" : "not-allowed",
          boxShadow:
            ready && !sending ? "0 4px 16px rgba(200,65,50,0.18)" : "none",
          transition: "all .2s",
        }}
      >
        {sending ? "⏳ …" : t.satBtn}
      </button>
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────────────────────── */
export default function PublicEducationPage() {
  const [lang, setLang] = useState<Lang>("zh-TW");
  const [phase, setPhase] = useState<"home" | "stages">("home");
  const [page, setPage] = useState(0);
  const [visible, setVisible] = useState(true);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizTotal, setQuizTotal] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomInset = useBottomInset();

  const t = T[lang];
  const TOTAL = 6;

  useEffect(() => {
    void flushQueue();
  }, []);

  const goTo = (p: number) => {
    setVisible(false);
    setTimeout(() => {
      setPage(p);
      setVisible(true);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      topRef.current?.scrollIntoView({ behavior: "auto" });
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 120);
  };

  const restart = () => {
    setPhase("home");
    setPage(0);
    setQuizSubmitted(false);
    setQuizScore(null);
    setQuizTotal(null);
  };

  const handleBack = () => {
    if (page === 4 && quizSubmitted) {
      if (!window.confirm(t.quizBackWarn)) return;
    }
    if (page === 0) restart();
    else goTo(page - 1);
  };

  const currentStage = useMemo(() => {
    switch (page) {
      case 0:
        return <SMyths t={t} />;
      case 1:
        return <SAlts t={t} />;
      case 2:
        return <SGuide t={t} />;
      case 3:
        return <SBlood t={t} />;
      case 4:
        return (
          <SQuiz
            key={lang}
            lang={lang}
            t={t}
            onDone={() => goTo(5)}
            onSubmitted={(score, total) => {
              setQuizSubmitted(true);
              setQuizScore(score);
              setQuizTotal(total);
            }}
          />
        );
      case 5:
        return (
          <SSat
            lang={lang}
            t={t}
            onRestart={restart}
            quizScore={quizScore}
            quizTotal={quizTotal}
          />
        );
      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, lang, t]);

  if (phase === "home")
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at 0% 0%, rgba(200,65,50,0.05), transparent 45%)," +
            "radial-gradient(circle at 100% 100%, rgba(200,65,50,0.04), transparent 45%)," +
            "var(--bg)",
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Noto Sans TC", "PingFang TC", sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "12px 16px",
          }}
        >
          <LangPills current={lang} onChange={setLang} variant="light" />
        </div>
        <div
          style={{
            maxWidth: 420,
            margin: "0 auto",
            padding: "10px 24px 40px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 82,
              height: 82,
              borderRadius: 24,
              background:
                "linear-gradient(135deg,var(--crimson-500),var(--crimson-700))",
              margin: "0 auto 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              boxShadow: "0 8px 28px var(--shadow-crimson)",
            }}
          >
            🩸
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: "var(--crimson-600)",
              letterSpacing: -0.5,
              marginBottom: 4,
            }}
          >
            {t.appName}
          </div>
          <div
            style={{ fontSize: 13, color: "var(--gray-400)", marginBottom: 6 }}
          >
            {t.appSub}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--crimson-500)",
              fontWeight: 600,
              marginBottom: 18,
              background: "var(--crimson-50)",
              borderRadius: 20,
              padding: "5px 14px",
              display: "inline-block",
            }}
          >
            {t.estTime}
          </div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: "var(--gray-700)",
              lineHeight: 1.4,
              marginBottom: 14,
            }}
          >
            {t.home}
          </div>
          <div
            style={{
              fontSize: 14,
              color: "var(--gray-500)",
              lineHeight: 1.7,
              marginBottom: 24,
            }}
          >
            {t.homeDesc}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 7,
              marginBottom: 28,
            }}
          >
            {t.stagesFull.map((s, i) => (
              <span
                key={i}
                style={{
                  padding: "5px 12px",
                  borderRadius: 20,
                  background: "var(--crimson-50)",
                  color: "var(--crimson-600)",
                  fontSize: 12,
                  fontWeight: 700,
                  border: "1.5px solid #fecaca",
                }}
              >
                {s}
              </span>
            ))}
          </div>
          <button
            onClick={() => setPhase("stages")}
            style={{
              width: "100%",
              padding: 17,
              borderRadius: 16,
              background:
                "linear-gradient(135deg,var(--crimson-500),var(--crimson-600))",
              color: "#fff",
              fontWeight: 800,
              fontSize: 17,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 6px 24px var(--shadow-crimson)",
              marginBottom: 14,
            }}
          >
            {t.start}
          </button>
          <div
            style={{
              background: "#fef9c3",
              borderRadius: 12,
              padding: "10px 14px",
              fontSize: 12,
              color: "#92400e",
              display: "flex",
              gap: 8,
              lineHeight: 1.5,
              textAlign: "left",
            }}
          >
            <span style={{ flexShrink: 0 }}>⚠️</span>
            <span>{t.disc}</span>
          </div>
        </div>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Noto Sans TC", "PingFang TC", sans-serif',
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          background:
            "linear-gradient(135deg,var(--crimson-500),var(--crimson-600))",
          padding: "13px 16px 10px",
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          flexShrink: 0,
        }}
      >
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 9,
            }}
          >
            <button
              onClick={restart}
              title="返回首頁"
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              🏠
            </button>
            <span
              style={{ fontWeight: 800, fontSize: 15, color: "#fff", flex: 1 }}
            >
              🩸 {t.appName}
            </span>
            <LangPills current={lang} onChange={setLang} variant="dark" />
            <span
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.7)",
                fontWeight: 600,
              }}
            >
              {page + 1}/{TOTAL}
            </span>
          </div>
          <div style={{ display: "flex", gap: 4, marginBottom: 7 }}>
            {Array(TOTAL)
              .fill(0)
              .map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  title={t.stagesFull[i]}
                  style={{
                    flex: 1,
                    height: 5,
                    borderRadius: 4,
                    border: "none",
                    cursor: "pointer",
                    background:
                      i === page
                        ? "#fff"
                        : i < page
                          ? "rgba(255,255,255,0.55)"
                          : "rgba(255,255,255,0.2)",
                    padding: 0,
                    transition: "background .25s",
                  }}
                />
              ))}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
            {t.stagesFull[page]}
          </div>
        </div>
      </header>

      <main
        ref={scrollRef}
        data-scroll
        style={{ flex: 1, overflowY: "auto", paddingBottom: 88 + bottomInset }}
      >
        <div ref={topRef} />
        <div
          style={{
            maxWidth: 560,
            margin: "0 auto",
            padding: "16px 16px 0",
            opacity: visible ? 1 : 0,
            transition: "opacity .15s",
          }}
        >
          {currentStage}
        </div>
      </main>

      <nav
        style={{
          position: "fixed",
          bottom: bottomInset,
          left: 0,
          right: 0,
          background: "rgba(249,250,251,0.97)",
          borderTop: "1px solid #e5e7eb",
          padding: "12px 16px",
          backdropFilter: "blur(8px)",
          transition: "bottom .1s",
        }}
      >
        <div
          style={{ maxWidth: 560, margin: "0 auto", display: "flex", gap: 10 }}
        >
          <button
            onClick={handleBack}
            style={{
              flex: 1,
              padding: 13,
              borderRadius: 12,
              border: "2px solid #e5e7eb",
              background: "#fff",
              color: "var(--gray-700)",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            {page === 0 ? "🏠" : t.prev}
          </button>
          {page !== 4 && page !== 5 && (
            <button
              onClick={() => goTo(page + 1)}
              style={{
                flex: 2,
                padding: 13,
                borderRadius: 12,
                border: "none",
                background:
                  "linear-gradient(135deg,var(--crimson-500),var(--crimson-600))",
                color: "#fff",
                fontWeight: 800,
                cursor: "pointer",
                fontSize: 14,
                boxShadow: "0 3px 12px rgba(200,65,50,0.18)",
              }}
            >
              {t.next}
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
