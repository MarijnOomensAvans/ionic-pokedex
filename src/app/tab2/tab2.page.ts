import { Component } from '@angular/core';
import { Item } from '../model/Item';
import { ToastController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { ErrorService } from '../Services/ErrorService';
import { PhotoService } from '../Services/PhotoService';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public allItems: Array<Item> = [];
  public title: string;
  public description: string;
  private platform: Platform;

  constructor(public toastController: ToastController, platform: Platform, private errorService: ErrorService, private photoService: PhotoService) {
    this.platform = platform;
  }

  ngOnInit() {
    this.createItems();
    this.photoService.loadSaved(this.allItems);
  }


  createItems() {
    this.allItems.push(new Item("Potion", 1, "A spray-type medicine for treating wounds. It can be used to restore 20 HP to a single Pokémon."));
    this.allItems.push(new Item("Poké Ball", 2, "A device for catching wild Pokémon. It's thrown like a ball at a Pokémon, comfortably encapsulating its target."));
    this.allItems.push(new Item("Master ball", 3, "The best Poké Ball with the ultimate level of performance. With it, you will catch any wild Pokémon without fail."));
  }

  addNewItemUI() {
    let form = document.getElementById("newItemForm");
    if (!form) {
      this.errorService.showError("Something went wrong with creating the form");
    }
    else {
      form.hidden = !form.hidden;
    }
  }


  async addItem(ev: any) {
    if (!this.title || !this.description) {
      this.errorService.showError("You didn't fill in every input");
    }
    else {
      this.allItems.push(new Item(this.title, this.allItems.length + 1, this.description));
      this.title = "";
      this.description = "";
      this.addNewItemUI();
    }
  }

  takePhoto(id: string) {
    Diagnostic.isCameraAuthorized().then((authorized) => {
      if (authorized) {
        this.photoService.getPhoto(id, this.allItems);
      } else {
        Diagnostic.requestCameraAuthorization().then((status) => {
          if (status == Diagnostic.permissionStatus.GRANTED) {
            this.photoService.getPhoto(id, this.allItems);
          }
          else {
            this.errorService.showError("No permission for the camera")
          }
        })
      }
    })
  }

  


  editItem(id: string) {
    let description = <HTMLTextAreaElement>document.getElementById("description " + id);
    if (description) {
      description.disabled = !description.disabled;
    }
    else {
      this.errorService.showError("Something went wrong while getting the description")
    }
  }

  async deleteItem(id: number) {
    var item = this.allItems.find(x => x.id == id);
    if (item != null) {
      this.allItems.splice(id - 1, 1);
      let toast = await this.toastController.create({
        message: "Your item has been deleted",
        duration: 2000
      });
      await toast.present();
    }

  }


}
