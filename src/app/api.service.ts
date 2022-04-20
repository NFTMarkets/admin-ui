import { Injectable } from '@angular/core'
import { environment } from '../environments/environment'

@Injectable({ providedIn: 'root' })
export class ApiService {
  url = environment.apiUrl

  loadQueueItems(): Promise<QueueItem[]> {
    return fetch(`${this.url}/queue`).then(x => x.json())
  }

  loadCollections(): Promise<Collection[]> {
    return fetch(`${this.url}/collections`).then(x => x.json())
  }

  addContract(contractAddress: string) {
    return fetch(`${this.url}/register-collection`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        contractAddress,
      }),
    }).then(x => x.json())
  }

  retrySyncProcess(contractAddress: string) {
    return fetch(`${this.url}/reset-queue-item`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        contractAddress,
      }),
    }).then(x => x.json())
  }

  deleteCollection(contractAddress: string) {
    return fetch(`${this.url}/delete-collection`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        contractAddress,
      }),
    }).then(x => x.json())
  }

  loadCollectionItems(
    contractAddress: string,
    selectedRarityMethod: string,
  ): Promise<CollectionItem[]> {
    return fetch(
      `${this.url}/collection/${contractAddress}?rarityMethod=${selectedRarityMethod}`,
    )
      .then(x => x.json())
      .then(x => x.items)
  }
}

export type QueueItem = {
  id: string
  contractAddress: string
  attributesAnalysed: boolean
  formulasApplied: boolean
  itemsDownloaded: boolean
  transferHistoryLoaded: boolean
  downloadProgress: number
  error?: string
  syncError?: string
}

export type Collection = {
  contractAddress: string
  name: string
  symbol: string
  totalSupply: number
  isReady: boolean
}

export type CollectionItem = {
  itemId: number
  rank: number
  name: string
  description: string
  imageUrl: string
  attributes: {
    trait_type: string
    value: string
  }[]
}
