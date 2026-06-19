import type { ReactNode } from "react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, Tooltip,
} from "recharts";

export type Pair = {
  product: string;
  brand: string;
  chart: ReactNode;
};

export const pairs: Pair[] = [
  {
    product: "VOLT R2",
    brand: "TESLA",
    chart: (
      <LineChart data={[
        { m: "J", v: 420 }, { m: "F", v: 580 }, { m: "M", v: 510 },
        { m: "A", v: 740 }, { m: "M", v: 690 }, { m: "J", v: 870 },
      ]}>
        <XAxis dataKey="m" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip contentStyle={{ background: "#111", border: "none", color: "#fff", fontSize: 11 }} />
        <Line type="monotone" dataKey="v" stroke="#fff" strokeWidth={1.5} dot={false} />
      </LineChart>
    ),
  },
  {
    product: "ÉCLAT",
    brand: "CHANEL",
    chart: (
      <BarChart data={[
        { q: "Q1", v: 310 }, { q: "Q2", v: 480 }, { q: "Q3", v: 390 },
        { q: "Q4", v: 620 },
      ]}>
        <XAxis dataKey="q" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip contentStyle={{ background: "#111", border: "none", color: "#fff", fontSize: 11 }} />
        <Bar dataKey="v" fill="rgba(255,255,255,0.8)" radius={[2, 2, 0, 0]} />
      </BarChart>
    ),
  },
  {
    product: "PROJECT ION",
    brand: "APPLE",
    chart: (
      <AreaChart data={[
        { d: "Mon", v: 900 }, { d: "Tue", v: 1200 }, { d: "Wed", v: 1100 },
        { d: "Thu", v: 1500 }, { d: "Fri", v: 1350 }, { d: "Sat", v: 1700 },
      ]}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="d" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip contentStyle={{ background: "#111", border: "none", color: "#fff", fontSize: 11 }} />
        <Area type="monotone" dataKey="v" stroke="#fff" strokeWidth={1.5} fill="url(#areaGrad)" />
      </AreaChart>
    ),
  },
  {
    product: "AEROLINE",
    brand: "BMW",
    chart: (
      <BarChart layout="vertical" data={[
        { label: "0–60", v: 34 }, { label: "Range", v: 78 }, { label: "Output", v: 56 }, { label: "Torque", v: 91 },
      ]}>
        <XAxis type="number" hide />
        <YAxis dataKey="label" type="category" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} width={42} />
        <Tooltip contentStyle={{ background: "#111", border: "none", color: "#fff", fontSize: 11 }} />
        <Bar dataKey="v" fill="rgba(255,255,255,0.75)" radius={[0, 2, 2, 0]} />
      </BarChart>
    ),
  },
  {
    product: "SÉRIE NOIR",
    brand: "SAINT LAURENT",
    chart: (
      <LineChart data={[
        { s: "SS22", v: 210 }, { s: "AW22", v: 340 }, { s: "SS23", v: 290 },
        { s: "AW23", v: 470 }, { s: "SS24", v: 410 }, { s: "AW24", v: 560 },
      ]}>
        <XAxis dataKey="s" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 9 }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip contentStyle={{ background: "#111", border: "none", color: "#fff", fontSize: 11 }} />
        <Line type="monotone" dataKey="v" stroke="#fff" strokeWidth={1.5} dot={{ r: 2, fill: "#fff" }} />
      </LineChart>
    ),
  },
  {
    product: "ULTRARUN",
    brand: "NIKE",
    chart: (
      <BarChart data={[
        { w: "Wk 1", v: 42 }, { w: "Wk 2", v: 55 }, { w: "Wk 3", v: 48 },
        { w: "Wk 4", v: 61 }, { w: "Wk 5", v: 73 }, { w: "Wk 6", v: 68 },
      ]}>
        <XAxis dataKey="w" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip contentStyle={{ background: "#111", border: "none", color: "#fff", fontSize: 11 }} />
        <Bar dataKey="v" fill="rgba(255,255,255,0.8)" radius={[2, 2, 0, 0]} />
      </BarChart>
    ),
  },
  {
    product: "ATELIER 03",
    brand: "HERMÈS",
    chart: (
      <RadarChart data={[
        { axis: "Craft", v: 92 }, { axis: "Rarity", v: 85 }, { axis: "Heritage", v: 98 },
        { axis: "Value", v: 76 }, { axis: "Design", v: 89 },
      ]} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="rgba(255,255,255,0.15)" />
        <PolarAngleAxis dataKey="axis" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9 }} />
        <Radar dataKey="v" stroke="#fff" fill="rgba(255,255,255,0.12)" strokeWidth={1.5} />
        <Tooltip contentStyle={{ background: "#111", border: "none", color: "#fff", fontSize: 11 }} />
      </RadarChart>
    ),
  },
  {
    product: "PULSE ONE",
    brand: "ADIDAS",
    chart: (
      <AreaChart data={[
        { t: "0s", v: 0 }, { t: "10s", v: 22 }, { t: "20s", v: 58 },
        { t: "30s", v: 45 }, { t: "40s", v: 80 }, { t: "50s", v: 72 }, { t: "60s", v: 95 },
      ]}>
        <defs>
          <linearGradient id="pulseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffffff" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="t" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip contentStyle={{ background: "#111", border: "none", color: "#fff", fontSize: 11 }} />
        <Area type="monotone" dataKey="v" stroke="#fff" strokeWidth={1.5} fill="url(#pulseGrad)" />
      </AreaChart>
    ),
  },
  {
    product: "LINEA 24",
    brand: "PRADA",
    chart: (
      <BarChart data={[
        { r: "Milan", v: 88 }, { r: "Paris", v: 74 }, { r: "Tokyo", v: 95 },
        { r: "NY", v: 67 }, { r: "Dubai", v: 82 },
      ]}>
        <XAxis dataKey="r" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip contentStyle={{ background: "#111", border: "none", color: "#fff", fontSize: 11 }} />
        <Bar dataKey="v" fill="rgba(255,255,255,0.8)" radius={[2, 2, 0, 0]} />
      </BarChart>
    ),
  },
  {
    product: "PURE FORM",
    brand: "PORSCHE",
    chart: (
      <LineChart data={[
        { rpm: "1k", v: 120 }, { rpm: "2k", v: 240 }, { rpm: "3k", v: 380 },
        { rpm: "4k", v: 460 }, { rpm: "5k", v: 510 }, { rpm: "6k", v: 490 }, { rpm: "7k", v: 430 },
      ]}>
        <XAxis dataKey="rpm" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip contentStyle={{ background: "#111", border: "none", color: "#fff", fontSize: 11 }} />
        <Line type="monotone" dataKey="v" stroke="#fff" strokeWidth={1.5} dot={false} />
      </LineChart>
    ),
  },
  {
    product: "EDGE",
    brand: "MERCEDES-BENZ",
    chart: (
      <AreaChart data={[
        { y: "2020", v: 310 }, { y: "2021", v: 420 }, { y: "2022", v: 390 },
        { y: "2023", v: 550 }, { y: "2024", v: 610 },
      ]}>
        <defs>
          <linearGradient id="edgeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="y" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip contentStyle={{ background: "#111", border: "none", color: "#fff", fontSize: 11 }} />
        <Area type="monotone" dataKey="v" stroke="#fff" strokeWidth={1.5} fill="url(#edgeGrad)" />
      </AreaChart>
    ),
  },
  {
    product: "ROSSO LINEA",
    brand: "FERRARI",
    chart: (
      <RadarChart data={[
        { axis: "Speed", v: 99 }, { axis: "Grip", v: 87 }, { axis: "Aero", v: 93 },
        { axis: "Brake", v: 88 }, { axis: "Power", v: 97 },
      ]} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="rgba(255,255,255,0.15)" />
        <PolarAngleAxis dataKey="axis" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9 }} />
        <Radar dataKey="v" stroke="#fff" fill="rgba(255,255,255,0.12)" strokeWidth={1.5} />
        <Tooltip contentStyle={{ background: "#111", border: "none", color: "#fff", fontSize: 11 }} />
      </RadarChart>
    ),
  },
];
