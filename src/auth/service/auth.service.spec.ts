import { AuthServiceImpl } from './auth.service.impl';
import { HttpStatus } from '@nestjs/common';
import { jwtHelper } from '../../utils/helper';

describe('AuthServiceImpl (unit)', () => {
  let service: AuthServiceImpl;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = {
      findOne: jest.fn(),
    };

    service = new AuthServiceImpl(mockRepo);
  });

  it('login() -> NOT_FOUND bo‘lsa', async () => {
    mockRepo.findOne.mockResolvedValue(null);

    const result = await service.login({ username: 'foo', password: 'bar' });

    expect(result.status).toBe(HttpStatus.NOT_FOUND);
    expect(result.data).toBeNull();
    expect(result.message).toBe('Admin is not found');
  });

  it('login() -> token qaytaradi', async () => {
    const mockAdmin = {
      id: 1,
      username: 'foo',
      password: 'bar',
      isSuperAdmin: true,
    };
    mockRepo.findOne.mockResolvedValue(mockAdmin);

    jest.spyOn(jwtHelper, 'sign').mockReturnValue('mocked_token');

    const result = await service.login({ username: 'foo', password: 'bar' });

    expect(result.status).toBe(HttpStatus.OK);
    expect(result.data.access_token).toBe('mocked_token');
    expect(result.data.username).toBe('foo');
    expect(result.data.isSuperAdmin).toBe(true);
  });
});
