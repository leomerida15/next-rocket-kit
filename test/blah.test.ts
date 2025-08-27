import { createRocket } from '../v1';

describe('blah', () => {
    it('works', () => {
        const rocket = createRocket();
        expect(Boolean(typeof rocket === 'object')).toBe(true);
    });
});
