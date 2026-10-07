import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const repoDir = process.cwd();
const outputDir = path.join(repoDir, "outputs", "019f710c-82b5-7712-9ab5-3e33a1e32524");
const publicDir = path.join(repoDir, "docs", "downloads");
const qaDir = path.join(repoDir, "tmp", "launch-model-qa");
const outputPath = path.join(outputDir, "Lame_Brain_Ideas_Financial_Model.xlsx");
const publicPath = path.join(publicDir, "Lame_Brain_Ideas_Financial_Model.xlsx");

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(publicDir, { recursive: true });
await fs.mkdir(qaDir, { recursive: true });

const wb = Workbook.create();
const summary = wb.worksheets.add("Summary");
const assumptions = wb.worksheets.add("Assumptions");
const plan = wb.worksheets.add("24-Month Plan");
const funnel = wb.worksheets.add("Funnel & Capacity");
const cash = wb.worksheets.add("Cash Flow");
const budget = wb.worksheets.add("Launch Budget");
const checks = wb.worksheets.add("Checks");
const sources = wb.worksheets.add("Sources");

const C = {
  navy: "#17324D",
  teal: "#007C83",
  acid: "#F4EE45",
  ink: "#17202A",
  slate: "#5B6B7A",
  white: "#FFFFFF",
  line: "#CFD9DF",
  pale: "#EEF3F5",
  paleBlue: "#EAF2F7",
  paleTeal: "#E4F4F2",
  paleGold: "#FFF4CC",
  paleRed: "#FDECEA",
  blue: "#0000FF",
  green: "#008000",
  red: "#B42318",
};

const fontFamily = "Arial";
const money = '$#,##0;[Red]($#,##0);-';
const percent = '0.0%;[Red](0.0%);-';
const count = '#,##0.0;[Red](#,##0.0);-';
const integer = '#,##0;[Red](#,##0);-';

function setupSheet(sheet, widths = {}) {
  sheet.showGridLines = false;
  sheet.getRange("A1:Z120").format.font = { name: fontFamily, size: 10, color: C.ink };
  for (const [col, width] of Object.entries(widths)) sheet.getRange(`${col}:${col}`).format.columnWidth = width;
}

function title(sheet, text, subtitle, end = "H") {
  sheet.getRange(`A2:${end}2`).merge();
  sheet.getRange("A2").values = [[text]];
  sheet.getRange(`A2:${end}2`).format = {
    font: { name: fontFamily, bold: true, size: 16, color: C.ink },
    verticalAlignment: "center",
    borders: { bottom: { style: "medium", color: C.teal } },
  };
  sheet.getRange(`A2:${end}2`).format.rowHeight = 28;
  if (subtitle) {
    sheet.getRange(`A3:${end}3`).merge();
    sheet.getRange("A3").values = [[subtitle]];
    sheet.getRange(`A3:${end}3`).format = {
      font: { name: fontFamily, italic: true, size: 9, color: C.slate },
      verticalAlignment: "center",
    };
    sheet.getRange(`A3:${end}3`).format.rowHeight = 20;
  }
}

function section(sheet, range, text) {
  sheet.getRange(range).merge();
  const anchor = range.split(":")[0];
  sheet.getRange(anchor).values = [[text]];
  sheet.getRange(range).format = {
    fill: C.navy,
    font: { name: fontFamily, bold: true, color: C.white, size: 10 },
    verticalAlignment: "center",
    borders: { preset: "outside", style: "thin", color: C.navy },
  };
  sheet.getRange(range).format.rowHeight = 21;
}

function header(sheet, range) {
  sheet.getRange(range).format = {
    fill: C.teal,
    font: { name: fontFamily, bold: true, color: C.white, size: 9 },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "inside", style: "thin", color: C.white },
  };
  sheet.getRange(range).format.rowHeight = 26;
}

function total(sheet, range, dark = false) {
  sheet.getRange(range).format = {
    fill: dark ? C.navy : C.paleBlue,
    font: { name: fontFamily, bold: true, color: dark ? C.white : C.ink },
    borders: { top: { style: "thin", color: C.navy } },
  };
}

function input(sheet, range) {
  sheet.getRange(range).format = {
    fill: C.paleGold,
    font: { name: fontFamily, color: C.blue },
  };
}

function crossLink(sheet, range) {
  sheet.getRange(range).format.font = { name: fontFamily, color: C.green };
}

function dateForMonth(offset) {
  return new Date(Date.UTC(2026, 10 + offset, 1));
}

const monthCols = Array.from({ length: 24 }, (_, i) => String.fromCharCode(66 + i)); // B:Y
const cashMonthCols = Array.from({ length: 24 }, (_, i) => String.fromCharCode(67 + i)); // C:Z

