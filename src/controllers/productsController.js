const{readFileSync, existsSync, writeFileSync, unlinkSync } = require('../data/index');
const path = require('path');
const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		// Do the magic
		const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
		const products = JSON.parse(readFileSync(productsFilePath, 'utf-8'));
		return res.render('products', {
			products,
			toThousand
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		// Do the magic
		const product = products.find(product => product.id === +req.params.id)
		return res.render('detail', {
			...product,
			toThousand
		})
	},

	// Create - Form to create
	create: (req, res) => {
		// Do the magic
		return res.render('product-create-form')
	},

	// Create -  Method to store
	store: (req, res) => {
		// Do the magic
		const { name, price, discount, description, category} = req.body
		let newProduct = {
			id: products[products.length - 1].id + 1,
			name: name.trim(),
			price: +price,
			discount: +discount,
			category,
			description: description.trim(),
			image: req.file ? req.file.filename : 'default-image.png'
		}

		products.push(newProduct);

		writeFileSync(productsFilePath, JSON.stringify(products, null, 3), 'utf-8');
		
		return res.redirect('/products')
	},

	// Update - Form to edit
	edit: (req, res) => {
		// Do the magic
		const product = products.find(product => product.id === +req.params.id)
		return res.render('product-edit-form', {
			...product
		})
	},
	// Update - Method to update
	update: (req, res) => {
		// Do the magic

		const { name, price, discount, description, category, } = req.body
		const productsModify = products.map(product => {
			if (product.id === +req.params.id) {
				req.file && existsSync(`./public/images/products/${product.image}`) && unlinkSync(`./public/images/products/${product.image}`);
				product.name = name.trim();
				product.price = +price;
				product.discount = +discount;
				product.category = category;
				product.description = description.trim();
				product.image = req.file ? req.file.filename : product.image;
				
			}

			return product
		})
		writeFileSync(productsFilePath, JSON.stringify(productsModify, null, 3), 'utf-8');

		return res.redirect('/products')
	},

	// Delete - Delete one product from DB
	destroy: (req, res) => {
		// Do the magic
		const productsModify = products.filter((product) => {
			if(product.id === +req.params.id) {
				existsSync(`./public/images/products/${product.image}`) && unlinkSync(`./public/images/products/${product.image}`);
			}
			return product.id !== +req.params.id;
		});
	
		writeFileSync(productsFilePath, JSON.stringify(productsModify, null, 3), 'utf-8');
		return res.redirect('/products')
	}
};

module.exports = controller;