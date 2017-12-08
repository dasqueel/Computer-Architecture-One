// Basic CPU
const HALT = 0b00000000; // Halt CPU
const INIT = 0b00000001; // Initialize CPU registers to zero
const SET  = 0b00000010; // SET R(egister)
const SAVE = 0b00000100; // SAVE I(mmediate)
const MUL  = 0b00000101; // multiple two numbers
const ADD  = 0b00000111; // add two numbers
const SUB  = 0b00001000; // sub two numbers
const PRN  = 0b00000110; // print number
const PRA  = 0b00001110; // print number
const INC  = 0b00001111; // increase current register by one


class CPU {
	constructor() {
		this.mem = new Array(256);
		this.mem.fill(0);

		// this.curReg = 0;
		this.reg = new Array(256);
		this.reg.fill(0);

		this.reg.PC = 0;

		this.buildBranchTable();
	}

	buildBranchTable() {
		this.branchTable = {
			[INIT]: this.INIT,
			[SET]: this.SET,
			[SAVE]: this.SAVE,
			[MUL]: this.MUL,
			[ADD]: this.ADD,
			[SUB]: this.SUB,
			[PRN]: this.PRN,
			[PRA]: this.PRA,
			[INC]: this.INC,
			[HALT]: this.HALT
		};
	}

	poke(address, value) {
		this.mem[address] = value;
	}

	/*
	start the clock
	*/

	startClock() {
		this.clock = setInterval(() => { this.tick() }, 100)
	}

	stopClock() {
		clearInterval(this.clock);
	}

	tick() {
		// the cpus memory holds the registers program counter
		const currentInstruction = this.mem[this.reg.PC];
		// console.log(this.reg.PC)
		const handler = this.branchTable[currentInstruction];

		if (handler === undefined) {
			console.error(`error: invalid instruction ${currentInstruction}`)
			this.stopClock();
			return;
		}

		handler.call(this);
	}

	// every cpu methods first code is getting the next instruction in memory
	// e.x. this.mem[this.reg.PC + 1]

	INIT() {
		console.log('INIT')
		this.curReg = 0;

		this.reg.PC++; //go to next instruction
	}

	SET() {
		const reg = this.mem[this.reg.PC + 1];
		console.log('SET ' + reg)

		this.curReg = reg;

		this.reg.PC += 2;
	}

	SAVE() {
		const val = this.mem[this.reg.PC + 1];
		console.log("SAVE " + val);

		// this.reg[this.curReg] = val;
		this.reg[this.curReg] = this.mem[this.reg.PC + 1];

		this.reg.PC += 2;
	}

	MUL() {
		console.log('MUL')
		// console.log(this.reg.slice(0,10))
		let product = this.reg[0] * this.reg[1]

		// store value in register
		this.reg[this.curReg] = product;

		this.reg.PC += 3;
	}

	ADD() {
		console.log('ADD')
		let sum = this.reg[0] + this.reg[1]

		// store value in register
		this.reg[this.curReg] = sum;

		this.reg.PC += 3;
	}

	SUB() {
		console.log('SUB')
		let dif = this.reg[0] - this.reg[1]

		// store value in register
		this.reg[this.curReg] = dif;

		this.reg.PC += 3;
	}

	PRN() {
		console.log(`PRN ${this.reg[this.curReg]}`)

		this.reg.PC++;
	}

	PRA() {
		console.log(this.reg.map(charCode => String.fromCharCode(charCode)).join(''));
		// console.log(this.reg)
		// console.log(`PRA ${String.fromCharCode(this.reg[this.curReg])}`)

		this.reg.PC++;
	}

	INC() {
		this.reg.curReg = this.reg.curReg + 1 & 0xff;
	}

	HALT() {
		this.stopClock();
	}

}

module.exports = CPU;