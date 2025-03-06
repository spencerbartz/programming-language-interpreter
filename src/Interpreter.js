class Interpreter {
    static symbols = [ '>', '<', ',', '.', '+', '-', '[', ']', '#' ];

    constructor(cellSize) {
        this.reset(cellSize);
    }

    reset(cellSize = 30000) {
        this.cells = Array(cellSize).fill(0);
        this.currentCell = 0;
        this.stack = [];
        this.curChar = '';
        this.curCharPos = 0;
        this.currentSrcLine = 0;
        this.inputBuffer = '';
        this.inputPointer = 0;
        this.outputBuffer = '';
    }

    getState() {
        return {
            'cells': this.cells,
            'currentCell': this.currentCell,
            'stack': this.stack,
            'curChar': this.curChar,
            'curCharPos': this.curCharPos,
            'curSrcLine': this.currentSrcLine,
            'inputBuffer': this.inputBuffer,
            'inputPointer': this.inputPointer,
            'outputBuffer': this.outputBuffer,
        };
    }

    getSymbols() {
        return Parser.symbols;
    }

    get output() {
        return this.outputBuffer;
    }

    set output(outputText) {
        this.outputBuffer = outputText;
    }

    interpret(inputBuffer, source) {
        this.reset();
        this.inputBuffer = inputBuffer;
        
        try { 
            this.parse(source); 
        } catch (error) {
            console.error(`${error.name}: ${error.message}`);
        }

        return this.outputBuffer;
    }

    parse(text) {
        for (this.curCharPos = 0; this.curCharPos < text.length; this.curCharPos++) {
            this.curChar = text.charAt(this.curCharPos);

            switch (this.curChar) {
                case '>':
                    this.mvr();
                    break;
                case '<':
                    this.mvl();
                    break;
                case ',': 
                    this.get();
                    break;
                case '.':
                    this.put();
                    break;
                case '+':
                    this.add();
                    break;
                case '-':
                    this.sub();
                    break;
                case '[':
                    this.lbr(text);
                    break;
                case ']':
                    this.rbr();
                    break;
                case '#':
                    this.dbg();
                    break;
                case "\n": 
                    this.currentSrcLine++;
                    break;
                default:
                    break;
            }
        }
    }

    mvr() {
        this.currentCell++;
    }
    
    mvl() {
        this.currentCell--;
    }
    
    get() {
        this.cells[this.currentCell] = this.inputBuffer.charCodeAt(this.inputPointer);
        this.inputPointer++;
    }
    
    put() {
        this.outputBuffer += String.fromCharCode(this.cells[this.currentCell]);
    }
    
    lbr(text) {
        this.stack.push({ lbrace: '[', current: this.curCharPos });
        
        // isolate this block (cut off brackets from the start and end of remaining input)
        let newContext = text.substring(this.curCharPos);
        let matchingRBPos = this.findMatchingBracePos(newContext);        
        let newBlock = newContext.substring(1, matchingRBPos);
        
        let loopCount = 0;
        
        while (this.cells[this.currentCell] > 0) {
            loopCount++;
            this.parse(newBlock);
        }
        
        this.curCharPos = matchingRBPos + (text.length - newContext.length);
    }
    
    rbr() {
        this.stack.pop();
    }
    
    add() {
        this.cells[this.currentCell]++;
    }
    
    sub() {
        this.cells[this.currentCell]--;
    }

    dbg() {
        let dbgMsg = '';
        let state = this.getState();

        for (let key in state) {
            dbgMsg += key + ' - ' + (Array.isArray(state[key]) ? JSON.stringify(state[key].filter(c => c).map(c => c['lbrace'] ?? c)) : state[key]) + " |\n";
        }

        console.log(dbgMsg);
    }

    // start at left brace and find matching right brace position
    findMatchingBracePos(text) {
        let subStack = [];
        let i = 0;

        subStack.push('[');

        while (subStack.length > 0 && i < text.length - 1) {
            i++;
            if (text.charAt(i) === '[') {
                subStack.push('[');
            } else if(text.charAt(i) === ']') {
                subStack.pop();
            }
        }
        
        if (subStack.length > 0) {
            throw new Error('Unmatched brace');
        }
        
        return i;
    }

    getFactors(number) {
        let factors = [];
        
        for (let i = number - 1; i > 0; i--) {
            if (number % i === 0) {
                // i is a factor of number. Find number's next closest factor j such that j * i === number
                for (let j = i - 1; j > 0; j--) {
                    if (number % j === 0 && (j * i === number)) {
                        factors.push([i, j, i - j]);
                    }
                }
            }
        }
        
        // TODO: This is kind of ham fisted. Why not determine the i, j with minimum difference as we're pushing? 
        if (factors.length > 0) {
            let minDiffCell = -1;
            let min = number - 1; // default to difference between factors of a prime number
            for (let i = 0; i < factors.length; i++) {
                if (factors[i][2] < min) {
                    min = factors[i][2];
                    minDiffCell = i;
                }
            }
            
            return [ factors[minDiffCell][0], factors[minDiffCell][1] ];
        } else {
            return [ number, 1 ];                
        }
    }
    
    // Generates a program that prints the given text, interpreted as ascii
    asciiToSrc(asciiText) {
        let srcOutput = '[-]>[-]<\n';
        let lastChar = '\0';
        let codeDiff = 0; //difference in ascii code from last char read
        
        for (let i = 0; i < asciiText.length; i++) {
            codeDiff = asciiText.charCodeAt(i) - lastChar.charCodeAt(0);
            
            if (codeDiff === 0) {
                srcOutput += '>.<\n';
                continue;
            }
            
            let factors = this.getFactors(Math.abs(codeDiff));
        
            // Set loop counter for block
            for (let j = 0; j < factors[0]; j++) {
                srcOutput += '+';
            }
            
            //start loop block
            srcOutput += '[>';
            
            for (let j = 0; j < factors[1]; j++) {
                if (codeDiff > 0) {
                    srcOutput += '+';
                } else if (codeDiff < 0) {
                    srcOutput += '-';
                }
            }
            
            srcOutput += '<-]>.<\n';
            lastChar = asciiText.charAt(i);
        }
        return srcOutput;
    }
}

