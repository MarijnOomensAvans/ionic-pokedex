import { ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root'})
export class ErrorService {


    constructor(public toastController: ToastController) {
    }

    async showError(errormessage:string){
        let toast = await this.toastController.create({
          message: errormessage,
          duration: 8000
        });
        await toast.present();
      }

}