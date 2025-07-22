import "./backtest";
import { calculateROI } from "./metrics";
import data from "./mockData.json" assert { type: "json" };

console.log("ROI:", calculateROI());
console.log("Data Loaded:", data); 