// The source behind the métro trips figures (Figure 6's morph and the métro
// story, 8-paris-metro-story.js).
//
// DATA (2026-11-14): Omnil / Île-de-France Mobilités "Trafic annuel et
// journalier" 2025, sheet "2- Voyages annuels Métro": the network total
// 2000–2025 and lines 1–14 from 2007. Annual trips, millions: entries from
// the street, the surface network and the RER; transfers between métro lines
// are NOT counted. Precision as published (1 dp to 2017, 2 dp from 2018).
// The rows "Ligne 3 (+3bis)" and "Ligne 7 (+7bis)" carry the short lines,
// which the source lists on their own only from 2022 (not drawn).
// The source's own notes: rail traffic 2000–2024 was recalculated to
// neutralise a change of counting method; line 14 extended 2020 and 2024
// (its new stations estimated from ticket validations), line 4 in 2013 and
// 2022, line 12 in 2013 and 2022, line 11 in 2024; strikes in Q2 2018, Q4
// 2019 and 2023, the health crisis in 2020, the Olympics in 2024.
// Reproduction is allowed with the source named (the workbook's preamble).
export const source = "Source: Île-de-France Mobilités (Omnil), Trafic annuel et journalier 2025, Figure 2, from RATP data";
// The workbook itself, behind the footer's link.
export const sourceUrl = "https://omnil.cdn.prismic.io/omnil/ajFb3Y1P9HI4Uk5i_TCC_trafic_annuel_2025.xlsx";
