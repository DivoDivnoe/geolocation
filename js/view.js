class View {
    get template() {
        throw new Error('Abstract method. Define template for view');
    }

    get html() {
        if (!this._html) {
            this._html = this._render();
            this._bind();
        }

        return this._html;
    }

    _render() {

    }

    _bind() {

    }
}

export default View;