// Assumptions
setupSheet(assumptions, { A: 36, B: 16, C: 16, D: 16, E: 16, F: 15, G: 48, H: 13 });
title(assumptions, "Lame Brain Ideas - Launch assumptions", "Management case for a lean pop-up and digital studio. Blue cells are editable hypotheses.", "H");
assumptions.freezePanes.freezeRows(5);
assumptions.getRange("A5:B9").values = [
  ["Model date", new Date(Date.UTC(2026, 9, 7))],
  ["Pilot start", dateForMonth(0)],
  ["Forecast horizon (months)", 24],
  ["Minimum cash buffer", 25000],
  ["Model scope", "Studio, workshops, membership, and media only"],
];
assumptions.getRange("B5:B6").format.numberFormat = "mmm d, yyyy";
assumptions.getRange("B8").format.numberFormat = money;
input(assumptions, "B5:B9");

section(assumptions, "A12:H12", "Offer economics");
assumptions.getRange("A13:G13").values = [["Offer", "Price", "Delivery hours", "Materials %", "Payment %", "Engagement mix", "Purpose"]];
header(assumptions, "A13:G13");
assumptions.getRange("A14:G17").values = [
  ["Quick Diagnostic", 125, 1.25, 0.02, 0.03, 0.25, "Clarify the idea, risk, and next responsible step"],
  ["Idea Sprint", 750, 4, 0.08, 0.03, 0.35, "Define the customer, offer, evidence plan, and economics"],
  ["Venture Build", 4200, 22, 0.14, 0.03, 0.25, "Build the research, operating plan, model, and launch brief"],
  ["Partner Workshop", 2500, 10, 0.10, 0.03, 0.15, "Run a structured cohort for a host organization"],
];
input(assumptions, "B14:F17");
assumptions.getRange("B14:B17").format.numberFormat = money;
assumptions.getRange("C14:C17").format.numberFormat = "0.00";
assumptions.getRange("D14:F17").format.numberFormat = percent;
assumptions.getRange("A18:G18").values = [["Weighted offer economics", null, null, null, null, null, "Mix must equal 100%"]];
assumptions.getRange("B18").formulas = [["=SUMPRODUCT(B14:B17,F14:F17)"]];
assumptions.getRange("C18").formulas = [["=SUMPRODUCT(C14:C17,F14:F17)"]];
assumptions.getRange("D18").formulas = [["=SUMPRODUCT(D14:D17,F14:F17)"]];
assumptions.getRange("E18").formulas = [["=SUMPRODUCT(E14:E17,F14:F17)"]];
assumptions.getRange("F18").formulas = [["=SUM(F14:F17)"]];
assumptions.getRange("B18").format.numberFormat = money;
assumptions.getRange("C18").format.numberFormat = "0.00";
assumptions.getRange("D18:F18").format.numberFormat = percent;
total(assumptions, "A18:G18");

section(assumptions, "A21:H21", "Acquisition, membership, and delivery");
assumptions.getRange("A22:B39").values = [
  ["Month 1 qualified leads", 40],
  ["Monthly lead growth - Months 2-12", 0.09],
  ["Monthly lead growth - Months 13-24", 0.06],
  ["Discovery booking rate - Months 1-6", 0.25],
  ["Discovery booking rate - Months 7-12", 0.28],
  ["Discovery booking rate - Months 13-24", 0.30],
  ["Paid conversion - Months 1-6", 0.35],
  ["Paid conversion - Months 7-12", 0.38],
  ["Paid conversion - Months 13-24", 0.40],
  ["Delivery labor cost / hour", 65],
  ["Membership launch month", 13],
  ["Membership price / month", 29],
  ["Month 13 active members", 20],
  ["Month 24 active members", 120],
  ["Media sponsorship launch month", 18],
  ["First sponsorship month revenue", 1000],
  ["Month 24 sponsorship revenue", 3000],
  ["Membership direct cost %", 0.20],
];
input(assumptions, "B22:B39");
assumptions.getRange("B22").format.numberFormat = integer;
assumptions.getRange("B23:B30").format.numberFormat = percent;
assumptions.getRange("B31").format.numberFormat = money;
assumptions.getRange("B32").format.numberFormat = integer;
assumptions.getRange("B33").format.numberFormat = money;
assumptions.getRange("B34:B36").format.numberFormat = integer;
assumptions.getRange("B37:B38").format.numberFormat = money;
assumptions.getRange("B39").format.numberFormat = percent;

section(assumptions, "A42:H42", "Monthly operating expense levels");
assumptions.getRange("A43:D43").values = [["Expense", "Months 1-3", "Months 4-12", "Months 13-24"]];
header(assumptions, "A43:D43");
assumptions.getRange("A44:D51").values = [
  ["Founder compensation", 5000, 6000, 7000],
  ["Operations / customer support", 0, 1500, 3000],
  ["Content production", 1500, 1500, 1500],
  ["Marketing", 1500, 2500, 3000],
  ["Technology", 600, 900, 1100],
  ["Legal, accounting, and insurance", 1200, 1500, 1800],
  ["Events and partner hosting", 1000, 1500, 2000],
  ["General and administrative", 500, 500, 600],
];
input(assumptions, "B44:D51");
assumptions.getRange("B44:D51").format.numberFormat = money;

