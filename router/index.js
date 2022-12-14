const express = require("express");
const { Supplier, Product } = require("../models");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("pages/home/index");
});

/** START PRODUCTS ROUTE */

router.get("/products", (req, res) => {
  Product.findAll({
    order: [["name", "ASC"]],
    include: ["supplier"],
  }).then((products) => {
    res.render("pages/products/index", {
      pageTitle: "Daftar Barang",
      products,
    });
  });
});

router.get("/products/create", (req, res) => {
  Supplier.findAll({
    order: [["name", "ASC"]],
  }).then((suppliers) => {
    res.render("pages/products/create", {
      pageTitle: "Buat Barang",
      suppliers,
    });
  });
});

router.post("/products", (req, res) => {
  const { name, price, stock, supplierId } = req.body;

  Product.create({
    name,
    price,
    stock,
    supplierId,
  }).then(() => {
    res.redirect("/products");
  });
});

router.get("/products/:id", (req, res) => {
  Product.findOne({
    where: { id: req.params.id },
    include: "supplier",
  }).then((product) => {
    res.render("pages/products/show", {
      pageTitle: `Barang: ${product.name}`,
      product,
    });
  });
});

router.get("/products/:id/edit", async (req, res) => {
  const product = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });
  const suppliers = await Supplier.findAll({
    order: [["name", "ASC"]],
  });
  res.render("pages/products/edit", {
    pageTitle: "Edit Product",
    product,
    suppliers,
  });
});

router.put("/products/:id", (req, res) => {
  const { name, price, stock, supplierId } = req.body;
  Product.update(
    {
      name,
      price,
      stock,
      supplierId,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  ).then(() => {
    res.redirect("/products");
  });
});

router.delete("/products/:id", (req, res) => {
  Product.destroy({
    where: {
      id: req.params.id,
    },
  }).then(() => {
    res.redirect("back");
  });
});

/** END PRODUCTS ROUTE */

/** START SUPPLIERS ROUTE */

router.get("/suppliers", (req, res) => {
  Supplier.findAll({
    order: [["name", "ASC"]],
  }).then((suppliers) => {
    res.render("pages/suppliers/index", {
      pageTitle: "Daftar Supplier",
      suppliers,
    });
  });
});

router.get("/suppliers/create", (req, res) => {
  res.render("pages/suppliers/create", { pageTitle: "Buat Supplier" });
});

router.post("/suppliers", (req, res) => {
  let joinDate;
  if (!req.body.joinDate) {
    joinDate = null;
  } else {
    joinDate = req.body.joinDate;
  }

  Supplier.create({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    address: req.body.address,
    joinDate,
  }).then(() => {
    res.redirect("/suppliers");
  });
});

router.get("/suppliers/:id", (req, res) => {
  Supplier.findOne({
    where: {
      id: req.params.id,
    },
  }).then((supplier) => {
    res.render("pages/suppliers/show", {
      pageTitle: `Supplier: ${supplier.name}`,
      supplier,
    });
  });
});

router.get("/suppliers/:id/edit", (req, res) => {
  Supplier.findOne({
    where: {
      id: req.params.id,
    },
  }).then((supplier) => {
    res.render("pages/suppliers/edit", {
      pageTitle: `Edit Supplier`,
      supplier,
    });
  });
});

router.put("/suppliers/:id", (req, res) => {
  let joinDate;
  if (!req.body.joinDate) {
    joinDate = null;
  } else {
    joinDate = req.body.joinDate;
  }

  Supplier.update(
    {
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      address: req.body.address,
      joinDate,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  ).then(() => {
    res.redirect("/suppliers");
  });
});

router.delete("/suppliers/:id", (req, res) => {
  Supplier.destroy({
    where: {
      id: req.params.id,
    },
  }).then(() => {
    res.redirect("back");
  });
});

/** END SUPPLIERS ROUTE */

module.exports = router;
