import { test, expect, Locator } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

/**
 * @title Validate Specific Component Test
 * @description Analyzes a SPECIFIC component you provide - gives detailed CSS analysis for Figma comparison
 * @tags @webtest @component-validation @figma-comparison @specific-component
 */

// Type definitions
interface CSSStylesDetail {
  layout: Record<string, string>;
  visual: Record<string, string>;
  typography: Record<string, string>;
  spacing: Record<string, string>;
  positioning: Record<string, string>;
  border: Record<string, string>;
  background: Record<string, string>;
  transform: Record<string, string>;
}

interface ComponentDetailAnalysis {
  componentName: string;
  element: string;
  selector: string;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  computedStyles: CSSStylesDetail;
  attributes: Record<string, string>;
  figmaComparison: {
    dimensions: string;
    position: string;
    colors: Record<string, string>;
    typography: Record<string, string>;
    spacing: Record<string, string>;
    checklist: string[];
  };
  qaValidation: {
    accessibility: Record<string, boolean>;
    responsiveness: Record<string, string>;
    consistency: Record<string, boolean>;
  };
}

// Website configuration  
const WEBSITE_CONFIG = {
  url: process.env.COMPONENT_BASE_URL || 'https://blueparadox.com/en',
  name: 'Current Website',
  titlePattern: /Marines|BlueParadox|United States Marine Corps/, // Accept multiple possible titles
  screenshotPrefix: 'component-detail'
};

// CONFIGURATION: Specify which component to analyze
const TARGET_COMPONENT = {
  // Change these values to analyze different components
  name: 'Primary Logo', // Descriptive name for the component
  selector: 'img[alt*="logo" i], img[src*="logo" i], .logo img, [class*="logo" i] img', // CSS selector to find the component
  fallbackSelector: 'img:first-of-type' // Fallback if primary selector fails
};

