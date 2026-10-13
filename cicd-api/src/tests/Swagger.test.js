const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const swaggerSpec = require("../docs/swagger");

describe("Swagger spec", () => {
  it("exporta um objeto", () => {
    assert.equal(typeof swaggerSpec, "object");
    assert.notEqual(swaggerSpec, null);
  });

  it("declara a versão do OpenAPI/Swagger", () => {
    assert.ok(swaggerSpec.openapi || swaggerSpec.swagger);
  });
});
