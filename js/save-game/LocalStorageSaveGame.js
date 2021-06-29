class LocalStorageSaveGame {
	constructor(namespace, prefix, localWindow = window) {
		this.namespace = namespace;
		this.prefix = prefix;
		this.window = localWindow;
	}

	_key(game) {
		return [this.namespace, this.prefix, game].filter((v) => !!v).join('.');
	}

	save(game, data) {
		this.window.localStorage.setItem(this._key(game), data);
	}
	load(game) {
		return this.window.localStorage.getItem(this._key(game));
	}
}
