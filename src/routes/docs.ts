import { Router, type Request, type Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { buildOpenapiSpec } from '../openapi/spec';

const router = Router();

// Serve OpenAPI spec as JSON
router.get('/openapi.json', (req: Request, res: Response) => {
	const host = req.get('host');
	const serverUrl = host ? `${req.protocol}://${host}` : 'http://localhost:9377';
	res.setHeader('Content-Type', 'application/json');
	res.json(buildOpenapiSpec(serverUrl));
});

// Serve Swagger UI
router.use('/api/docs', swaggerUi.serve);
router.get('/api/docs', swaggerUi.setup(undefined, {
	swaggerOptions: {
		url: '/openapi.json',
	},
}));

export default router;
