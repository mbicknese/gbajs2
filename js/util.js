/**
 * @param {number} value
 * @param {number} [leading]
 * @param {boolean} [usePrefix]
 * @returns {string}
 */
function hex(value, leading = 8, usePrefix = true) {
	const asHex = (value >>> 0).toString(16).toUpperCase();
	leading -= asHex.length;
	if (leading < 0) return asHex;
	return (usePrefix ? '0x' : '') + new Array(leading + 1).join('0') + asHex;
}

class Pointer {
	index = 0;
	top = 0;
	stack = [];

	advance(amount) {
		const oldIndex = this.index;
		this.index += amount;
		return oldIndex;
	}
	mark() {
		return this.index - this.top;
	}
	push() {
		this.stack.push(this.top);
		this.top = this.index;
	}
	pop() {
		this.top = this.stack.pop();
	}

	/**
	 * @param {DataView} view
	 * @returns {string}
	 */
	readString(view) {
		const length = view.getUint32(this.advance(4), true);
		const bytes = [];
		for (let i = 0; i < length; ++i) {
			bytes.push(String.fromCharCode(view.getUint8(this.advance(1))));
		}
		return bytes.join('');
	}
}

class Serializer {
	static TAG_INT = 1;
	static TAG_STRING = 2;
	static TAG_STRUCT = 3;
	static TAG_BLOB = 4;
	static TAG_BOOLEAN = 5;
	static TYPE = 'application/octet-stream';

	static pack(value) {
		const object = new DataView(new ArrayBuffer(4));
		object.setUint32(0, value, true);
		return object.buffer;
	}

	static pack8(value) {
		const object = new DataView(new ArrayBuffer(1));
		object.setUint8(0, value);
		return object.buffer;
	}

	static prefix(value) {
		return new Blob([Serializer.pack(value.size || value.length || value.byteLength), value], {
			type: Serializer.TYPE
		});
	}

	static serialize(stream) {
		const parts = [];
		let size = 4;
		for (let i in stream) {
			if (stream.hasOwnProperty(i)) {
				const head = Serializer.prefix(i);
				let tag;
				let body;
				switch (typeof stream[i]) {
					case 'number':
						tag = Serializer.TAG_INT;
						body = Serializer.pack(stream[i]);
						break;
					case 'string':
						tag = Serializer.TAG_STRING;
						body = Serializer.prefix(stream[i]);
						break;
					case 'object':
						if (stream[i].type === Serializer.TYPE) {
							tag = Serializer.TAG_BLOB;
							body = stream[i];
						} else {
							tag = Serializer.TAG_STRUCT;
							body = Serializer.serialize(stream[i]);
						}
						break;
					case 'boolean':
						tag = Serializer.TAG_BOOLEAN;
						body = Serializer.pack8(stream[i]);
						break;
					default:
						console.log(stream[i]);
						break;
				}
				size += 1 + head.size + (body.size || body.byteLength || body.length);
				parts.push(Serializer.pack8(tag));
				parts.push(head);
				parts.push(body);
			}
		}
		parts.unshift(Serializer.pack(size));
		return new Blob(parts);
	}

	static deserialize(blob, callback) {
		const reader = new FileReader();
		reader.onload = function (data) {
			if (!(data.target?.result instanceof ArrayBuffer)) return;
			callback(Serializer.deserializeStream(new DataView(data.target.result), new Pointer()));
		};
		reader.readAsArrayBuffer(blob);
	}

	static deserializeStream(view, pointer) {
		pointer.push();
		const object = {};
		const remaining = view.getUint32(pointer.advance(4), true);
		while (pointer.mark() < remaining) {
			const tag = view.getUint8(pointer.advance(1));
			const head = pointer.readString(view);
			let body;
			switch (tag) {
				case Serializer.TAG_INT:
					body = view.getUint32(pointer.advance(4), true);
					break;
				case Serializer.TAG_STRING:
					body = pointer.readString(view);
					break;
				case Serializer.TAG_STRUCT:
					body = Serializer.deserializeStream(view, pointer);
					break;
				case Serializer.TAG_BLOB:
					const size = view.getUint32(pointer.advance(4), true);
					body = view.buffer.slice(pointer.advance(size), pointer.advance(0));
					break;
				case Serializer.TAG_BOOLEAN:
					body = !!view.getUint8(pointer.advance(1));
					break;
			}
			object[head] = body;
		}
		if (pointer.mark() > remaining) {
			throw 'Size of serialized data exceeded';
		}
		pointer.pop();
		return object;
	}

