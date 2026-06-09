// Export Design Tokens
export * from './tokens';

// Export Animation Configurations
export * from './animation';

// Export Library Helpers
export * from './lib';

// Export Custom React Hooks
export * from './hooks';

// Export Core UI Components
export * from './components';

// Charts category (24 animated, zero-dependency chart components)
export { AreaChartGradient } from './components/AreaChartGradient';
export { BarChartVertical } from './components/BarChartVertical';
export { LineChartInteractive } from './components/LineChartInteractive';
export { DonutChartLegend } from './components/DonutChartLegend';
export { RadialGaugeChart } from './components/RadialGaugeChart';
export { StackedBarChart } from './components/StackedBarChart';
export { MultiLineComparison } from './components/MultiLineComparison';
export { HorizontalBarRanking } from './components/HorizontalBarRanking';
export { RadarChartPolygon } from './components/RadarChartPolygon';
export { ProgressRingTrio } from './components/ProgressRingTrio';
export { HeatmapGridChart } from './components/HeatmapGridChart';
export { AreaChartStackedTrend } from './components/AreaChartStackedTrend';
export { SparklineStatCard } from './components/SparklineStatCard';
export { CandlestickChart } from './components/CandlestickChart';
export { BubbleScatterChart } from './components/BubbleScatterChart';
export { SpeedometerGauge } from './components/SpeedometerGauge';
export { RadialBarChart } from './components/RadialBarChart';
export { FunnelChart } from './components/FunnelChart';
export { WaterfallChart } from './components/WaterfallChart';
export { GroupedBarChart } from './components/GroupedBarChart';
export { StepAreaChart } from './components/StepAreaChart';
export { PolarAreaChart } from './components/PolarAreaChart';
export { BulletKpiChart } from './components/BulletKpiChart';
export { AnimatedBarRace } from './components/AnimatedBarRace';

// Accessible interactive primitives (React Aria / Radix-grade: keyboard, ARIA,
// focus management, controlled + uncontrolled — zero extra dependencies).
export { Checkbox } from './components/Checkbox';
export { Select, SelectItem } from './components/Select';
export { Combobox } from './components/Combobox';
export { Datepicker } from './components/Datepicker';

// Resolve export ambiguity for duplicated components between components and blocks
export { SpotlightCard, SourceCitationCard, SourceCitation, Product, Testimonial } from './components';
export { usePrefersReducedMotion } from './animation';

// Export Reusable Layout Blocks
export * from './blocks';

