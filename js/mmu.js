class MemoryView {
	/** @type ArrayBuffer */
	buffer;
	/** @type number */
	mask;
	/** @type number */
	mask8;
	/** @type number */
	mask16;
	/** @type number */
	mask32;
	/**
	 * @protected
	 * @type DataView
	 */
	view;

	/**
	 * @param {ArrayBuffer} memory
	 * @param {number} [offset=0]
	 */
	constructor(memory, offset) {
		this.buffer = memory;
		this.view = new DataView(this.buffer, typeof offset === 'number' ? offset : 0);
		this.mask = memory.byteLength - 1;
		this.resetMask();
	}

	/**
	 * sets 8, 16 and 32-bit masks to match the base mask
	 * @returns {void}
	 */
	resetMask() {
		this.mask8 = this.mask & 0xffffffff;
		this.mask16 = this.mask & 0xfffffffe;
		this.mask32 = this.mask & 0xfffffffc;
	}

	/**
	 * @param {number} offset
	 * @returns {number}
	 */
	load8(offset) {
		return this.view.getInt8(offset & this.mask8);
	}

	/**
	 * @param {number} offset
	 * @returns {number}
	 */
	load16(offset) {
		// Unaligned 16-bit loads are unpredictable...let's just pretend they work
		return this.view.getInt16(offset & this.mask, true);
	}

	/**
	 * @param {number} offset
	 * @returns {number}
	 */
	loadU8(offset) {
		return this.view.getUint8(offset & this.mask8);
	}

	/**
	 * @param {number} offset
	 * @returns {number}
	 */
	loadU16(offset) {
		// Unaligned 16-bit loads are unpredictable...let's just pretend they work
		return this.view.getUint16(offset & this.mask, true);
	}

	/**
	 * @param {number} offset
	 * @returns {number}
	 */
	load32(offset) {
		// Unaligned 32-bit loads are "rotated" so they make some semblance of sense
		const rotate = (offset & 3) << 3;
		const mem = this.view.getInt32(offset & this.mask32, true);
		return (mem >>> rotate) | (mem << (32 - rotate));
	}

	/**
	 * @param {number} offset
	 * @param {number} value
	 * @returns {void}
	 */
	store8(offset, value) {
		this.view.setInt8(offset & this.mask8, value);
	}

	/**
	 * @param {number} offset
	 * @param {number} value
	 * @returns {void}
	 */
	store16(offset, value) {
		this.view.setInt16(offset & this.mask16, value, true);
	}

	/**
	 * @param {number} offset
	 * @param {number} value
	 * @returns {void}
	 */
	store32(offset, value) {
		this.view.setInt32(offset & this.mask32, value, true);
	}

	invalidatePage(address) {}

	/**
	 * @param {ArrayBuffer} memory
	 * @param {number} [offset=0]
	 * @returns {void}
	 */
	replaceData(memory, offset) {
		this.buffer = memory;
		this.view = new DataView(this.buffer, typeof offset === 'number' ? offset : 0);
		if (this.icache) {
			this.icache = new Array(this.icache.length);
		}
	}
}

class MemoryBlock extends MemoryView {
	/**
	 * @readonly
	 * @type {number}
	 * @todo naming implies readonly but `invalidatePage` writes to it anyway.
	 */
	ICACHE_PAGE_BITS;

	/**
	 * @readonly
	 * @type {number}
	 */
	PAGE_MASK;

	/** @type {Object[]} - pages array */
	icache;

	/**
	 * @param {number} size
	 * @param {number} cacheBits
	 */
	constructor(size, cacheBits) {
		super(new ArrayBuffer(size));
		this.ICACHE_PAGE_BITS = cacheBits;
		this.PAGE_MASK = (2 << this.ICACHE_PAGE_BITS) - 1;
		this.icache = new Array(size >> (this.ICACHE_PAGE_BITS + 1));
	}

	/**
	 * @param {number} address
	 * @returns {void}
	 */
	invalidatePage(address) {
		const page = this.icache[(address & this.mask) >> this.ICACHE_PAGE_BITS];
		if (page) {
			page.invalid = true;
		}
		this.ICACHE_PAGE_BITS = 4;
	}
}

class ROMView extends MemoryView {
	/**
	 * @readonly
	 * @type {number}
	 */
	ICACHE_PAGE_BITS;

	/**
	 * @readonly
	 * @type {number}
	 */
	PAGE_MASK;

	/** @type {Object[]} - pages array */
	icache;

	constructor(rom, offset) {
		super(rom, offset);
		this.ICACHE_PAGE_BITS = 10;
		this.PAGE_MASK = (2 << this.ICACHE_PAGE_BITS) - 1;
		this.icache = new Array(rom.byteLength >> (this.ICACHE_PAGE_BITS + 1));
		this.mask = 0x01ffffff;
		this.resetMask();
	}

	store8(offset, value) {}

	store16(offset, value) {
		if (offset < 0xca && offset >= 0xc4) {
			if (!this.gpio) {
				this.gpio = this.mmu.allocGPIO(this);
			}
			this.gpio.store16(offset, value);
		}
	}