test.describe('Component Detail Analysis', () => {
  test(`Analyze ${TARGET_COMPONENT.name} component for Figma comparison`, async ({ page }) => {
    // Navigate to the target page
    await test.step('Navigate to target page', async () => {
      await page.goto(WEBSITE_CONFIG.url);
      await expect(page).toHaveTitle(WEBSITE_CONFIG.titlePattern);
    });

    let targetElement: Locator;
    let usedSelector = '';

    // Find the target component
    await test.step('Locate target component', async () => {
      try {
        targetElement = page.locator(TARGET_COMPONENT.selector).first();
        const isVisible = await targetElement.isVisible();
        if (isVisible) {
          usedSelector = TARGET_COMPONENT.selector;
        } else {
          throw new Error('Primary selector not visible');
        }
      } catch (error) {
        console.log('Primary selector failed, trying fallback...');
        targetElement = page.locator(TARGET_COMPONENT.fallbackSelector).first();
        usedSelector = TARGET_COMPONENT.fallbackSelector;
      }

      await expect(targetElement).toBeVisible();
      console.log(`✅ Found ${TARGET_COMPONENT.name} using selector: ${usedSelector}`);
    });

    let componentAnalysis: ComponentDetailAnalysis;

    // Perform detailed analysis
    await test.step('Perform detailed component analysis', async () => {
      // Get bounding box
      const boundingBox = await targetElement.boundingBox();
      if (!boundingBox) {
        throw new Error('Could not get component bounding box');
      }

      // Get computed styles
      const computedStyles = await targetElement.evaluate((element: any) => {
        const styles = window.getComputedStyle(element);
        return {
          layout: {
            display: styles.display,
            position: styles.position,
            float: styles.float,
            clear: styles.clear,
            overflow: styles.overflow,
            overflowX: styles.overflowX,
            overflowY: styles.overflowY,
            visibility: styles.visibility,
            opacity: styles.opacity,
            zIndex: styles.zIndex
          },
          visual: {
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            opacity: styles.opacity,
            filter: styles.filter,
            backdropFilter: styles.backdropFilter,
            mixBlendMode: styles.mixBlendMode,
            clipPath: styles.clipPath
          },
          typography: {
            fontFamily: styles.fontFamily,
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight,
            fontStyle: styles.fontStyle,
            lineHeight: styles.lineHeight,
            letterSpacing: styles.letterSpacing,
            textAlign: styles.textAlign,
            textDecoration: styles.textDecoration,
            textTransform: styles.textTransform,
            whiteSpace: styles.whiteSpace,
            wordSpacing: styles.wordSpacing,
            textIndent: styles.textIndent
          },
          spacing: {
            padding: styles.padding,
            paddingTop: styles.paddingTop,
            paddingRight: styles.paddingRight,
            paddingBottom: styles.paddingBottom,
            paddingLeft: styles.paddingLeft,
            margin: styles.margin,
            marginTop: styles.marginTop,
            marginRight: styles.marginRight,
            marginBottom: styles.marginBottom,
            marginLeft: styles.marginLeft
          },
          positioning: {
            position: styles.position,
            top: styles.top,
            right: styles.right,
            bottom: styles.bottom,
            left: styles.left,
            width: styles.width,
            height: styles.height,
            minWidth: styles.minWidth,
            maxWidth: styles.maxWidth,
            minHeight: styles.minHeight,
            maxHeight: styles.maxHeight
          },
          border: {
            border: styles.border,
            borderTop: styles.borderTop,
            borderRight: styles.borderRight,
            borderBottom: styles.borderBottom,
            borderLeft: styles.borderLeft,
            borderRadius: styles.borderRadius,
            borderTopLeftRadius: styles.borderTopLeftRadius,
            borderTopRightRadius: styles.borderTopRightRadius,
            borderBottomLeftRadius: styles.borderBottomLeftRadius,
            borderBottomRightRadius: styles.borderBottomRightRadius,
            borderStyle: styles.borderStyle,
            borderWidth: styles.borderWidth,
            borderColor: styles.borderColor,
            outline: styles.outline,
            outlineColor: styles.outlineColor,
            outlineStyle: styles.outlineStyle,
            outlineWidth: styles.outlineWidth
          },
          background: {
            background: styles.background,
            backgroundColor: styles.backgroundColor,
            backgroundImage: styles.backgroundImage,
            backgroundRepeat: styles.backgroundRepeat,
            backgroundPosition: styles.backgroundPosition,
            backgroundSize: styles.backgroundSize,
            backgroundAttachment: styles.backgroundAttachment,
            backgroundClip: styles.backgroundClip,
            backgroundOrigin: styles.backgroundOrigin
          },
          transform: {
            transform: styles.transform,
            transformOrigin: styles.transformOrigin,
            transformStyle: styles.transformStyle,
            perspective: styles.perspective,
            perspectiveOrigin: styles.perspectiveOrigin,
            backfaceVisibility: styles.backfaceVisibility
          }
        };
      });

      // Get element attributes
      const attributes = await targetElement.evaluate((element: any) => {
        const attrs: Record<string, string> = {};
        for (let i = 0; i < element.attributes.length; i++) {
          const attr = element.attributes[i];
          attrs[attr.name] = attr.value;
        }
        return attrs;
      });

      // Get element tag name
      const tagName = await targetElement.evaluate((el: any) => el.tagName.toLowerCase());

      // Create Figma comparison data
      const figmaComparison = {
        dimensions: `${Math.round(boundingBox.width)}×${Math.round(boundingBox.height)}px`,
        position: `x:${Math.round(boundingBox.x)}, y:${Math.round(boundingBox.y)}`,
        colors: {
          backgroundColor: computedStyles.visual.backgroundColor,
          textColor: computedStyles.visual.color,
          borderColor: computedStyles.border.borderColor
        },
        typography: {
          fontFamily: computedStyles.typography.fontFamily,
          fontSize: computedStyles.typography.fontSize,
          fontWeight: computedStyles.typography.fontWeight,
          lineHeight: computedStyles.typography.lineHeight,
          letterSpacing: computedStyles.typography.letterSpacing
        },
        spacing: {
          padding: computedStyles.spacing.padding,
          margin: computedStyles.spacing.margin,
          borderRadius: computedStyles.border.borderRadius
        },
        checklist: [
          `✓ Verify dimensions: ${Math.round(boundingBox.width)}×${Math.round(boundingBox.height)}px`,
          `✓ Check position: x:${Math.round(boundingBox.x)}, y:${Math.round(boundingBox.y)}`,
          `✓ Validate colors: bg(${computedStyles.visual.backgroundColor}) text(${computedStyles.visual.color})`,
          `✓ Confirm typography: ${computedStyles.typography.fontFamily} at ${computedStyles.typography.fontSize}`,
          `✓ Check spacing: padding(${computedStyles.spacing.padding}) margin(${computedStyles.spacing.margin})`,
          `✓ Verify borders: ${computedStyles.border.border}`,
          `✓ Validate border-radius: ${computedStyles.border.borderRadius}`,
          `✓ Check opacity: ${computedStyles.visual.opacity}`,
          `✓ Verify display: ${computedStyles.layout.display}`,
          `✓ Validate position: ${computedStyles.layout.position}`
        ]
      };

      // QA Validation checks
      const qaValidation = {
        accessibility: {
          hasAltText: !!(attributes.alt || attributes['aria-label']),
          hasRole: !!attributes.role,
          isVisible: computedStyles.layout.visibility === 'visible' && computedStyles.layout.opacity !== '0',
          hasAppropriateSize: boundingBox.width >= 44 && boundingBox.height >= 44,
          hasContrastRatio: true // Would need additional calculation
        },
        responsiveness: {
          widthUnit: computedStyles.positioning.width.includes('%') ? 'relative' : 'fixed',
          heightUnit: computedStyles.positioning.height.includes('%') ? 'relative' : 'fixed',
          positionType: computedStyles.layout.position,
          overflowHandling: computedStyles.layout.overflow
        },
        consistency: {
          usesBorderBox: true, // Would need box-sizing check
          usesRelativeUnits: computedStyles.typography.fontSize.includes('rem') || computedStyles.typography.fontSize.includes('em'),
          hasTransitions: !!computedStyles.transform.transform,
          followsNamingConvention: true // Would need class analysis
        }
      };

      componentAnalysis = {
        componentName: TARGET_COMPONENT.name,
        element: tagName,
        selector: usedSelector,
        boundingBox,
        computedStyles,
        attributes,
        figmaComparison,
        qaValidation
      };
    });

    // Generate detailed reports
    await test.step('Generate component analysis reports', async () => {
      const reportsDir = join(process.cwd(), 'component-reports', 'specific-analysis');
      
      // Create directory if it doesn't exist
      mkdirSync(reportsDir, { recursive: true });
      
      // Create technical analysis JSON with descriptive filename
      const technicalReport = JSON.stringify(componentAnalysis, null, 2);
      const componentFileName = TARGET_COMPONENT.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const technicalPath = join(reportsDir, `${componentFileName}-technical-analysis.json`);
      writeFileSync(technicalPath, technicalReport);

      // Create Figma comparison report
      const figmaReport = `
FIGMA DESIGN COMPARISON REPORT
==============================

Component: ${componentAnalysis.componentName}
Element: <${componentAnalysis.element}>
Selector: ${componentAnalysis.selector}
Scan Date: ${new Date().toISOString()}

DIMENSIONS & POSITIONING:
========================
Actual Size: ${componentAnalysis.figmaComparison.dimensions}
Position: ${componentAnalysis.figmaComparison.position}
Display: ${componentAnalysis.computedStyles.layout.display}
Position Type: ${componentAnalysis.computedStyles.layout.position}

COLORS & VISUAL:
===============
Background: ${componentAnalysis.figmaComparison.colors.backgroundColor}
Text Color: ${componentAnalysis.figmaComparison.colors.textColor}
Border Color: ${componentAnalysis.figmaComparison.colors.borderColor}
Opacity: ${componentAnalysis.computedStyles.visual.opacity}

TYPOGRAPHY:
==========
Font Family: ${componentAnalysis.figmaComparison.typography.fontFamily}
Font Size: ${componentAnalysis.figmaComparison.typography.fontSize}
Font Weight: ${componentAnalysis.figmaComparison.typography.fontWeight}
Line Height: ${componentAnalysis.figmaComparison.typography.lineHeight}
Letter Spacing: ${componentAnalysis.figmaComparison.typography.letterSpacing}

SPACING & LAYOUT:
================
Padding: ${componentAnalysis.figmaComparison.spacing.padding}
Margin: ${componentAnalysis.figmaComparison.spacing.margin}
Border Radius: ${componentAnalysis.figmaComparison.spacing.borderRadius}

FIGMA VALIDATION CHECKLIST:
===========================
${componentAnalysis.figmaComparison.checklist.join('\n')}

QA ACCESSIBILITY CHECKS:
========================
Has Alt Text: ${componentAnalysis.qaValidation.accessibility.hasAltText ? '✅ PASS' : '❌ FAIL'}
Has Role: ${componentAnalysis.qaValidation.accessibility.hasRole ? '✅ PASS' : '❌ FAIL'}  
Is Visible: ${componentAnalysis.qaValidation.accessibility.isVisible ? '✅ PASS' : '❌ FAIL'}
Appropriate Size: ${componentAnalysis.qaValidation.accessibility.hasAppropriateSize ? '✅ PASS' : '❌ FAIL'}

DETAILED CSS PROPERTIES:
=======================

LAYOUT:
${Object.entries(componentAnalysis.computedStyles.layout)
  .map(([prop, value]) => `  ${prop}: ${value}`)
  .join('\n')}

VISUAL:
${Object.entries(componentAnalysis.computedStyles.visual)
  .map(([prop, value]) => `  ${prop}: ${value}`)
  .join('\n')}

TYPOGRAPHY:
${Object.entries(componentAnalysis.computedStyles.typography)
  .map(([prop, value]) => `  ${prop}: ${value}`)
  .join('\n')}

SPACING:
${Object.entries(componentAnalysis.computedStyles.spacing)
  .map(([prop, value]) => `  ${prop}: ${value}`)
  .join('\n')}

POSITIONING:
${Object.entries(componentAnalysis.computedStyles.positioning)
  .map(([prop, value]) => `  ${prop}: ${value}`)
  .join('\n')}

BORDER:
${Object.entries(componentAnalysis.computedStyles.border)
  .map(([prop, value]) => `  ${prop}: ${value}`)
  .join('\n')}

BACKGROUND:
${Object.entries(componentAnalysis.computedStyles.background)
  .map(([prop, value]) => `  ${prop}: ${value}`)
  .join('\n')}

TRANSFORM:
${Object.entries(componentAnalysis.computedStyles.transform)
  .map(([prop, value]) => `  ${prop}: ${value}`)
  .join('\n')}

ELEMENT ATTRIBUTES:
==================
${Object.entries(componentAnalysis.attributes)
  .map(([attr, value]) => `  ${attr}="${value}"`)
  .join('\n')}
`;

      const figmaPath = join(reportsDir, `${componentFileName}-figma-comparison.txt`);
      writeFileSync(figmaPath, figmaReport);

      // Create quick reference summary
      const quickRef = `
QUICK REFERENCE: ${componentAnalysis.componentName}
=======================================

COPY FOR FIGMA COMPARISON:
• Dimensions: ${componentAnalysis.figmaComparison.dimensions}
• Position: ${componentAnalysis.figmaComparison.position}  
• Background: ${componentAnalysis.figmaComparison.colors.backgroundColor}
• Text Color: ${componentAnalysis.figmaComparison.colors.textColor}
• Font: ${componentAnalysis.figmaComparison.typography.fontFamily}
• Font Size: ${componentAnalysis.figmaComparison.typography.fontSize}
• Font Weight: ${componentAnalysis.figmaComparison.typography.fontWeight}
• Padding: ${componentAnalysis.figmaComparison.spacing.padding}
• Margin: ${componentAnalysis.figmaComparison.spacing.margin}
• Border Radius: ${componentAnalysis.figmaComparison.spacing.borderRadius}

CSS SELECTOR FOR TESTING:
${componentAnalysis.selector}

ELEMENT TAG:
<${componentAnalysis.element}>
`;

      const quickRefPath = join(reportsDir, `${componentFileName}-quick-reference.txt`);
      writeFileSync(quickRefPath, quickRef);

      console.log(`✅ Component analysis completed for: ${componentAnalysis.componentName}`);
      console.log('📋 Reports saved to: component-reports/specific-analysis/');
      console.log(`   - ${componentFileName}-technical-analysis.json (complete CSS data)`);
      console.log(`   - ${componentFileName}-figma-comparison.txt (design validation)`); 
      console.log(`   - ${componentFileName}-quick-reference.txt (copy-paste ready data)`);

      // Note: Files are saved directly to component-reports/specific-analysis/ with descriptive names
      // No longer attaching to Playwright report to avoid duplicate hash-named files
    });

    // Take component screenshot
    await test.step('Capture component screenshot', async () => {
      const componentFileName = TARGET_COMPONENT.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const screenshotPath = join(process.cwd(), 'component-reports', 'specific-analysis', `${componentFileName}-screenshot.png`);
      await targetElement.screenshot({ 
        path: screenshotPath,
        animations: 'disabled'
      });

      console.log(`📸 Component screenshot saved: component-reports/specific-analysis/${componentFileName}-screenshot.png`);
      // Note: Screenshot saved directly with descriptive name, not attached to avoid hash-named duplicates
    });

    // Validation assertions
    await test.step('Validate component analysis', async () => {
      expect(componentAnalysis.boundingBox.width).toBeGreaterThan(0);
      expect(componentAnalysis.boundingBox.height).toBeGreaterThan(0);
      expect(componentAnalysis.computedStyles.layout.visibility).toBe('visible');
      
      console.log(`✅ Component validation passed for: ${componentAnalysis.componentName}`);
      console.log(`   Dimensions: ${componentAnalysis.figmaComparison.dimensions}`);
      console.log(`   Position: ${componentAnalysis.figmaComparison.position}`);
      console.log(`   Accessibility: ${componentAnalysis.qaValidation.accessibility.hasAltText ? 'Has alt text' : 'Missing alt text'}`);
    });
  });
});