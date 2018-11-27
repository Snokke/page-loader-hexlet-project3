import loader from '../src';

describe('test', () => {
  it('test', () => {
    const expected = 'test';
    expect(loader('test')).toBe(expected);
  });
});