	store32(offset, value) {
		if (offset < 0xca && offset >= 0xc4) {
			if (!this.gpio) {
				this.gpio = this.mmu.allocGPIO(this);
			}
			this.gpio.store32(offset, value);
		}
	}
}

class BIOSView extends MemoryView {
	/**
	 * @readonly
	 * @type {number}
	 */
	ICACHE_PAGE_BITS;

	/**
	 * @readonly
	 * @type {number}
	 */
	PAGE_MASK;

	/** @type {Object[]} - pages array */
	icache;

	/** @type {boolean|undefined} */
	real;

	/**
	 * @param {ArrayBuffer} rom
	 * @param {number} [offset=0]
	 */
	constructor(rom, offset) {
		super(rom, offset);

		this.ICACHE_PAGE_BITS = 16;
		this.PAGE_MASK = (2 << this.ICACHE_PAGE_BITS) - 1;
		this.icache = new Array(1);
	}

	load8(offset) {
		if (offset >= this.buffer.byteLength) {
			return -1;
		}
		return this.view.getInt8(offset);
	}

	load16(offset) {
		if (offset >= this.buffer.byteLength) {
			return -1;
		}
		return this.view.getInt16(offset, true);
	}

	loadU8(offset) {
		if (offset >= this.buffer.byteLength) {
			return -1;
		}
		return this.view.getUint8(offset);
	}

	loadU16(offset) {
		if (offset >= this.buffer.byteLength) {
			return -1;
		}
		return this.view.getUint16(offset, true);
	}

	load32(offset) {
		if (offset >= this.buffer.byteLength) {
			return -1;
		}
		return this.view.getInt32(offset, true);
	}

	store8(offset, value) {}
	store16(offset, value) {}
	store32(offset, value) {}
}

/**
 * @implements MemoryView
 */
class BadMemory {
	/** @type {ARMCore} */
	cpu;
	/** @type {GameBoyAdvanceMMU} */
	mmu;

	/**
	 * @param {GameBoyAdvanceMMU} mmu
	 * @param {ARMCore} cpu
	 */
	constructor(mmu, cpu) {
		this.cpu = cpu;
		this.mmu = mmu;
	}

	load8(offset) {
		return this.mmu.load8(
			this.cpu.gprs[this.cpu.PC] - this.cpu.instructionWidth + (offset & 0x3)
		);
	}

	load16(offset) {
		return this.mmu.load16(
			this.cpu.gprs[this.cpu.PC] - this.cpu.instructionWidth + (offset & 0x2)
		);
	}

	loadU8(offset) {
		return this.mmu.loadU8(
			this.cpu.gprs[this.cpu.PC] - this.cpu.instructionWidth + (offset & 0x3)
		);
	}

	loadU16(offset) {
		return this.mmu.loadU16(
			this.cpu.gprs[this.cpu.PC] - this.cpu.instructionWidth + (offset & 0x2)
		);
	}

	load32(offset) {
		if (this.cpu.execMode === this.cpu.MODE_ARM) {
			return this.mmu.load32(this.cpu.gprs[this.cpu.gprs.PC] - this.cpu.instructionWidth);
		}
		const halfWord = this.mmu.loadU16(this.cpu.gprs[this.cpu.PC] - this.cpu.instructionWidth);
		return halfWord | (halfWord << 16);
	}

	store8(offset, value) {}
	store16(offset, value) {}
	store32(offset, value) {}
	invalidatePage(address) {}
}

/**
 * @implements MemoryView
 */
class GameBoyAdvanceMMU {
	static REGION_WORKING_RAM = 0x2;
	static REGION_WORKING_IRAM = 0x3;
	static REGION_IO = 0x4;
	static REGION_PALETTE_RAM = 0x5;
	static REGION_VRAM = 0x6;
	static REGION_OAM = 0x7;
	static REGION_CART0 = 0x8;
	static REGION_CART1 = 0xa;
	static REGION_CART2 = 0xc;
	static REGION_CART_SRAM = 0xe;

	// static BASE_BIOS = 0x00000000;
	// static BASE_WORKING_RAM = 0x02000000;
	// static BASE_WORKING_IRAM = 0x03000000;
	static BASE_IO = 0x04000000;
	// static BASE_PALETTE_RAM = 0x05000000;
	// static BASE_VRAM = 0x06000000;
	// static BASE_OAM = 0x07000000;
	// static BASE_CART0 = 0x08000000;
	// static BASE_CART1 = 0x0a000000;
	// static BASE_CART2 = 0x0c000000;
	// static BASE_CART_SRAM = 0x0e000000;

	// static BASE_MASK = 0x0f000000;
	static BASE_OFFSET = 24;
	static OFFSET_MASK = 0x00ffffff;

	// static SIZE_BIOS = 0x00004000;
	static SIZE_WORKING_RAM = 0x00040000;
	static SIZE_WORKING_IRAM = 0x00008000;
	static SIZE_IO = 0x00000400;
	static SIZE_PALETTE_RAM = 0x00000400;
	static SIZE_VRAM = 0x00018000;
	static SIZE_OAM = 0x00000400;
	// static SIZE_CART0 = 0x02000000;
	// static SIZE_CART1 = 0x02000000;
	// static SIZE_CART2 = 0x02000000;
	static SIZE_CART_SRAM = 0x00008000;
	static SIZE_CART_FLASH512 = 0x00010000;
	static SIZE_CART_FLASH1M = 0x00020000;
	static SIZE_CART_EEPROM = 0x00002000;

