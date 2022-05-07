const nft = require('../../database/models/nft');

const PRODUCT = {
  marketplace: function (req, res) {
    nft
      .findAll()
      .then((products) =>
        res.render('product/product-marketplace', { productos: products })
      );
  },

  create: function (req, res) {
    res.render('product/product-create');
  },

  processCreate: async function (req, res) {
    nft
      .create(req.body)
      .then(({ dataValues }) => {
        res.redirect('/product/detail/' + dataValues.id);
      })
      .catch((err) => console.log(err));
  },

  edit: function (req, res) {
    nft
      .findByPk(req.params.id)
      .then(({ dataValues }) => {
        res.render('product/product-edit', {
          producto: dataValues,
        });
      })
      .catch(() => {
        res.render('product/product-edit-error', {
          error: {
            text: 'Edit-Error: No se pudo cargar el producto solicitado.',
          },
        });
      });
  },

  processEdit: async function (req, res) {
    const productUpdate = await nft.findByPk(req.body.id);

    // Comprobamos que exista el proudcto.
    if (!productUpdate) {
      return res.render('product/product-edit-error', {
        error: {
          text: 'Error: Ocurrio un error. No existe el producto a editar en la base de datos.',
        },
      });
    }

    // Si existe entonces hacemos el update.
    await productUpdate
      .update({
        imagen: req.body.imagen,
        nombre_nft: req.body.nft,
        descripcion: req.body.descripcion,
        tematica: req.body.tematica,
        precio_actual_eth: req.body.precio_actual_eth,
        precio_actual_usd: req.body.precio_actual_usd,
      })
      .then(() => res.redirect(`/product/detail/${req.body.id}`))
      .catch(() => {
        res.render('product/product-edit-error', {
          error: {
            text: 'Update-Error: No se pudo procesar el cambio. (Faltan datos para hacer la actualización).',
          },
        });
      });
  },

  delete: function (req, res) {
    // Este endpoint queda pendiente.
    // Esta petidición necesita una vista.
    res.redirect('/');
  },

  processDelete: function (req, res) {
    nft
      .destroy({ where: { id: req.params.id } })
      .then(() => res.redirect('/'))
      .catch((err) => console.log(err));
  },

  detail: async function (req, res) {
    await nft
      .findOne({ where: { id: req.params.id } })
      .then(({ dataValues }) =>
        res.render('product/product-detail', { productos: dataValues })
      )
      .catch((err) => console.log(err));
  },

};

module.exports = PRODUCT;
