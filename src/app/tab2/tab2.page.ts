import { Component } from '@angular/core'
import { AlertController } from '@ionic/angular'
import { ApiService, Collection } from '../api.service'

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  items: Collection[] = []
  lastUpdatedAt: Date

  constructor(
    private api: ApiService,
    private alertController: AlertController,
  ) {}

  ngOnInit() {
    this.refresh()
  }

  async refresh() {
    this.items = []
    this.items = await this.api.loadCollections()
    this.lastUpdatedAt = new Date()
  }

  async deleteCollection(item: Collection) {
    const alert = await this.alertController.create({
      header: 'Delete Collection Confirmation',
      message: `Please confirm to delete "${item.name}" collection?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel')
          },
        },
        {
          text: 'Confirm',
          handler: async () => {
            await this.api.deleteCollection(item.contractAddress)

            this.refresh()
          },
        },
      ],
    })

    alert.present()
  }
}
