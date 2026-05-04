const { startServer, stopServer, getServerUrl } = require('../helpers/startServer');
const { createClient } = require('../helpers/client');

describe('OpenAPI/Docs Endpoints', () => {
  let serverUrl;
  
  beforeAll(async () => {
    await startServer();
    serverUrl = getServerUrl();
  }, 120000);
  
  afterAll(async () => {
    await stopServer();
  }, 30000);
  
  describe('GET /openapi.json', () => {
    test('returns 200 with valid OpenAPI 3.1.0 spec', async () => {
      const response = await fetch(`${serverUrl}/openapi.json`);
      
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('application/json');
      
      const spec = await response.json();
      
      // Verify OpenAPI version
      expect(spec.openapi).toBe('3.1.0');
      
      // Verify basic structure
      expect(spec.info).toBeDefined();
      expect(spec.info.title).toBeDefined();
      expect(spec.info.version).toBeDefined();
      expect(spec.paths).toBeDefined();
      expect(typeof spec.paths).toBe('object');
      
      // Verify representative core routes are documented
      expect(spec.paths['/health']).toBeDefined();
      expect(spec.paths['/presets']).toBeDefined();
      expect(spec.paths['/tabs']).toBeDefined();
      expect(spec.paths['/tabs/{tabId}/navigate']).toBeDefined();
      expect(spec.paths['/tabs/{tabId}/snapshot']).toBeDefined();
      expect(spec.paths['/tabs/{tabId}/click']).toBeDefined();
      
      // Verify representative OpenClaw routes are documented
      expect(spec.paths['/tabs/open']).toBeDefined();
      expect(spec.paths['/navigate']).toBeDefined();
      expect(spec.paths['/snapshot']).toBeDefined();
      expect(spec.paths['/act']).toBeDefined();
    });
    
    test('spec includes components and schemas', async () => {
      const response = await fetch(`${serverUrl}/openapi.json`);
      const spec = await response.json();
      
      // Verify components section exists
      expect(spec.components).toBeDefined();
      expect(spec.components.schemas).toBeDefined();
      
      // Verify some key schemas are defined
      expect(spec.components.schemas.TabState).toBeDefined();
      expect(spec.components.schemas.GeolocationConfig).toBeDefined();
    });
  });
  
  describe('GET /api/docs', () => {
    test('returns 200 with HTML Swagger UI', async () => {
      const response = await fetch(`${serverUrl}/api/docs`);
      
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('text/html');
      
      const html = await response.text();
      
      // Verify Swagger UI is present
      expect(html).toContain('swagger-ui');
      expect(html.toLowerCase()).toContain('swagger');
    });
  });
});
