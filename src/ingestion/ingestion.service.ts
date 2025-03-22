import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  IngestionInterface,
  DocumentIngestionResponse,
  DocumentEmbedding,
} from './ingestion.interface';

@Injectable()
export class IngestionService implements IngestionInterface {
  private readonly ingestionStore: Map<string, DocumentIngestionResponse> =
    new Map();
  private readonly embeddingStore: Map<string, DocumentEmbedding> = new Map();

  ingestDocument(
    file: Express.Multer.File,
    metadata?: Record<string, any>,
  ): DocumentIngestionResponse {
    const id = uuidv4();
    const initialResponse: DocumentIngestionResponse = {
      id,
      status: 'processing',
    };

    // Store the initial response
    this.ingestionStore.set(id, initialResponse);

    // Simulate processing delay (2-5 seconds)
    const processingTime = Math.floor(Math.random() * 3000) + 2000;

    setTimeout(() => {
      // 90% chance of success, 10% chance of failure
      const success = Math.random() < 0.5;

      const updatedResponse: DocumentIngestionResponse = {
        id,
        status: success ? 'completed' : 'failed',
        message: success
          ? 'Document processed successfully'
          : 'Failed to process document',
      };

      this.ingestionStore.set(id, updatedResponse);

      // If successful, create a mock embedding
      if (success) {
        this.embeddingStore.set(id, {
          id,
          embedding: Array.from({ length: 384 }, () => Math.random() * 2 - 1), // Random 384-dim vector
          metadata: {
            filename: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            ...metadata,
          },
        });
      }
    }, processingTime);

    return initialResponse;
  }

  getIngestionStatus(id: string): DocumentIngestionResponse {
    const status = this.ingestionStore.get(id);
    if (!status) {
      throw new NotFoundException(`No ingestion found with id: ${id}`);
    }
    return status;
  }

  getDocumentEmbeddings(query: string, limit: number = 5): DocumentEmbedding[] {
    // In a real implementation, this would use the query to find similar embeddings
    // For the mock, we'll just return random embeddings from our store

    const embeddings = Array.from(this.embeddingStore.values());

    // Shuffle the embeddings to simulate different results for different queries
    const shuffled = [...embeddings];
    shuffled.sort(() => 0.5 - Math.random());

    // Return a subset of the embeddings
    return shuffled.slice(0, Math.min(limit, shuffled.length));
  }
}
