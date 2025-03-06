document.addEventListener('DOMContentLoaded', _ => {
    document.getElementById('input-type').addEventListener('change', (event) => {
        document.getElementById('bf-input').disabled = event.target.checked;
    });

    document.getElementById('run-bf-src').addEventListener('click', (event) => {
        const programInput = document.getElementById('bf-input');
        const sourceCode = document.getElementById('bf-src').value;
        const streamSource = programInput.disabled ? { 'type': 'user' } : { 'type': 'UI', 'value': programInput.value };
        const is = new InputStream(streamSource);
        const bfi = new Interpreter(is);
        document.getElementById('bf-output').value = bfi.interpret(sourceCode);
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