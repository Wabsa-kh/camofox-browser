import type { OpenAPIV3_1 } from 'openapi-types';

/**
 * OpenAPI 3.1.0 specification for Camofox Browser API
 * 
 * This spec documents the current route surface for core and OpenClaw endpoints.
 * It provides a maintainable, realistic subset covering the documented API surface.
 */
export const openapiSpec: OpenAPIV3_1.Document = {
	openapi: '3.1.0',
	info: {
		title: 'Camofox Browser API',
		version: '2.3.0',
		description:
			'Camofox is a fingerprint-resistant browser automation server powered by Camoufox. ' +
			'It provides both a core REST API and OpenClaw-compatible endpoints for browser automation tasks.',
		license: {
			name: 'MIT',
			url: 'https://github.com/redf0x1/camofox-browser/blob/main/LICENSE',
		},
	},
	servers: [
		{
			url: 'http://localhost:3000',
			description: 'Local development server',
		},
	],
	paths: {
		'/health': {
			get: {
				summary: 'Health check',
				description: 'Returns server health status and basic statistics',
				tags: ['Core'],
				responses: {
					'200': {
						description: 'Server is healthy',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										ok: { type: 'boolean' },
										enabled: { type: 'boolean' },
										running: { type: 'boolean' },
										engine: { type: 'string' },
										version: { type: 'string' },
									},
								},
							},
						},
					},
				},
			},
		},
		'/presets': {
			get: {
				summary: 'List available presets',
				description: 'Returns all available browser context presets',
				tags: ['Core'],
				responses: {
					'200': {
						description: 'List of presets',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										ok: { type: 'boolean' },
										presets: {
											type: 'array',
											items: { type: 'string' },
										},
									},
								},
							},
						},
					},
				},
			},
		},
		'/tabs': {
			get: {
				summary: 'List tabs for a user',
				description: 'Returns all active tabs for the specified user',
				tags: ['Core'],
				parameters: [
					{
						name: 'userId',
						in: 'query',
						schema: { type: 'string' },
						required: false,
						description: 'User ID to filter tabs',
					},
				],
				responses: {
					'200': {
						description: 'List of tabs',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										ok: { type: 'boolean' },
										tabs: {
											type: 'array',
											items: {
												type: 'object',
												properties: {
													tabId: { type: 'string' },
													url: { type: 'string' },
													title: { type: 'string' },
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},
		},
		'/tabs/{tabId}/navigate': {
			post: {
				summary: 'Navigate tab to URL',
				description: 'Navigate the specified tab to a URL, macro, or search query',
				tags: ['Core'],
				parameters: [
					{
						name: 'tabId',
						in: 'path',
						required: true,
						schema: { type: 'string' },
						description: 'Tab ID',
					},
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									userId: { type: 'string' },
									url: { type: 'string' },
									macro: { type: 'string' },
									query: { type: 'string' },
								},
							},
						},
					},
				},
				responses: {
					'200': {
						description: 'Navigation successful',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/NavigationResult',
								},
							},
						},
					},
				},
			},
		},
		'/tabs/{tabId}/snapshot': {
			get: {
				summary: 'Get page snapshot',
				description: 'Returns a text snapshot of the current page',
				tags: ['Core'],
				parameters: [
					{
						name: 'tabId',
						in: 'path',
						required: true,
						schema: { type: 'string' },
					},
					{
						name: 'userId',
						in: 'query',
						schema: { type: 'string' },
					},
					{
						name: 'offset',
						in: 'query',
						schema: { type: 'string' },
					},
				],
				responses: {
					'200': {
						description: 'Snapshot retrieved',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										ok: { type: 'boolean' },
										snapshot: { type: 'string' },
										url: { type: 'string' },
										title: { type: 'string' },
									},
								},
							},
						},
					},
				},
			},
		},
		'/tabs/{tabId}/click': {
			post: {
				summary: 'Click element',
				description: 'Click an element by ref or selector',
				tags: ['Core'],
				parameters: [
					{
						name: 'tabId',
						in: 'path',
						required: true,
						schema: { type: 'string' },
					},
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									userId: { type: 'string' },
									ref: { type: 'string' },
									selector: { type: 'string' },
								},
							},
						},
					},
				},
				responses: {
					'200': {
						description: 'Click successful',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										ok: { type: 'boolean' },
									},
								},
							},
						},
					},
				},
			},
		},
		'/tabs/open': {
			post: {
				summary: 'Open new tab (OpenClaw)',
				description: 'Create a new browser tab with optional URL and configuration',
				tags: ['OpenClaw'],
				requestBody: {
					required: false,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									url: { type: 'string' },
									userId: { type: 'string' },
									listItemId: { type: 'string' },
									proxyProfile: { type: 'string' },
									proxy: {
										type: 'object',
										properties: {
											host: { type: 'string' },
											port: { type: 'string' },
											username: { type: 'string' },
											password: { type: 'string' },
										},
									},
									geoMode: { type: 'string', enum: ['explicit-wins', 'proxy-locked'] },
								},
							},
						},
					},
				},
				responses: {
					'200': {
						description: 'Tab created',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										status: { type: 'string' },
										targetId: { type: 'string' },
										url: { type: 'string' },
									},
								},
							},
						},
					},
				},
			},
		},
		'/navigate': {
			post: {
				summary: 'Navigate (OpenClaw)',
				description: 'Navigate to a URL, macro, or search query',
				tags: ['OpenClaw'],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									targetId: { type: 'string' },
									url: { type: 'string' },
									macro: { type: 'string' },
									query: { type: 'string' },
									userId: { type: 'string' },
								},
							},
						},
					},
				},
				responses: {
					'200': {
						description: 'Navigation successful',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/NavigationResult',
								},
							},
						},
					},
				},
			},
		},
		'/snapshot': {
			get: {
				summary: 'Get snapshot (OpenClaw)',
				description: 'Get a text snapshot of the current page',
				tags: ['OpenClaw'],
				parameters: [
					{
						name: 'targetId',
						in: 'query',
						schema: { type: 'string' },
					},
					{
						name: 'userId',
						in: 'query',
						schema: { type: 'string' },
					},
					{
						name: 'format',
						in: 'query',
						schema: { type: 'string' },
					},
					{
						name: 'offset',
						in: 'query',
						schema: { type: 'string' },
					},
				],
				responses: {
					'200': {
						description: 'Snapshot retrieved',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										ok: { type: 'boolean' },
										snapshot: { type: 'string' },
										url: { type: 'string' },
										title: { type: 'string' },
									},
								},
							},
						},
					},
				},
			},
		},
		'/act': {
			post: {
				summary: 'Execute action (OpenClaw)',
				description: 'Execute various browser actions like click, type, scroll, etc.',
				tags: ['OpenClaw'],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									targetId: { type: 'string' },
									userId: { type: 'string' },
									action: { type: 'string' },
									ref: { type: 'string' },
									selector: { type: 'string' },
									text: { type: 'string' },
									key: { type: 'string' },
								},
							},
						},
					},
				},
				responses: {
					'200': {
						description: 'Action executed',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										ok: { type: 'boolean' },
									},
								},
							},
						},
					},
				},
			},
		},
	},
	components: {
		schemas: {
			GeolocationConfig: {
				type: 'object',
				properties: {
					latitude: { type: 'number' },
					longitude: { type: 'number' },
				},
				required: ['latitude', 'longitude'],
			},
			ViewportConfig: {
				type: 'object',
				properties: {
					width: { type: 'number' },
					height: { type: 'number' },
				},
				required: ['width', 'height'],
			},
			TabState: {
				type: 'object',
				properties: {
					tabId: { type: 'string' },
					url: { type: 'string' },
					title: { type: 'string' },
					toolCalls: { type: 'number' },
				},
			},
			NavigationResult: {
				type: 'object',
				properties: {
					ok: { type: 'boolean' },
					url: { type: 'string' },
					title: { type: 'string' },
					status: { type: 'number' },
				},
			},
		},
	},
	tags: [
		{
			name: 'Core',
			description: 'Core Camofox Browser API endpoints',
		},
		{
			name: 'OpenClaw',
			description: 'OpenClaw-compatible browser automation endpoints',
		},
	],
};
