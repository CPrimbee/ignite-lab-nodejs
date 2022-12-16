import { Content } from '../../../src/application/entities/content';

describe('Notification content', () => {
  it('should be able to create a notification content', () => {
    const content = new Content('Você recebeu uma solicitação de amizade');

    expect(content).toBeTruthy();
  });

  it('should not be able to create a notification with less then 5 characters', () => {
    expect(() => new Content('aaa')).toThrow();
  });

  it('should not be able to create a notification with more than 240 characters', () => {
    expect(() => new Content('a'.repeat(241))).toThrow();
  });
});
