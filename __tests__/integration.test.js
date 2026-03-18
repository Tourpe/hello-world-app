/**
 * Integration Test - Server Startup
 * 
 * This test starts the actual server and validates it responds correctly.
 */

const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

describe('Integration: Server Startup', () => {
  let serverProcess;
  const PORT = 8765;
  const BASE_URL = `http://localhost:${PORT}`;
  const TIMEOUT = 10000;

  // Start server before tests
  beforeAll((done) => {
    // Use npx to invoke live-server
    serverProcess = spawn('npx', ['live-server', 'src', `--port=${PORT}`, '--no-browser'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe',
      detached: true
    });

    // Wait for server to be ready
    let attempts = 0;
    const checkServer = () => {
      attempts++;
      
      const request = http.get(BASE_URL, (res) => {
        console.log(`✓ Server ready after ${attempts} attempts`);
        done();
      });

      request.on('error', () => {
        if (attempts < 20) {
          setTimeout(checkServer, 500);
        } else {
          done(new Error('Server did not start within timeout'));
        }
      });

      request.end();
    };

    setTimeout(checkServer, 1000);
  }, TIMEOUT);

  // Stop server after tests
  afterAll(() => {
    if (serverProcess) {
      process.kill(-serverProcess.pid, 'SIGTERM');
    }
  });

  test('server responds to HTTP requests', (done) => {
    const request = http.get(BASE_URL, (res) => {
      expect(res.statusCode).toBe(200);
      done();
    });

    request.on('error', (err) => {
      done(err);
    });

    request.end();
  }, TIMEOUT);

  test('server serves index.html', (done) => {
    let data = '';

    const request = http.get(BASE_URL, (res) => {
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        expect(data).toContain('<!DOCTYPE html');
        expect(data).toContain('Hello World');
        done();
      });
    });

    request.on('error', (err) => {
      done(err);
    });

    request.end();
  }, TIMEOUT);

  test('server serves CSS stylesheet', (done) => {
    let data = '';

    const request = http.get(`${BASE_URL}/styles/style.css`, (res) => {
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        expect(res.statusCode).toBe(200);
        expect(res.headers['content-type']).toContain('text/css');
        done();
      });
    });

    request.on('error', (err) => {
      done(err);
    });

    request.end();
  }, TIMEOUT);

  test('server serves application script', (done) => {
    let data = '';

    const request = http.get(`${BASE_URL}/scripts/app.js`, (res) => {
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        expect(res.statusCode).toBe(200);
        expect(res.headers['content-type']).toMatch(/javascript/);
        done();
      });
    });

    request.on('error', (err) => {
      done(err);
    });

    request.end();
  }, TIMEOUT);
});
