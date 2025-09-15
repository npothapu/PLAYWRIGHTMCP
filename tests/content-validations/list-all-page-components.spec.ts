import { test, expect } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

/**
 * @title List All Page Components Test
 * @description Discovers and lists ALL interactive and visual components on a page for QA planning and overview
 * @tags @webtest @component-list @qa-discovery @inventory
 */

// Type definitions
interface ComponentAttributes {
  id?: string;
  class?: string;
  role?: string;
  href?: string;
  src?: string;
  alt?: string;
  ariaLabel?: string;
}

interface ComponentInfo {
  index: number;
  type: string;
  element: string;
  text: string;
  position: string;
  dimensions: string;
  attributes: ComponentAttributes;
  selector: string;
  qaIdentifier: string;
}

interface ComponentTypeData {
  count: number;
  components: ComponentInfo[];
  error?: string;
}

interface InventoryData {
  website: string;
  url: string;
  scanDate: string;
  totalComponents: number;
  componentsByType: Record<string, ComponentTypeData>;
  detailedInventory: ComponentInfo[];
}

// Website configuration
const WEBSITE_CONFIG = {
  url: process.env.COMPONENT_BASE_URL || 'https://blueparadox.com/en',
  name: 'Current Website',
  titlePattern: /Marines|BlueParadox|United States Marine Corps/, // Accept multiple possible titles
  screenshotPrefix: 'component-inventory'
};

