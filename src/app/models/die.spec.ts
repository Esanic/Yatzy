import { Die } from './die';

describe('Die', () => {
  it('should create an instance', () => {
    expect(new Die(0,0,false)).toBeTruthy();
  });
});