	static DMA_TIMING_NOW = 0;
	static DMA_TIMING_VBLANK = 1;
	static DMA_TIMING_HBLANK = 2;
	static DMA_TIMING_CUSTOM = 3;

	// static DMA_INCREMENT = 0;
	// static DMA_DECREMENT = 1;
	// static DMA_FIXED = 2;
	static DMA_INCREMENT_RELOAD = 3;

	static DMA_OFFSET = [1, -1, 0, 1];

	static ROM_WS = [4, 3, 2, 8];
	static ROM_WS_SEQ = [
		[2, 1],
		[4, 1],
		[8, 1]
	];

	static ICACHE_PAGE_BITS = 8;
	static PAGE_MASK = (2 << GameBoyAdvanceMMU.ICACHE_PAGE_BITS) - 1;

	/** @type {BadMemory} */
	badMemory;
	/** @type {BIOSView} */
	bios;
	/**
	 * 	@type {Object|null}
	 * 	@todo define cart model
	 */
	cart;
	/**
	 * @type {GameBoyAdvance}
	 * @deprecated
	 */
	core;
	/** @type {ARMCore} */
	cpu;
	/** @type {MemoryView[]} */
	memory;
	/** @type {FlashSavedata|SRAMSavedata|EEPROMSavedata|null} */
	save;
	/** @type number[] */
	waitstates;
	/** @type number[] */
	waitstates32;
	/** @type number[] */
	waitstatesSeq;
	/** @type number[] */
	waitstatesSeq32;
	/** @type number[] */
	waitstatesPrefetch;
	/** @type number[] */
	waitstatesPrefetch32;

	constructor() {
		this.setWaitStates();
	}

	/**
	 * @param {number} region
	 * @param {MemoryView} object
	 * @returns {void}
	 */
	mmap(region, object) {
		this.memory[region] = object;
	}

	/**
	 * @returns {void}
	 */
	// prettier-ignore
	setWaitStates() {
		this.waitstates = [0, 0, 2, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, ...new Array(241).fill(0)];
		this.waitstates32 = [0, 0, 5, 0, 0, 1, 0, 1, 7, 7, 9, 9, 13, 13, 8, ...new Array(241).fill(0)];
		this.waitstatesSeq = [0, 0, 2, 0, 0, 0, 0, 0, 2, 2, 4, 4, 8, 8, 4, ...new Array(241).fill(0)];
		this.waitstatesSeq32 = [0, 0, 5, 0, 0, 1, 0, 1, 5, 5, 9, 9, 17, 17, 8, ...new Array(241).fill(0)];
		this.waitstatesPrefetch = [...this.waitstatesSeq];
		this.waitstatesPrefetch32 = [...this.waitstatesSeq32];
	}

	/**
	 * @returns {void}
	 */
	clear() {
		this.badMemory = new BadMemory(this, this.cpu);
		this.memory = [
			this.bios,
			this.badMemory,
			new MemoryBlock(GameBoyAdvanceMMU.SIZE_WORKING_RAM, 9),
			new MemoryBlock(GameBoyAdvanceMMU.SIZE_WORKING_IRAM, 7),
			null, // This is owned by GameBoyAdvanceIO
			null, // This is owned by GameBoyAdvancePalette
			null, // This is owned by GameBoyAdvanceVRAM
			null, // This is owned by GameBoyAdvanceOAM
			this.badMemory,
			this.badMemory,
			this.badMemory,
			this.badMemory,
			this.badMemory,
			this.badMemory,
			this.badMemory,
			this.badMemory // Unused
		];
		for (let i = 16; i < 256; ++i) {
			this.memory[i] = this.badMemory;
		}

		this.setWaitStates();

		this.cart = null;
		this.save = null;

		GameBoyAdvanceMMU.DMA_REGISTER = [
			GameBoyAdvanceIO.DMA0CNT_HI >> 1,
			GameBoyAdvanceIO.DMA1CNT_HI >> 1,
			GameBoyAdvanceIO.DMA2CNT_HI >> 1,
			GameBoyAdvanceIO.DMA3CNT_HI >> 1
		];
	}

	/**
	 * @returns {{iram: ArrayBuffer, ram: ArrayBuffer}}
	 */
	freeze() {
		return {
			ram: Serializer.prefix(this.memory[GameBoyAdvanceMMU.REGION_WORKING_RAM].buffer),
			iram: Serializer.prefix(this.memory[GameBoyAdvanceMMU.REGION_WORKING_IRAM].buffer)
		};
	}

	/**
	 * @param {{iram: ArrayBuffer, ram: ArrayBuffer}} frost
	 */
	defrost(frost) {
		this.memory[GameBoyAdvanceMMU.REGION_WORKING_RAM].replaceData(frost.ram);
		this.memory[GameBoyAdvanceMMU.REGION_WORKING_IRAM].replaceData(frost.iram);
	}

