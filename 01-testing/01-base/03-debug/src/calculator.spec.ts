import * as calculator from './calculator';
import * as business from './business/calculator.business';

describe('Calculator tests', () => {
  describe('Calculator tests', () => {
    it('should return 4 when passing A equals 2 and B equals 2', () => {
      // Arrange
      const a = 2;
      const b = 2;

      // Act
      const result = calculator.add(a, b);

      // Assert
      expect(result).toEqual(4);
    });

    it('should call to isLowerThanFive when passing A equals 2 and B equals 2', () => {
      // Arrange
      const a = 2;
      const b = 2;
      const isLowerThanFive = jest
        .spyOn(business, 'isLowerThanFive')
        .mockImplementation((result) =>
          console.log(`This is the result ${result}`)
        );
      // Act
      const result = calculator.add(a, b);

      // Assert
      expect(isLowerThanFive).toHaveBeenCalled();
      expect(isLowerThanFive).toHaveBeenCalledWith(4);
    });
  });
});
