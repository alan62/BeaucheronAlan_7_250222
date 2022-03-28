class Card {
    
    constructor(name, time, ingredients, description) {
        this.name = name
        this.time = time
        this.ingredients = ingredients
        this.description = description
    }


    render() {
        let ul = '<ul>'
        this.ingredients.forEach(one => {
            const ingredient =  (one.ingredient != undefined) ? one.ingredient : '';
            const quantity = (one.quantity != undefined) ? one.quantity : '';
            const unit = (one.unit != undefined) ? one.unit : '';
            const li = `<li class='list_ingredient'><span class='text_ingredient'>${ingredient}: </span>${quantity} ${unit}</li>`;
            ul += li;
        
        })
        ul += '</ul>'

        return (`
            <div class='card_main'>
                <div class='img_card'>
                <img src="assets/img/logo.svg" alt="logo"></img>
                </div>
                <div class='content_card'>
                    <div class='header_card'>
                        <div class='title_card'>
                            <p>${this.name}</p>
                        </div>
                        <div class='time_card'>
                            <div class='fav_clock'>
                                <i class='far fa-clock'></i>
                            </div>
                            <div class='text_clock'>
                                <p>${this.time} min</p>
                            </div> 
                        </div>
                    </div>
                    <div class='description_card'>
                        <div class='ingredients_content'>
                            ${ul}
                        </div>
                        <div class='description_content'>
                            <p>${this.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        `)
    }
}

export default Card;