section(assumptions, "A54:H54", "Delivery capacity and media cost");
assumptions.getRange("A55:D55").values = [["Period", "Months 1-6", "Months 7-12", "Months 13-24"]];
header(assumptions, "A55:D55");
assumptions.getRange("A56:D57").values = [
  ["Available delivery hours / month", 80, 140, 260],
  ["Media direct cost %", 0.15, 0.15, 0.15],
];
input(assumptions, "B56:D57");
assumptions.getRange("B56:D56").format.numberFormat = integer;
assumptions.getRange("B57:D57").format.numberFormat = percent;

section(assumptions, "A60:H60", "Prelaunch uses");
assumptions.getRange("A61:B68").values = [
  ["Entity, contracts, privacy, and IP setup", 15000],
  ["Brand and public website", 8000],
  ["Insurance and deposits", 6000],
  ["Portable studio and recording equipment", 12000],
  ["Initial content season", 9000],
  ["Pilot events and partner support", 10000],
  ["Research, accessibility, and testing", 8000],
  ["Contingency", 7000],
];
input(assumptions, "B61:B68");
assumptions.getRange("B61:B68").format.numberFormat = money;
assumptions.getRange("A69:B69").values = [["Total prelaunch uses", null]];
assumptions.getRange("B69").formulas = [["=SUM(B61:B68)"]];
assumptions.getRange("B69").format.numberFormat = money;
total(assumptions, "A69:B69", true);

// 24-month plan
setupSheet(plan, { A: 34 });
for (const col of monthCols) plan.getRange(`${col}:${col}`).format.columnWidth = 13;
title(plan, "Lame Brain Ideas - 24-month operating plan", "Monthly management case. No storefront lease, crowdfunding fees, investor memberships, or transaction compensation.", "Y");
plan.freezePanes.freezeRows(4);
plan.freezePanes.freezeColumns(1);
plan.getRange("A4:Y4").values = [["Month", ...Array.from({ length: 24 }, (_, i) => dateForMonth(i))]];
header(plan, "A4:Y4");
plan.getRange("B4:Y4").format.numberFormat = "mmm-yy";

section(plan, "A5:Y5", "Demand and revenue");
plan.getRange("A6:A17").values = [
  ["Qualified leads"], ["Discovery booking rate"], ["Discovery calls"], ["Paid conversion"], ["Paid engagements"],
  ["Average service revenue / engagement"], ["Service revenue"], ["Active members"], ["Membership fee / month"],
  ["Membership revenue"], ["Media sponsorship revenue"], ["Total revenue"],
];
for (let i = 0; i < 24; i++) {
  const col = monthCols[i];
  const prior = i === 0 ? null : monthCols[i - 1];
  plan.getRange(`${col}6`).formulas = [[i === 0 ? "='Assumptions'!$B$22" : `=${prior}6*(1+'Assumptions'!$B$${i < 12 ? 23 : 24})`]];
  plan.getRange(`${col}7`).formulas = [[i < 6 ? "='Assumptions'!$B$25" : (i < 12 ? "='Assumptions'!$B$26" : "='Assumptions'!$B$27")]];
  plan.getRange(`${col}8`).formulas = [[`=${col}6*${col}7`]];
  plan.getRange(`${col}9`).formulas = [[i < 6 ? "='Assumptions'!$B$28" : (i < 12 ? "='Assumptions'!$B$29" : "='Assumptions'!$B$30")]];
  plan.getRange(`${col}10`).formulas = [[`=${col}8*${col}9`]];
  plan.getRange(`${col}11`).formulas = [["='Assumptions'!$B$18"]];
  plan.getRange(`${col}12`).formulas = [[`=${col}10*${col}11`]];
  plan.getRange(`${col}13`).formulas = [[i < 12 ? "=0" : `='Assumptions'!$B$34+(${i + 1}-'Assumptions'!$B$32)*('Assumptions'!$B$35-'Assumptions'!$B$34)/(24-'Assumptions'!$B$32)`]];
  plan.getRange(`${col}14`).formulas = [["='Assumptions'!$B$33"]];
  plan.getRange(`${col}15`).formulas = [[`=${col}13*${col}14`]];
  plan.getRange(`${col}16`).formulas = [[i < 17 ? "=0" : `='Assumptions'!$B$37+(${i + 1}-'Assumptions'!$B$36)*('Assumptions'!$B$38-'Assumptions'!$B$37)/(24-'Assumptions'!$B$36)`]];
  plan.getRange(`${col}17`).formulas = [[`=SUM(${col}12,${col}15,${col}16)`]];
}
crossLink(plan, "B6:Y7"); crossLink(plan, "B9:Y9"); crossLink(plan, "B11:Y11"); crossLink(plan, "B13:Y14");
plan.getRange("B6:Y6").format.numberFormat = integer;
plan.getRange("B7:Y7").format.numberFormat = percent;
plan.getRange("B8:Y10").format.numberFormat = count;
plan.getRange("B11:Y12").format.numberFormat = money;
plan.getRange("B13:Y13").format.numberFormat = integer;
plan.getRange("B14:Y17").format.numberFormat = money;
total(plan, "A17:Y17", true);

