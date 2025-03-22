import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { CreateDocumentDto, UpdateDocumentDto } from './schema/document.schema';
import { User, UserRole } from '../users/entities/user.entity';
import * as fs from 'fs';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,
  ) {}

  async create(
    createDocumentDto: CreateDocumentDto,
    file: Express.Multer.File,
    userId: string,
  ): Promise<Document> {
    try {
      const document = this.documentsRepository.create({
        ...createDocumentDto,
        fileName: file?.originalname,
        filePath: file?.path,
        fileSize: file?.size,
        mimeType: file?.mimetype,
        ownerId: userId,
      });

      return await this.documentsRepository.save(document);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(user: User): Promise<Document[]> {
    try {
      // Admin can see all documents
      if (user.role === UserRole.ADMIN) {
        return await this.documentsRepository.find({
          relations: ['owner'],
        });
      }

      // Editors and Viewers can only see their own documents
      return await this.documentsRepository.find({
        where: { ownerId: user.id },
        relations: ['owner'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve documents');
    }
  }

  async findOne(id: string, user: User): Promise<Document> {
    try {
      const document = await this.documentsRepository.findOne({
        where: { id },
        relations: ['owner'],
      });

      if (!document) {
        throw new NotFoundException('Document not found');
      }

      // Check if user is authorized to view this document
      if (user.role !== UserRole.ADMIN && document.ownerId !== user.id) {
        throw new ForbiddenException(
          'You are not authorized to view this document',
        );
      }

      return document;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve document');
    }
  }

  async update(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
    user: User,
  ): Promise<Document> {
    try {
      const document = await this.findOne(id, user);

      // Check if user is authorized to update this document
      if (
        user.role !== UserRole.ADMIN &&
        document.ownerId !== user.id &&
        user.role !== UserRole.EDITOR
      ) {
        throw new ForbiddenException(
          'You are not authorized to update this document',
        );
      }

      // Update document properties
      this.documentsRepository.merge(document, updateDocumentDto);
      return await this.documentsRepository.save(document);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update document');
    }
  }

  async remove(id: string, user: User): Promise<void> {
    try {
      const document = await this.findOne(id, user);

      // Check if user is authorized to delete this document
      if (
        user.role !== UserRole.ADMIN &&
        document.ownerId !== user.id &&
        user.role !== UserRole.EDITOR
      ) {
        throw new ForbiddenException(
          'You are not authorized to delete this document',
        );
      }

      // Delete the file from the filesystem
      try {
        fs.unlinkSync(document.filePath);
      } catch (err) {
        console.error('Error deleting file:', err);
        // Continue with document deletion even if file removal fails
      }

      // Delete the document from the database
      await this.documentsRepository.remove(document);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete document');
    }
  }
}
