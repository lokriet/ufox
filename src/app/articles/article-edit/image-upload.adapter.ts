import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize, take } from 'rxjs/operators';

export class FirebaseImageUploadAdapter {
  // Main task
  private task: AngularFireUploadTask;
  // private fireStorage: AngularFireStorage;

  constructor(private loader,
              private fireStorage: AngularFireStorage
              ) {}

  upload(): Promise<{default: string}> {
    return this.loader.file.then(
      (file: File) => 
        new Promise((resolve, reject) => {
          try {
            const path = `test/${new Date().getTime()}_${file.name}`;

            // Totally optional metadata
            const customMetadata = { app: 'My AngularFire-powered PWA!' };

            // The main task
            console.log('uploading file to firestore...');
            console.log(file);
            this.task = this.fireStorage.upload(path, file, { customMetadata });
            const ref = this.fireStorage.ref(path);

            // Progress monitoring
            // const percentage = this.task.percentageChanges();
            // const snapshot   = this.task.snapshotChanges();

            // The file's download URL
            // this.downloadURL = this.task.downloadURL();
            this.task.snapshotChanges().pipe(
              finalize(() => {
                console.log('uploaded. getting url..');
                ref.getDownloadURL().subscribe(url => {
                  console.log('uploaded image. url is ' + url);
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