section(plan, "A19:Y19", "Delivery and contribution");
plan.getRange("A20:A32").values = [
  ["Average service hours / engagement"], ["Delivery hours"], ["Available delivery hours"], ["Delivery utilization"],
  ["Delivery labor cost / hour"], ["Delivery labor"], ["Materials and pass-through"], ["Payment processing"],
  ["Membership delivery"], ["Media direct cost"], ["Total direct costs"], ["Contribution profit"], ["Contribution margin"],
];
for (let i = 0; i < 24; i++) {
  const col = monthCols[i];
  plan.getRange(`${col}20`).formulas = [["='Assumptions'!$C$18"]];
  plan.getRange(`${col}21`).formulas = [[`=${col}10*${col}20`]];
  plan.getRange(`${col}22`).formulas = [[i < 6 ? "='Assumptions'!$B$56" : (i < 12 ? "='Assumptions'!$C$56" : "='Assumptions'!$D$56")]];
  plan.getRange(`${col}23`).formulas = [[`=${col}21/${col}22`]];
  plan.getRange(`${col}24`).formulas = [["='Assumptions'!$B$31"]];
  plan.getRange(`${col}25`).formulas = [[`=${col}21*${col}24`]];
  plan.getRange(`${col}26`).formulas = [[`=${col}12*'Assumptions'!$D$18`]];
  plan.getRange(`${col}27`).formulas = [[`=${col}17*'Assumptions'!$E$18`]];
  plan.getRange(`${col}28`).formulas = [[`=${col}15*'Assumptions'!$B$39`]];
  plan.getRange(`${col}29`).formulas = [[`=${col}16*'Assumptions'!$D$57`]];
  plan.getRange(`${col}30`).formulas = [[`=SUM(${col}25:${col}29)`]];
  plan.getRange(`${col}31`).formulas = [[`=${col}17-${col}30`]];
  plan.getRange(`${col}32`).formulas = [[`=${col}31/${col}17`]];
}
crossLink(plan, "B20:Y20"); crossLink(plan, "B22:Y22"); crossLink(plan, "B24:Y24");
plan.getRange("B20:Y22").format.numberFormat = count;
plan.getRange("B23:Y23").format.numberFormat = percent;
plan.getRange("B24:Y31").format.numberFormat = money;
plan.getRange("B32:Y32").format.numberFormat = percent;
total(plan, "A30:Y31");

section(plan, "A34:Y34", "Operating expenses and EBITDA");
plan.getRange("A35:A45").values = [
  ["Founder compensation"], ["Operations / customer support"], ["Content production"], ["Marketing"], ["Technology"],
  ["Legal, accounting, and insurance"], ["Events and partner hosting"], ["General and administrative"], ["Total operating expenses"],
  ["EBITDA"], ["EBITDA margin"],
];
for (let i = 0; i < 24; i++) {
  const col = monthCols[i];
  const tierCol = i < 3 ? "B" : (i < 12 ? "C" : "D");
  for (let row = 35; row <= 42; row++) plan.getRange(`${col}${row}`).formulas = [[`='Assumptions'!$${tierCol}$${row + 9}`]];
  plan.getRange(`${col}43`).formulas = [[`=SUM(${col}35:${col}42)`]];
  plan.getRange(`${col}44`).formulas = [[`=${col}31-${col}43`]];
  plan.getRange(`${col}45`).formulas = [[`=${col}44/${col}17`]];
}
crossLink(plan, "B35:Y42");
plan.getRange("B35:Y44").format.numberFormat = money;
plan.getRange("B45:Y45").format.numberFormat = percent;
total(plan, "A43:Y44", true);

// Funnel and capacity summary
setupSheet(funnel, { A: 34, B: 17, C: 17, D: 17, E: 17, F: 17, G: 17, H: 17 });
title(funnel, "Funnel and delivery capacity", "The launch case is constrained by qualified demand and delivery hours, not national market share.", "H");
funnel.getRange("A5:G5").values = [["Checkpoint", "Qualified leads", "Paid engagements", "Delivery hours", "Capacity hours", "Utilization", "Monthly revenue"]];
header(funnel, "A5:G5");
const checkpoints = [[3, "Month 3"], [6, "Month 6"], [12, "Month 12"], [18, "Month 18"], [24, "Month 24"]];
checkpoints.forEach(([month, label], idx) => {
  const row = 6 + idx;
  const col = monthCols[month - 1];
  funnel.getRange(`A${row}:G${row}`).values = [[label, null, null, null, null, null, null]];
  funnel.getRange(`B${row}:G${row}`).formulas = [[`='24-Month Plan'!${col}6`, `='24-Month Plan'!${col}10`, `='24-Month Plan'!${col}21`, `='24-Month Plan'!${col}22`, `='24-Month Plan'!${col}23`, `='24-Month Plan'!${col}17`]];
});
crossLink(funnel, "B6:G10");
funnel.getRange("B6:E10").format.numberFormat = count;
funnel.getRange("F6:F10").format.numberFormat = percent;
funnel.getRange("G6:G10").format.numberFormat = money;
section(funnel, "A13:H13", "Pilot management targets");
funnel.getRange("A14:D14").values = [["Gate", "Target", "Model indicator", "Use"]];
header(funnel, "A14:D14");
funnel.getRange("A15:D19").values = [
  ["Paid cases by Month 3", 12, null, "Validate willingness to pay and delivery effort"],
  ["Partner hosts by Day 30", 3, null, "Validate trusted local distribution"],
  ["Published episodes by Day 90", 8, null, "Validate cadence and qualified audience actions"],
  ["Month 12 contribution margin", 0.50, null, "Fund operating expense and reinvestment"],
  ["Month 24 delivery utilization ceiling", 0.85, null, "Protect quality and capacity"],
];
funnel.getRange("C15:C19").formulas = [["=SUM('24-Month Plan'!B10:D10)"], ["=0"], ["=0"], ["='24-Month Plan'!M32"], ["='24-Month Plan'!Y23"]];
funnel.getRange("B15:C17").format.numberFormat = integer;
funnel.getRange("B18:C19").format.numberFormat = percent;
input(funnel, "C16:C17");
funnel.getRange("C16:C17").format.font = { name: fontFamily, color: C.blue };

