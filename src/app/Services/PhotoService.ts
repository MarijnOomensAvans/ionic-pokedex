import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import {
    Plugins, CameraResultType, Capacitor, FilesystemDirectory,
    CameraPhoto, CameraSource
} from '@capacitor/core';
import { Item } from '../model/Item';
const { Camera, Filesystem, Storage } = Plugins;
@Injectable({ providedIn: 'root' })
export class PhotoService {

    private PHOTO_STORAGE: string = "photos";
    public photos: Photo[] = [];
    public allItems: Array<Item> = [];

    constructor(public platform: Platform) {

    }

    async getPhoto(id: string, allItems: Array<Item>) {
        this.allItems = allItems;
        const capturedPhoto = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100
        });

        let imageView = <HTMLIonImgElement>document.getElementById("photo " + id);

        imageView.src = capturedPhoto.webPath;

        const savedImageFile = await this.savePicture(capturedPhoto);
        savedImageFile.id = parseInt(id);

        var item = this.allItems.find(item => item.id == parseInt(id));
        if (item) {
            item.photo = savedImageFile;
        }

        if (this.photos.length > 0) {
            var photo = this.photos.find(photo => photo.id == parseInt(id))
            if (photo) {
                photo == savedImageFile;
            }
            else {
                this.photos.unshift(savedImageFile);
            }
        }
        else {
            this.photos.unshift(savedImageFile);
        }


        Storage.set({
            key: this.PHOTO_STORAGE,
            value: this.platform.is('hybrid') ? JSON.stringify(this.photos) : JSON.stringify(this.photos.map(p => {
                const photoCopy = { ...p };
                delete photoCopy.base64;

                return photoCopy;
            }))
        });
    }

    private async savePicture(cameraPhoto: CameraPhoto) {
        const base64Data = await this.readAsBase64(cameraPhoto);

        const fileName = new Date().getTime() + '.jpeg';
        await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: FilesystemDirectory.Data
        });

        return await this.getPhotoFile(cameraPhoto, fileName);
    }

    private async readAsBase64(cameraPhoto: CameraPhoto) {
        if (this.platform.is('hybrid')) {
            const file = await Filesystem.readFile({
                path: cameraPhoto.path
            });
        } else {
            const wbResponse = await fetch(cameraPhoto.webPath);
            const wbBlob = await wbResponse.blob();

            return await this.convertBlobToBase64(wbBlob) as string;
        }

        const response = await fetch(cameraPhoto.webPath);
        const blob = await response.blob();

        return await this.convertBlobToBase64(blob) as string;
    }

    convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
        const reader = new FileReader;
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });

    private async getPhotoFile(cameraPhoto: CameraPhoto, fileName: string): Promise<Photo> {
        if (this.platform.is('hybrid')) {
            const fileUri = await Filesystem.getUri({
                directory: FilesystemDirectory.Data,
                path: fileName
            });

            return {
                filePath: fileUri.uri,
                webviewPath: Capacitor.convertFileSrc(fileUri.uri)
            };
        } else {

            return {
                filePath: fileName,
                webviewPath: cameraPhoto.webPath
            };
        }
    }

    public async loadSaved(allItems: Array<Item>) {
        this.allItems = allItems;
        const photos = await Storage.get({ key: this.PHOTO_STORAGE });
        this.photos = JSON.parse(photos.value) || [];
        if (photos.value != null) {
            if (!this.platform.is('hybrid')) {
                this.photos.forEach(async (photo) => {
                    var item = allItems.find(item => item.id == photo.id);
                    if (item) {
                        item.photo = photo;
                    }
                    const readFile = await Filesystem.readFile({
                        path: photo.filePath,
                        directory: FilesystemDirectory.Data
                    });
                    photo.base64 = `data:image/jpeg;base64,${readFile.data}`;
                }
                )
            }
        }
    }
}

