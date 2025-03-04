class Parser {
    static bfSymbols = [ '>', '<', ',', '.', '+', '-', '[', ']', '#' ];

    constructor(bufferSize = 30000) {
        this.reset(bufferSize);
    }

    reset(bufferSize) {
        this.cells = Array(bufferSize).fill(0);
        this.currentCell = 0;
        this.stack = [];
        this.curChar = '';
        this.curCharPos = 0;
        this.inputText = '';
        this.curInputLine = 0;
        this.outputBuffer = '';
    }

    getBfSymbols() {
        return Parser.bfSymbols;
    }

    get output() {
        return this.outputBuffer;
    }

    set output(outputText) {
        this.outputBuffer = outputText;
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
                    break
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
                    this.curInputLine++;
                    break;
                default:
                    break;
            }

        }
        return this.outputBuffer;
    }

    mvr() {
        this.currentCell++;
    }
    
    mvl() {
        this.currentCell--;
    }
    
    get(character) {
        this.cells[currentCell] = character.charCodeAt(0);
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
        
        while(this.cells[this.currentCell] > 0) {
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
            throw 'Unmatched brace';
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
        let bfOutput = '[-]>[-]<\n';
        let lastChar = '\0';
        let codeDiff = 0; //difference in ascii code from last char read
        
        for (let i = 0; i < asciiText.length; i++) {
            codeDiff = asciiText.charCodeAt(i) - lastChar.charCodeAt(0);
            
            if (codeDiff === 0) {
                bfOutput += '>.<\n';
                continue;
            }
            
            let factors = this.getFactors(Math.abs(codeDiff));
        
            // Set loop counter for block
            for (let j = 0; j < factors[0]; j++) {
                bfOutput += '+';
            }
            
            //start loop block
            bfOutput += '[>';
            
            for (let j = 0; j < factors[1]; j++) {
                if (codeDiff > 0) {
                    bfOutput += '+';
                } else if (codeDiff < 0) {
                    bfOutput += '-';
                }
            }
            
            bfOutput += '<-]>.<\n';
            lastChar = asciiText.charAt(i);
        }
        return bfOutput;
    }
}

document.addEventListener('DOMContentLoaded', _ => {
    document.getElementById('run-bf-src').addEventListener('click', (event) => {
        let p = new Parser();
        document.getElementById('bf-output').value = p.parse(document.getElementById('bf-src').value);
    });

    document.getElementById('clear-bf-output').addEventListener('click', (event) => {
        document.getElementById('bf-output').value = '';
    });

    document.getElementById('convert-txt-src').addEventListener('click', (event) => {
        let p = new Parser();
        document.getElementById('convert-output').value = p.asciiToSrc(document.getElementById('txt-src').value);
    });

    document.getElementById('clear-convert-output').addEventListener('click', (event) => {
        document.getElementById('convert-output').value = '';
    });

    document.getElementById('copy-to-interperter').addEventListener('click', (event) => {
        document.getElementById('bf-src').value = document.getElementById('convert-output').value;
        document.getElementById('convert-output').value = '';
    });
});
