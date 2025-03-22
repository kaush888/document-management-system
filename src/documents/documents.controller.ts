import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
  ParseUUIDPipe,
  UsePipes,
  BadRequestException,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import {
  CreateDocumentDto,
  UpdateDocumentDto,
  createDocumentSchema,
  updateDocumentSchema,
} from './schema/document.schema';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Request } from 'express';

@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @UsePipes(new ZodValidationPipe(createDocumentSchema))
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const document = await this.documentsService.create(
      createDocumentDto,
      file,
      req?.user?.id as string,
    );

    return {
      message: 'Document created successfully',
      data: {
        id: document.id,
        title: document.title,
        description: document.description,
        fileName: document.fileName,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        createdAt: document.createdAt,
        owner: document.ownerId,
      },
    };
  }

  @Get()
  async findAll(@Req() req: Request) {
    const documents = await this.documentsService.findAll(req.user as any);

    return {
      message: 'Documents retrieved successfully',
      data: documents.map((doc) => ({
        id: doc.id,
        title: doc.title,
        description: doc.description,
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
        owner: {
          id: doc.owner?.id,
          email: doc.owner?.email,
        },
        createdAt: doc.createdAt,
      })),
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const document = await this.documentsService.findOne(id, req.user as any);

    return {
      message: 'Document retrieved successfully',
      data: {
        id: document.id,
        title: document.title,
        description: document.description,
        fileName: document.fileName,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        owner: {
          id: document.owner?.id,
          email: document.owner?.email,
        },
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
      },
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @UsePipes(new ZodValidationPipe(updateDocumentSchema))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @Req() req: Request,
  ) {
    const document = await this.documentsService.update(
      id,
      updateDocumentDto,
      req.user as any,
    );

    return {
      message: 'Document updated successfully',
      data: {
        id: document.id,
        title: document.title,
        description: document.description,
        updatedAt: document.updatedAt,
      },
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    await this.documentsService.remove(id, req.user as any);

    return {
      message: 'Document deleted successfully',
    };
  }
}
