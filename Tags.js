class Tags {

    constructor(id, option, type, deleteElement){
        this.id = id
        this.option = option
        this.type = type
        this.deleteElement = deleteElement
    }

    
    render(){
        
        var tag = document.createElement('div');
        tag.innerText = this.option 
        tag.innerHTML += `<img src='../../assets/img/cross.svg' alt='cross' class='cross'>`
        tag.classList.add('tag')
        tag.classList.add(this.type)
        tag.addEventListener('click', () => {
            this.deleteElement(tag, this.option)
        })
        return tag

    }

}
export default Tags;