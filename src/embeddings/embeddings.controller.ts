import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EmbeddingsService } from './embeddings.service';
import {
  DocumentEmbedding,
  DocumentIngestionResponse,
} from 'src/ingestion/ingestion.interface';

@Controller('embeddings')
export class EmbeddingsController {
  constructor(private readonly embeddingsService: EmbeddingsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() metadata?: Record<string, any>,
  ): DocumentIngestionResponse {
    return this.embeddingsService.uploadDocument(file, metadata);
  }

  @Get('status/:id')
  getDocumentStatus(@Param('id') id: string): DocumentIngestionResponse {
    return this.embeddingsService.getDocumentStatus(id);
  }

  @Get('search')
  searchDocuments(
    @Query('query') query: string,
    @Query('limit') limit?: number,
  ): DocumentEmbedding[] {
    return this.embeddingsService.searchDocuments(query, limit);
  }
}
