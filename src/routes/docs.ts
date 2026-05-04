import { Router, type Request, type Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { openapiSpec } from '../openapi/spec';

const router = Router();

// Serve OpenAPI spec as JSON
router.get('/openapi.json', (_req: Request, res: Response) => {
	res.setHeader('Content-Type', 'application/json');
	res.json(openapiSpec);
});

// Serve Swagger UI
router.use('/api/docs', swaggerUi.serve);
router.get('/api/docs', swaggerUi.setup(openapiSpec));

export default router;
