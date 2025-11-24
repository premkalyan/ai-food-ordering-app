/**
 * OpenAPI Schema endpoint for ChatGPT Custom GPT Actions
 * This is separate from MCP - used for Custom GPT integration
 */

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "content-type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  const schema = {
    openapi: "3.1.0",
    info: {
      title: "Food Ordering MCP API",
      version: "1.0.0",
      description: "AI-powered food ordering system with MCP integration"
    },
    servers: [
      {
        url: "https://ai-food-ordering-poc.vercel.app/api/v1",
        description: "Production API"
      }
    ],
    paths: {
      "/cities": {
        get: {
          operationId: "getCities",
          summary: "Get available cities",
          description: "Returns list of cities where food delivery is available",
          responses: {
            "200": {
              description: "List of cities",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      cities: {
                        type: "array",
                        items: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/cuisines": {
        get: {
          operationId: "getCuisines",
          summary: "Get available cuisines",
          description: "Returns list of available cuisine types",
          responses: {
            "200": {
              description: "List of cuisines",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      cuisines: {
                        type: "array",
                        items: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/restaurants/search": {
        get: {
          operationId: "searchRestaurants",
          summary: "Search restaurants",
          description: "Search for restaurants by city and/or cuisine",
          parameters: [
            {
              name: "city",
              in: "query",
              schema: { type: "string" },
              description: "Filter by city"
            },
            {
              name: "cuisine",
              in: "query",
              schema: { type: "string" },
              description: "Filter by cuisine type"
            }
          ],
          responses: {
            "200": {
              description: "List of restaurants",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        cuisine: { type: "string" },
                        city: { type: "string" },
                        rating: { type: "number" },
                        delivery_time: { type: "string" },
                        image: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/restaurants/{restaurant_id}/menu": {
        get: {
          operationId: "getMenu",
          summary: "Get restaurant menu",
          description: "Get the complete menu for a specific restaurant",
          parameters: [
            {
              name: "restaurant_id",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Restaurant ID"
            }
          ],
          responses: {
            "200": {
              description: "Restaurant menu",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      restaurant_id: { type: "string" },
                      categories: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            name: { type: "string" },
                            items: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  id: { type: "string" },
                                  name: { type: "string" },
                                  description: { type: "string" },
                                  price: { type: "number" },
                                  image: { type: "string" }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/orders/create": {
        post: {
          operationId: "createOrder",
          summary: "Create order",
          description: "Create a new food order",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["restaurant_id", "items", "delivery_address"],
                  properties: {
                    restaurant_id: { type: "string" },
                    items: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          item_id: { type: "string" },
                          name: { type: "string" },
                          price: { type: "number" },
                          quantity: { type: "number" }
                        }
                      }
                    },
                    delivery_address: {
                      type: "object",
                      properties: {
                        address: { type: "string" },
                        city: { type: "string" },
                        state: { type: "string" },
                        zip: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Order created",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      status: { type: "string" },
                      total: { type: "number" },
                      estimated_delivery: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  res.status(200).json(schema);
}

