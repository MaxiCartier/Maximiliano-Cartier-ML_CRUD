const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
		// Do the magic
		return res.render('index', {
			productsVisited: products.filter(product => product.category === 'visited'),
			productsInSale: products.filter(product => product.category === 'in-sale'),
			toThousand
		})
	},
	search: (req, res) => {
		// Do the magic
		const results = products.filter(product => product.name.toLowerCase().includes(req.query.keywords.toLowerCase()))

		return res.render('results', {
			results,
			toThousand,
			keywords: req.query.keywords
		})
	},
};

module.exports = controller;
