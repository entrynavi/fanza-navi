export interface SalePeriod {
  name: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  discount: string;
  strategy: string;
  category: "monthly" | "seasonal" | "annual";
  color: string;
}

export const MONTHLY_SALES: Omit<SalePeriod, "startMonth" | "endMonth">[] = [
  {
    name: "月初セール",
    startDay: 1,
    endDay: 3,
    discount: "20〜40%OFF",
    strategy: "月替わり直後が狙い目。前月の売れ筋がまとまって動きやすいタイミング。",
    category: "monthly",
    color: "var(--color-primary)",
  },
  {
    name: "月中セール",
    startDay: 15,
    endDay: 17,
    discount: "15〜30%OFF",
    strategy: "ジャンル絞りの中型セールが多い時期。狙い撃ちの買い方に向いています。",
    category: "monthly",
    color: "var(--color-accent)",
  },
  {
    name: "月末セール",
    startDay: 25,
    endDay: 31,
    discount: "30〜50%OFF",
    strategy: "月内でいちばん割引が伸びやすい波。まとめ買い向き。",
    category: "monthly",
    color: "#22c55e",
  },
];

export const SEASONAL_SALES: SalePeriod[] = [
  {
    name: "GWセール",
    startMonth: 4,
    startDay: 29,
    endMonth: 5,
    endDay: 5,
    discount: "30〜50%OFF",
    strategy: "連休前後はまとまった値下げが来やすいので、ウォッチリストを先に整えておくと有利です。",
    category: "seasonal",
    color: "#f59e0b",
  },
  {
    name: "夏のボーナスセール",
    startMonth: 7,
    startDay: 1,
    endMonth: 7,
    endDay: 15,
    discount: "40〜60%OFF",
    strategy: "高額作品を買うなら最優先候補。予算を寄せる価値があります。",
    category: "seasonal",
    color: "#ef4444",
  },
  {
    name: "バレンタインセール",
    startMonth: 2,
    startDay: 10,
    endMonth: 2,
    endDay: 14,
    discount: "20〜40%OFF",
    strategy: "短期開催なので、狙いの作品は先にメモしておくと取りこぼしを防げます。",
    category: "seasonal",
    color: "#ec4899",
  },
  {
    name: "年末年始セール",
    startMonth: 12,
    startDay: 20,
    endMonth: 1,
    endDay: 5,
    discount: "50〜70%OFF",
    strategy: "年間最大クラス。大型値引き狙いなら最優先で予算を確保したい期間です。",
    category: "seasonal",
    color: "#8b5cf6",
  },
];

export const ANNUAL_SALES: SalePeriod[] = [
  {
    name: "FANZA周年記念セール",
    startMonth: 8,
    startDay: 1,
    endMonth: 8,
    endDay: 31,
    discount: "40〜70%OFF",
    strategy: "全体で動く大型セール。普段高い作品を狙うのに向いています。",
    category: "annual",
    color: "#f97316",
  },
  {
    name: "ブラックフライデー",
    startMonth: 11,
    startDay: 22,
    endMonth: 11,
    endDay: 28,
    discount: "30〜60%OFF",
    strategy: "年末前に一段安くなる波。電子書籍・まとめ買いとの相性も良いです。",
    category: "annual",
    color: "#1e293b",
  },
];

export const DAYS_OF_WEEK = ["日", "月", "火", "水", "木", "金", "土"] as const;
export const MONTH_NAMES = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
] as const;

export function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function getSalesForDate(year: number, month: number, day: number): SalePeriod[] {
  const results: SalePeriod[] = [];
  const monthNumber = month + 1;
  const daysInMonth = getDaysInMonth(year, month);

  for (const sale of MONTHLY_SALES) {
    const endDay = Math.min(sale.endDay, daysInMonth);
    if (day >= sale.startDay && day <= endDay) {
      results.push({
        ...sale,
        startMonth: monthNumber,
        endMonth: monthNumber,
      });
    }
  }

  for (const sale of [...SEASONAL_SALES, ...ANNUAL_SALES]) {
    if (sale.startMonth === sale.endMonth) {
      if (monthNumber === sale.startMonth && day >= sale.startDay && day <= sale.endDay) {
        results.push(sale);
      }
      continue;
    }

    if (monthNumber === sale.startMonth && day >= sale.startDay) {
      results.push(sale);
    } else if (monthNumber === sale.endMonth && day <= sale.endDay) {
      results.push(sale);
    }
  }

  return results;
}

export function getUpcomingSales(
  year: number,
  month: number,
  now: Date = new Date()
): SalePeriod[] {
  const currentDay = now.getDate();
  const isCurrentMonth = now.getFullYear() === year && now.getMonth() === month;
  const monthNumber = month + 1;
  const daysInMonth = getDaysInMonth(year, month);
  const allSales: SalePeriod[] = [];

  for (const sale of MONTHLY_SALES) {
    const endDay = Math.min(sale.endDay, daysInMonth);
    const fullSale: SalePeriod = {
      ...sale,
      startMonth: monthNumber,
      endMonth: monthNumber,
    };

    if (!isCurrentMonth || endDay >= currentDay) {
      allSales.push(fullSale);
    }
  }

  for (const sale of [...SEASONAL_SALES, ...ANNUAL_SALES]) {
    if (sale.startMonth === sale.endMonth) {
      if (monthNumber !== sale.startMonth) {
        continue;
      }
      if (!isCurrentMonth || sale.endDay >= currentDay) {
        allSales.push(sale);
      }
      continue;
    }

    if (monthNumber === sale.startMonth || monthNumber === sale.endMonth) {
      allSales.push(sale);
    }
  }

  return allSales;
}
