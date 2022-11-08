// components
import Card from './components/Card.js';
import NavHome from './components/NavBar.js';
import Search from './components/Search.js';
import Select from './components/Select.js';
import Tags from './components/Tags.js'

// ------------------------------------------

class Index {
	constructor(){
		this.list = [];
		this.cards = [];
		this.ingredients = [];
		this.ustensils = [];
		this.appliances = [];
		this.query = '';
		(async () => {
		await this.loadData();
			this.renderDOM();
			this.filterRecipes()
		})() //Immediate function
	}

	/**
	 * Chargement des données
	 */

	loadData(){
		return fetch('../data/recipes.json')
		.then((resp) => resp.json())
		.then((data) => {
			this.list = data.list;
			this.filterRecipes();
	})
		.catch(function(error) {
			console.log(error);
		});
	}


	//  ------------- Gestion des selects --------------- 

	// Liste des ingredients dans tableau des recettes
	// On vient récupérer la liste des subItem dans le fichier JSON dans le parent ingredients et on les classe par ordre alphabétique
	selectIngredientsList(){
		let ingredientsList = this.filteredRecipes.map(function(item) {
			let tmp = item.ingredients.map(function(subItem){
				return subItem.ingredient
			});
		return tmp;
		}).flat().sort((a, b) => a.localeCompare(b));
		return [...new Set(ingredientsList)]
		
	}

	// Liste des appliances dans tableau des recettes
	// On vient récupérer la liste des appliances dans le fichier JSON
	selectAppliancesList() {
		const appliances = this.filteredRecipes.map(function(item) {
			return item.appliance
		}).flat().sort((a, b) => a.localeCompare(b));
		return [...new Set(appliances)]
	}

	// Liste des ustensiles dans tableau des recettes
	// On vient récupérer la liste des subItem dans le fichier JSON pour y récupérer les ustensils et on les classe par ordre alphabétique 
	selectUstensilsList() {
	let ustensilsList = this.filteredRecipes.map(function(item) {
		let tmp = item.ustensils.map(function(subItem){
			return subItem
		});
		return tmp;
	}).flat().sort((a, b) => a.localeCompare(b));

	return [...new Set(ustensilsList)]
	}


	

	// --------------- Algorithme de recherche -----------------

	// recherche via la search bar ( ustensils, ingredients, appliances)
	// Si il a - de 3 caracteres saisies alors on ne retourne rien 
	// Sinon on cherche une valeur existante dans les ustensils, appliance ou dans les ingredients

    filterGlobalRecipe(value, recipe) {
        if (value === '' || value.length < 3) {
            return true
        } 
		return recipe.name.toLowerCase().trim().includes(value) ||
		recipe.description.toLowerCase().trim().includes(value) ||
		recipe.ingredients.filter((i) => {
			return i.ingredient.toLowerCase().includes(value.toLowerCase())
		}).length > 0 ||
		recipe.appliance.toLowerCase().includes(value.toLowerCase()) ||
		recipe.ustensils.filter((u) => {
			return u.toLowerCase().includes(value.toLowerCase())
		}).length > 0

    }

	// recherche par ingredient
	// filtre dans les ingredients
	filterByIngredient(ingredients, recipe){ 
		if(ingredients.length == 0) {
			return true
		}
		return recipe.ingredients.filter((i) => 
			ingredients.includes(i.ingredient)
		).length == ingredients.length


	}

	// recherche par appliance
	// filtre dans les appliances
	filterByAppliance (appliances, recipe) {
		if(appliances.length == 0) {
			return true
		}
		return appliances.includes(recipe.appliance)
	}

	// recherche par ustensile
	// filtre dans les ustensiles
	filterByUstensils(ustensils, recipe){
		if(ustensils.length == 0) {
			return true
		}
		return recipe.ustensils.filter((u) =>
			ustensils.includes(u)
		).length == ustensils.length
	}

	// recherche globale 

	/* filterRecipes() est la methode qui vient prendre en compte les differentes methodes de filtrage afin de retourner 
	 une nouvelle liste avec les recettes */
	 /* filteredRecipes = la liste des recettes qui est filtré */
	filterRecipes() {
		this.filteredRecipes = this.list.filter((recipe) => {
			return this.filterGlobalRecipe(this.query, recipe)
			&& this.filterByIngredient(this.ingredients, recipe) 
			&& this.filterByAppliance (this.appliances, recipe)
			&& this.filterByUstensils(this.ustensils, recipe)
		})
	}

	// ---------------------- affichage et suppression des tags -------------------------

	// option selectionnée select ingredients 
	// la liste des recettes est filtré en fonction de l'option choisit qui est push dans this.ingredients
	// appel le template Tag.js  et envoie le contenu dans la div parent #tags ( tag ingredient )
	selectIngredient(ingredient) {
		this.ingredients.push(ingredient)
		this.filterRecipes()
		this.renderSelectDOM()
		this.renderRecipeDOM(this.filteredRecipes)
		const tag = new Tags('', ingredient, 'ingredient', (tagElement, ingredient) => this.deleteIngredientTag(tagElement, ingredient))
		document.querySelector('#tags').appendChild(tag.render())
	}


