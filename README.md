# Programming Language Interpreter
Parses and interprets a Turing Complete programming language consisting of 8 symbols

The language's machine model consists of the program and instruction pointer, as well as a one-dimensional array of at least 30,000 byte cells initialized to zero; 
a movable data pointer (initialized to point to the leftmost byte of the array); 
and two streams of bytes for input and output (most often connected to a keyboard and a monitor respectively, and using the ASCII character encoding).

The eight language commands each consist of a single character:

| Character | Instruction Performed |
| --- | --- |
| > | Increment the data pointer by one (to point to the next cell to the right) |
| < | Decrement the data pointer by one (to point to the next cell to the left) |
| + | Increment the byte at the data pointer by one |
| -	| Decrement the byte at the data pointer by one |
| . | Output the byte at the data pointer |
| , | Accept one byte of input, storing its value in the byte at the data pointer |
| \[ | If the byte at the data pointer is zero, then instead of moving the instruction pointer forward to the next command, jump it forward to the command after the matching \] command |
| \] | If the byte at the data pointer is nonzero, then instead of moving the instruction pointer forward to the next command, jump it back to the command after the matching \[ command |

\[ and \] match as parentheses usually do: each \[ matches exactly one \] and vice versa, the \[ comes first, and there can be no unmatched \[ or \] between the two.

[More information here](https://w.wiki/STN#Language_design)