// Cash flow
setupSheet(cash, { A: 36, B: 14 });
for (const col of cashMonthCols) cash.getRange(`${col}:${col}`).format.columnWidth = 12;
title(cash, "Cash flow and funding need", "Initial financing is modeled as a planning placeholder. Financing structure, ownership, and terms are not assumed.", "Z");
cash.freezePanes.freezeRows(4);
cash.freezePanes.freezeColumns(2);
cash.getRange("A4:Z4").values = [["USD", "Prelaunch", ...Array.from({ length: 24 }, (_, i) => dateForMonth(i))]];
header(cash, "A4:Z4");
cash.getRange("C4:Z4").format.numberFormat = "mmm-yy";
cash.getRange("A6:A10").values = [["Operating cash flow"], ["Cumulative cash before financing"], ["Financing inflow"], ["Ending cash"], ["Minimum cash buffer"]];
cash.getRange("B6").formulas = [["=-'Assumptions'!$B$69"]];
for (let i = 0; i < 24; i++) cash.getRange(`${cashMonthCols[i]}6`).formulas = [[`='24-Month Plan'!${monthCols[i]}44`]];
cash.getRange("B7").formulas = [["=B6"]];
for (let i = 0; i < 24; i++) {
  const col = cashMonthCols[i];
  const prev = i === 0 ? "B" : cashMonthCols[i - 1];
  cash.getRange(`${col}7`).formulas = [[`=${prev}7+${col}6`]];
}
cash.getRange("B8").formulas = [["=-MIN(B7:Z7)+'Assumptions'!$B$8"]];
cash.getRange("C8:Z8").values = [Array(24).fill(0)];
cash.getRange("B9").formulas = [["=B6+B8"]];
for (let i = 0; i < 24; i++) {
  const col = cashMonthCols[i];
  const prev = i === 0 ? "B" : cashMonthCols[i - 1];
  cash.getRange(`${col}9`).formulas = [[`=${prev}9+${col}6+${col}8`]];
}
cash.getRange("B10:Z10").formulas = [Array.from({ length: 25 }, () => "='Assumptions'!$B$8")];
crossLink(cash, "C6:Z6"); crossLink(cash, "B10:Z10");
cash.getRange("B6:Z10").format.numberFormat = money;
total(cash, "A8:Z9", true);

// Launch budget
setupSheet(budget, { A: 43, B: 19, C: 55, D: 17 });
title(budget, "90-day launch budget", "Capital is released in tranches against evidence. The authorization is a ceiling, not a spending target.", "D");
section(budget, "A5:D5", "Uses and authorization");
budget.getRange("A6:C6").values = [["Use", "Amount", "Control"]];
header(budget, "A6:C6");
for (let i = 0; i < 8; i++) {
  const row = 7 + i;
  budget.getRange(`A${row}`).formulas = [[`='Assumptions'!A${61 + i}`]];
  budget.getRange(`B${row}`).formulas = [[`='Assumptions'!B${61 + i}`]];
}
budget.getRange("C7:C14").values = [
  ["Complete before customer intake"], ["Publish public brief and trust center"], ["Bind coverage before events"], ["Portable only; no leasehold build-out"],
  ["Eight-episode learning season"], ["Three local hosts and clinics"], ["Name, accessibility, and user testing"], ["Founder approval required"],
];
crossLink(budget, "A7:B14");
budget.getRange("B7:B14").format.numberFormat = money;
budget.getRange("A15:C15").values = [["Prelaunch uses", null, ""]];
budget.getRange("B15").formulas = [["=SUM(B7:B14)"]];
budget.getRange("A16:C16").values = [["First 90-day operating loss", null, "Months 1-3 EBITDA loss"]];
budget.getRange("B16").formulas = [["=-MIN(0,SUM('24-Month Plan'!B44:D44))"]];
budget.getRange("A17:C17").values = [["Minimum cash buffer", null, "Not operating spend"]];
budget.getRange("B17").formulas = [["='Assumptions'!$B$8"]];
budget.getRange("A18:C18").values = [["Calculated pilot cash requirement", null, ""]];
budget.getRange("B18").formulas = [["=SUM(B15:B17)"]];
budget.getRange("A19:C19").values = [["90-day authorization ceiling", null, "Rounded to next $5,000"]];
budget.getRange("B19").formulas = [["=ROUNDUP(B18/5000,0)*5000"]];
budget.getRange("B15:B19").format.numberFormat = money;
total(budget, "A15:C18"); total(budget, "A19:C19", true);
section(budget, "A22:D22", "Tranche release gates");
budget.getRange("A23:D23").values = [["Tranche", "Maximum", "Evidence required", "Stop condition"]];
header(budget, "A23:D23");
budget.getRange("A24:D26").values = [
  ["1. Trust and setup", 35000, "Entity, contracts, privacy, AI-use, insurance, source register", "Controls not approved"],
  ["2. Paid pilot", 65000, "Three hosts, offer scripts, booking path, separate media consent", "No credible recruitment path"],
  ["3. Completion buffer", 25000, "Six paid cases and documented delivery economics", "Poor outcomes or unacceptable contribution"],
];
input(budget, "B24:B26");
budget.getRange("B24:B26").format.numberFormat = money;

