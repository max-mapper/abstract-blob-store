/// <reference types="node" />

declare class MemBlobs implements MemBlobs.AbstractBlobStore {
  data: {[key: string]: any}
  createWriteStream(opts: MemBlobs.BlobKey, callback: MemBlobs.CreateCallback): NodeJS.WriteStream
  createReadStream(opts: MemBlobs.BlobKey): NodeJS.ReadStream
  exists(opts: MemBlobs.BlobKey, callback: MemBlobs.ExistsCallback): void
  remove(opts: MemBlobs.BlobKey, callback: MemBlobs.RemoveCallback): void
}

declare namespace MemBlobs {
  type BlobKey = string | {key: string, [name: string]: any}
  type BlobMetadata = {key: string, [name: string]: any}
  type CreateCallback = (error: Error | null, metadata: BlobMetadata) => void
  type ExistsCallback = (error: Error | null, exists: boolean) => void
  type RemoveCallback = (error: Error | null) => void
  interface AbstractBlobStore {
    createWriteStream(opts: BlobKey, callback: CreateCallback): NodeJS.WriteStream
    createReadStream(opts: BlobKey): NodeJS.ReadStream
    exists(opts: BlobKey, callback: ExistsCallback): void
    remove(opts: BlobKey, callback: RemoveCallback): void
  }
}

export = MemBlobs
