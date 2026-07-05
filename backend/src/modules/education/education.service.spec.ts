import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { EducationService } from './education.service';
import { Education } from './entities/education.entity';

describe('EducationService', () => {
  let service: EducationService;
  let repo: jest.Mocked<Repository<Education>>;

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
        EducationService,
        { provide: getRepositoryToken(Education), useValue: mockRepo },
      ],
    }).compile();

    service = module.get(EducationService);
    repo = module.get(getRepositoryToken(Education));
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll', () => {
    it('should return all education records for a user', async () => {
      const mockData = [{ id: 1, institution: 'UI' }, { id: 2, institution: 'ITB' }] as Education[];
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
    it('should create and return a new education record', async () => {
      const dto = { institution: 'UI', degree: 'S1' };
      const created = { id: 1, user_id: 1, ...dto } as Education;
      repo.create.mockReturnValue(created);
      repo.save.mockResolvedValue(created);

      const result = await service.create(1, dto);

      expect(result).toEqual(created);
      expect(repo.create).toHaveBeenCalledWith({ ...dto, user_id: 1 });
      expect(repo.save).toHaveBeenCalledWith(created);
    });
  });

  describe('update', () => {
    it('should update and return the education record if found', async () => {
      const existing = { id: 1, user_id: 1, institution: 'UI', degree: 'S1' } as Education;
      repo.findOneBy.mockResolvedValue(existing);
      repo.save.mockResolvedValue(existing);

      const result = await service.update(1, 1, { degree: 'S2' });

      expect(result).toEqual(existing);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1, user_id: 1 });
      expect(repo.save).toHaveBeenCalledWith(existing);
    });

    it('should throw NotFoundException if record not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.update(99, 1, { degree: 'S2' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the record if found', async () => {
      const existing = { id: 1, user_id: 1 } as Education;
      repo.findOneBy.mockResolvedValue(existing);
      repo.remove.mockResolvedValue(existing);

      await service.remove(1, 1);

      expect(repo.remove).toHaveBeenCalledWith(existing);
    });

    it('should throw NotFoundException if record not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.remove(99, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