// Checks
setupSheet(checks, { A: 40, B: 19, C: 19, D: 19, E: 15, F: 13, G: 45 });
title(checks, "Model checks", "Checks confirm formula consistency. They do not validate customer demand or management assumptions.", "G");
checks.getRange("A5:G5").values = [["Check", "Actual", "Expected", "Difference", "Tolerance", "Status", "Where to review"]];
header(checks, "A5:G5");
checks.getRange("A6:A11").values = [["Offer mix sums to 100%"], ["Revenue components tie"], ["Contribution profit ties"], ["Minimum ending cash meets buffer"], ["Maximum delivery utilization does not exceed 85%"], ["Cash roll-forward ties"]];
checks.getRange("B6").formulas = [["='Assumptions'!F18"]]; checks.getRange("C6").values = [[1]]; checks.getRange("D6").formulas = [["=B6-C6"]]; checks.getRange("E6").values = [[0.0001]];
checks.getRange("B7").formulas = [["=SUM('24-Month Plan'!B17:Y17)"]]; checks.getRange("C7").formulas = [["=SUM('24-Month Plan'!B12:Y12)+SUM('24-Month Plan'!B15:Y15)+SUM('24-Month Plan'!B16:Y16)"]]; checks.getRange("D7").formulas = [["=B7-C7"]]; checks.getRange("E7").values = [[1]];
checks.getRange("B8").formulas = [["=SUM('24-Month Plan'!B31:Y31)"]]; checks.getRange("C8").formulas = [["=SUM('24-Month Plan'!B17:Y17)-SUM('24-Month Plan'!B30:Y30)"]]; checks.getRange("D8").formulas = [["=B8-C8"]]; checks.getRange("E8").values = [[1]];
checks.getRange("B9").formulas = [["=MIN('Cash Flow'!B9:Z9)"]]; checks.getRange("C9").formulas = [["='Assumptions'!B8"]]; checks.getRange("D9").formulas = [["=B9-C9"]]; checks.getRange("E9").values = [[1]];
checks.getRange("B10").formulas = [["=MAX('24-Month Plan'!B23:Y23)"]]; checks.getRange("C10").values = [[0.85]]; checks.getRange("D10").formulas = [["=MAX(0,B10-C10)"]]; checks.getRange("E10").values = [[0]];
checks.getRange("B11").formulas = [["='Cash Flow'!Z9-('Cash Flow'!B9+SUM('Cash Flow'!C6:Z6))"]]; checks.getRange("C11").values = [[0]]; checks.getRange("D11").formulas = [["=B11-C11"]]; checks.getRange("E11").values = [[1]];
for (let row = 6; row <= 11; row++) checks.getRange(`F${row}`).formulas = [[`=IF(ABS(D${row})<=E${row},"OK","FAIL")`]];
checks.getRange("G6:G11").values = [["Assumptions F14:F18"], ["24-Month Plan revenue"], ["24-Month Plan contribution"], ["Cash Flow and Assumptions"], ["24-Month Plan delivery"], ["Cash Flow roll-forward"]];
checks.getRange("B6:E6").format.numberFormat = percent;
checks.getRange("B7:E9").format.numberFormat = money;
checks.getRange("B10:E10").format.numberFormat = percent;
checks.getRange("B11:E11").format.numberFormat = money;
checks.getRange("A13:B13").values = [["MODEL STATUS", null]];
checks.getRange("B13").formulas = [["=IF(COUNTIF(F6:F11,\"FAIL\")=0,\"PASS\",\"FAIL\")"]];
total(checks, "A13:B13", true);

