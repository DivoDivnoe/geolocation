class AbstractModel {
    get initialCoords() {
        throw Error('Abstract method. Define initialCoords for model');
    }

    get data() {
        if (!this._data) {
            this._data = localStorage.data ? JSON.parse(localStorage.data) : [];
        }

        return this._data;
    }
}

class Model extends AbstractModel {
    get initialCoords() {
        return [59.94, 30.32];
    }

    updateData(data) {
        this.data.push(data);
        this._updateLocalStorage();
    }

    _updateLocalStorage() {
        localStorage.data = JSON.stringify(this.data);
    }
}

export default Model;
