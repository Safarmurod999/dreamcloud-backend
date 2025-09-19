// admin.service.impl.spec.ts
import { AdminServiceImpl } from './admin.service.impl';
import { AdminRepository } from '../repository/admin.repository';
import { HttpStatus } from '@nestjs/common';

describe('AdminServiceImpl (unit)', () => {
  let service: AdminServiceImpl;
  let repo: jest.Mocked<AdminRepository>;

  beforeEach(() => {
    repo = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<AdminRepository>;

    service = new AdminServiceImpl(repo);
  });

  // ----------------- findAll -----------------
  it('findAll() should return paginated data', async () => {
    repo.findAndCount.mockResolvedValue([[{ id: 1, username: 'admin' } as any], 1]);

    const result = await service.findAll(1, 10);

    expect(result.status).toBe(HttpStatus.OK);
    expect(result.data).toHaveLength(1);
    expect(result.pagination.totalCount).toBe(1);
  });

  // ----------------- findOne -----------------
  it('findOne() should return admin if found', async () => {
    repo.findOne.mockResolvedValue({ id: 1, username: 'admin' } as any);

    const result = await service.findOne({ username: 'admin' });

    expect(result.status).toBe(HttpStatus.OK);
    expect(result.data[0].username).toBe('admin');
  });

  it('findOne() should return empty if not found', async () => {
    repo.findOne.mockResolvedValue(null);

    const result = await service.findOne({ username: 'notfound' });

    expect(result.status).toBe(HttpStatus.OK);
    expect(result.data).toEqual([]);
    expect(result.message).toBe('No admin found!');
  });

  // ----------------- createAdmin -----------------
  it('createAdmin() should fail if admin exists', async () => {
    repo.findOneBy.mockResolvedValue({ id: 1, username: 'admin' } as any);

    const result = await service.createAdmin({ username: 'admin' });

    expect(result.status).toBe(HttpStatus.BAD_REQUEST);
    expect(result.message).toBe('Admin already exists!');
  });

  it('createAdmin() should create if not exists', async () => {
    repo.findOneBy.mockResolvedValue(null);
    repo.create.mockReturnValue({ id: 2, username: 'newAdmin' } as any);
    repo.save.mockResolvedValue({ id: 2, username: 'newAdmin' } as any);

    const result = await service.createAdmin({
      username: 'newAdmin',
      email: 'test@test.com',
      password: '123',
    });

    expect(result.status).toBe(HttpStatus.CREATED);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  // ----------------- updateAdmin -----------------
  it('updateAdmin() should fail if admin not found', async () => {
    repo.findOneBy.mockResolvedValue(null);

    const result = await service.updateAdmin({ id: 99 }, { username: 'x' } as any, null);

    expect(result.status).toBe(HttpStatus.NOT_FOUND);
    expect(result.message).toBe('Admin not found!');
  });

  it('updateAdmin() should update if found', async () => {
    repo.findOneBy.mockResolvedValue({ id: 1, username: 'admin', email: 'a@test.com' } as any);
    repo.update.mockResolvedValue({ affected: 1 } as any);

    const result = await service.updateAdmin({ id: 1 }, { username: 'updated' } as any, null);

    expect(result.status).toBe(HttpStatus.CREATED);
    expect(result.message).toBe('Admin updated successfully!');
    expect(repo.update).toHaveBeenCalledWith(
      { id: 1 },
      expect.objectContaining({ username: 'updated' }),
    );
  });

  // ----------------- deleteAdmin -----------------
  it('deleteAdmin() should delete and return success', async () => {
    repo.softDelete.mockResolvedValue({
      raw: [{ image: 'test.png' }],
    } as any);

    // unlinkSync ni mock qilish
    jest.spyOn(require('fs'), 'unlinkSync').mockImplementation(() => {});

    const result = await service.deleteAdmin({ id: 1 });

    expect(result.status).toBe(200);
    expect(result.message).toBe('Admin deleted successfully');
    expect(repo.softDelete).toHaveBeenCalledWith(1);
  });
});
