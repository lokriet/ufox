import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { guid } from '@datorama/akita';
import { finalize } from 'rxjs/operators';

import { ImageService } from '../../shared/image/state/image.service';

export class FirebaseImageUploadAdapter {
  private task: AngularFireUploadTask;

  constructor(private loader,
              private fireStorage: AngularFireStorage,
              private imageService: ImageService
              ) {}

  upload(): Promise<{default: string}> {
    return this.loader.file.then(
      (file: File) => 
        new Promise((resolve, reject) => {
          try {
            const path = `images/${new Date().getTime()}_${file.name}`;
            this.task = this.fireStorage.upload(path, file);
            const ref = this.fireStorage.ref(path);

            this.task.snapshotChanges().pipe(
              finalize(() => {
                ref.getDownloadURL().subscribe(url => {
                  this.imageService.add({id: guid(), url});
                  resolve({default: url});
                });
              })
            )
            .subscribe();
          } catch (e) {
            console.log('failed to upload file');
            console.log(e);
            reject(e);
          }
        })
    );
  }



  abort() {
    this.task.cancel();
    console.log('upload cancelled');
  }
}
