import { Component, OnInit, OnDestroy } from '@angular/core';

import * as ClassicEditor from 'src/assets/ckeditor/ckeditor';
import { AngularFireStorage } from '@angular/fire/storage';
import { FirebaseImageUploadAdapter } from '../articles/article-edit/image-upload.adapter';
import { FormsModule } from '@angular/forms';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { ArticleService } from '../articles/state/article.service';
import { ImageService } from '../shared/image/state/image.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  // public static staticFiretorage: AngularFireStorage;

  // public editor = ClassicEditor;
  // ckconfig = {
  //   placeholder: 'Hello world',
  //   extraPlugins: [ this.imagePluginFactory]
  // };

  articleSub;
  imageSub;
  editorValue: string;

  safeHtml: SafeHtml;
  hardcodedText = '<figure class="image image-style-align-right" style="width:10.71%;"><img src="https://firebasestorage.googleapis.com/v0/b/ufox-e7353.appspot.com/o/test%2F1574841210506_Felyne_Rathalos.png?alt=media&token=da987a44-3ee6-47ca-a283-706ccacda8eb"></figure><p>Bacon ipsum dolor amet hamburger porchetta short loin sausage ground round. Doner shoulder beef ball tip ham shank, leberkas sausage drumstick venison short loin. Filet mignon tri-tip boudin picanha, short loin salami ground round. Pork loin brisket pig, short ribs cow tongue t-bone capicola sirloin burgdoggen shankle leberkas. Drumstick sirloin capicola beef ribs. Short ribs jerky andouille beef, pancetta tail sausage biltong ground round alcatra drumstick prosciutto.</p><p>Ball tip swine andouille jerky tongue. Short loin landjaeger picanha tri-tip ham hock cupim pastrami. Sausage shankle sirloin shoulder tail jowl strip steak pig ribeye. Cupim tenderloin meatball, jerky cow doner capicola pork chop venison leberkas short loin. Meatloaf sausage cupim kielbasa burgdoggen, pastrami tenderloin.</p><p>Brisket picanha salami landjaeger kevin pig pancetta ham pork chop. Rump chislic sirloin short loin andouille cupim filet mignon ham pastrami hamburger boudin frankfurter kielbasa. Pork chop spare ribs flank, biltong cow tenderloin ribeye venison sirloin bacon strip steak swine short ribs. Corned beef kevin beef ribs short loin turducken brisket boudin. Buffalo porchetta jerky bacon tongue, ground round pastrami cupim salami tri-tip. Shank fatback pork loin landjaeger, pork belly sausage bacon salami shoulder doner porchetta meatloaf ground round ham. Jerky t-bone boudin doner sausage drumstick meatball shank chuck brisket sirloin shoulder.</p><p>T-bone ham burgdoggen, tongue shankle venison chuck ribeye pork loin. Landjaeger sirloin kielbasa ribeye meatloaf. Spare ribs boudin pork chop, pork belly drumstick sausage ground round meatloaf beef pork loin biltong brisket short ribs kielbasa buffalo. Burgdoggen short loin pig buffalo picanha. Strip steak pig bacon burgdoggen biltong. Andouille pork chop brisket swine. Salami ham pancetta kevin picanha jerky buffalo ball tip drumstick fatback.</p><p>Tri-tip pancetta boudin, brisket prosciutto ham hock pork belly tongue. Rump beef ribs t-bone frankfurter ham hock filet mignon flank, jowl burgdoggen sh</p>'

  constructor(private fireStorage: AngularFireStorage,
              private sanitizer: DomSanitizer,
              private articleService: ArticleService,
              private imageService: ImageService) {
    // HomeComponent.staticFiretorage = fireStorage;
  }

  ngOnInit() {
    this.articleSub = this.articleService.syncCollection().subscribe();
    this.imageSub = this.imageService.syncCollection().subscribe();
  }

  ngOnDestroy(): void {
    this.articleSub.unsubscribe();
    this.imageSub.unsubscribe();
  }

  // imagePluginFactory(editor) {
  //   editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
  //     console.log('creating new upload adapter');
  //     console.log(HomeComponent.staticFiretorage);
  //     return new FirebaseImageUploadAdapter(loader, HomeComponent.staticFiretorage);
  //   };
  // }

}
