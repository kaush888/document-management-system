import { BadRequestException, Injectable } from '@nestjs/common';
import { IngestionService } from 'src/ingestion/ingestion.service';
import {
  DocumentIngestionResponse,
  DocumentEmbedding,
} from 'src/ingestion/ingestion.interface';

@Injectable()
export class EmbeddingsService {
  constructor(private readonly ingestionService: IngestionService) {}

  uploadDocument(
    file: Express.Multer.File,
    metadata?: Record<string, any>,
  ): DocumentIngestionResponse {
    return this.ingestionService.ingestDocument(file, metadata);
  }

  getDocumentStatus(id: string): DocumentIngestionResponse {
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    return this.ingestionService.getIngestionStatus(id);
  }

  searchDocuments(query: string, limit?: number): DocumentEmbedding[] {
    return this.ingestionService.getDocumentEmbeddings(query, limit);
  }
}
