class GameBoyAdvanceIO {
	static DISPCNT = 0x000;
	static GREENSWP = 0x002;
	static DISPSTAT = 0x004;
	static VCOUNT = 0x006;
	static BG0CNT = 0x008;
	static BG1CNT = 0x00a;
	static BG2CNT = 0x00c;
	static BG3CNT = 0x00e;
	static BG0HOFS = 0x010;
	static BG0VOFS = 0x012;
	static BG1HOFS = 0x014;
	static BG1VOFS = 0x016;
	static BG2HOFS = 0x018;
	static BG2VOFS = 0x01a;
	static BG3HOFS = 0x01c;
	static BG3VOFS = 0x01e;
	static BG2PA = 0x020;
	static BG2PB = 0x022;
	static BG2PC = 0x024;
	static BG2PD = 0x026;
	static BG2X_LO = 0x028;
	static BG2X_HI = 0x02a;
	static BG2Y_LO = 0x02c;
	static BG2Y_HI = 0x02e;
	static BG3PA = 0x030;
	static BG3PB = 0x032;
	static BG3PC = 0x034;
	static BG3PD = 0x036;
	static BG3X_LO = 0x038;
	static BG3X_HI = 0x03a;
	static BG3Y_LO = 0x03c;
	static BG3Y_HI = 0x03e;
	static WIN0H = 0x040;
	static WIN1H = 0x042;
	static WIN0V = 0x044;
	static WIN1V = 0x046;
	static WININ = 0x048;
	static WINOUT = 0x04a;
	static MOSAIC = 0x04c;
	static BLDCNT = 0x050;
	static BLDALPHA = 0x052;
	static BLDY = 0x054;

	// Sound
	static SOUND1CNT_LO = 0x060;
	static SOUND1CNT_HI = 0x062;
	static SOUND1CNT_X = 0x064;
	static SOUND2CNT_LO = 0x068;
	static SOUND2CNT_HI = 0x06c;
	static SOUND3CNT_LO = 0x070;
	static SOUND3CNT_HI = 0x072;
	static SOUND3CNT_X = 0x074;
	static SOUND4CNT_LO = 0x078;
	static SOUND4CNT_HI = 0x07c;
	static SOUNDCNT_LO = 0x080;
	static SOUNDCNT_HI = 0x082;
	static SOUNDCNT_X = 0x084;
	static SOUNDBIAS = 0x088;
	static WAVE_RAM0_LO = 0x090;
	static WAVE_RAM0_HI = 0x092;
	static WAVE_RAM1_LO = 0x094;
	static WAVE_RAM1_HI = 0x096;
	static WAVE_RAM2_LO = 0x098;
	static WAVE_RAM2_HI = 0x09a;
	static WAVE_RAM3_LO = 0x09c;
	static WAVE_RAM3_HI = 0x09e;
	static FIFO_A_LO = 0x0a0;
	static FIFO_A_HI = 0x0a2;
	static FIFO_B_LO = 0x0a4;
	static FIFO_B_HI = 0x0a6;

	// DMA
	static DMA0SAD_LO = 0x0b0;
	static DMA0SAD_HI = 0x0b2;
	static DMA0DAD_LO = 0x0b4;
	static DMA0DAD_HI = 0x0b6;
	static DMA0CNT_LO = 0x0b8;
	static DMA0CNT_HI = 0x0ba;
	static DMA1SAD_LO = 0x0bc;
	static DMA1SAD_HI = 0x0be;
	static DMA1DAD_LO = 0x0c0;
	static DMA1DAD_HI = 0x0c2;
	static DMA1CNT_LO = 0x0c4;
	static DMA1CNT_HI = 0x0c6;
	static DMA2SAD_LO = 0x0c8;
	static DMA2SAD_HI = 0x0ca;
	static DMA2DAD_LO = 0x0cc;
	static DMA2DAD_HI = 0x0ce;
	static DMA2CNT_LO = 0x0d0;
	static DMA2CNT_HI = 0x0d2;
	static DMA3SAD_LO = 0x0d4;
	static DMA3SAD_HI = 0x0d6;
	static DMA3DAD_LO = 0x0d8;
	static DMA3DAD_HI = 0x0da;
	static DMA3CNT_LO = 0x0dc;
	static DMA3CNT_HI = 0x0de;

	// Timers
	static TM0CNT_LO = 0x100;
	static TM0CNT_HI = 0x102;
	static TM1CNT_LO = 0x104;
	static TM1CNT_HI = 0x106;
	static TM2CNT_LO = 0x108;
	static TM2CNT_HI = 0x10a;
	static TM3CNT_LO = 0x10c;
	static TM3CNT_HI = 0x10e;

