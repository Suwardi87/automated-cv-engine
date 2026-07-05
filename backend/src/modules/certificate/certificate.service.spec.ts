import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { Certificate } from './entities/certificate.entity';

describe('CertificateService', () => {
  let service: CertificateService;
  let repo: jest.Mocked<Repository<Certificate>>;

  const mockRepo = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CertificateService,
        { provide: getRepositoryToken(Certificate), useValue: mockRepo },
      ],
    }).compile();

    service = module.get(CertificateService);
    repo = module.get(getRepositoryToken(Certificate));
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll', () => {
    it('should return all certificates for a user', async () => {
      const mockData = [{ id: 1, name: 'AWS' }] as Certificate[];
      repo.find.mockResolvedValue(mockData);

      const result = await service.findAll(1);

      expect(result).toEqual(mockData);
      expect(repo.find).toHaveBeenCalledWith({
        where: { user_id: 1 },
        order: { sort_order: 'ASC' },
      });
    });
  });

  describe('create', () => {
    it('should create and return a new certificate', async () => {
      const dto = { name: 'AWS', issuer: 'Amazon' };
      const created = { id: 1, user_id: 1, ...dto } as Certificate;
      repo.create.mockReturnValue(created);
      repo.save.mockResolvedValue(created);

      const result = await service.create(1, dto);

      expect(result).toEqual(created);
      expect(repo.create).toHaveBeenCalledWith({ user_id: 1, ...dto });
    });
  });

  describe('update', () => {
    it('should update and return the certificate if found', async () => {
      const existing = { id: 1, user_id: 1, name: 'AWS', issuer: 'Amazon' } as Certificate;
      repo.findOneBy.mockResolvedValue(existing);
      repo.save.mockResolvedValue(existing);

      const result = await service.update(1, 1, { issuer: 'AWS' });

      expect(result).toEqual(existing);
    });

    it('should throw NotFoundException if certificate not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.update(99, 1, { issuer: 'AWS' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the certificate if found', async () => {
      const existing = { id: 1, user_id: 1 } as Certificate;
      repo.findOneBy.mockResolvedValue(existing);
      repo.remove.mockResolvedValue(existing);

      await service.remove(1, 1);

      expect(repo.remove).toHaveBeenCalledWith(existing);
    });

    it('should throw NotFoundException if certificate not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.remove(99, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
