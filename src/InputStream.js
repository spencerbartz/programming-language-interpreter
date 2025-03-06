class InputStream {
    constructor(streamSource) {
        this.streamSource = streamSource;
        this.inputPointer = 0;
    }

    requestInput() {
        let input = undefined;
        if (this.streamSource.type === 'user') {
            input = prompt('Enter a value');
        } else if (this.streamSource.type === 'UI') {
            input = this.streamSource.value.charAt(this.inputPointer);
            this.inputPointer++;
        }

        if (!input) {
            throw new Error('Input was empty.');
        }

        return input.charCodeAt(0);
    }
}