// Sources
setupSheet(sources, { A: 25, B: 36, C: 75, D: 16 });
title(sources, "Sources and assumption register", "External figures provide context. Commercial inputs remain management hypotheses until replaced by pilot evidence.", "D");
sources.getRange("A5:D5").values = [["Source", "Use", "URL", "As of"]];
header(sources, "A5:D5");
sources.getRange("A6:D14").values = [
  ["US SBA Office of Advocacy", "Small-business base", "https://advocacy.sba.gov/wp-content/uploads/2026/02/FINAL_FAQsAboutSmallBusiness_2026_012826.pdf", "Feb 2026"],
  ["US Census Bureau", "Business formation activity", "https://www.census.gov/econ/bfs/current/index.html", "Aug 2026"],
  ["US Bureau of Labor Statistics", "Management analyst compensation", "https://www.bls.gov/ooh/business-and-financial/management-analysts.htm", "May 2025"],
  ["US SEC", "Regulation Crowdfunding context only", "https://www.sec.gov/data-research/statistics-data-visualizations/regulation-crowdfunding-cf-offerings", "Jun 2026"],
  ["NIST", "AI risk-management reference", "https://www.nist.gov/itl/ai-risk-management-framework", "Accessed Oct 2026"],
  ["US Copyright Office", "AI-assisted copyright reference", "https://www.copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-2-Copyrightability-Report.pdf", "Jan 2025"],
  ["USPTO", "AI-assisted inventorship reference", "https://www.uspto.gov/subscription-center/2025/revised-inventorship-guidance-ai-assisted-inventions", "Nov 2025"],
  ["Edison Research", "Podcast consumption and dual-format behavior", "https://www.edisonresearch.com/the-infinite-dial-2026/", "Mar 2026"],
  ["OpenAI Docs", "Current model-selection guidance", "https://developers.openai.com/api/docs/models", "Accessed Oct 2026"],
];
sources.getRange("A17:D17").values = [["Management assumption", "Status", "Evidence required", "Owner"]];
header(sources, "A17:D17");
sources.getRange("A18:D26").values = [
  ["Offer prices and mix", "Unproven", "Paid transactions and customer interviews", "Commercial lead"],
  ["Lead growth and funnel conversion", "Unproven", "Channel-attributed funnel data", "Growth lead"],
  ["Delivery hours and labor cost", "Unproven", "Time logs and contractor quotes", "Operations lead"],
  ["Membership demand", "Gated", "Paid cohort and continuation requests", "Community lead"],
  ["Media sponsorship", "Gated", "Audience quality and sponsor conversations", "Editorial lead"],
  ["Operating expense levels", "Estimate", "Vendor quotes and actual invoices", "Finance lead"],
  ["Prelaunch uses", "Estimate", "Professional quotes and approved scope", "Founder"],
  ["Brand name", "Unvalidated", "Moderated audience tests and trademark review", "Founder"],
  ["No regulated revenue", "Policy", "Counsel-approved change only", "Founder / counsel"],
];

// Summary after all builds exist
setupSheet(summary, { A: 29, B: 18, C: 18, D: 18, E: 18, F: 18, G: 18, H: 18, I: 18 });
summary.showGridLines = false;
title(summary, "Lame Brain Ideas - Company launch model", "Lean pop-up and digital studio | 24-month management case | Updated 7 October 2026", "I");
summary.getRange("A5:I5").merge();
summary.getRange("A5").values = [["Decision: authorize a capped 90-day pilot. Do not sign a flagship lease or launch regulated capital activity."]];
summary.getRange("A5:I5").format = { fill: C.navy, font: { name: fontFamily, bold: true, color: C.white, size: 11 }, verticalAlignment: "center", wrapText: true };
summary.getRange("A5:I5").format.rowHeight = 32;

summary.getRange("A7:B9").values = [["90-day authorization ceiling", null], ["24-month external funding need", null], ["First positive monthly EBITDA", null]];
summary.getRange("B7").formulas = [["='Launch Budget'!B19"]];
summary.getRange("B8").formulas = [["='Cash Flow'!B8"]];
const positiveFormula = monthCols.reduceRight((acc, col, idx) => `IF('24-Month Plan'!${col}44>0,"Month ${idx + 1}",${acc})`, '"Beyond Month 24"');
summary.getRange("B9").formulas = [[`=${positiveFormula}`]];
summary.getRange("D7:E9").values = [["Month 24 revenue", null], ["Month 24 EBITDA", null], ["Month 24 contribution margin", null]];
summary.getRange("E7").formulas = [["='24-Month Plan'!Y17"]];
summary.getRange("E8").formulas = [["='24-Month Plan'!Y44"]];
summary.getRange("E9").formulas = [["='24-Month Plan'!Y32"]];
summary.getRange("G7:H9").values = [["24-month cumulative revenue", null], ["Month 24 active members", null], ["Month 24 delivery utilization", null]];
summary.getRange("H7").formulas = [["=SUM('24-Month Plan'!B17:Y17)"]];
summary.getRange("H8").formulas = [["='24-Month Plan'!Y13"]];
summary.getRange("H9").formulas = [["='24-Month Plan'!Y23"]];
for (const range of ["A7:B9", "D7:E9", "G7:H9"]) {
  summary.getRange(range).format = { fill: C.paleBlue, borders: { preset: "outside", style: "thin", color: C.line }, verticalAlignment: "center" };
}
summary.getRange("B7:B8").format.numberFormat = money;
summary.getRange("E7:E8").format.numberFormat = money;
summary.getRange("E9").format.numberFormat = percent;
summary.getRange("H7").format.numberFormat = money;
summary.getRange("H8").format.numberFormat = integer;
summary.getRange("H9").format.numberFormat = percent;
summary.getRange("B7:B9").format.font = { name: fontFamily, bold: true, color: C.ink, size: 12 };
summary.getRange("E7:E9").format.font = { name: fontFamily, bold: true, color: C.ink, size: 12 };
summary.getRange("H7:H9").format.font = { name: fontFamily, bold: true, color: C.ink, size: 12 };