	/**
	 * @param {ArrayBuffer} bios
	 * @param {boolean} real - accepts truthy/falsy values
	 */
	loadBios(bios, real) {
		this.bios = new BIOSView(bios);
		this.bios.real = !!real;
	}

	/**
	 * @param {ArrayBuffer} rom
	 * @param {boolean} process
	 * @returns {Object|undefined}
	 */
	loadRom(rom, process) {
		const lo = new ROMView(rom);
		if (lo.view.getUint8(0xb2) !== 0x96) {
			// Not a valid ROM
			return;
		}

		const cart = {
			title: null,
			code: null,
			maker: null,
			memory: rom,
			saveType: null
		};

		lo.mmu = this; // Needed for GPIO
		this.memory[GameBoyAdvanceMMU.REGION_CART0] = lo;
		this.memory[GameBoyAdvanceMMU.REGION_CART1] = lo;
		this.memory[GameBoyAdvanceMMU.REGION_CART2] = lo;

		if (rom.byteLength > 0x01000000) {
			const hi = new ROMView(rom, 0x01000000);
			this.memory[GameBoyAdvanceMMU.REGION_CART0 + 1] = hi;
			this.memory[GameBoyAdvanceMMU.REGION_CART1 + 1] = hi;
			this.memory[GameBoyAdvanceMMU.REGION_CART2 + 1] = hi;
		}

		if (process) {
			let name = '';
			for (let i = 0; i < 12; ++i) {
				const c = lo.loadU8(i + 0xa0);
				if (!c) {
					break;
				}
				name += String.fromCharCode(c);
			}
			cart.title = name;

			let code = '';
			for (let i = 0; i < 4; ++i) {
				const c = lo.loadU8(i + 0xac);
				if (!c) {
					break;
				}
				code += String.fromCharCode(c);
			}
			cart.code = code;

			let maker = '';
			for (let i = 0; i < 2; ++i) {
				const c = lo.loadU8(i + 0xb0);
				if (!c) {
					break;
				}
				maker += String.fromCharCode(c);
			}
			cart.maker = maker;

			// Find savedata type
			let state = '';
			let next;
			let terminal = false;
			for (let i = 0xe4; i < rom.byteLength && !terminal; ++i) {
				next = String.fromCharCode(lo.loadU8(i));
				state += next;
				switch (state) {
					case 'F':
					case 'FL':
					case 'FLA':
					case 'FLAS':
					case 'FLASH':
					case 'FLASH_':
					case 'FLASH5':
					case 'FLASH51':
					case 'FLASH512':
					case 'FLASH512_':
					case 'FLASH1':
					case 'FLASH1M':
					case 'FLASH1M_':
					case 'S':
					case 'SR':
					case 'SRA':
					case 'SRAM':
					case 'SRAM_':
					case 'E':
					case 'EE':
					case 'EEP':
					case 'EEPR':
					case 'EEPRO':
					case 'EEPROM':
					case 'EEPROM_':
						break;
					case 'FLASH_V':
					case 'FLASH512_V':
					case 'FLASH1M_V':
					case 'SRAM_V':
					case 'EEPROM_V':
						terminal = true;
						break;
					default:
						state = next;
						break;
				}
			}
			if (terminal) {
				cart.saveType = state;
				switch (state) {
					case 'FLASH_V':
					case 'FLASH512_V':
						this.save = this.memory[
							GameBoyAdvanceMMU.REGION_CART_SRAM
						] = new FlashSavedata(GameBoyAdvanceMMU.SIZE_CART_FLASH512);
						break;
					case 'FLASH1M_V':
						this.save = this.memory[
							GameBoyAdvanceMMU.REGION_CART_SRAM
						] = new FlashSavedata(GameBoyAdvanceMMU.SIZE_CART_FLASH1M);
						break;
					case 'SRAM_V':
						this.save = this.memory[
							GameBoyAdvanceMMU.REGION_CART_SRAM
						] = new SRAMSavedata(GameBoyAdvanceMMU.SIZE_CART_SRAM);
						break;
					case 'EEPROM_V':
						this.save = this.memory[
							GameBoyAdvanceMMU.REGION_CART2 + 1
						] = new EEPROMSavedata(GameBoyAdvanceMMU.SIZE_CART_EEPROM, this);
						break;
				}
			}
			if (!this.save) {
				// Assume we have SRAM
				this.save = this.memory[GameBoyAdvanceMMU.REGION_CART_SRAM] = new SRAMSavedata(
					GameBoyAdvanceMMU.SIZE_CART_SRAM
				);
			}
		}

		this.cart = cart;
		return cart;
	}

	/**
	 * @param {ArrayBuffer} save
	 * @returns {void}
	 */
	loadSavedata(save) {
		this.save.replaceData(save);
	}

	load8(offset) {
		return this.memory[offset >>> GameBoyAdvanceMMU.BASE_OFFSET].load8(offset & 0x00ffffff);
	}

