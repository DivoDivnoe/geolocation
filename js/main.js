import Model from './model';
import FormView from './formView';
import ToggleView from './toggleView';

class Controller {
    constructor(containerId) {
        this.model = new Model();

        new Promise((resolve) => ymaps.ready(resolve))
            .then(() => {
                this.myMap = new ymaps.Map(containerId, {
                    center: this.model.initialCoords,
                    zoom: 11
                }, {
                    searchControlProvider: 'yandex#search'
                });

                const customItemContentLayout = ymaps.templateLayoutFactory.createClass(
                    '{{ properties.balloonContentBody|raw }}'
                );

                this.clusterer = new ymaps.Clusterer({
                    preset: 'islands#invertedVioletClusterIcons',
                    clusterDisableClickZoom: true,
                    clusterOpenBalloonOnClick: true,
                    clusterBalloonContentLayout: 'cluster#balloonCarousel',
                    clusterBalloonItemContentLayout: customItemContentLayout,
                    clusterBalloonPanelMaxMapArea: 0,
                    clusterBalloonContentLayoutWidth: 400,
                    clusterBalloonContentLayoutHeight: 200,
                    clusterBalloonPagerSize: 5
                });

                this.myMap.geoObjects.add(this.clusterer);
                this.model.data.forEach((item) => this._renderIcon(item));
                this._bind();

                return this.model.data;
            })
            .catch((err) => alert('Ошибка' + err.message));
    }

    _renderIcon(item) {
        this.switcher = new ToggleView(item);
        this.switcher.addressClickHandler = () => {
            this._clickHandler(item.coords);
        };

        const placeMark = new ymaps.Placemark(item.coords, {
            balloonContentBody: this.switcher.html.outerHTML
        }, {
            preset: 'islands#violetIcon'
        });

        placeMark.events.add('click', (evt) => {
            evt.preventDefault();

            this._clickHandler(item.coords);
        });

        this.myMap.geoObjects
            .add(placeMark);

        this.clusterer.add(placeMark);
    }

    _bind() {
        this.myMap.events.add('click', (e) => {
            const coords = e.get('coords');

            this._clickHandler(coords);
        });
    }

    _clickHandler(coords) {
        this._geocode(coords)
            .then((address) => {
                this._initForm(address, coords);
                this._renderForm();
            });
    }

    _initForm(address, coords) {
        const reviews = document.querySelector('.reviews');
        const dataItems = this.model.data.filter((item) => item.coords === coords);
        const reviewsList = dataItems ? dataItems.map((item) => {
            return {
                review: item.review,
                name: item.name,
                place: item.place,
                date: item.date
            };
        }) : [];

        this.form = new FormView({ reviewsList, address });
        this.form.closeForm = () => reviews.classList.remove('reviews--opened');
        this.form.submitForm = (name, place, review) => {
            const formData = {
                coords,
                address,
                name,
                place,
                date: new Date().toLocaleString().split(', ').join(' '),
                review
            };

            this.model.updateData(formData);
            this._renderIcon(formData);
            this._clickHandler(coords);
        };
    }

    _renderForm() {
        const reviews = document.querySelector('.reviews');

        reviews.innerHTML = '';
        reviews.appendChild(this.form.html);
        reviews.classList.add('reviews--opened');
    }

    _geocode(coords) {
        return ymaps.geocode(coords)
            .then((result) => result.geoObjects.get(0).properties.get('metaDataProperty').GeocoderMetaData.text);
    }
}

new Controller('map');
