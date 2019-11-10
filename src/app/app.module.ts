import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import { ArticlesSetupComponent } from './articles-setup/articles-setup.component';
import { ArticleTypeEditComponent } from './articles-setup/article-type-edit/article-type-edit.component';
import { ArticleTypeViewComponent } from './articles-setup/article-type-view/article-type-view.component';
import { EditTagsComponent } from './edit-tags/edit-tags.component';

@NgModule({
  declarations: [
    AppComponent,
    ArticlesSetupComponent,
    ArticleTypeEditComponent,
    ArticleTypeViewComponent,
    EditTagsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    // tslint:disable-next-line: max-line-length
    AngularFireStorageModule, environment.production ? [] : AkitaNgDevtools.forRoot(), AkitaNgRouterStoreModule.forRoot() // imports firebase/storage only needed for storage features
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
