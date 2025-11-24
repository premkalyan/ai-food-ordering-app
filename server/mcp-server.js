/**
 * MCP Server for AI Food Ordering App
 * Exposes the food ordering UI and tools to ChatGPT
 */

import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

// Read the built UI (we'll build the React app into a single HTML file)
const appHtml = readFileSync("dist/index.html", "utf8");

// API base URL
const API_BASE_URL = "https://ai-food-ordering-poc.vercel.app/api/v1";

// Tool input schemas
const searchRestaurantsSchema = {
  city: z.string().optional(),
  cuisine: z.string().optional(),
};

const getMenuSchema = {
  restaurant_id: z.string(),
};

const createOrderSchema = {
  restaurant_id: z.string(),
  items: z.array(z.object({
    item_id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
  })),
  delivery_address: z.object({
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  }),
};

// Helper to call our API
async function callAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  return response.json();
}

// Create the MCP server
function createFoodOrderingServer() {
  const server = new McpServer({ 
    name: "food-ordering-app", 
    version: "1.0.0" 
  });

  // Register the UI widget
  server.registerResource(
    "food-ordering-widget",
    "ui://widget/food-ordering.html",
    {},
    async () => ({
      contents: [
        {
          uri: "ui://widget/food-ordering.html",
          mimeType: "text/html+skybridge",
          text: appHtml,
          _meta: { 
            "openai/widgetPrefersBorder": true,
            "openai/widgetTitle": "Food Ordering"
          },
        },
      ],
    })
  );

  // Tool 1: Get Cities
  server.registerTool(
    "get_cities",
    {
      title: "Get Cities",
      description: "Get list of available cities for food delivery",
      inputSchema: {},
      _meta: {
        "openai/outputTemplate": "ui://widget/food-ordering.html",
        "openai/toolInvocation/invoking": "Loading cities...",
        "openai/toolInvocation/invoked": "Cities loaded",
      },
    },
    async () => {
      const data = await callAPI("/cities");
      return {
        content: [{
          type: "text",
          text: `Available cities: ${data.cities.join(", ")}`
        }],
        structuredContent: { 
          cities: data.cities,
          action: "show_cities"
        },
      };
    }
  );

  // Tool 2: Get Cuisines
  server.registerTool(
    "get_cuisines",
    {
      title: "Get Cuisines",
      description: "Get list of available cuisine types",
      inputSchema: {},
      _meta: {
        "openai/outputTemplate": "ui://widget/food-ordering.html",
        "openai/toolInvocation/invoking": "Loading cuisines...",
        "openai/toolInvocation/invoked": "Cuisines loaded",
      },
    },
    async () => {
      const data = await callAPI("/cuisines");
      return {
        content: [{
          type: "text",
          text: `Available cuisines: ${data.cuisines.join(", ")}`
        }],
        structuredContent: { 
          cuisines: data.cuisines,
          action: "show_cuisines"
        },
      };
    }
  );

  // Tool 3: Search Restaurants
  server.registerTool(
    "search_restaurants",
    {
      title: "Search Restaurants",
      description: "Search for restaurants by city and/or cuisine",
      inputSchema: searchRestaurantsSchema,
      _meta: {
        "openai/outputTemplate": "ui://widget/food-ordering.html",
        "openai/toolInvocation/invoking": "Searching restaurants...",
        "openai/toolInvocation/invoked": "Restaurants found",
      },
    },
    async (args) => {
      const params = new URLSearchParams();
      if (args.city) params.append("city", args.city);
      if (args.cuisine) params.append("cuisine", args.cuisine);
      
      const restaurants = await callAPI(`/restaurants/search?${params}`);
      
      return {
        content: [{
          type: "text",
          text: `Found ${restaurants.length} restaurants`
        }],
        structuredContent: { 
          restaurants,
          action: "show_restaurants",
          filters: { city: args.city, cuisine: args.cuisine }
        },
      };
    }
  );

  // Tool 4: Get Menu
  server.registerTool(
    "get_menu",
    {
      title: "Get Restaurant Menu",
      description: "Get the menu for a specific restaurant",
      inputSchema: getMenuSchema,
      _meta: {
        "openai/outputTemplate": "ui://widget/food-ordering.html",
        "openai/toolInvocation/invoking": "Loading menu...",
        "openai/toolInvocation/invoked": "Menu loaded",
      },
    },
    async (args) => {
      const menu = await callAPI(`/restaurants/${args.restaurant_id}/menu`);
      
      return {
        content: [{
          type: "text",
          text: `Menu loaded for restaurant ${args.restaurant_id}`
        }],
        structuredContent: { 
          menu: menu.categories,
          restaurant_id: args.restaurant_id,
          action: "show_menu"
        },
      };
    }
  );

  // Tool 5: Create Order
  server.registerTool(
    "create_order",
    {
      title: "Create Order",
      description: "Create a new food order",
      inputSchema: createOrderSchema,
      _meta: {
        "openai/outputTemplate": "ui://widget/food-ordering.html",
        "openai/toolInvocation/invoking": "Creating order...",
        "openai/toolInvocation/invoked": "Order created",
      },
    },
    async (args) => {
      const order = await callAPI("/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
      });
      
      return {
        content: [{
          type: "text",
          text: `Order created: ${order.id}`
        }],
        structuredContent: { 
          order,
          action: "show_confirmation"
        },
      };
    }
  );

  return server;
}

// HTTP server setup
const port = Number(process.env.PORT ?? 8787);
const MCP_PATH = "/mcp";

const httpServer = createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400).end("Missing URL");
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

  // CORS preflight
  if (req.method === "OPTIONS" && url.pathname === MCP_PATH) {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
      "Access-Control-Allow-Headers": "content-type, mcp-session-id",
      "Access-Control-Expose-Headers": "Mcp-Session-Id",
    });
    res.end();
    return;
  }

  // Health check
  if (req.method === "GET" && url.pathname === "/") {
    res.writeHead(200, { "content-type": "text/plain" })
      .end("Food Ordering MCP Server");
    return;
  }

  // MCP endpoint
  const MCP_METHODS = new Set(["POST", "GET", "DELETE"]);
  if (url.pathname === MCP_PATH && req.method && MCP_METHODS.has(req.method)) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");

    const server = createFoodOrderingServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // stateless mode
      enableJsonResponse: true,
    });

    res.on("close", () => {
      transport.close();
      server.close();
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res);
    } catch (error) {
      console.error("Error handling MCP request:", error);
      if (!res.headersSent) {
        res.writeHead(500).end("Internal server error");
      }
    }
    return;
  }

  res.writeHead(404).end("Not Found");
});

httpServer.listen(port, () => {
  console.log(
    `🍽️  Food Ordering MCP server listening on http://localhost:${port}${MCP_PATH}`
  );
  console.log(`📱 UI will be served from dist/index.html`);
  console.log(`🔗 API backend: ${API_BASE_URL}`);
});

