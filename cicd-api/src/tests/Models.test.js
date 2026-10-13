const { describe, it, after } = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");

const { User, Post, Category, Comment } = require("../models/models");

const newId = () => new mongoose.Types.ObjectId();

after(async () => {
  await mongoose.disconnect();
});

describe("User", () => {
  it("é válido com name, email e password", () => {
    const user = new User({
      name: "Ana",
      email: "ana@example.com",
      password: "123456",
    });

    assert.equal(user.validateSync(), undefined);
  });

  it("exige name, email e password", () => {
    const error = new User({}).validateSync();

    assert.ok(error);
    assert.ok(error.errors.name);
    assert.ok(error.errors.email);
    assert.ok(error.errors.password);
  });

  it("define email como único", () => {
    assert.equal(User.schema.path("email").options.unique, true);
  });
});

describe("Category", () => {
  it("é válida com name", () => {
    assert.equal(new Category({ name: "Backend" }).validateSync(), undefined);
  });

  it("exige name", () => {
    const error = new Category({}).validateSync();

    assert.ok(error);
    assert.ok(error.errors.name);
  });

  it("define name como único", () => {
    assert.equal(Category.schema.path("name").options.unique, true);
  });
});

describe("Post", () => {
  it("é válido sem category (campo opcional)", () => {
    const post = new Post({
      title: "Meu primeiro post",
      content: "Conteúdo do post",
      user: newId(),
    });

    assert.equal(post.validateSync(), undefined);
  });

  it("é válido com category", () => {
    const post = new Post({
      title: "Post com categoria",
      content: "Conteúdo",
      user: newId(),
      category: newId(),
    });

    assert.equal(post.validateSync(), undefined);
  });

  it("exige title, content e user", () => {
    const error = new Post({}).validateSync();

    assert.ok(error);
    assert.ok(error.errors.title);
    assert.ok(error.errors.content);
    assert.ok(error.errors.user);
  });

  it("rejeita user com ObjectId inválido", () => {
    const error = new Post({
      title: "Título",
      content: "Conteúdo",
      user: "id-invalido",
    }).validateSync();

    assert.ok(error);
    assert.equal(error.errors.user.name, "CastError");
  });
});

describe("Comment", () => {
  it("é válido com content, user e post", () => {
    const comment = new Comment({
      content: "Muito bom!",
      user: newId(),
      post: newId(),
    });

    assert.equal(comment.validateSync(), undefined);
  });

  it("exige content, user e post", () => {
    const error = new Comment({}).validateSync();

    assert.ok(error);
    assert.ok(error.errors.content);
    assert.ok(error.errors.user);
    assert.ok(error.errors.post);
  });
});

describe("Timestamps", () => {
  for (const Model of [User, Post, Category, Comment]) {
    it(`${Model.modelName} usa created_at e updated_at`, () => {
      assert.ok(Model.schema.path("created_at"));
      assert.ok(Model.schema.path("updated_at"));
    });
  }
});

describe("PostLike", () => {
  it("é válido com user e post", () => {
    const postLike = new PostLike({
      user: newId(),
      post: newId(),
    });

    assert.equal(postLike.validateSync(), undefined);
  });

  it("exige user e post", () => {
    const error = new PostLike({}).validateSync();

    assert.ok(error);
    assert.ok(error.errors.user);
    assert.ok(error.errors.post);
  });

  it("rejeita user e post com ObjectIds inválidos", () => {
    const error = new PostLike({
      user: "id-invalido",
      post: "outro-id-invalido",
    }).validateSync();

    assert.ok(error);
    assert.equal(error.errors.user.name, "CastError");
    assert.equal(error.errors.post.name, "CastError");
  });

  it("referencia User e Post", () => {
    assert.equal(PostLike.schema.path("user").options.ref, "User");
    assert.equal(PostLike.schema.path("post").options.ref, "Post");
  });

  it("declara índice composto único para user e post", () => {
    const indexes = PostLike.schema.indexes();

    const uniqueIndex = indexes.find(
      ([fields, options]) =>
        fields.user === 1 && fields.post === 1 && options.unique === true,
    );

    assert.ok(uniqueIndex);
  });

  it("usa a coleção post_likes", () => {
    assert.equal(PostLike.collection.collectionName, "post_likes");
  });
});
