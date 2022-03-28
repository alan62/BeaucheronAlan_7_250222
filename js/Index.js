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
	
		selectIngredientsList(){
		const ingOptions = []
		for (let index = 0; index < this.filteredRecipes.length; index++) {
			for (let i = 0; i < this.filteredRecipes[index].ingredients.length; i++) {
				ingOptions.push(this.filteredRecipes[index].ingredients[i].ingredient)
			}
		};
		return [...new Set(ingOptions)].sort() 
	} 

	// Liste des appliances dans tableau des recettes
	selectAppliancesList() {
		const appOptions = []
		for (let index = 0; index < this.filteredRecipes.length; index++) {
			appOptions.push(this.filteredRecipes[index].appliance)
		}
		return [...new Set(appOptions)].sort()
	} 

	// Liste des ustensiles dans tableau des recettes
	selectUstensilsList() {
	const ustOptions = []
	for (let index = 0; index < this.filteredRecipes.length; index++) {
		for (let i = 0; i < this.filteredRecipes[index].ustensils.length; i++) {
            ustOptions.push(this.filteredRecipes[index].ustensils[i])
        }
	}
	return [...new Set(ustOptions)].sort()
	} 


	// --------------- Algorithme de recherche -----------------

	// recherche via la search bar (titres, ustensils, ingredients, appliances)

    
	filterGlobalRecipe(value, recipe) {
		if (value === '' || 
			value.length < 3 || 
			recipe.name.toLowerCase().trim().includes(value) || 
			recipe.description.toLowerCase().trim().includes(value)  ||
			recipe.appliance.toLowerCase().includes(value.toLowerCase()) || 
			recipe.ustensils.includes(value.toLowerCase())) {
			return true;
		}

		// filter for ingredients
		for (let index = 0; index < recipe.ingredients.length; index++) {
			const i = recipe.ingredients[index];
			if (i.ingredient.toLowerCase().includes(value.toLowerCase())) {
				return true;
			}
		} 

		return false;
    } 

	// recherche par ingredient
	filterByIngredient(ingredients, recipe){ 
		if(ingredients.length == 0) {
			return true
		} 
		let filteredIngredients = []
		for(let index = 0; index < recipe.ingredients.length; index++) {
			const i = recipe.ingredients[index]
			if (ingredients.includes(i.ingredient)) {
				filteredIngredients.push(true)
			}
		}
		return filteredIngredients.length == ingredients.length
	}

	// recherche par appliance
	filterByAppliance (appliances, recipe) {
		if(appliances.length == 0) {
			return true
		}
		return appliances.includes(recipe.appliance)
	}

	// recherche par ustensile
	filterByUstensils(ustensils, recipe){
		if(ustensils.length == 0) {
			return true
		}
		let filteredUstensils = []
		for (let index = 0; index < recipe.ustensils.length; index++) {
			const u = recipe.ustensils[index]
			if (ustensils.includes(u)) {
				filteredUstensils.push(true)
			}
		}	
		return filteredUstensils.length == ustensils.length
	}  

	// recherche globale
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
	selectIngredient(ingredient) {
		this.ingredients.push(ingredient)
		this.filterRecipes()
		this.renderSelectDOM()
		this.renderRecipeDOM(this.filteredRecipes)
		const tag = new Tags('', ingredient, 'ingredient', (tagElement, ingredient) => this.deleteIngredientTag(tagElement, ingredient))
		document.querySelector('#tags').appendChild(tag.render())
	}


	// sup tag ingredients
	deleteIngredientTag(tagElement, ingredient) {
		document.querySelector('#tags').removeChild(tagElement)
		this.ingredients = this.ingredients.filter((i) => {
			return i != ingredient
		})
		this.filterRecipes()
		this.renderSelectDOM()
		this.renderRecipeDOM(this.filteredRecipes)
	}

	// option selectionnée select appliances
	selectAppliance(appliance) {
		this.appliances.push(appliance)
		this.filterRecipes()
		this.renderSelectDOM()
		this.renderRecipeDOM(this.filteredRecipes)
		const tag = new Tags('', appliance, 'appliance', (tagElement, appliance) => this.deleteApplianceTag(tagElement, appliance))
		document.querySelector('#tags').appendChild(tag.render())
	}

	// sup tag appliances
	deleteApplianceTag(tagElement, appliance) {
		document.querySelector('#tags').removeChild(tagElement)
		this.appliances = this.appliances.filter((a) => {
			return a != appliance
		})
		this.filterRecipes()
		this.renderSelectDOM()
		this.renderRecipeDOM(this.filteredRecipes)
	}

	// option selectionnée select ustensils
	selectUstensil(ustensil) {
		this.ustensils.push(ustensil)
		this.filterRecipes()
		this.renderSelectDOM()
		this.renderRecipeDOM(this.filteredRecipes)
		const tag = new Tags('', ustensil, 'ustensil', (tagElement, ustensil) => this.deleteUstensilTag(tagElement, ustensil))
		document.querySelector('#tags').appendChild(tag.render())
	}

	// sup tag ustensils
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

	renderRecipeDOM(list){
		const $list = document.querySelector('#cooking')
		$list.innerHTML = this.renderCards(list).join('')
	}

	/**
	 * Création du DOM physique
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