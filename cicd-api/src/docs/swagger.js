const swaggerSpec = {
  openapi: "3.0.3",

  info: {
    title: "CI/CD Studies API",
    version: "1.0.0",
    description: `
API REST desenvolvida com Node.js, Express e MongoDB.

Esta API disponibiliza operações CRUD para usuários, posts,
categorias e comentários.

## Observações
- Os IDs utilizados nos endpoints são ObjectIds do MongoDB.
- Os campos created_at e updated_at são gerados pelo Mongoose
  quando os schemas utilizam timestamps.
- A API utiliza JSON nas requisições e respostas.
    `,
    contact: {
      name: "API Support",
    },
  },

  servers: [
    {
      url: "http://localhost:3000",
      description: "Ambiente local",
    },
  ],

  tags: [
    { name: "Health", description: "Disponibilidade da API" },
    { name: "Users", description: "Gerenciamento de usuários" },
    { name: "Posts", description: "Gerenciamento de posts" },
    { name: "Categories", description: "Gerenciamento de categorias" },
    { name: "Comments", description: "Gerenciamento de comentários" },
  ],

  paths: {},

  components: {
    schemas: {
      Error: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Resource not found",
          },
        },
        required: ["message"],
      },

      Health: {
        type: "object",
        properties: {
          status: { type: "string", example: "UP" },
          message: { type: "string", example: "API is running" },
        },
        required: ["status", "message"],
      },

      UserInput: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: {
            type: "string",
            example: "Anderson",
          },
          email: {
            type: "string",
            format: "email",
            example: "anderson@example.com",
          },
          password: {
            type: "string",
            format: "password",
            writeOnly: true,
            example: "example-password",
          },
        },
      },

      User: {
        allOf: [
          { $ref: "#/components/schemas/UserInput" },
          {
            type: "object",
            properties: {
              _id: {
                type: "string",
                example: "68ed1234567890abcdef1234",
              },
              created_at: {
                type: "string",
                format: "date-time",
              },
              updated_at: {
                type: "string",
                format: "date-time",
              },
            },
          },
        ],
      },

      CategoryInput: {
        type: "object",
        required: ["name"],
        properties: {
          name: {
            type: "string",
            example: "Tecnologia",
          },
        },
      },

      Category: {
        allOf: [
          { $ref: "#/components/schemas/CategoryInput" },
          {
            type: "object",
            properties: {
              _id: {
                type: "string",
                example: "68ed1234567890abcdef1234",
              },
              created_at: {
                type: "string",
                format: "date-time",
              },
              updated_at: {
                type: "string",
                format: "date-time",
              },
            },
          },
        ],
      },

      PostInput: {
        type: "object",
        required: ["title", "content", "user"],
        properties: {
          title: {
            type: "string",
            example: "Meu primeiro post",
          },
          content: {
            type: "string",
            example: "Estudando CI/CD com Node.js",
          },
          user: {
            type: "string",
            pattern: "^[0-9a-fA-F]{24}$",
            example: "68ed1234567890abcdef1234",
            description: "ID do usuário autor do post",
          },
          category: {
            type: "string",
            nullable: true,
            pattern: "^[0-9a-fA-F]{24}$",
            example: "68ed1234567890abcdef5678",
            description: "ID opcional da categoria",
          },
        },
      },

      Post: {
        allOf: [
          { $ref: "#/components/schemas/PostInput" },
          {
            type: "object",
            properties: {
              _id: {
                type: "string",
                example: "68ed1234567890abcdef9999",
              },
              created_at: {
                type: "string",
                format: "date-time",
              },
              updated_at: {
                type: "string",
                format: "date-time",
              },
            },
          },
        ],
      },

      CommentInput: {
        type: "object",
        required: ["content", "user", "post"],
        properties: {
          content: {
            type: "string",
            example: "Excelente publicação!",
          },
          user: {
            type: "string",
            pattern: "^[0-9a-fA-F]{24}$",
            example: "68ed1234567890abcdef1234",
            description: "ID do usuário que escreveu o comentário",
          },
          post: {
            type: "string",
            pattern: "^[0-9a-fA-F]{24}$",
            example: "68ed1234567890abcdef9999",
            description: "ID do post comentado",
          },
        },
      },

      Comment: {
        allOf: [
          { $ref: "#/components/schemas/CommentInput" },
          {
            type: "object",
            properties: {
              _id: {
                type: "string",
                example: "68ed1234567890abcdef7777",
              },
              created_at: {
                type: "string",
                format: "date-time",
              },
              updated_at: {
                type: "string",
                format: "date-time",
              },
            },
          },
        ],
      },
    },

    parameters: {
      Id: {
        name: "id",
        in: "path",
        required: true,
        description: "ObjectId do documento no MongoDB",
        schema: {
          type: "string",
          pattern: "^[0-9a-fA-F]{24}$",
        },
        example: "68ed1234567890abcdef1234",
      },
    },

    responses: {
      BadRequest: {
        description: "ID inválido ou erro de validação",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
            example: { message: "Invalid ID" },
          },
        },
      },

      NotFound: {
        description: "Documento não encontrado",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
            example: { message: "Resource not found" },
          },
        },
      },

      Conflict: {
        description: "Valor único já cadastrado",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
            example: {
              message: "A resource with this unique value already exists",
            },
          },
        },
      },

      InternalServerError: {
        description: "Erro interno do servidor",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
            example: { message: "Internal server error" },
          },
        },
      },
    },
  },
};

