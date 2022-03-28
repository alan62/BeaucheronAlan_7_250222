class Search {
    constructor(onChange){
        this.onChange = onChange
    }

    initEvent() {
        document.querySelector('.searchTerm').addEventListener('input', (e) => {
           this.onChange(e.target.value)
        })
    }

    render(){
        return (`
            <div class="searchbar">
                <input type="text" class="searchTerm" placeholder='Rechercher un ingrédient, appareil, ustensile ou une recette'>
                <button type="submit" class="searchButton">
                    <i class="fa fa-search"></i>
                </button>
            </div>
        `)
    }
}

export default Search;