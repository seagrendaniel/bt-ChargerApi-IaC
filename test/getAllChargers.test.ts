import { handler as getAllChargers } from '../lambda/getAllChargers'; // Adjust the import path based on your project structure

describe('getAllChargers Lambda Function', () => {
  it('should return a list of chargers', async () => {
    const event = {} as any; // Mock event object if needed
    const context = {} as any; // Mock Lambda context if needed
    const callback = jest.fn(); // Mock callback function

    // Assume this mocks the expected behavior of the DynamoDB call or any other external dependency
    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify([
        { id: '1', location: 'Location 1' },
        { id: '2', location: 'Location 2' }
      ]),
    };

    // Call the handler with the callback
    const result = await getAllChargers(event, context, callback);
    expect(result).toEqual(expectedResult);
    // If using callback style, you might want to check if callback was called correctly
    expect(callback).toHaveBeenCalledWith(null, expectedResult);
  });

  // Additional tests for error handling or other scenarios
});