	static serializePNG(blob, base, callback) {
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		const pixels = base.getContext('2d').getImageData(0, 0, base.width, base.height);
		let transparent = 0;
		for (let y = 0; y < base.height; ++y) {
			for (let x = 0; x < base.width; ++x) {
				if (!pixels.data[(x + y * base.width) * 4 + 3]) {
					++transparent;
				}
			}
		}
		const bytesInCanvas = transparent * 3 + (base.width * base.height - transparent);
		// TODO discover what's going on here
		let multiplier = 1;
		for (multiplier; bytesInCanvas * multiplier * multiplier < blob.size; ++multiplier);
		const edges = bytesInCanvas * multiplier * multiplier - blob.size;
		const padding = Math.ceil(edges / (base.width * multiplier));
		canvas.setAttribute('width', (base.width * multiplier).toString());
		canvas.setAttribute('height', (base.height * multiplier + padding).toString());

		const reader = new FileReader();
		reader.onload = function (data) {
			if (!(data.target?.result instanceof ArrayBuffer)) return;
			const view = new Uint8Array(data.target.result);
			const newPixels = context.createImageData(canvas.width, canvas.height + padding);
			let pointer = 0;
			let pixelPointer = 0;
			for (let y = 0; y < canvas.height; ++y) {
				for (let x = 0; x < canvas.width; ++x) {
					const oldY = (y / multiplier) | 0;
					const oldX = (x / multiplier) | 0;
					if (oldY > base.height || !pixels.data[(oldX + oldY * base.width) * 4 + 3]) {
						newPixels.data[pixelPointer++] = view[pointer++];
						newPixels.data[pixelPointer++] = view[pointer++];
						newPixels.data[pixelPointer++] = view[pointer++];
						newPixels.data[pixelPointer++] = 0;
					} else {
						const byte = view[pointer++];
						newPixels.data[pixelPointer++] =
							pixels.data[(oldX + oldY * base.width) * 4] | (byte & 7);
						newPixels.data[pixelPointer++] =
							pixels.data[(oldX + oldY * base.width) * 4 + 1] | ((byte >> 3) & 7);
						newPixels.data[pixelPointer++] =
							pixels.data[(oldX + oldY * base.width) * 4 + 2] | ((byte >> 6) & 7);
						newPixels.data[pixelPointer++] =
							pixels.data[(oldX + oldY * base.width) * 4 + 3];
					}
				}
			}
			context.putImageData(newPixels, 0, 0);
			callback(canvas.toDataURL('image/png'));
		};
		reader.readAsArrayBuffer(blob);
		return canvas;
	}

	static deserializePNG(blob, callback) {
		const reader = new FileReader();
		reader.onload = function (fileReader) {
			if (typeof fileReader.target.result !== 'string') return;
			const image = document.createElement('img');
			image.setAttribute('src', fileReader.target.result);
			const canvas = document.createElement('canvas');
			canvas.setAttribute('height', image.height.toString());
			canvas.setAttribute('width', image.width.toString());
			const context = canvas.getContext('2d');
			context.drawImage(image, 0, 0);
			const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
			let data = [];
			for (let y = 0; y < canvas.height; ++y) {
				for (let x = 0; x < canvas.width; ++x) {
					if (!pixels.data[(x + y * canvas.width) * 4 + 3]) {
						data.push(pixels.data[(x + y * canvas.width) * 4]);
						data.push(pixels.data[(x + y * canvas.width) * 4 + 1]);
						data.push(pixels.data[(x + y * canvas.width) * 4 + 2]);
					} else {
						let byte = 0;
						byte |= pixels.data[(x + y * canvas.width) * 4] & 7;
						byte |= (pixels.data[(x + y * canvas.width) * 4 + 1] & 7) << 3;
						byte |= (pixels.data[(x + y * canvas.width) * 4 + 2] & 7) << 6;
						data.push(byte);
					}
				}
			}
			const newBlob = new Blob(
				data.map(function (byte) {
					const array = new Uint8Array(1);
					array[0] = byte;
					return array;
				}),
				{ type: Serializer.TYPE }
			);
			Serializer.deserialize(newBlob, callback);
		};
		reader.readAsDataURL(blob);
	}
}