section(summary, "A12:I12", "Launch interpretation");
summary.getRange("A13:I16").values = [
  ["1", "The management case reaches positive monthly EBITDA only after qualified lead volume, conversion, and offer mix improve. Treat Month 19 as a testable forecast, not a promise.", null, null, null, null, null, null, null],
  ["2", "The model funds a portable studio, partner events, media, and professional setup. It contains no storefront build-out, crowdfunding fees, investor memberships, or transaction compensation.", null, null, null, null, null, null, null],
  ["3", "Release capital in three tranches. Stop or redesign the pilot if paid demand, outcomes, contribution, or trust controls do not meet the documented gates.", null, null, null, null, null, null, null],
  ["4", "Replace every commercial assumption with invoice, funnel, time-log, cohort, or vendor evidence before approving a larger fixed-cost commitment.", null, null, null, null, null, null, null],
];
summary.getRange("B13:I16").merge(true);
summary.getRange("A13:I16").format = { fill: C.paleTeal, verticalAlignment: "center", wrapText: true, borders: { bottom: { style: "thin", color: C.line } } };
summary.getRange("A13:A16").format.font = { name: fontFamily, bold: true, color: C.teal };
summary.getRange("A13:I16").format.rowHeight = 31;

summary.getRange("A19:C43").values = [["Month", "Revenue", "EBITDA"], ...Array.from({ length: 24 }, (_, i) => [dateForMonth(i), null, null])];
header(summary, "A19:C19");
for (let i = 0; i < 24; i++) {
  const row = 20 + i;
  summary.getRange(`B${row}`).formulas = [[`='24-Month Plan'!${monthCols[i]}17`]];
  summary.getRange(`C${row}`).formulas = [[`='24-Month Plan'!${monthCols[i]}44`]];
}
summary.getRange("A20:A43").format.numberFormat = "mmm-yy";
summary.getRange("B20:C43").format.numberFormat = money;
const chart = summary.charts.add("line", summary.getRange("A19:C43"));
chart.setPosition("E19", "I42");
chart.title = "Monthly revenue and EBITDA";
chart.titleTextStyle.fontSize = 12;
chart.titleTextStyle.typeface = fontFamily;
chart.legend = { position: "top", textStyle: { typeface: fontFamily, fontSize: 9 } };
chart.xAxis = { axisType: "textAxis", textStyle: { typeface: fontFamily, fontSize: 8 } };
chart.yAxis = { numberFormatCode: "$#,##0", numberFormatSourceLinked: false, textStyle: { typeface: fontFamily, fontSize: 8 } };

for (const sheet of [summary, assumptions, plan, funnel, cash, budget, checks, sources]) {
  const used = sheet.getUsedRange();
  if (used) used.format.verticalAlignment = "center";
}

wb.recalculate();

const inspectSummary = await wb.inspect({ kind: "table", range: "Summary!A5:I16", include: "values,formulas", tableMaxRows: 20, tableMaxCols: 12, maxChars: 12000 });
const inspectChecks = await wb.inspect({ kind: "table", range: "Checks!A5:G13", include: "values,formulas", tableMaxRows: 20, tableMaxCols: 10, maxChars: 10000 });
const errors = await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, maxChars: 10000 });
await fs.writeFile(path.join(qaDir, "summary.inspect.ndjson"), inspectSummary.ndjson);
await fs.writeFile(path.join(qaDir, "checks.inspect.ndjson"), inspectChecks.ndjson);
await fs.writeFile(path.join(qaDir, "errors.inspect.ndjson"), errors.ndjson);

for (const sheetName of ["Summary", "Assumptions", "24-Month Plan", "Funnel & Capacity", "Cash Flow", "Launch Budget", "Checks", "Sources"]) {
  const preview = await wb.render({ sheetName, autoCrop: "all", scale: 1.25, format: "png" });
  await fs.writeFile(path.join(qaDir, `${sheetName.replaceAll(" ", "_").replaceAll("&", "and")}.png`), new Uint8Array(await preview.arrayBuffer()));
}

const xlsx = await SpreadsheetFile.exportXlsx(wb);
await xlsx.save(outputPath);
await xlsx.save(publicPath);

console.log(JSON.stringify({ outputPath, publicPath, qaDir }, null, 2));
