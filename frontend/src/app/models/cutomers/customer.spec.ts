import { Customer } from './customer';

describe('Customer', () => {
  it('should create an instance', () => {
    expect(new Customer(0, '', '', '', '', true, new Date())).toBeTruthy();
  });
});
