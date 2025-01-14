const { Page, User } = require("../models");
let express = require("express");
let wikiRouter = express.Router();
let { addPage, wikiPage, main } = require("../views");

wikiRouter.get("/", async (req, res, next) => {
  const pages = await Page.findAll();
  console.log("!!!");
  console.log(Array.from(pages));
  console.log("!!!");
  res.send(main(pages));
});

wikiRouter.post("/", async (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const author = req.body.author;
  const email = req.body.email;

  try {
    const page = await Page.create({ title, content });
    const [user, wasCreated] = await User.findOrCreate({where: { 
      name: author,
      email: email
    }});
    
    await page.setAuthor(user)
    res.redirect(`/wiki/${page.slug}`);
  } catch (error) {
    next(error);
  }
});

wikiRouter.get("/add", (req, res) => {
  res.send(addPage());
});

wikiRouter.get("/:slug", async (req, res, next) => {
  const page = await Page.findOne({ where: { slug: req.params.slug } });
  res.send(wikiPage(page, "Dave"));
});
module.exports = wikiRouter;
