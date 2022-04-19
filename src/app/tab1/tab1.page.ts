import { Component, OnInit } from '@angular/core'
import { AlertController, ToastController } from '@ionic/angular'
import { ApiService, QueueItem } from '../api.service'

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  items: QueueItem[] = []
  lastUpdatedAt: Date

  constructor(
    private api: ApiService,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.refresh()
  }

  async refresh() {
    this.items = []
    this.items = await this.api.loadQueueItems()
    this.lastUpdatedAt = new Date()
  }

  async addNew() {
    const alert = await this.alertController.create({
      header: 'Please enter the ethereum Contract Address',
      inputs: [
        {
          name: 'contractAddress',
          type: 'text',
          placeholder: '0x...',
        },
      ],
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
          text: 'Submit',
          handler: async data => {
            if (data.contractAddress?.length !== 42) {
              const toast = await this.toastController.create({
                color: 'danger',
                position: 'top',
                duration: 3000,
                message:
                  'Invalid contract address. Please double check.',
              })

              toast.onclick = () => {
                toast.dismiss()
              }

              toast.present()
              return
            }

            await this.api.addContract(data.contractAddress)

            this.refresh()
          },
        },
      ],
    })

    await alert.present()
  }

  async showError(item: QueueItem) {
    const alert = await this.alertController.create({
      header: 'Error during the sync process',
      message: item.error,
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
          text: 'Retry',
          handler: async () => {
            await this.api.retrySyncProcess(item.contractAddress)

            this.refresh()
          },
        },
      ],
    })

    alert.present()
  }

  async deleteCollection(item: QueueItem) {
    const alert = await this.alertController.create({
      header: 'Delete Collection Confirmation',
      message: `Please confirm to delete "${item.contractAddress}" collection?`,
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
