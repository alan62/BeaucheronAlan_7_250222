class Select {

    constructor(id, title, options, filterRecipes) {
        this.id = id;
        this.title = title;
        this.options = options;
        this.filteredOptions = options;
        this.filterRecipes = filterRecipes;
        this.opened = false;
    }

    createOptions() {
        return this.filteredOptions.map((o) => {
            const option = document.createElement('span');
            option.style.cursor = 'pointer'
            option.classList.add('select-option');
            option.textContent = o;
            option.addEventListener('click', () => {
                this.filterRecipes(o)
            })
            return option;
        });
    }

    filterOptions(value) {
        if (value === '' || value.length < 3) {
            this.filteredOptions = this.options
            return;
        }
        this.filteredOptions = this.options.filter((o) => o.toLowerCase().trim().includes(value))
    }

    createTitle() {
        const parser = new DOMParser()
        let dom = `<div class="select-title-content">
                <span>${this.title}</span>
                <span class="caret chevron-bottom">&#8250;</span>
            </div>`
        if (!this.opened) {
            return parser.parseFromString(dom, 'text/html').querySelector('.select-title-content')
        }

        dom = `<div class="select-title-content">
            <input placeholder="${this.title}" autofocus/>
            <span class="caret chevron-top">&#8250;</span>
        </div>`
        dom = parser.parseFromString(dom, 'text/html').querySelector('.select-title-content')

        dom.querySelector('input').addEventListener('input', (e) => {
            this.filterOptions(e.target.value.toLowerCase().trim());
            this.renderOptions();
        })
        return dom
    }

    renderOptions() {
        const selectOptions = this.select.querySelector('.select-options')
        if (!this.opened) {
            selectOptions.style.display = 'none'
            return;
        }
        selectOptions.style.display = 'flex'
        const options = this.createOptions()
        selectOptions.innerHTML = ''
        options.forEach(o => selectOptions.appendChild(o))
    }

    renderTitle($selectTitle) {
        const $newSelectTitleChild = this.createTitle()
        $selectTitle.innerHTML = ''
        $selectTitle.appendChild($newSelectTitleChild)
        if (this.opened) {
            this.select.style.width = '400px';
        } else {
            this.select.style.width = '170px';
        }
    }

    render() {
        const parser = new DOMParser();
        const document = parser.parseFromString(`<div id=${this.id} class="select">
            <div class="select-title"></div>
            <div class="select-options" style="display: none"></div>            
            </div>`, 'text/html')
        this.select = document.querySelector(`#${this.id}`);
        const $selectTitle = this.select.querySelector('.select-title')
        this.renderTitle($selectTitle)
        $selectTitle.addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT') {
                this.opened = !this.opened
                this.filteredOptions = this.options
                this.renderTitle($selectTitle)
                this.renderOptions();
            }
        });
        return this.select;
    }
}

export default Select;