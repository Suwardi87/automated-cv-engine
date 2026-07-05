import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { WorkExperienceService } from './work-experience.service';
import { WorkExperience } from './entities/work-experience.entity';

describe('WorkExperienceService', () => {
  let service: WorkExperienceService;
  let repo: jest.Mocked<Repository<WorkExperience>>;

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
        WorkExperienceService,
        { provide: getRepositoryToken(WorkExperience), useValue: mockRepo },
      ],
    }).compile();

    service = module.get(WorkExperienceService);
    repo = module.get(getRepositoryToken(WorkExperience));
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll', () => {
    it('should return all work experiences ordered by sort_order', async () => {
      const mockData = [{ id: 1, company: 'Gojek' }] as WorkExperience[];
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
    it('should create and return a new work experience record', async () => {
      const dto = { company: 'Gojek', position: 'Dev', highlights: ['feat x'] };
      const created = { id: 1, user_id: 1, ...dto } as WorkExperience;
      repo.create.mockReturnValue(created);
      repo.save.mockResolvedValue(created);

      const result = await service.create(1, dto);

      expect(result).toEqual(created);
      expect(repo.create).toHaveBeenCalledWith({ user_id: 1, ...dto });
    });
  });

  describe('update', () => {
    it('should update and return the record if found', async () => {
      const existing = { id: 1, user_id: 1, company: 'Gojek', position: 'Dev' } as WorkExperience;
      repo.findOneBy.mockResolvedValue(existing);
      repo.save.mockResolvedValue(existing);

      const result = await service.update(1, 1, { position: 'Sr Dev' });

      expect(result).toEqual(existing);
      expect(Object.keys(existing)).toContain('company');
    });

    it('should throw NotFoundException if record not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.update(99, 1, { position: 'Sr Dev' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the record if found', async () => {
      const existing = { id: 1, user_id: 1 } as WorkExperience;
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