const resources = [
  {
    path: "/users",
    tag: "Users",
    singular: "User",
    plural: "users",
    schema: "User",
    inputSchema: "UserInput",
    createSummary: "Criar usuário",
    updateSummary: "Atualizar usuário",
    example: {
      name: "Anderson",
      email: "anderson@example.com",
      password: "example-password",
    },
  },
  {
    path: "/posts",
    tag: "Posts",
    singular: "Post",
    plural: "posts",
    schema: "Post",
    inputSchema: "PostInput",
    createSummary: "Criar post",
    updateSummary: "Atualizar post",
    example: {
      title: "Meu primeiro post",
      content: "Estudando CI/CD com Node.js",
      user: "68ed1234567890abcdef1234",
      category: "68ed1234567890abcdef5678",
    },
  },
  {
    path: "/categories",
    tag: "Categories",
    singular: "Category",
    plural: "categories",
    schema: "Category",
    inputSchema: "CategoryInput",
    createSummary: "Criar categoria",
    updateSummary: "Atualizar categoria",
    example: { name: "Tecnologia" },
  },
  {
    path: "/comments",
    tag: "Comments",
    singular: "Comment",
    plural: "comments",
    schema: "Comment",
    inputSchema: "CommentInput",
    createSummary: "Criar comentário",
    updateSummary: "Atualizar comentário",
    example: {
      content: "Excelente publicação!",
      user: "68ed1234567890abcdef1234",
      post: "68ed1234567890abcdef9999",
    },
  },
];

function jsonResponse(description, schema, example) {
  return {
    description,
    content: {
      "application/json": {
        schema,
        ...(example ? { example } : {}),
      },
    },
  };
}

for (const resource of resources) {
  const itemSchema = {
    $ref: `#/components/schemas/${resource.schema}`,
  };

  const inputSchema = {
    $ref: `#/components/schemas/${resource.inputSchema}`,
  };

  const basePath = resource.path;
  const itemPath = `${basePath}/{id}`;

  swaggerSpec.paths[basePath] = {
    get: {
      tags: [resource.tag],
      summary: `Listar ${resource.plural}`,
      operationId: `list${resource.plural}`,
      responses: {
        200: jsonResponse("Lista de documentos", {
          type: "array",
          items: itemSchema,
        }),
        500: { $ref: "#/components/responses/InternalServerError" },
      },
    },

    post: {
      tags: [resource.tag],
      summary: resource.createSummary,
      operationId: `create${resource.singular}`,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: inputSchema,
            example: resource.example,
          },
        },
      },
      responses: {
        201: jsonResponse("Documento criado", itemSchema),
        400: { $ref: "#/components/responses/BadRequest" },
        409: { $ref: "#/components/responses/Conflict" },
        500: { $ref: "#/components/responses/InternalServerError" },
      },
    },
  };

  swaggerSpec.paths[itemPath] = {
    parameters: [{ $ref: "#/components/parameters/Id" }],

    get: {
      tags: [resource.tag],
      summary: `Buscar ${resource.singular} por ID`,
      operationId: `get${resource.singular}ById`,
      responses: {
        200: jsonResponse("Documento encontrado", itemSchema),
        400: { $ref: "#/components/responses/BadRequest" },
        404: { $ref: "#/components/responses/NotFound" },
        500: { $ref: "#/components/responses/InternalServerError" },
      },
    },

    put: {
      tags: [resource.tag],
      summary: resource.updateSummary,
      operationId: `update${resource.singular}`,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              description:
                "Campos a atualizar. A validação do schema é aplicada.",
              additionalProperties: true,
              example: resource.example,
            },
          },
        },
      },
      responses: {
        200: jsonResponse("Documento atualizado", itemSchema),
        400: { $ref: "#/components/responses/BadRequest" },
        404: { $ref: "#/components/responses/NotFound" },
        409: { $ref: "#/components/responses/Conflict" },
        500: { $ref: "#/components/responses/InternalServerError" },
      },
    },

    delete: {
      tags: [resource.tag],
      summary: `Excluir ${resource.singular}`,
      operationId: `delete${resource.singular}`,
      responses: {
        200: jsonResponse("Documento excluído", {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Resource deleted successfully",
            },
          },
        }),
        400: { $ref: "#/components/responses/BadRequest" },
        404: { $ref: "#/components/responses/NotFound" },
        500: { $ref: "#/components/responses/InternalServerError" },
      },
    },
  };
}

swaggerSpec.paths["/health"] = {
  get: {
    tags: ["Health"],
    summary: "Verificar disponibilidade da API",
    operationId: "healthCheck",
    responses: {
      200: jsonResponse(
        "API disponível",
        {
          $ref: "#/components/schemas/Health",
        },
        {
          status: "UP",
          message: "API is running",
        },
      ),
    },
  },
};

module.exports = swaggerSpec;
