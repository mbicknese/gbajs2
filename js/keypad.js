const connectEvents = ['gamepadconnected', 'mozgamepadconnected', 'webkitgamepadconnected'];
const disconnectEvents = [
	'gamepaddisconnected',
	'mozgamepaddisconnected',
	'webkitgamepaddisconnected'
];

class GameBoyAdvanceKeypad {
	static KEY_OFFSET = 0x03ff;
	get currentDown() {
		return Object.values(this.pressedKeys).reduce(
			(acc, value) => acc & ~value,
			GameBoyAdvanceKeypad.KEY_OFFSET
		);
	}

	pressedKeys = { keyboard: 0 };

	constructor() {
		this.KEYCODE_LEFT = 37;
		this.KEYCODE_UP = 38;
		this.KEYCODE_RIGHT = 39;
		this.KEYCODE_DOWN = 40;
		this.KEYCODE_START = 13;
		this.KEYCODE_SELECT = 220;
		this.KEYCODE_A = 90;
		this.KEYCODE_B = 88;
		this.KEYCODE_L = 65;
		this.KEYCODE_R = 83;

		this.A = 0;
		this.B = 1;
		this.SELECT = 2;
		this.START = 3;
		this.RIGHT = 4;
		this.LEFT = 5;
		this.UP = 6;
		this.DOWN = 7;
		this.R = 8;
		this.L = 9;

		this.eatInput = false;

		this.gamepads = [];

		this.remappingKeyId = '';
	}
	keyboardHandler(e) {
		var toggle = 0;

		// Check for a remapping
		if (this.remappingKeyId != '') {
			this.remapKeycode(this.remappingKeyId, e.keyCode);
			this.remappingKeyId = '';
			e.preventDefault();
			return;
		}

		switch (e.keyCode) {
			case this.KEYCODE_START:
				toggle = this.START;
				break;
			case this.KEYCODE_SELECT:
				toggle = this.SELECT;
				break;
			case this.KEYCODE_A:
				toggle = this.A;
				break;
			case this.KEYCODE_B:
				toggle = this.B;
				break;
			case this.KEYCODE_L:
				toggle = this.L;
				break;
			case this.KEYCODE_R:
				toggle = this.R;
				break;
			case this.KEYCODE_UP:
				toggle = this.UP;
				break;
			case this.KEYCODE_RIGHT:
				toggle = this.RIGHT;
				break;
			case this.KEYCODE_DOWN:
				toggle = this.DOWN;
				break;
			case this.KEYCODE_LEFT:
				toggle = this.LEFT;
				break;
			default:
				return;
		}

		toggle = 1 << toggle;
		if (e.type === 'keydown') {
			this.pressedKeys['keyboard'] |= toggle;
		} else {
			this.pressedKeys['keyboard'] &= ~toggle;
		}

		if (this.eatInput) {
			e.preventDefault();
		}
	}
	gamepadHandler(gamepad, map) {
		var value = 0;
		if (gamepad.buttons[map.GAMEPAD_LEFT].value > map.GAMEPAD_THRESHOLD) {
			value |= 1 << this.LEFT;
		}
		if (gamepad.buttons[map.GAMEPAD_UP].value > map.GAMEPAD_THRESHOLD) {
			value |= 1 << this.UP;
		}
		if (gamepad.buttons[map.GAMEPAD_RIGHT].value > map.GAMEPAD_THRESHOLD) {
			value |= 1 << this.RIGHT;
		}
		if (gamepad.buttons[map.GAMEPAD_DOWN].value > map.GAMEPAD_THRESHOLD) {
			value |= 1 << this.DOWN;
		}
		if (gamepad.buttons[map.GAMEPAD_START].value > map.GAMEPAD_THRESHOLD) {
			value |= 1 << this.START;
		}
		if (gamepad.buttons[map.GAMEPAD_SELECT].value > map.GAMEPAD_THRESHOLD) {
			value |= 1 << this.SELECT;
		}
		if (gamepad.buttons[map.GAMEPAD_A].value > map.GAMEPAD_THRESHOLD) {
			value |= 1 << this.A;
		}
		if (gamepad.buttons[map.GAMEPAD_B].value > map.GAMEPAD_THRESHOLD) {
			value |= 1 << this.B;
		}
		if (gamepad.buttons[map.GAMEPAD_L].value > map.GAMEPAD_THRESHOLD) {
			value |= 1 << this.L;
		}
		if (gamepad.buttons[map.GAMEPAD_R].value > map.GAMEPAD_THRESHOLD) {
			value |= 1 << this.R;
		}

		this.pressedKeys[gamepad.id] = value;
	}
	gamepadConnectHandler(gamepad) {
		this.gamepads.push(gamepad);
	}
	gamepadDisconnectHandler(gamepad) {
		this.gamepads = self.gamepads.filter(function (other) {
			return other != gamepad;
		});
	}
	pollGamepads() {
		const navigatorList = navigator?.getGamepads() || navigator?.webkitGetGamepads();

		// Let"s all give a shout out to Chrome for making us get the gamepads EVERY FRAME
		/* How big of a performance draw is this? Would it be worth letting users know? */
		if (navigatorList.length) {
			this.gamepads = [];
		}
		for (var i = 0; i < navigatorList.length; ++i) {
			if (navigatorList[i]) {
				this.gamepads.push(navigatorList[i]);
			}
		}
		this.gamepads.forEach((gamepad) => {
			this.gamepadHandler(gamepad, gamepadMaps[gamepad.id] || gamepadMaps['default']);
		});
	}
	registerHandlers() {
		window.addEventListener('keydown', this.keyboardHandler.bind(this), true);
		window.addEventListener('keyup', this.keyboardHandler.bind(this), true);

		const boundGamepadConnectHandler = this.gamepadConnectHandler.bind(this);
		connectEvents.forEach((event) => {
			window.addEventListener(event, boundGamepadConnectHandler, true);
		});

		const boundGamepadDisconnectHandler = this.gamepadConnectHandler.bind(this);
		disconnectEvents.forEach((event) => {
			window.addEventListener(event, boundGamepadDisconnectHandler, true);
		});
	}
	// keyId is ["A", "B", "SELECT", "START", "RIGHT", "LEFT", "UP", "DOWN", "R", "L"]
	initKeycodeRemap(keyId) {
		// Ensure valid keyId
		var validKeyIds = ['A', 'B', 'SELECT', 'START', 'RIGHT', 'LEFT', 'UP', 'DOWN', 'R', 'L'];
		if (validKeyIds.indexOf(keyId) != -1) {
			/* If remappingKeyId holds a value, the keydown event above will
			wait for the next keypress to assign the keycode */
			this.remappingKeyId = keyId;
		}
	}
	// keyId is ["A", "B", "SELECT", "START", "RIGHT", "LEFT", "UP", "DOWN", "R", "L"]
	remapKeycode(keyId, keycode) {
		switch (keyId) {
			case 'A':
				this.KEYCODE_A = keycode;
				break;
			case 'B':
				this.KEYCODE_B = keycode;
				break;
			case 'SELECT':
				this.KEYCODE_SELECT = keycode;
				break;
			case 'START':
				this.KEYCODE_START = keycode;
				break;
			case 'RIGHT':
				this.KEYCODE_RIGHT = keycode;
				break;
			case 'LEFT':
				this.KEYCODE_LEFT = keycode;
				break;
			case 'UP':
				this.KEYCODE_UP = keycode;
				break;
			case 'DOWN':
				this.KEYCODE_DOWN = keycode;
				break;
			case 'R':
				this.KEYCODE_R = keycode;
				break;
			case 'L':
				this.KEYCODE_L = keycode;
				break;
		}
	}
}

