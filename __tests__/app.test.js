/**
 * App Start & Integration Tests (TDD Approach)
 * 
 * These tests define the expected behavior of the hello-world-app.
 * Tests should pass when the app is correctly configured and running.
 */

describe('Hello World App - Startup & Integration', () => {
  // Test 1: npm start script exists and is configured
  describe('npm start script', () => {
    it('should be defined in package.json', () => {
      const pkg = require('../package.json');
      expect(pkg.scripts).toHaveProperty('start');
      expect(pkg.scripts.start).toBeDefined();
    });

    it('should reference a valid server command', () => {
      const pkg = require('../package.json');
      expect(pkg.scripts.start).toMatch(/live-server|http-server|node|npx/);
    });

    it('should point to the src directory', () => {
      const pkg = require('../package.json');
      expect(pkg.scripts.start).toMatch(/src/);
    });
  });

  // Test 2: live-server dependency is configured
  describe('live-server dependency', () => {
    it('should be installed as a devDependency', () => {
      const pkg = require('../package.json');
      expect(pkg.devDependencies).toHaveProperty('live-server');
    });

    it('should be accessible via node_modules/.bin', () => {
      const fs = require('fs');
      const path = require('path');
      const liveServerPath = path.join(__dirname, '../node_modules/.bin/live-server');
      expect(fs.existsSync(liveServerPath)).toBe(true);
    });
  });

  // Test 3: HTML entry point exists and is valid
  describe('index.html', () => {
    it('should exist in src directory', () => {
      const fs = require('fs');
      const htmlPath = require('path').join(__dirname, '../src/index.html');
      expect(fs.existsSync(htmlPath)).toBe(true);
    });

    it('should contain DOCTYPE and essential elements', () => {
      const fs = require('fs');
      const htmlPath = require('path').join(__dirname, '../src/index.html');
      const html = fs.readFileSync(htmlPath, 'utf8');
      
      expect(html).toMatch(/<!DOCTYPE html/i);
      expect(html).toMatch(/<html/i);
      expect(html).toMatch(/<head/i);
      expect(html).toMatch(/<body/i);
      expect(html).toMatch(/<title>/i);
    });

    it('should link to the stylesheet and scripts', () => {
      const fs = require('fs');
      const htmlPath = require('path').join(__dirname, '../src/index.html');
      const html = fs.readFileSync(htmlPath, 'utf8');
      
      expect(html).toMatch(/style\.css/);
      expect(html).toMatch(/app\.js/);
    });

    it('should have required broadcast UI elements', () => {
      const fs = require('fs');
      const htmlPath = require('path').join(__dirname, '../src/index.html');
      const html = fs.readFileSync(htmlPath, 'utf8');
      
      expect(html).toMatch(/easterGuide|headline|metric/i);
    });
  });

  // Test 4: CSS stylesheet exists and is valid
  describe('stylesheet', () => {
    it('should exist in src/styles directory', () => {
      const fs = require('fs');
      const cssPath = require('path').join(__dirname, '../src/styles/style.css');
      expect(fs.existsSync(cssPath)).toBe(true);
    });

    it('should contain valid CSS', () => {
      const fs = require('fs');
      const cssPath = require('path').join(__dirname, '../src/styles/style.css');
      const css = fs.readFileSync(cssPath, 'utf8');
      
      // Check for basic CSS structure
      expect(css).toMatch(/\{/);
      expect(css).toMatch(/\}/);
      expect(css.length).toBeGreaterThan(100); // Should have meaningful content
    });
  });

  // Test 5: JavaScript app file exists and is syntactically valid
  describe('app.js script', () => {
    it('should exist in src/scripts directory', () => {
      const fs = require('fs');
      const jsPath = require('path').join(__dirname, '../src/scripts/app.js');
      expect(fs.existsSync(jsPath)).toBe(true);
    });

    it('should be syntactically valid JavaScript', () => {
      const fs = require('fs');
      const jsPath = require('path').join(__dirname, '../src/scripts/app.js');
      const js = fs.readFileSync(jsPath, 'utf8');
      
      // Try to parse as JavaScript
      expect(() => {
        new Function(js);
      }).not.toThrow();
    });

    it('should contain core function definitions', () => {
      const fs = require('fs');
      const jsPath = require('path').join(__dirname, '../src/scripts/app.js');
      const js = fs.readFileSync(jsPath, 'utf8');
      
      // Check for essential functions mentioned in ARCHITECTURE.md
      expect(js).toMatch(/function|const|let|var/); // Should have executable code
      expect(js.length).toBeGreaterThan(500); // Should have meaningful implementation
    });
  });

  // Test 6: Package.json is valid and complete
  describe('package.json configuration', () => {
    it('should have valid JSON structure', () => {
      expect(() => {
        require('../package.json');
      }).not.toThrow();
    });

    it('should have required metadata fields', () => {
      const pkg = require('../package.json');
      expect(pkg.name).toBeDefined();
      expect(pkg.version).toBeDefined();
      expect(pkg.description).toBeDefined();
    });

    it('should have required dependencies installed', () => {
      const pkg = require('../package.json');
      expect(pkg.dependencies['animejs']).toBeDefined();
      expect(pkg.dependencies['normalize.css']).toBeDefined();
    });

    it('should specify node engine compatibility', () => {
      const pkg = require('../package.json');
      expect(pkg.engines).toHaveProperty('node');
      expect(pkg.engines.node).toMatch(/>=\s*14/);
    });
  });

  // Test 7: Project structure is correct
  describe('project structure', () => {
    it('should have README.md documentation', () => {
      const fs = require('fs');
      const readmePath = require('path').join(__dirname, '../README.md');
      expect(fs.existsSync(readmePath)).toBe(true);
    });

    it('should have ARCHITECTURE.md documentation', () => {
      const fs = require('fs');
      const archPath = require('path').join(__dirname, '../ARCHITECTURE.md');
      expect(fs.existsSync(archPath)).toBe(true);
    });

    it('should have all required directories', () => {
      const fs = require('fs');
      const path = require('path');
      const baseDir = require('path').join(__dirname, '..');
      
      const required = ['src', 'src/scripts', 'src/styles'];
      required.forEach(dir => {
        const fullPath = path.join(baseDir, dir);
        expect(fs.existsSync(fullPath)).toBe(true);
      });
    });
  });
});