	load16(offset) {
		return this.memory[offset >>> GameBoyAdvanceMMU.BASE_OFFSET].load16(offset & 0x00ffffff);
	}

	load32(offset) {
		return this.memory[offset >>> GameBoyAdvanceMMU.BASE_OFFSET].load32(offset & 0x00ffffff);
	}

	loadU8(offset) {
		return this.memory[offset >>> GameBoyAdvanceMMU.BASE_OFFSET].loadU8(offset & 0x00ffffff);
	}

	loadU16(offset) {
		return this.memory[offset >>> GameBoyAdvanceMMU.BASE_OFFSET].loadU16(offset & 0x00ffffff);
	}

	store8(offset, value) {
		const maskedOffset = offset & 0x00ffffff;
		const memory = this.memory[offset >>> GameBoyAdvanceMMU.BASE_OFFSET];
		memory.store8(maskedOffset, value);
		memory.invalidatePage(maskedOffset);
	}

	store16(offset, value) {
		const maskedOffset = offset & 0x00fffffe;
		const memory = this.memory[offset >>> GameBoyAdvanceMMU.BASE_OFFSET];
		memory.store16(maskedOffset, value);
		memory.invalidatePage(maskedOffset);
	}

	store32(offset, value) {
		const maskedOffset = offset & 0x00fffffc;
		const memory = this.memory[offset >>> GameBoyAdvanceMMU.BASE_OFFSET];
		memory.store32(maskedOffset, value);
		memory.invalidatePage(maskedOffset);
		memory.invalidatePage(maskedOffset + 2);
	}

	/**
	 * @param {number} memory
	 * @returns {void}
	 */
	waitPrefetch(memory) {
		this.cpu.cycles += 1 + this.waitstatesPrefetch[memory >>> GameBoyAdvanceMMU.BASE_OFFSET];
	}

	/**
	 * @param {number} memory
	 * @returns {void}
	 */
	waitPrefetch32(memory) {
		this.cpu.cycles += 1 + this.waitstatesPrefetch32[memory >>> GameBoyAdvanceMMU.BASE_OFFSET];
	}

	/**
	 * @param {number} memory
	 * @returns {void}
	 */
	wait(memory) {
		this.cpu.cycles += 1 + this.waitstates[memory >>> GameBoyAdvanceMMU.BASE_OFFSET];
	}

	/**
	 * @param {number} memory
	 * @returns {void}
	 */
	wait32(memory) {
		this.cpu.cycles += 1 + this.waitstates32[memory >>> GameBoyAdvanceMMU.BASE_OFFSET];
	}

	/**
	 * @param {number} memory
	 * @returns {void}
	 */
	waitSeq(memory) {
		this.cpu.cycles += 1 + this.waitstatesSeq[memory >>> GameBoyAdvanceMMU.BASE_OFFSET];
	}

	/**
	 * @param {number} memory
	 * @returns {void}
	 */
	waitSeq32(memory) {
		this.cpu.cycles += 1 + this.waitstatesSeq32[memory >>> GameBoyAdvanceMMU.BASE_OFFSET];
	}

	/**
	 * @param {number} rs
	 * @returns {void}
	 */
	waitMul(rs) {
		if (rs & (0xffffff00 === 0xffffff00) || !(rs & 0xffffff00)) {
			this.cpu.cycles += 1;
		} else if (rs & (0xffff0000 === 0xffff0000) || !(rs & 0xffff0000)) {
			this.cpu.cycles += 2;
		} else if (rs & (0xff000000 === 0xff000000) || !(rs & 0xff000000)) {
			this.cpu.cycles += 3;
		} else {
			this.cpu.cycles += 4;
		}
	}

	/**
	 * @param {number} memory
	 * @param {number} seq
	 * @returns {void}
	 */
	waitMulti32(memory, seq) {
		this.cpu.cycles += 1 + this.waitstates32[memory >>> GameBoyAdvanceMMU.BASE_OFFSET];
		this.cpu.cycles +=
			(1 + this.waitstatesSeq32[memory >>> GameBoyAdvanceMMU.BASE_OFFSET]) * (seq - 1);
	}

	/**
	 * @param {number} region
	 * @param {number} address
	 * @returns {number}
	 */
	addressToPage(region, address) {
		return address >> this.memory[region].ICACHE_PAGE_BITS;
	}

	/**
	 * @param region
	 * @param pageId
	 * @throws {Error} when out of bounds memory is accessed
	 * @returns {{thumb: Array, arm: Array, invalid: boolean}}
	 */
	accessPage(region, pageId) {
		if (!this.memory[region].icache) {
			throw new Error(`Region ${region} of memory does not have icache.`);
		}
		const memory = this.memory[region];
		let page = memory.icache[pageId];
		if (!page || page.invalid) {
			page = {
				thumb: new Array(1 << memory.ICACHE_PAGE_BITS),
				arm: new Array(1 << (memory.ICACHE_PAGE_BITS - 1)),
				invalid: false
			};
			memory.icache[pageId] = page;
		}
		return page;
	}

