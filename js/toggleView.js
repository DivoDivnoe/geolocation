import View from './view';

class ToggleView extends View {
    constructor(data) {
        super();
        this.data = data;
    }

    get template() {
        return document.querySelector('#switch-template').innerHTML;
    }

    _render() {
        const render = Handlebars.compile(this.template);
        const helpElement = document.createElement('div');

        helpElement.innerHTML = render({
            place: this.data.place,
            address: this.data.address,
            review: this.data.review,
            date: this.data.date
        });

        return helpElement.firstElementChild;
    }

    _bind() {
        this.html.querySelector('.switch__address').addEventListener('click', (evt) => {
            evt.preventDefault();

            this.addressClickHandler();
        })
    }

    addressClickHandler() {

    }
}

export default ToggleView;
