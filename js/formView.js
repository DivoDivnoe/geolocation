import View from './view';

class FormView extends View {
    constructor(data) {
        super();
        this.data = data;
    }

    get template() {
        return document.querySelector('#header-template').innerHTML;
    }

    _render() {
        const render = Handlebars.compile(this.template);
        const helpElement = document.createElement('template');

        helpElement.innerHTML = render({
            list: this.data.reviewsList,
            address: this.data.address
        });
        console.log(helpElement.innerHTML);

        return helpElement.content;
    }

    _bind() {
        const form = this.html.querySelector('.form');
        form.onclick = console.log(111);
        const formCloser = this.html.querySelector('.header__close');

        const submitHandler = (evt) => {
            evt.preventDefault();

            const name = form.querySelector('.form__field--name').value;
            const address = form.querySelector('.form__field--place').value;
            const review = form.querySelector('.form__field--impression').value;

            this.submitForm(name, address, review);
        };
        const closeHandler = () => {
            this.closeForm();
            formCloser.removeEventListener('click', closeHandler);
            form.removeEventListener('submit', submitHandler);
        };

        form.addEventListener('submit', submitHandler);
        formCloser.addEventListener('click', closeHandler);
    }

    submitForm() {

    }

    closeForm() {

    }
}

export default FormView;