	/**
	 * @param {number} dma - has to be 0, 1, 2 or 3
	 * @param {Object} info
	 * @returns {void}
	 */
	scheduleDma(dma, info) {
		switch (info.timing) {
			case GameBoyAdvanceMMU.DMA_TIMING_NOW:
				this.serviceDma(dma, info);
				break;
			case GameBoyAdvanceMMU.DMA_TIMING_HBLANK:
			case GameBoyAdvanceMMU.DMA_TIMING_VBLANK:
				// Handled implicitly
				break;
			case GameBoyAdvanceMMU.DMA_TIMING_CUSTOM:
				switch (dma) {
					case 0:
						this.core.WARN('Discarding invalid DMA0 scheduling');
						break;
					case 1:
					case 2:
						this.cpu.irq.audio.scheduleFIFODma(dma, info);
						break;
					case 3:
						// FIXME possibly unused code, check if it can be removed.
						this.core.WARN(
							'Going to try and call unresolved function "scheduleVCaptureDma"'
						);
						this.cpu.irq.video.scheduleVCaptureDma(dma, info);
						break;
				}
		}
	}

	/**
	 * @returns {void}
	 */
	runHblankDmas() {
		for (let i = 0; i < this.cpu.irq.dma.length; ++i) {
			const dma = this.cpu.irq.dma[i];
			if (dma.enable && dma.timing === GameBoyAdvanceMMU.DMA_TIMING_HBLANK) {
				this.serviceDma(i, dma);
			}
		}
	}

	/**
	 * @returns {void}
	 */
	runVblankDmas() {
		for (let i = 0; i < this.cpu.irq.dma.length; ++i) {
			const dma = this.cpu.irq.dma[i];
			if (dma.enable && dma.timing === GameBoyAdvanceMMU.DMA_TIMING_VBLANK) {
				this.serviceDma(i, dma);
			}
		}
	}

	/**
	 * @param {number} dma - has to be 0, 1, 2 or 3
	 * @param {Object} info
	 * @returns {void}
	 */
	serviceDma(dma, info) {
		if (!info.enable) {
			// There was a DMA scheduled that got canceled
			return;
		}

		const width = info.width;
		const sourceOffset = GameBoyAdvanceMMU.DMA_OFFSET[info.srcControl] * width;
		const destOffset = GameBoyAdvanceMMU.DMA_OFFSET[info.dstControl] * width;
		const sourceRegion = info.nextSource >>> GameBoyAdvanceMMU.BASE_OFFSET;
		const destRegion = info.nextDest >>> GameBoyAdvanceMMU.BASE_OFFSET;
		const sourceBlock = this.memory[sourceRegion];
		const destBlock = this.memory[destRegion];
		let wordsRemaining = info.nextCount;
		let source = info.nextSource & GameBoyAdvanceMMU.OFFSET_MASK;
		let dest = info.nextDest & GameBoyAdvanceMMU.OFFSET_MASK;
		let sourceView = null;
		let destView = null;
		let sourceMask = 0xffffffff;
		let destMask = 0xffffffff;
		let word;

		if (destBlock.ICACHE_PAGE_BITS) {
			const endPage = (dest + wordsRemaining * width) >> destBlock.ICACHE_PAGE_BITS;
			for (let i = dest >> destBlock.ICACHE_PAGE_BITS; i <= endPage; ++i) {
				destBlock.invalidatePage(i << destBlock.ICACHE_PAGE_BITS);
			}
		}

		if (
			destRegion === GameBoyAdvanceMMU.REGION_WORKING_RAM ||
			destRegion === GameBoyAdvanceMMU.REGION_WORKING_IRAM
		) {
			destView = destBlock.view;
			destMask = destBlock.mask;
		}

		if (
			sourceRegion === GameBoyAdvanceMMU.REGION_WORKING_RAM ||
			sourceRegion === GameBoyAdvanceMMU.REGION_WORKING_IRAM ||
			sourceRegion === GameBoyAdvanceMMU.REGION_CART0 ||
			sourceRegion === GameBoyAdvanceMMU.REGION_CART1
		) {
			sourceView = sourceBlock.view;
			sourceMask = sourceBlock.mask;
		}

		if (sourceBlock && destBlock) {
			if (sourceView && destView) {
				if (width === 4) {
					source &= 0xfffffffc;
					dest &= 0xfffffffc;
					while (wordsRemaining--) {
						word = sourceView.getInt32(source & sourceMask);
						destView.setInt32(dest & destMask, word);
						source += sourceOffset;
						dest += destOffset;
					}
				} else {
					while (wordsRemaining--) {
						word = sourceView.getUint16(source & sourceMask);
						destView.setUint16(dest & destMask, word);
						source += sourceOffset;
						dest += destOffset;
					}
				}
			} else if (sourceView) {
				if (width === 4) {
					source &= 0xfffffffc;
					dest &= 0xfffffffc;
					while (wordsRemaining--) {
						word = sourceView.getInt32(source & sourceMask, true);
						destBlock.store32(dest, word);
						source += sourceOffset;
						dest += destOffset;
					}
				} else {
					while (wordsRemaining--) {
						word = sourceView.getUint16(source & sourceMask, true);
						destBlock.store16(dest, word);
						source += sourceOffset;
						dest += destOffset;
					}
				}
			} else {
				if (width === 4) {
					source &= 0xfffffffc;
					dest &= 0xfffffffc;
					while (wordsRemaining--) {
						word = sourceBlock.load32(source);
						destBlock.store32(dest, word);
						source += sourceOffset;
						dest += destOffset;
					}
				} else {
					while (wordsRemaining--) {
						word = sourceBlock.loadU16(source);
						destBlock.store16(dest, word);
						source += sourceOffset;
						dest += destOffset;
					}
				}
			}
		} else {
			this.core.WARN('Invalid DMA');
		}

		if (info.doIrq) {
			info.nextIRQ = this.cpu.cycles + 2;
			info.nextIRQ +=
				width === 4
					? this.waitstates32[sourceRegion] + this.waitstates32[destRegion]
					: this.waitstates[sourceRegion] + this.waitstates[destRegion];
			info.nextIRQ +=
				(info.count - 1) *
				(width === 4
					? this.waitstatesSeq32[sourceRegion] + this.waitstatesSeq32[destRegion]
					: this.waitstatesSeq[sourceRegion] + this.waitstatesSeq[destRegion]);
		}

		info.nextSource = source | (sourceRegion << GameBoyAdvanceMMU.BASE_OFFSET);
		info.nextDest = dest | (destRegion << GameBoyAdvanceMMU.BASE_OFFSET);
		info.nextCount = wordsRemaining;

		if (!info.repeat) {
			info.enable = false;

			// Clear the enable bit in memory
			const io = this.memory[GameBoyAdvanceMMU.REGION_IO];
			io.registers[GameBoyAdvanceMMU.DMA_REGISTER[dma]] &= 0x7fe0;
		} else {
			info.nextCount = info.count;
			if (info.dstControl === GameBoyAdvanceMMU.DMA_INCREMENT_RELOAD) {
				info.nextDest = info.dest;
			}
			this.scheduleDma(dma, info);
		}
	}