test.describe('Page Component Inventory', () => {
  test('Generate complete component inventory list', async ({ page }) => {
    // Navigate to the target page
    await test.step('Navigate to target page', async () => {
      await page.goto(WEBSITE_CONFIG.url);
      await expect(page).toHaveTitle(WEBSITE_CONFIG.titlePattern);
    });

    // Define component selectors for discovery
    const componentSelectors = [
      { name: 'Logos/Images', selector: 'img', role: 'img' },
      { name: 'Navigation Links', selector: 'nav a, [role="navigation"] a', role: 'link' },
      { name: 'Buttons', selector: 'button, [role="button"], input[type="button"], input[type="submit"]', role: 'button' },
      { name: 'Headings', selector: 'h1, h2, h3, h4, h5, h6', role: 'heading' },
      { name: 'Text Links', selector: 'a:not(nav a):not([role="navigation"] a)', role: 'link' },
      { name: 'Form Inputs', selector: 'input, textarea, select', role: 'textbox' },
      { name: 'Lists', selector: 'ul, ol', role: 'list' },
      { name: 'Articles/Sections', selector: 'article, section, [role="main"]', role: 'main' },
      { name: 'Navigation Menus', selector: 'nav, [role="navigation"]', role: 'navigation' },
      { name: 'Interactive Elements', selector: '[onclick], [role="tab"], [role="tabpanel"]', role: 'tab' }
    ];

    const inventoryData: InventoryData = {
      website: WEBSITE_CONFIG.name,
      url: WEBSITE_CONFIG.url,
      scanDate: new Date().toISOString(),
      totalComponents: 0,
      componentsByType: {},
      detailedInventory: []
    };

    // Scan each component type
    await test.step('Scan and catalog all components', async () => {
      for (const componentType of componentSelectors) {
        try {
          const elements = await page.locator(componentType.selector).all();
          const componentList = [];

          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            
            try {
              // Check if element is visible
              const isVisible = await element.isVisible();
              if (!isVisible) continue;

              // Get element details
              const boundingBox = await element.boundingBox();
              const tagName = await element.evaluate(el => el.tagName.toLowerCase());
              
              // Get text content (safely)
              let textContent = '';
              try {
                textContent = await element.textContent() || '';
                textContent = textContent.trim().substring(0, 100); // Limit length
              } catch (e) {
                textContent = 'N/A';
              }

              // Get key attributes
              const attributes: ComponentAttributes = {};
              try {
                const id = await element.getAttribute('id');
                const className = await element.getAttribute('class');
                const role = await element.getAttribute('role');
                const href = await element.getAttribute('href');
                const src = await element.getAttribute('src');
                const alt = await element.getAttribute('alt');
                const ariaLabel = await element.getAttribute('aria-label');

                if (id) attributes.id = id;
                if (className) attributes.class = className.split(' ').slice(0, 3).join(' '); // Limit classes
                if (role) attributes.role = role;
                if (href) attributes.href = href;
                if (src) attributes.src = src.substring(0, 100); // Limit URL length
                if (alt) attributes.alt = alt;
                if (ariaLabel) attributes.ariaLabel = ariaLabel;
              } catch (e) {
                // Continue if attribute reading fails
              }

              const componentInfo = {
                index: i + 1,
                type: componentType.name,
                element: tagName,
                text: textContent,
                position: boundingBox ? `(${Math.round(boundingBox.x)}, ${Math.round(boundingBox.y)})` : 'N/A',
                dimensions: boundingBox ? `${Math.round(boundingBox.width)}×${Math.round(boundingBox.height)}px` : 'N/A',
                attributes: attributes,
                selector: `${tagName}${attributes.id ? `#${attributes.id}` : ''}${attributes.class ? `.${attributes.class.split(' ')[0]}` : ''}`,
                qaIdentifier: `${componentType.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${i + 1}`
              };

              componentList.push(componentInfo);
            } catch (elementError: any) {
              console.log(`Error processing element ${i} of type ${componentType.name}:`, elementError.message);
              continue;
            }
          }

          inventoryData.componentsByType[componentType.name] = {
            count: componentList.length,
            components: componentList
          };

          inventoryData.totalComponents += componentList.length;
          inventoryData.detailedInventory.push(...componentList);

        } catch (typeError: any) {
          console.log(`Error scanning component type ${componentType.name}:`, typeError.message);
          inventoryData.componentsByType[componentType.name] = {
            count: 0,
            components: [],
            error: typeError.message
          };
        }
      }
    });

    // Generate reports
    await test.step('Generate component inventory reports', async () => {
      const reportsDir = join(process.cwd(), 'component-reports', 'inventory');
      
      // Create directory if it doesn't exist
      mkdirSync(reportsDir, { recursive: true });
      
      // Create detailed JSON report with descriptive filename
      const jsonReport = JSON.stringify(inventoryData, null, 2);
      const jsonPath = join(reportsDir, 'component-inventory-detailed.json');
      writeFileSync(jsonPath, jsonReport);

      // Create QA-friendly summary report
      const summaryReport = `
COMPONENT INVENTORY REPORT
==========================

Website: ${inventoryData.website}
URL: ${inventoryData.url}
Scan Date: ${inventoryData.scanDate}
Total Components Found: ${inventoryData.totalComponents}

COMPONENT BREAKDOWN BY TYPE:
${Object.entries(inventoryData.componentsByType)
  .map(([type, data]) => `${type}: ${data.count} components`)
  .join('\n')}

DETAILED COMPONENT LIST:
${inventoryData.detailedInventory
  .map(comp => `${comp.index}. ${comp.type} - ${comp.element} "${comp.text}" [${comp.dimensions}] ${comp.selector}`)
  .join('\n')}

QA COMPONENT REFERENCE:
${inventoryData.detailedInventory
  .map(comp => `${comp.qaIdentifier}: ${comp.text || comp.element} (${comp.dimensions})`)
  .join('\n')}
`;

      const summaryPath = join(reportsDir, 'component-inventory-summary.txt');
      writeFileSync(summaryPath, summaryReport);

      // Create Figma comparison checklist
      const figmaChecklist = `
FIGMA DESIGN COMPARISON CHECKLIST
=================================

Use this list to verify components match Figma designs:

${Object.entries(inventoryData.componentsByType)
  .filter(([type, data]) => data.count > 0)
  .map(([type, data]) => `
${type.toUpperCase()} (${data.count} found):
${data.components
  .map(comp => `□ ${comp.text || comp.element} - Check: dimensions(${comp.dimensions}), position${comp.position}, styling`)
  .join('\n')}`)
  .join('\n')}

QUICK REFERENCE BY QA ID:
${inventoryData.detailedInventory
  .map(comp => `${comp.qaIdentifier} = "${comp.text || comp.element}" ${comp.selector}`)
  .join('\n')}
`;

      const checklistPath = join(reportsDir, 'figma-comparison-checklist.txt');
      writeFileSync(checklistPath, figmaChecklist);

      console.log(`✅ Component inventory completed - ${inventoryData.totalComponents} components found`);
      console.log('📋 Reports saved to: component-reports/inventory/');
      console.log('   - component-inventory-detailed.json (technical data)');
      console.log('   - component-inventory-summary.txt (QA overview)');
      console.log('   - figma-comparison-checklist.txt (design validation)');

      // Note: Files are saved directly to component-reports/inventory/ with descriptive names
      // No longer attaching to Playwright report to avoid duplicate hash-named files
    });

    // Take overview screenshot
    await test.step('Capture page overview screenshot', async () => {
      const screenshotPath = join(process.cwd(), 'component-reports', 'inventory', 'page-overview-screenshot.png');
      await page.screenshot({ 
        path: screenshotPath,
        fullPage: true
      });

      console.log('📸 Screenshot saved: component-reports/inventory/page-overview-screenshot.png');
      // Note: Screenshot saved directly with descriptive name, not attached to avoid hash-named duplicates
    });

    // Validation assertions
    await test.step('Validate component discovery', async () => {
      expect(inventoryData.totalComponents).toBeGreaterThan(0);
      expect(Object.keys(inventoryData.componentsByType).length).toBeGreaterThan(0);
      
      console.log(`✅ Component inventory validation passed`);
      console.log(`   Found ${inventoryData.totalComponents} total components`);
      console.log(`   Across ${Object.keys(inventoryData.componentsByType).length} component types`);
    });
  });
});