describe('InputStream', function () {
    let is;
    let userSource;
    let uiSource;

    beforeEach(function () {
        userSource = {
            type: 'user'
        };

        uiSource = {
            type: 'UI',
            value: 'abc'
        };
    });

    describe('requestInput()', function () {
        describe('with user as input source', function () {
            it('should prompt user for input', function () {
                is = new InputStream(userSource);

                spyOn(is, 'requestInput').and.callThrough();
                spyOn(window, 'prompt').and.returnValue('x');
                
                expect(is.requestInput()).toEqual('x'.charCodeAt(0));
                expect(window.prompt).toHaveBeenCalledWith('Enter a value');
            });

            it('should prompt user for input and throw an error if empty', function () {
                is = new InputStream(userSource);

                spyOn(is, 'requestInput').and.callThrough();
                spyOn(window, 'prompt');
                
                expect(() => is.requestInput()).toThrow(new Error('Input was empty.'));
                expect(window.prompt).toHaveBeenCalledWith('Enter a value');
            });
        });

        describe('with UI (input field) as source', function () {
            it('should be able to read from inputSource.value', function () {
                is = new InputStream(uiSource);
                expect(is.requestInput()).toEqual('a'.charCodeAt(0));
            });

            it('should be able to read all values from inputSource.value', function () {
                is = new InputStream(uiSource);
                expect(is.requestInput()).toEqual('a'.charCodeAt(0));
                expect(is.requestInput()).toEqual('b'.charCodeAt(0));
                expect(is.requestInput()).toEqual('c'.charCodeAt(0));
            });

            it('should throw an error if end of input has been reached', function () {
                is = new InputStream(uiSource);
                expect(is.requestInput()).toEqual('a'.charCodeAt(0));
                expect(is.requestInput()).toEqual('b'.charCodeAt(0));
                expect(is.requestInput()).toEqual('c'.charCodeAt(0));
                expect(() => is.requestInput()).toThrow(new Error('Input was empty.'));
            });
        });
    });

    describe('getInputPointer()', function () {
        it('should return the current value of the input pointer', function () {
            is = new InputStream(uiSource);
            expect(is.getInputPointer()).toEqual(0);
            expect(is.requestInput()).toEqual('a'.charCodeAt(0));
            expect(is.getInputPointer()).toEqual(1);
        });
    });
});