	// suppression du tag ingredient
	deleteIngredientTag(tagElement, ingredient) {
		document.querySelector('#tags').removeChild(tagElement)
		this.ingredients = this.ingredients.filter((i) => {
			return i != ingredient
		})
		this.filterRecipes()
		this.renderSelectDOM()
		this.renderRecipeDOM(this.filteredRecipes)
	}

	// la liste des recettes est filtré en fonction de l'option choisit qui est push dans this.appliances
	// appel le template Tag.js  et envoie le contenu dans la div parent #tags ( tag appliance )
	selectAppliance(appliance) {
		this.appliances.push(appliance)
		this.filterRecipes()
		this.renderSelectDOM()
		this.renderRecipeDOM(this.filteredRecipes)
		const tag = new Tags('', appliance, 'appliance', (tagElement, appliance) => this.deleteApplianceTag(tagElement, appliance))
		document.querySelector('#tags').appendChild(tag.render())
	}

	// suppression du tag appliance
	deleteApplianceTag(tagElement, appliance) {
		document.querySelector('#tags').removeChild(tagElement)
		this.appliances = this.appliances.filter((a) => {
			return a != appliance
		})
		this.filterRecipes()
		this.renderSelectDOM()
		this.renderRecipeDOM(this.filteredRecipes)
	}

	// la liste des recettes est filtré en fonction de l'option choisit qui est push dans this.ustensils
	// appel le template Tag.js  et envoie le contenu dans la div parent #tags ( tag ustensil )
	selectUstensil(ustensil) {
		this.ustensils.push(ustensil)
		this.filterRecipes()
		this.renderSelectDOM()
		this.renderRecipeDOM(this.filteredRecipes)
		const tag = new Tags('', ustensil, 'ustensil', (tagElement, ustensil) => this.deleteUstensilTag(tagElement, ustensil))
		document.querySelector('#tags').appendChild(tag.render())
	}

	// suppression du tag ustensil
	deleteUstensilTag(tagElement, ustensil) {
		document.querySelector('#tags').removeChild(tagElement)
		this.ustensils = this.ustensils.filter((u) => {
			return u != ustensil
		})
		this.filterRecipes()
		this.renderSelectDOM()
		this.renderRecipeDOM(this.filteredRecipes)
	}

	
	// ----------------------- render des éléments du DOM -------------------------------

	// rendu de la barre de recherche en faisant appel au fonction de rendu des recettes  selon la valeur saisie et appel du template search.js 
	renderSearchDOM(){
		const search = new Search((value) => {
			this.query = value
			this.filterRecipes()
			this.renderRecipeDOM(this.filteredRecipes)
			this.renderSelectDOM()
	
		});
		const $search = document.querySelector('#search');
		$search.innerHTML = `
			${search.render()}
		`
		search.initEvent()
	}

	 // Création du rendu des 3 menus déroulants avec en première information la div (exemple :select-ingrédient créé dans l'élement parent (#select))
	 // en 2e info le titre que l'on voit dans le select-title-content 
	 // l'appel de la fonction afin de pouvoir avoir sa liste d'options de filtrage  
	renderSelectDOM(){
		const $select = document.querySelector('#select');
		$select.innerHTML = '';
		const selectIngredients = new Select('select-ingredient', 'ingredients', this.selectIngredientsList(), (ingredient) => (this.selectIngredient(ingredient)), (ingredient) => (this.deleteIngredientTag(ingredient))) ;
		const selectAppliances = new Select('select-appliance', 'appliances', this.selectAppliancesList(), (appliance) => this.selectAppliance(appliance));
		const selectUstensils = new Select('select-ustensil', 'ustensils', this.selectUstensilsList(), (ustensil) => this.selectUstensil(ustensil));

		$select.appendChild(selectIngredients.render());
		$select.appendChild(selectAppliances.render());
		$select.appendChild(selectUstensils.render());
	}

	//  Retourne la liste des recettes depuis le fichier recipes.JSON et applique le template venant du fichier Card.js
	renderCards(list){
		return list.map(function(list) {
			const card = new Card(
			list.name, 
			list.time, 
			list.ingredients,
			list.description
			);
			return `${card.render()}`;
		});
	}

	// La section #cooking reçoit la liste des recettes 
	renderRecipeDOM(list){
		const $list = document.querySelector('#cooking')
		$list.innerHTML = this.renderCards(list).join('')
	}

	/*
	 * Création du DOM physique
	 */

	// Rendu du DOM (le contenu de la barre de navigation est envoyé dans le header, l'appel des methodes search select)
	/*
	applique le rendu des recettes en prenant en compte les différentes possibilités de filtres ( this.renderRecipeDOM(this.filteredRecipes)
	*/
	renderDOM(){
		const navhome = new NavHome();
		const $header = document.querySelector('#header');
		$header.innerHTML = `
			${navhome.render()}
		`
		this.renderSearchDOM();
		this.renderSelectDOM();
		this.renderRecipeDOM(this.filteredRecipes);
	}
};

new Index();