	// SIO (note: some of these are repeated)
	static SIODATA32_LO = 0x120;
	static SIOMULTI0 = 0x120;
	static SIODATA32_HI = 0x122;
	static SIOMULTI1 = 0x122;
	static SIOMULTI2 = 0x124;
	static SIOMULTI3 = 0x126;
	static SIOCNT = 0x128;
	static SIOMLT_SEND = 0x12a;
	static SIODATA8 = 0x12a;
	static RCNT = 0x134;
	static JOYCNT = 0x140;
	static JOY_RECV = 0x150;
	static JOY_TRANS = 0x154;
	static JOYSTAT = 0x158;

	// Keypad
	static KEYINPUT = 0x130;
	static KEYCNT = 0x132;

	// Interrupts, etc
	static IE = 0x200;
	static IF = 0x202;
	static WAITCNT = 0x204;
	static IME = 0x208;

	static POSTFLG = 0x300;
	static HALTCNT = 0x301;

	static DEFAULT_DISPCNT = 0x0080;
	static DEFAULT_SOUNDBIAS = 0x200;
	static DEFAULT_BGPA = 1;
	static DEFAULT_BGPD = 1;
	static DEFAULT_RCNT = 0x8000;
	constructor() {
		// Video
	}
	clear() {
		this.registers = new Uint16Array(GameBoyAdvanceMMU.SIZE_IO);

		this.registers[GameBoyAdvanceIO.DISPCNT >> 1] = GameBoyAdvanceIO.DEFAULT_DISPCNT;
		this.registers[GameBoyAdvanceIO.SOUNDBIAS >> 1] = GameBoyAdvanceIO.DEFAULT_SOUNDBIAS;
		this.registers[GameBoyAdvanceIO.BG2PA >> 1] = GameBoyAdvanceIO.DEFAULT_BGPA;
		this.registers[GameBoyAdvanceIO.BG2PD >> 1] = GameBoyAdvanceIO.DEFAULT_BGPD;
		this.registers[GameBoyAdvanceIO.BG3PA >> 1] = GameBoyAdvanceIO.DEFAULT_BGPA;
		this.registers[GameBoyAdvanceIO.BG3PD >> 1] = GameBoyAdvanceIO.DEFAULT_BGPD;
		this.registers[GameBoyAdvanceIO.RCNT >> 1] = GameBoyAdvanceIO.DEFAULT_RCNT;
	}
	freeze() {
		return {
			registers: Serializer.prefix(this.registers.buffer)
		};
	}
	defrost(frost) {
		this.registers = new Uint16Array(frost.registers);
		// Video registers don't serialize themselves
		for (var i = 0; i <= GameBoyAdvanceIO.BLDY; i += 2) {
			this.store16(i, this.registers[i >> 1]);
		}
	}
	load8(offset) {
		throw 'Unimplmeneted unaligned I/O access';
	}
	load16(offset) {
		return (this.loadU16(offset) << 16) >> 16;
	}
	load32(offset) {
		offset &= 0xfffffffc;
		switch (offset) {
			case GameBoyAdvanceIO.DMA0CNT_LO:
			case GameBoyAdvanceIO.DMA1CNT_LO:
			case GameBoyAdvanceIO.DMA2CNT_LO:
			case GameBoyAdvanceIO.DMA3CNT_LO:
				return this.loadU16(offset | 2) << 16;
			case GameBoyAdvanceIO.IME:
				return this.loadU16(offset) & 0xffff;
			case GameBoyAdvanceIO.JOY_RECV:
			case GameBoyAdvanceIO.JOY_TRANS:
				this.core.STUB('Unimplemented JOY register read: 0x' + offset.toString(16));
				return 0;
		}

		return this.loadU16(offset) | (this.loadU16(offset | 2) << 16);
	}
	loadU8(offset) {
		var odd = offset & 0x0001;
		var value = this.loadU16(offset & 0xfffe);
		return (value >>> (odd << 3)) & 0xff;
	}
	loadU16(offset) {
		switch (offset) {
			case GameBoyAdvanceIO.DISPCNT:
			case GameBoyAdvanceIO.BG0CNT:
			case GameBoyAdvanceIO.BG1CNT:
			case GameBoyAdvanceIO.BG2CNT:
			case GameBoyAdvanceIO.BG3CNT:
			case GameBoyAdvanceIO.WININ:
			case GameBoyAdvanceIO.WINOUT:
			case GameBoyAdvanceIO.SOUND1CNT_LO:
			case GameBoyAdvanceIO.SOUND3CNT_LO:
			case GameBoyAdvanceIO.SOUNDCNT_LO:
			case GameBoyAdvanceIO.SOUNDCNT_HI:
			case GameBoyAdvanceIO.SOUNDBIAS:
			case GameBoyAdvanceIO.BLDCNT:
			case GameBoyAdvanceIO.BLDALPHA:

			case GameBoyAdvanceIO.TM0CNT_HI:
			case GameBoyAdvanceIO.TM1CNT_HI:
			case GameBoyAdvanceIO.TM2CNT_HI:
			case GameBoyAdvanceIO.TM3CNT_HI:
			case GameBoyAdvanceIO.DMA0CNT_HI:
			case GameBoyAdvanceIO.DMA1CNT_HI:
			case GameBoyAdvanceIO.DMA2CNT_HI:
			case GameBoyAdvanceIO.DMA3CNT_HI:
			case GameBoyAdvanceIO.RCNT:
			case GameBoyAdvanceIO.WAITCNT:
			case GameBoyAdvanceIO.IE:
			case GameBoyAdvanceIO.IF:
			case GameBoyAdvanceIO.IME:
			case GameBoyAdvanceIO.POSTFLG:
				// Handled transparently by the written registers
				break;

			// Video
			case GameBoyAdvanceIO.DISPSTAT:
				return this.registers[offset >> 1] | this.video.readDisplayStat();
			case GameBoyAdvanceIO.VCOUNT:
				return this.video.vcount;

			// Sound
			case GameBoyAdvanceIO.SOUND1CNT_HI:
			case GameBoyAdvanceIO.SOUND2CNT_LO:
				return this.registers[offset >> 1] & 0xffc0;
			case GameBoyAdvanceIO.SOUND1CNT_X:
			case GameBoyAdvanceIO.SOUND2CNT_HI:
			case GameBoyAdvanceIO.SOUND3CNT_X:
				return this.registers[offset >> 1] & 0x4000;
			case GameBoyAdvanceIO.SOUND3CNT_HI:
				return this.registers[offset >> 1] & 0xe000;
			case GameBoyAdvanceIO.SOUND4CNT_LO:
				return this.registers[offset >> 1] & 0xff00;
			case GameBoyAdvanceIO.SOUND4CNT_HI:
				return this.registers[offset >> 1] & 0x40ff;
			case GameBoyAdvanceIO.SOUNDCNT_X:
				this.core.STUB('Unimplemented sound register read: SOUNDCNT_X');
				return this.registers[offset >> 1] | 0x0000;

			// Timers
			case GameBoyAdvanceIO.TM0CNT_LO:
				return this.cpu.irq.timerRead(0);
			case GameBoyAdvanceIO.TM1CNT_LO:
				return this.cpu.irq.timerRead(1);
			case GameBoyAdvanceIO.TM2CNT_LO:
				return this.cpu.irq.timerRead(2);
			case GameBoyAdvanceIO.TM3CNT_LO:
				return this.cpu.irq.timerRead(3);

			// SIO
			case GameBoyAdvanceIO.SIOCNT:
				return this.sio.readSIOCNT();

			case GameBoyAdvanceIO.KEYINPUT:
				this.keypad.pollGamepads();
				return this.keypad.currentDown;
			case GameBoyAdvanceIO.KEYCNT:
				this.core.STUB('Unimplemented I/O register read: KEYCNT');
				return 0;

			case GameBoyAdvanceIO.BG0HOFS:
			case GameBoyAdvanceIO.BG0VOFS:
			case GameBoyAdvanceIO.BG1HOFS:
			case GameBoyAdvanceIO.BG1VOFS:
			case GameBoyAdvanceIO.BG2HOFS:
			case GameBoyAdvanceIO.BG2VOFS:
			case GameBoyAdvanceIO.BG3HOFS:
			case GameBoyAdvanceIO.BG3VOFS:
			case GameBoyAdvanceIO.BG2PA:
			case GameBoyAdvanceIO.BG2PB:
			case GameBoyAdvanceIO.BG2PC:
			case GameBoyAdvanceIO.BG2PD:
			case GameBoyAdvanceIO.BG3PA:
			case GameBoyAdvanceIO.BG3PB:
			case GameBoyAdvanceIO.BG3PC:
			case GameBoyAdvanceIO.BG3PD:
			case GameBoyAdvanceIO.BG2X_LO:
			case GameBoyAdvanceIO.BG2X_HI:
			case GameBoyAdvanceIO.BG2Y_LO:
			case GameBoyAdvanceIO.BG2Y_HI:
			case GameBoyAdvanceIO.BG3X_LO:
			case GameBoyAdvanceIO.BG3X_HI:
			case GameBoyAdvanceIO.BG3Y_LO:
			case GameBoyAdvanceIO.BG3Y_HI:
			case GameBoyAdvanceIO.WIN0H:
			case GameBoyAdvanceIO.WIN1H:
			case GameBoyAdvanceIO.WIN0V:
			case GameBoyAdvanceIO.WIN1V:
			case GameBoyAdvanceIO.BLDY:
			case GameBoyAdvanceIO.DMA0SAD_LO:
			case GameBoyAdvanceIO.DMA0SAD_HI:
			case GameBoyAdvanceIO.DMA0DAD_LO:
			case GameBoyAdvanceIO.DMA0DAD_HI:
			case GameBoyAdvanceIO.DMA0CNT_LO:
			case GameBoyAdvanceIO.DMA1SAD_LO:
			case GameBoyAdvanceIO.DMA1SAD_HI:
			case GameBoyAdvanceIO.DMA1DAD_LO:
			case GameBoyAdvanceIO.DMA1DAD_HI:
			case GameBoyAdvanceIO.DMA1CNT_LO:
			case GameBoyAdvanceIO.DMA2SAD_LO:
			case GameBoyAdvanceIO.DMA2SAD_HI:
			case GameBoyAdvanceIO.DMA2DAD_LO:
			case GameBoyAdvanceIO.DMA2DAD_HI:
			case GameBoyAdvanceIO.DMA2CNT_LO:
			case GameBoyAdvanceIO.DMA3SAD_LO:
			case GameBoyAdvanceIO.DMA3SAD_HI:
			case GameBoyAdvanceIO.DMA3DAD_LO:
			case GameBoyAdvanceIO.DMA3DAD_HI:
			case GameBoyAdvanceIO.DMA3CNT_LO:
			case GameBoyAdvanceIO.FIFO_A_LO:
			case GameBoyAdvanceIO.FIFO_A_HI:
			case GameBoyAdvanceIO.FIFO_B_LO:
			case GameBoyAdvanceIO.FIFO_B_HI:
				this.core.WARN('Read for write-only register: 0x' + offset.toString(16));
				return this.core.mmu.badMemory.loadU16(0);

			case GameBoyAdvanceIO.MOSAIC:
				this.core.WARN('Read for write-only register: 0x' + offset.toString(16));
				return 0;

			case GameBoyAdvanceIO.SIOMULTI0:
			case GameBoyAdvanceIO.SIOMULTI1:
			case GameBoyAdvanceIO.SIOMULTI2:
			case GameBoyAdvanceIO.SIOMULTI3:
				return this.sio.read((offset - GameBoyAdvanceIO.SIOMULTI0) >> 1);

			case GameBoyAdvanceIO.SIODATA8:
				this.core.STUB('Unimplemented SIO register read: 0x' + offset.toString(16));
				return 0;
			case GameBoyAdvanceIO.JOYCNT:
			case GameBoyAdvanceIO.JOYSTAT:
				this.core.STUB('Unimplemented JOY register read: 0x' + offset.toString(16));
				return 0;

			default:
				this.core.WARN('Bad I/O register read: 0x' + offset.toString(16));
				return this.core.mmu.badMemory.loadU16(0);
		}
		return this.registers[offset >> 1];
	}
	store8(offset, value) {
		switch (offset) {
			case GameBoyAdvanceIO.WININ:
				this.value & 0x3f;
				break;
			case GameBoyAdvanceIO.WININ | 1:
				this.value & 0x3f;
				break;
			case GameBoyAdvanceIO.WINOUT:
				this.value & 0x3f;
				break;
			case GameBoyAdvanceIO.WINOUT | 1:
				this.value & 0x3f;
				break;
			case GameBoyAdvanceIO.SOUND1CNT_LO:
			case GameBoyAdvanceIO.SOUND1CNT_LO | 1:
			case GameBoyAdvanceIO.SOUND1CNT_HI:
			case GameBoyAdvanceIO.SOUND1CNT_HI | 1:
			case GameBoyAdvanceIO.SOUND1CNT_X:
			case GameBoyAdvanceIO.SOUND1CNT_X | 1:
			case GameBoyAdvanceIO.SOUND2CNT_LO:
			case GameBoyAdvanceIO.SOUND2CNT_LO | 1:
			case GameBoyAdvanceIO.SOUND2CNT_HI:
			case GameBoyAdvanceIO.SOUND2CNT_HI | 1:
			case GameBoyAdvanceIO.SOUND3CNT_LO:
			case GameBoyAdvanceIO.SOUND3CNT_LO | 1:
			case GameBoyAdvanceIO.SOUND3CNT_HI:
			case GameBoyAdvanceIO.SOUND3CNT_HI | 1:
			case GameBoyAdvanceIO.SOUND3CNT_X:
			case GameBoyAdvanceIO.SOUND3CNT_X | 1:
			case GameBoyAdvanceIO.SOUND4CNT_LO:
			case GameBoyAdvanceIO.SOUND4CNT_LO | 1:
			case GameBoyAdvanceIO.SOUND4CNT_HI:
			case GameBoyAdvanceIO.SOUND4CNT_HI | 1:
			case GameBoyAdvanceIO.SOUNDCNT_LO:
			case GameBoyAdvanceIO.SOUNDCNT_LO | 1:
			case GameBoyAdvanceIO.SOUNDCNT_X:
			case GameBoyAdvanceIO.IF:
			case GameBoyAdvanceIO.IME:
				break;
			case GameBoyAdvanceIO.SOUNDBIAS | 1:
				this.STUB_REG('sound', offset);
				break;
			case GameBoyAdvanceIO.HALTCNT:
				value &= 0x80;
				if (!value) {
					this.core.irq.halt();
				} else {
					this.core.STUB('Stop');
				}
				return;
			default:
				this.STUB_REG('8-bit I/O', offset);
				break;
		}

		if (offset & 1) {
			value <<= 8;
			value |= this.registers[offset >> 1] & 0x00ff;
		} else {
			value &= 0x00ff;
			value |= this.registers[offset >> 1] & 0xff00;
		}
		this.store16(offset & 0xffffffe, value);
	}
	store16(offset, value) {
		switch (offset) {
			// Video
			case GameBoyAdvanceIO.DISPCNT:
				this.video.renderPath.writeDisplayControl(value);
				break;
			case GameBoyAdvanceIO.DISPSTAT:
				value &= this.video.DISPSTAT_MASK;
				this.video.writeDisplayStat(value);
				break;
			case GameBoyAdvanceIO.BG0CNT:
				this.video.renderPath.writeBackgroundControl(0, value);
				break;
			case GameBoyAdvanceIO.BG1CNT:
				this.video.renderPath.writeBackgroundControl(1, value);
				break;
			case GameBoyAdvanceIO.BG2CNT:
				this.video.renderPath.writeBackgroundControl(2, value);
				break;
			case GameBoyAdvanceIO.BG3CNT:
				this.video.renderPath.writeBackgroundControl(3, value);
				break;
			case GameBoyAdvanceIO.BG0HOFS:
				this.video.renderPath.writeBackgroundHOffset(0, value);
				break;
			case GameBoyAdvanceIO.BG0VOFS:
				this.video.renderPath.writeBackgroundVOffset(0, value);
				break;
			case GameBoyAdvanceIO.BG1HOFS:
				this.video.renderPath.writeBackgroundHOffset(1, value);
				break;
			case GameBoyAdvanceIO.BG1VOFS:
				this.video.renderPath.writeBackgroundVOffset(1, value);
				break;
			case GameBoyAdvanceIO.BG2HOFS:
				this.video.renderPath.writeBackgroundHOffset(2, value);
				break;
			case GameBoyAdvanceIO.BG2VOFS:
				this.video.renderPath.writeBackgroundVOffset(2, value);
				break;
			case GameBoyAdvanceIO.BG3HOFS:
				this.video.renderPath.writeBackgroundHOffset(3, value);
				break;
			case GameBoyAdvanceIO.BG3VOFS:
				this.video.renderPath.writeBackgroundVOffset(3, value);
				break;
			case GameBoyAdvanceIO.BG2X_LO:
				this.video.renderPath.writeBackgroundRefX(
					2,
					(this.registers[(offset >> 1) | 1] << 16) | value
				);
				break;
			case GameBoyAdvanceIO.BG2X_HI:
				this.video.renderPath.writeBackgroundRefX(
					2,
					this.registers[(offset >> 1) ^ 1] | (value << 16)
				);
				break;
			case GameBoyAdvanceIO.BG2Y_LO:
				this.video.renderPath.writeBackgroundRefY(
					2,
					(this.registers[(offset >> 1) | 1] << 16) | value
				);
				break;
			case GameBoyAdvanceIO.BG2Y_HI:
				this.video.renderPath.writeBackgroundRefY(
					2,
					this.registers[(offset >> 1) ^ 1] | (value << 16)
				);
				break;
			case GameBoyAdvanceIO.BG2PA:
				this.video.renderPath.writeBackgroundParamA(2, value);
				break;
			case GameBoyAdvanceIO.BG2PB:
				this.video.renderPath.writeBackgroundParamB(2, value);
				break;
			case GameBoyAdvanceIO.BG2PC:
				this.video.renderPath.writeBackgroundParamC(2, value);
				break;
			case GameBoyAdvanceIO.BG2PD:
				this.video.renderPath.writeBackgroundParamD(2, value);
				break;
			case GameBoyAdvanceIO.BG3X_LO:
				this.video.renderPath.writeBackgroundRefX(
					3,
					(this.registers[(offset >> 1) | 1] << 16) | value
				);
				break;
			case GameBoyAdvanceIO.BG3X_HI:
				this.video.renderPath.writeBackgroundRefX(
					3,
					this.registers[(offset >> 1) ^ 1] | (value << 16)
				);
				break;
			case GameBoyAdvanceIO.BG3Y_LO:
				this.video.renderPath.writeBackgroundRefY(
					3,
					(this.registers[(offset >> 1) | 1] << 16) | value
				);
				break;
			case GameBoyAdvanceIO.BG3Y_HI:
				this.video.renderPath.writeBackgroundRefY(
					3,
					this.registers[(offset >> 1) ^ 1] | (value << 16)
				);
				break;
			case GameBoyAdvanceIO.BG3PA:
				this.video.renderPath.writeBackgroundParamA(3, value);
				break;
			case GameBoyAdvanceIO.BG3PB:
				this.video.renderPath.writeBackgroundParamB(3, value);
				break;
			case GameBoyAdvanceIO.BG3PC:
				this.video.renderPath.writeBackgroundParamC(3, value);
				break;
			case GameBoyAdvanceIO.BG3PD:
				this.video.renderPath.writeBackgroundParamD(3, value);
				break;
			case GameBoyAdvanceIO.WIN0H:
				this.video.renderPath.writeWin0H(value);
				break;
			case GameBoyAdvanceIO.WIN1H:
				this.video.renderPath.writeWin1H(value);
				break;
			case GameBoyAdvanceIO.WIN0V:
				this.video.renderPath.writeWin0V(value);
				break;
			case GameBoyAdvanceIO.WIN1V:
				this.video.renderPath.writeWin1V(value);
				break;
			case GameBoyAdvanceIO.WININ:
				value &= 0x3f3f;
				this.video.renderPath.writeWinIn(value);
				break;
			case GameBoyAdvanceIO.WINOUT:
				value &= 0x3f3f;
				this.video.renderPath.writeWinOut(value);
				break;
			case GameBoyAdvanceIO.BLDCNT:
				value &= 0x7fff;
				this.video.renderPath.writeBlendControl(value);
				break;
			case GameBoyAdvanceIO.BLDALPHA:
				value &= 0x1f1f;
				this.video.renderPath.writeBlendAlpha(value);
				break;
			case GameBoyAdvanceIO.BLDY:
				value &= 0x001f;
				this.video.renderPath.writeBlendY(value);
				break;
			case GameBoyAdvanceIO.MOSAIC:
				this.video.renderPath.writeMosaic(value);
				break;

			// Sound
			case GameBoyAdvanceIO.SOUND1CNT_LO:
				value &= 0x007f;
				this.audio.writeSquareChannelSweep(0, value);
				break;
			case GameBoyAdvanceIO.SOUND1CNT_HI:
				this.audio.writeSquareChannelDLE(0, value);
				break;
			case GameBoyAdvanceIO.SOUND1CNT_X:
				value &= 0xc7ff;
				this.audio.writeSquareChannelFC(0, value);
				value &= ~0x8000;
				break;
			case GameBoyAdvanceIO.SOUND2CNT_LO:
				this.audio.writeSquareChannelDLE(1, value);
				break;
			case GameBoyAdvanceIO.SOUND2CNT_HI:
				value &= 0xc7ff;
				this.audio.writeSquareChannelFC(1, value);
				value &= ~0x8000;
				break;
			case GameBoyAdvanceIO.SOUND3CNT_LO:
				value &= 0x00e0;
				this.audio.writeChannel3Lo(value);
				break;
			case GameBoyAdvanceIO.SOUND3CNT_HI:
				value &= 0xe0ff;
				this.audio.writeChannel3Hi(value);
				break;
			case GameBoyAdvanceIO.SOUND3CNT_X:
				value &= 0xc7ff;
				this.audio.writeChannel3X(value);
				value &= ~0x8000;
				break;
			case GameBoyAdvanceIO.SOUND4CNT_LO:
				value &= 0xff3f;
				this.audio.writeChannel4LE(value);
				break;
			case GameBoyAdvanceIO.SOUND4CNT_HI:
				value &= 0xc0ff;
				this.audio.writeChannel4FC(value);
				value &= ~0x8000;
				break;
			case GameBoyAdvanceIO.SOUNDCNT_LO:
				value &= 0xff77;
				this.audio.writeSoundControlLo(value);
				break;
			case GameBoyAdvanceIO.SOUNDCNT_HI:
				value &= 0xff0f;
				this.audio.writeSoundControlHi(value);
				break;
			case GameBoyAdvanceIO.SOUNDCNT_X:
				value &= 0x0080;
				this.audio.writeEnable(value);
				break;
			case GameBoyAdvanceIO.WAVE_RAM0_LO:
			case GameBoyAdvanceIO.WAVE_RAM0_HI:
			case GameBoyAdvanceIO.WAVE_RAM1_LO:
			case GameBoyAdvanceIO.WAVE_RAM1_HI:
			case GameBoyAdvanceIO.WAVE_RAM2_LO:
			case GameBoyAdvanceIO.WAVE_RAM2_HI:
			case GameBoyAdvanceIO.WAVE_RAM3_LO:
			case GameBoyAdvanceIO.WAVE_RAM3_HI:
				this.audio.writeWaveData(offset - GameBoyAdvanceIO.WAVE_RAM0_LO, value, 2);
				break;

			// DMA
			case GameBoyAdvanceIO.DMA0SAD_LO:
			case GameBoyAdvanceIO.DMA0DAD_LO:
			case GameBoyAdvanceIO.DMA1SAD_LO:
			case GameBoyAdvanceIO.DMA1DAD_LO:
			case GameBoyAdvanceIO.DMA2SAD_LO:
			case GameBoyAdvanceIO.DMA2DAD_LO:
			case GameBoyAdvanceIO.DMA3SAD_LO:
			case GameBoyAdvanceIO.DMA3DAD_LO:
				this.store32(offset, (this.registers[(offset >> 1) + 1] << 16) | value);
				return;

			case GameBoyAdvanceIO.DMA0SAD_HI:
			case GameBoyAdvanceIO.DMA0DAD_HI:
			case GameBoyAdvanceIO.DMA1SAD_HI:
			case GameBoyAdvanceIO.DMA1DAD_HI:
			case GameBoyAdvanceIO.DMA2SAD_HI:
			case GameBoyAdvanceIO.DMA2DAD_HI:
			case GameBoyAdvanceIO.DMA3SAD_HI:
			case GameBoyAdvanceIO.DMA3DAD_HI:
				this.store32(offset - 2, this.registers[(offset >> 1) - 1] | (value << 16));
				return;

			case GameBoyAdvanceIO.DMA0CNT_LO:
				this.cpu.irq.dmaSetWordCount(0, value);
				break;
			case GameBoyAdvanceIO.DMA0CNT_HI:
				// The DMA registers need to set the values before writing the control, as writing the
				// control can synchronously trigger a DMA transfer
				this.registers[offset >> 1] = value & 0xffe0;
				this.cpu.irq.dmaWriteControl(0, value);
				return;
			case GameBoyAdvanceIO.DMA1CNT_LO:
				this.cpu.irq.dmaSetWordCount(1, value);
				break;
			case GameBoyAdvanceIO.DMA1CNT_HI:
				this.registers[offset >> 1] = value & 0xffe0;
				this.cpu.irq.dmaWriteControl(1, value);
				return;
			case GameBoyAdvanceIO.DMA2CNT_LO:
				this.cpu.irq.dmaSetWordCount(2, value);
				break;
			case GameBoyAdvanceIO.DMA2CNT_HI:
				this.registers[offset >> 1] = value & 0xffe0;
				this.cpu.irq.dmaWriteControl(2, value);
				return;
			case GameBoyAdvanceIO.DMA3CNT_LO:
				this.cpu.irq.dmaSetWordCount(3, value);
				break;
			case GameBoyAdvanceIO.DMA3CNT_HI:
				this.registers[offset >> 1] = value & 0xffe0;
				this.cpu.irq.dmaWriteControl(3, value);
				return;

			// Timers
			case GameBoyAdvanceIO.TM0CNT_LO:
				this.cpu.irq.timerSetReload(0, value);
				return;
			case GameBoyAdvanceIO.TM1CNT_LO:
				this.cpu.irq.timerSetReload(1, value);
				return;
			case GameBoyAdvanceIO.TM2CNT_LO:
				this.cpu.irq.timerSetReload(2, value);
				return;
			case GameBoyAdvanceIO.TM3CNT_LO:
				this.cpu.irq.timerSetReload(3, value);
				return;

			case GameBoyAdvanceIO.TM0CNT_HI:
				value &= 0x00c7;
				this.cpu.irq.timerWriteControl(0, value);
				break;
			case GameBoyAdvanceIO.TM1CNT_HI:
				value &= 0x00c7;
				this.cpu.irq.timerWriteControl(1, value);
				break;
			case GameBoyAdvanceIO.TM2CNT_HI:
				value &= 0x00c7;
				this.cpu.irq.timerWriteControl(2, value);
				break;
			case GameBoyAdvanceIO.TM3CNT_HI:
				value &= 0x00c7;
				this.cpu.irq.timerWriteControl(3, value);
				break;

			// SIO
			case GameBoyAdvanceIO.SIOMULTI0:
			case GameBoyAdvanceIO.SIOMULTI1:
			case GameBoyAdvanceIO.SIOMULTI2:
			case GameBoyAdvanceIO.SIOMULTI3:
			case GameBoyAdvanceIO.SIODATA8:
				this.STUB_REG('SIO', offset);
				break;
			case GameBoyAdvanceIO.RCNT:
				this.sio.setMode(
					((value >> 12) & 0xc) |
						((this.registers[GameBoyAdvanceIO.SIOCNT >> 1] >> 12) & 0x3)
				);
				this.sio.writeRCNT(value);
				break;
			case GameBoyAdvanceIO.SIOCNT:
				this.sio.setMode(
					((value >> 12) & 0x3) |
						((this.registers[GameBoyAdvanceIO.RCNT >> 1] >> 12) & 0xc)
				);
				this.sio.writeSIOCNT(value);
				return;
			case GameBoyAdvanceIO.JOYCNT:
			case GameBoyAdvanceIO.JOYSTAT:
				this.STUB_REG('JOY', offset);
				break;

			// Misc
			case GameBoyAdvanceIO.IE:
				value &= 0x3fff;
				this.cpu.irq.setInterruptsEnabled(value);
				break;
			case GameBoyAdvanceIO.IF:
				this.cpu.irq.dismissIRQs(value);
				return;
			case GameBoyAdvanceIO.WAITCNT:
				value &= 0xdfff;
				this.cpu.mmu.adjustTimings(value);
				break;
			case GameBoyAdvanceIO.IME:
				value &= 0x0001;
				this.cpu.irq.masterEnable(value);
				break;
			default:
				this.STUB_REG('I/O', offset);
		}
		this.registers[offset >> 1] = value;
	}
	store32(offset, value) {
		switch (offset) {
			case GameBoyAdvanceIO.BG2X_LO:
				value &= 0x0fffffff;
				this.video.renderPath.writeBackgroundRefX(2, value);
				break;
			case GameBoyAdvanceIO.BG2Y_LO:
				value &= 0x0fffffff;
				this.video.renderPath.writeBackgroundRefY(2, value);
				break;
			case GameBoyAdvanceIO.BG3X_LO:
				value &= 0x0fffffff;
				this.video.renderPath.writeBackgroundRefX(3, value);
				break;
			case GameBoyAdvanceIO.BG3Y_LO:
				value &= 0x0fffffff;
				this.video.renderPath.writeBackgroundRefY(3, value);
				break;
			case GameBoyAdvanceIO.DMA0SAD_LO:
				this.cpu.irq.dmaSetSourceAddress(0, value);
				break;
			case GameBoyAdvanceIO.DMA0DAD_LO:
				this.cpu.irq.dmaSetDestAddress(0, value);
				break;
			case GameBoyAdvanceIO.DMA1SAD_LO:
				this.cpu.irq.dmaSetSourceAddress(1, value);
				break;
			case GameBoyAdvanceIO.DMA1DAD_LO:
				this.cpu.irq.dmaSetDestAddress(1, value);
				break;
			case GameBoyAdvanceIO.DMA2SAD_LO:
				this.cpu.irq.dmaSetSourceAddress(2, value);
				break;
			case GameBoyAdvanceIO.DMA2DAD_LO:
				this.cpu.irq.dmaSetDestAddress(2, value);
				break;
			case GameBoyAdvanceIO.DMA3SAD_LO:
				this.cpu.irq.dmaSetSourceAddress(3, value);
				break;
			case GameBoyAdvanceIO.DMA3DAD_LO:
				this.cpu.irq.dmaSetDestAddress(3, value);
				break;
			case GameBoyAdvanceIO.FIFO_A_LO:
				this.audio.appendToFifoA(value);
				return;
			case GameBoyAdvanceIO.FIFO_B_LO:
				this.audio.appendToFifoB(value);
				return;

			// High bits of this write should be ignored
			case GameBoyAdvanceIO.IME:
				this.store16(offset, value & 0xffff);
				return;
			case GameBoyAdvanceIO.JOY_RECV:
			case GameBoyAdvanceIO.JOY_TRANS:
				this.STUB_REG('JOY', offset);
				return;
			default:
				this.store16(offset, value & 0xffff);
				this.store16(offset | 2, value >>> 16);
				return;
		}

		this.registers[offset >> 1] = value & 0xffff;
		this.registers[(offset >> 1) + 1] = value >>> 16;
	}
	invalidatePage(address) {}

	/**
	 * @param type
	 * @param offset
	 * @todo find out what this does and rename to lower case.
	 */
	STUB_REG(type, offset) {
		this.core.STUB('Unimplemented ' + type + ' register write: ' + offset.toString(16));
	}
}
