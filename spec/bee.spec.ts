/// <reference path="../node_modules/@types/jasmine/index.d.ts" />
/// <reference path="../dist/beehive.d.ts" />

describe('bee', () => {
    it('true should be true', () => {
        expect(true).toBe(true);
    });

    it('shoud be defined', () => {
        expect(bee).toBeDefined();
    });

    it('should return string', () => {
        expect(bee()).toBe('test');
    })
});