	/**
	 * @param {number} word
	 * @returns {void}
	 */
	adjustTimings(word) {
		const sram = word & 0x0003;
		const ws0 = (word & 0x000c) >> 2;
		const ws0seq = (word & 0x0010) >> 4;
		const ws1 = (word & 0x0060) >> 5;
		const ws1seq = (word & 0x0080) >> 7;
		const ws2 = (word & 0x0300) >> 8;
		const ws2seq = (word & 0x0400) >> 10;
		const prefetch = word & 0x4000;

		this.waitstates[GameBoyAdvanceMMU.REGION_CART_SRAM] = GameBoyAdvanceMMU.ROM_WS[sram];
		this.waitstatesSeq[GameBoyAdvanceMMU.REGION_CART_SRAM] = GameBoyAdvanceMMU.ROM_WS[sram];
		this.waitstates32[GameBoyAdvanceMMU.REGION_CART_SRAM] = GameBoyAdvanceMMU.ROM_WS[sram];
		this.waitstatesSeq32[GameBoyAdvanceMMU.REGION_CART_SRAM] = GameBoyAdvanceMMU.ROM_WS[sram];

		this.waitstates[GameBoyAdvanceMMU.REGION_CART0] = this.waitstates[
			GameBoyAdvanceMMU.REGION_CART0 + 1
		] = GameBoyAdvanceMMU.ROM_WS[ws0];
		this.waitstates[GameBoyAdvanceMMU.REGION_CART1] = this.waitstates[
			GameBoyAdvanceMMU.REGION_CART1 + 1
		] = GameBoyAdvanceMMU.ROM_WS[ws1];
		this.waitstates[GameBoyAdvanceMMU.REGION_CART2] = this.waitstates[
			GameBoyAdvanceMMU.REGION_CART2 + 1
		] = GameBoyAdvanceMMU.ROM_WS[ws2];

		this.waitstatesSeq[GameBoyAdvanceMMU.REGION_CART0] = this.waitstatesSeq[
			GameBoyAdvanceMMU.REGION_CART0 + 1
		] = GameBoyAdvanceMMU.ROM_WS_SEQ[0][ws0seq];
		this.waitstatesSeq[GameBoyAdvanceMMU.REGION_CART1] = this.waitstatesSeq[
			GameBoyAdvanceMMU.REGION_CART1 + 1
		] = GameBoyAdvanceMMU.ROM_WS_SEQ[1][ws1seq];
		this.waitstatesSeq[GameBoyAdvanceMMU.REGION_CART2] = this.waitstatesSeq[
			GameBoyAdvanceMMU.REGION_CART2 + 1
		] = GameBoyAdvanceMMU.ROM_WS_SEQ[2][ws2seq];

		this.waitstates32[GameBoyAdvanceMMU.REGION_CART0] = this.waitstates32[
			GameBoyAdvanceMMU.REGION_CART0 + 1
		] =
			this.waitstates[GameBoyAdvanceMMU.REGION_CART0] +
			1 +
			this.waitstatesSeq[GameBoyAdvanceMMU.REGION_CART0];
		this.waitstates32[GameBoyAdvanceMMU.REGION_CART1] = this.waitstates32[
			GameBoyAdvanceMMU.REGION_CART1 + 1
		] =
			this.waitstates[GameBoyAdvanceMMU.REGION_CART1] +
			1 +
			this.waitstatesSeq[GameBoyAdvanceMMU.REGION_CART1];
		this.waitstates32[GameBoyAdvanceMMU.REGION_CART2] = this.waitstates32[
			GameBoyAdvanceMMU.REGION_CART2 + 1
		] =
			this.waitstates[GameBoyAdvanceMMU.REGION_CART2] +
			1 +
			this.waitstatesSeq[GameBoyAdvanceMMU.REGION_CART2];

		this.waitstatesSeq32[GameBoyAdvanceMMU.REGION_CART0] = this.waitstatesSeq32[
			GameBoyAdvanceMMU.REGION_CART0 + 1
		] = 2 * this.waitstatesSeq[GameBoyAdvanceMMU.REGION_CART0] + 1;
		this.waitstatesSeq32[GameBoyAdvanceMMU.REGION_CART1] = this.waitstatesSeq32[
			GameBoyAdvanceMMU.REGION_CART1 + 1
		] = 2 * this.waitstatesSeq[GameBoyAdvanceMMU.REGION_CART1] + 1;
		this.waitstatesSeq32[GameBoyAdvanceMMU.REGION_CART2] = this.waitstatesSeq32[
			GameBoyAdvanceMMU.REGION_CART2 + 1
		] = 2 * this.waitstatesSeq[GameBoyAdvanceMMU.REGION_CART2] + 1;

		if (prefetch) {
			this.waitstatesPrefetch[GameBoyAdvanceMMU.REGION_CART0] = this.waitstatesPrefetch[
				GameBoyAdvanceMMU.REGION_CART0 + 1
			] = 0;
			this.waitstatesPrefetch[GameBoyAdvanceMMU.REGION_CART1] = this.waitstatesPrefetch[
				GameBoyAdvanceMMU.REGION_CART1 + 1
			] = 0;
			this.waitstatesPrefetch[GameBoyAdvanceMMU.REGION_CART2] = this.waitstatesPrefetch[
				GameBoyAdvanceMMU.REGION_CART2 + 1
			] = 0;

			this.waitstatesPrefetch32[GameBoyAdvanceMMU.REGION_CART0] = this.waitstatesPrefetch32[
				GameBoyAdvanceMMU.REGION_CART0 + 1
			] = 0;
			this.waitstatesPrefetch32[GameBoyAdvanceMMU.REGION_CART1] = this.waitstatesPrefetch32[
				GameBoyAdvanceMMU.REGION_CART1 + 1
			] = 0;
			this.waitstatesPrefetch32[GameBoyAdvanceMMU.REGION_CART2] = this.waitstatesPrefetch32[
				GameBoyAdvanceMMU.REGION_CART2 + 1
			] = 0;
		} else {
			this.waitstatesPrefetch[GameBoyAdvanceMMU.REGION_CART0] = this.waitstatesPrefetch[
				GameBoyAdvanceMMU.REGION_CART0 + 1
			] = this.waitstatesSeq[GameBoyAdvanceMMU.REGION_CART0];
			this.waitstatesPrefetch[GameBoyAdvanceMMU.REGION_CART1] = this.waitstatesPrefetch[
				GameBoyAdvanceMMU.REGION_CART1 + 1
			] = this.waitstatesSeq[GameBoyAdvanceMMU.REGION_CART1];
			this.waitstatesPrefetch[GameBoyAdvanceMMU.REGION_CART2] = this.waitstatesPrefetch[
				GameBoyAdvanceMMU.REGION_CART2 + 1
			] = this.waitstatesSeq[GameBoyAdvanceMMU.REGION_CART2];

			this.waitstatesPrefetch32[GameBoyAdvanceMMU.REGION_CART0] = this.waitstatesPrefetch32[
				GameBoyAdvanceMMU.REGION_CART0 + 1
			] = this.waitstatesSeq32[GameBoyAdvanceMMU.REGION_CART0];
			this.waitstatesPrefetch32[GameBoyAdvanceMMU.REGION_CART1] = this.waitstatesPrefetch32[
				GameBoyAdvanceMMU.REGION_CART1 + 1
			] = this.waitstatesSeq32[GameBoyAdvanceMMU.REGION_CART1];
			this.waitstatesPrefetch32[GameBoyAdvanceMMU.REGION_CART2] = this.waitstatesPrefetch32[
				GameBoyAdvanceMMU.REGION_CART2 + 1
			] = this.waitstatesSeq32[GameBoyAdvanceMMU.REGION_CART2];
		}
	}

	/**
	 * @returns {boolean}
	 */
	saveNeedsFlush() {
		return this.save.writePending;
	}

	/**
	 * @returns {void}
	 */
	flushSave() {
		this.save.writePending = false;
	}

	/**
	 *
	 * @param {ROMView} rom
	 * @returns {GameBoyAdvanceGPIO}
	 */
	allocGPIO(rom) {
		return new GameBoyAdvanceGPIO(this.core, rom);
	}
}
