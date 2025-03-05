document.addEventListener('DOMContentLoaded', _ => {
    document.getElementById('run-bf-src').addEventListener('click', (event) => {
        let inputBuffer = document.getElementById('bf-input').value;
        let source = document.getElementById('bf-src').value;
        let bfi = new Interpreter();
        document.getElementById('bf-output').value = bfi.interpret(inputBuffer, source);
    });

    document.getElementById('clear-bf-src').addEventListener('click', (event) => {
        document.getElementById('bf-src').value = '';
    });

    document.getElementById('clear-bf-output').addEventListener('click', (event) => {
        document.getElementById('bf-output').value = '';
    });

    document.getElementById('convert-txt-src').addEventListener('click', (event) => {
        let bfi = new Interpreter();
        document.getElementById('convert-output').value = bfi.asciiToSrc(document.getElementById('txt-src').value);
    });

    document.getElementById('clear-txt-src').addEventListener('click', (event) => {
        document.getElementById('txt-src').value = '';
    });

    document.getElementById('clear-convert-output').addEventListener('click', (event) => {
        document.getElementById('convert-output').value = '';
    });

    document.getElementById('copy-to-interperter').addEventListener('click', (event) => {
        document.getElementById('bf-src').value = document.getElementById('convert-output').value;
        document.getElementById('convert-output').value = '';
    });
});