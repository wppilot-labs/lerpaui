import * as fs from 'fs';
import * as path from 'path';

const comps = [
  { name: 'text-pressure', file: 'TextPressure.tsx', deps: [] },
  { name: 'decrypted-text', file: 'DecryptedText.tsx', deps: [] },
  { name: 'split-text', file: 'SplitText.tsx', deps: ['framer-motion'] },
  { name: 'blur-text', file: 'BlurText.tsx', deps: ['framer-motion'] },
  { name: 'glitch-text', file: 'GlitchText.tsx', deps: ['framer-motion'] },
  { name: 'tilted-card', file: 'TiltedCard.tsx', deps: ['framer-motion'] },
  { name: 'magnet', file: 'Magnet.tsx', deps: ['framer-motion'] },
  { name: 'splash-cursor', file: 'SplashCursor.tsx', deps: [] },
  { name: 'retro-grid', file: 'RetroGrid.tsx', deps: [] },
  { name: 'aurora-background', file: 'AuroraBackground.tsx', deps: [] },
  { name: 'border-beam', file: 'BorderBeam.tsx', deps: ['framer-motion'] },
  { name: 'scroll-reveal', file: 'ScrollReveal.tsx', deps: ['framer-motion'] },
  { name: 'orbit', file: 'Orbit.tsx', deps: ['framer-motion'] },
  { name: 'shiny-button', file: 'ShinyButton.tsx', deps: ['framer-motion'] },
  { name: 'morphing-dialog', file: 'MorphingDialog.tsx', deps: ['framer-motion'] },
  { name: 'animated-beam', file: 'AnimatedBeam.tsx', deps: ['framer-motion'] },
  { name: 'floating-dock', file: 'FloatingDock.tsx', deps: ['framer-motion'] },
  { name: 'pin-container', file: 'PinContainer.tsx', deps: ['framer-motion'] },
  { name: 'sparkles', file: 'Sparkles.tsx', deps: [] },
  { name: 'stacking-cards', file: 'StackingCards.tsx', deps: ['framer-motion'] },
  { name: 'hyperspeed', file: 'Hyperspeed.tsx', deps: [] },
  { name: 'true-focus', file: 'TrueFocus.tsx', deps: ['framer-motion'] },
  { name: 'ballpit', file: 'Ballpit.tsx', deps: [] },
  { name: 'shiny-text', file: 'ShinyText.tsx', deps: [] },
  { name: 'shape-grid', file: 'ShapeGrid.tsx', deps: ['framer-motion'] },
  { name: 'compare-mask', file: 'CompareMask.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'elastic-swiper', file: 'ElasticSwiper.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'perspective-ring', file: 'PerspectiveRing.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'card-stack-loop', file: 'CardStackLoop.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'spotlight-card', file: 'SpotlightCard.tsx', deps: ['framer-motion'] },
  { name: 'source-citation-card', file: 'SourceCitationCard.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'bento-stats-overview', file: 'BentoStatsOverview.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'concentric-activity-ring', file: 'ConcentricActivityRing.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'haptic-mic-input', file: 'HapticMicInput.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'bottom-drawer', file: 'BottomDrawer.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'liquid-progress-tank', file: 'LiquidProgressTank.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'ai-code-preview-panel', file: 'AICodePreviewPanel.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'workflow-node-card', file: 'WorkflowNodeCard.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'circular-wheel-carousel', file: 'CircularWheelCarousel.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'three-d-product-visualizer', file: 'ThreeDProductVisualizer.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'liquid-morph-text-title', file: 'LiquidMorphTextTitle.tsx', deps: ['framer-motion'] },
  { name: 'scroll-tied-progress-line', file: 'ScrollTiedProgressLine.tsx', deps: ['framer-motion'] },
  { name: 'coupon-scratch-card', file: 'CouponScratchCard.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'infinite-integration-marquee', file: 'InfiniteIntegrationMarquee.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'interactive-office-locator', file: 'InteractiveOfficeLocator.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'interactive-credit-card', file: 'InteractiveCreditCard.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'drag-wishlist-bucket', file: 'DragWishlistBucket.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'three-d-product-web-gl', file: 'ThreeDProductWebGL.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'elastic-pull-to-refresh', file: 'ElasticPullToRefresh.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'bottom-navigation-dock', file: 'BottomNavigationDock.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'haptic-swipe-list-row', file: 'HapticSwipeListRow.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'bouncy-star-feedback', file: 'BouncyStarFeedback.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'invoice-pricing-calculator', file: 'InvoicePricingCalculator.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'office-clock-grid', file: 'OfficeClockGrid.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'cinematic-parallax-hero', file: 'CinematicParallaxHero.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'cursor-velocity-ring', file: 'CursorVelocityRing.tsx', deps: ['framer-motion'] },
  { name: 'slide-screen-panels', file: 'SlideScreenPanels.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'holographic-foil-card', file: 'HolographicFoilCard.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'pixel-dissolve-hover', file: 'PixelDissolveHover.tsx', deps: ['lucide-react'] },
  { name: 'interactive-globe-canvas', file: 'InteractiveGlobeCanvas.tsx', deps: ['lucide-react'] },
  { name: 'responsive-heatmap-matrix', file: 'ResponsiveHeatmapMatrix.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'typewriter-elite-script', file: 'TypewriterEliteScript.tsx', deps: [] },
  { name: 'team-department-swapper', file: 'TeamDepartmentSwapper.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'bottom-action-bubble-nav', file: 'BottomActionBubbleNav.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'bouncy-pull-refresh-arrow', file: 'BouncyPullRefreshArrow.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'neumorphic-outset-product-card', file: 'NeumorphicOutsetProductCard.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'sliding-mini-cart-drawer', file: 'SlidingMiniCartDrawer.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'sizing-estimator-tool', file: 'SizingEstimatorTool.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'flying-to-cart-animator', file: 'FlyingToCartAnimator.tsx', deps: ['framer-motion'] },
  { name: 'interactive-engraving-field', file: 'InteractiveEngravingField.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'sizing-fit-indicator', file: 'SizingFitIndicator.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'product-bundle-selector', file: 'ProductBundleSelector.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'visual-search-overlay', file: 'VisualSearchOverlay.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'testimonial-stack-carousel', file: 'TestimonialStackCarousel.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'case-study-roster-grid', file: 'CaseStudyRosterGrid.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'bottom-navigation-pill', file: 'BottomNavigationPill.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'mobile-nav-circle-dial', file: 'MobileNavCircleDial.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'keyboard-safe-bottom-drawer', file: 'KeyboardSafeBottomDrawer.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'elastic-drag-list', file: 'ElasticDragList.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'pull-to-refresh-loader', file: 'PullToRefreshLoader.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'true-focus-scope', file: 'TrueFocusScope.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'magnetic-anchor-dot-pointer', file: 'MagneticAnchorDotPointer.tsx', deps: ['framer-motion'] },
  { name: 'cursor-repulsion-starfield', file: 'CursorRepulsionStarfield.tsx', deps: [] },
  { name: 'hover-accent-drawing-roster', file: 'HoverAccentDrawingRoster.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'diagonal-curtain-gate', file: 'DiagonalCurtainGate.tsx', deps: ['framer-motion'] },
  
  // Phase 10: Advanced SaaS & AI Components
  { name: 'prompt-input-glowing', file: 'PromptInputGlowing.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'ai-message-bubble-response', file: 'AIMessageBubbleResponse.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'interactive-command-palette', file: 'InteractiveCommandPalette.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'ai-prompt-parameter-switcher', file: 'AIPromptParameterSwitcher.tsx', deps: ['lucide-react'] },
  { name: 'multi-agent-conversational-panel', file: 'MultiAgentConversationalPanel.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'responsive-area-metric-chart', file: 'ResponsiveAreaMetricChart.tsx', deps: ['framer-motion', 'lucide-react', 'recharts'] },
  { name: 'holographic-pie-chart', file: 'HolographicPieChart.tsx', deps: ['framer-motion', 'lucide-react', 'recharts'] },
  { name: 'multi-line-trend-chart', file: 'MultiLineTrendChart.tsx', deps: ['framer-motion', 'lucide-react', 'recharts'] },
  { name: 'analytical-metric-folder', file: 'AnalyticalMetricFolder.tsx', deps: ['framer-motion', 'lucide-react', 'recharts'] },
  { name: 'workflow-node-spotlight', file: 'WorkflowNodeSpotlight.tsx', deps: ['lucide-react'] },

  // Phase 11: E-Commerce Suite
  { name: 'three-d-product-perspective-card', file: 'ThreeDProductPerspectiveCard.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'flip-card-product-vertical', file: 'FlipCardProductVertical.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'draggable-wishlist-product-card', file: 'DraggableWishlistProductCard.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'tilt-glare-product-card', file: 'TiltGlareProductCard.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'live-stock-counter', file: 'LiveStockCounter.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'address-auto-complete-selector', file: 'AddressAutoCompleteSelector.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'save-for-later-list-drawer', file: 'SaveForLaterListDrawer.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'diagonal-split-category-selector', file: 'DiagonalSplitCategorySelector.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'category-navigation-bubble', file: 'CategoryNavigationBubble.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'product-volume-customizer', file: 'ProductVolumeCustomizer.tsx', deps: ['framer-motion', 'lucide-react'] },

  // Phase 12: Creative & Typography Suite
  { name: 'decrypted-text-reveal', file: 'DecryptedTextReveal.tsx', deps: ['framer-motion'] },
  { name: 'split-text-character-slider', file: 'SplitTextCharacterSlider.tsx', deps: ['framer-motion'] },
  { name: 'rgb-chromatic-aberration-title', file: 'RGBChromaticAberrationTitle.tsx', deps: ['framer-motion'] },
  { name: 'cursor-attraction-magnet', file: 'CursorAttractionMagnet.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'mac-magnifying-dock-layout', file: 'MacMagnifyingDockLayout.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'cursor-velocity-ring-trail', file: 'CursorVelocityRingTrail.tsx', deps: ['framer-motion'] },
  { name: 'gsap-scroll-trigger-slider-panel', file: 'GSAPScrollTriggerSliderPanel.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'diagonal-sliding-slider-frame', file: 'DiagonalSlidingSliderFrame.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'fullscreen-grid-curtain-gate', file: 'FullscreenGridCurtainGate.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'pixel-dissolve-hover-image', file: 'PixelDissolveHoverImage.tsx', deps: ['framer-motion', 'lucide-react'] },

  // Phase 13: Business & Mobile Loaders
  { name: 'structured-roster-grid', file: 'StructuredRosterGrid.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'double-border-pricing-card', file: 'DoubleBorderPricingCard.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'faq-search-input-field', file: 'FAQSearchInputField.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'office-status-badge-tracker', file: 'OfficeStatusBadgeTracker.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'accreditation-trust-badge-grid', file: 'AccreditationTrustBadgeGrid.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'bottom-sheet-filter-panel', file: 'BottomSheetFilterPanel.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'bottom-sheet-share-dialog', file: 'BottomSheetShareDialog.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'reorderable-list-container', file: 'ReorderableListContainer.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'elastic-pull-to-refresh-indicator', file: 'ElasticPullToRefreshIndicator.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'interactive-mobile-loader-water-tank', file: 'InteractiveMobileLoaderWaterTank.tsx', deps: ['framer-motion', 'lucide-react'] },

  // Signature originals (production-scale, light+dark, original IP)
  { name: 'aurora-stat-card', file: 'AuroraStatCard.tsx', deps: ['lucide-react'] },
  { name: 'magnetic-button', file: 'MagneticButton.tsx', deps: [] },
  { name: 'segmented-billing-toggle', file: 'SegmentedBillingToggle.tsx', deps: ['framer-motion'] },
  { name: 'spotlight-feature-card', file: 'SpotlightFeatureCard.tsx', deps: ['lucide-react'] },
  { name: 'tilt-bento-grid', file: 'TiltBentoGrid.tsx', deps: ['lucide-react'] },
  { name: 'live-status-beacon', file: 'LiveStatusBeacon.tsx', deps: [] },
  { name: 'gradient-border-card', file: 'GradientBorderCard.tsx', deps: ['lucide-react'] },
  { name: 'step-progress-tracker', file: 'StepProgressTracker.tsx', deps: ['lucide-react'] },
  { name: 'rating-stars', file: 'RatingStars.tsx', deps: ['lucide-react'] },
  { name: 'avatar-stack', file: 'AvatarStack.tsx', deps: [] }
];

const UI_DIR = path.join(__dirname, '../../ui/src/components');
const REGISTRY_ITEMS_DIR = path.join(__dirname, '../items');

function generate() {
  console.log("Generating creative registry items...");
  
  if (!fs.existsSync(UI_DIR)) {
    console.error(`UI Components directory not found at: ${UI_DIR}`);
    process.exit(1);
  }

  for (const comp of comps) {
    const compPath = path.join(UI_DIR, comp.file);
    if (!fs.existsSync(compPath)) {
      console.error(`Component file not found at: ${compPath}`);
      continue;
    }
    
    let content = fs.readFileSync(compPath, 'utf8');
    
    // Replace standard local cn import with project level global import
    content = content.replace(/import\s+{\s*cn\s*}\s*from\s+['"]\.\.\/lib\/cn['"];?/g, 'import { cn } from "@/lib/utils";');
    
    const registryItem = {
      name: comp.name,
      type: 'registry:ui',
      dependencies: comp.deps,
      files: [
        {
          path: `components/ui/${comp.file}`,
          type: 'registry:ui',
          content: content
        }
      ]
    };
    
    const destPath = path.join(REGISTRY_ITEMS_DIR, `${comp.name}.json`);
    fs.writeFileSync(destPath, JSON.stringify(registryItem, null, 2), 'utf8');
    console.log(`✅ Created registry item for ${comp.name} at ${destPath}`);
  }
  
  console.log("🎉 Registry items generated successfully!");
}

generate();