const gamepadMaps = {
	default: {
		GAMEPAD_LEFT: 14,
		GAMEPAD_UP: 12,
		GAMEPAD_RIGHT: 15,
		GAMEPAD_DOWN: 13,
		GAMEPAD_START: 9,
		GAMEPAD_SELECT: 8,
		GAMEPAD_A: 1,
		GAMEPAD_B: 0,
		GAMEPAD_L: 4,
		GAMEPAD_R: 5,
		GAMEPAD_THRESHOLD: 0.2
	},
	'Xbox Wireless Controller Extended Gamepad': {
		GAMEPAD_LEFT: 14,
		GAMEPAD_UP: 12,
		GAMEPAD_RIGHT: 15,
		GAMEPAD_DOWN: 13,
		GAMEPAD_START: 9,
		GAMEPAD_SELECT: 8,
		GAMEPAD_A: 0,
		GAMEPAD_B: 1,
		GAMEPAD_L: 4,
		GAMEPAD_R: 5,
		GAMEPAD_THRESHOLD: 0.2
	},
	'Wireless Controller Extended Gamepad': {
		// Also known as DualShock 4
		GAMEPAD_LEFT: 14,
		GAMEPAD_UP: 12,
		GAMEPAD_RIGHT: 15,
		GAMEPAD_DOWN: 13,
		GAMEPAD_START: 9,
		GAMEPAD_SELECT: 8,
		GAMEPAD_A: 0,
		GAMEPAD_B: 1,
		GAMEPAD_L: 4,
		GAMEPAD_R: 5,
		GAMEPAD_THRESHOLD: 0.2
	}
};
