import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ApiService, CollectionItem, QueueItem } from '../api.service'

@Component({
  selector: 'app-collection',
  templateUrl: 'collection.page.html',
  styleUrls: ['collection.page.scss'],
})
export class CollectionPage implements OnInit {
  items: CollectionItem[] = []
  selectedRarityMethod = 'JACCARD_INDEX'
  contractAddress: string

  title = 'Collection'
  isLoading: boolean

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(x => {
      const contractAddress = x.get('contractAddress')

      this.title =
        this.route.snapshot.queryParamMap.get('title') ??
        contractAddress

      this.contractAddress = contractAddress

      this.refresh()
    })
  }

  async refresh() {
    this.isLoading = true
    try {
      this.items = []
      this.items = await this.api.loadCollectionItems(
        this.contractAddress,
        this.selectedRarityMethod,
      )

      console.log('items', this.items)
    } catch (err) {
      console.log(err)
    } finally {
      this.isLoading = false
    }
  }

  segmentChanged(e) {
    console.log('selectedRarityMethod', e.detail.value)
    this.selectedRarityMethod = e.detail.value
    this.refresh()
  }

  formatAttributes(item: CollectionItem) {
    return item.attributes
      .map(x => `${x.trait_type}: ${x.value}`)
      .join('\n')
  }
}
