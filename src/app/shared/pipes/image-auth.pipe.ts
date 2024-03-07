import { Pipe, PipeTransform } from '@angular/core';
import { ApiService } from 'src/app/core/http/api.service';

@Pipe({
  name: 'imageAuth'
})

export class ImageAuthPipe implements PipeTransform {

  constructor(
    private http: ApiService,
  ) { }

  async transform(src: string, fullSize: boolean = false): Promise<string> {
    if (!src || src.includes('?id=null')) {
      return 'assets/thumbnail.svg';
    }
    if (!src.includes('?id=')) {
      return src;
    }
    try {
      const isFull = fullSize ? 1 : 0;
      src += '&full=' + isFull;
      const imageBlob = await this.http.getImage(src).toPromise();
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onloadend = () => {
          let data = reader.result as string;
         let data1 = data.split('data:text/xml;base64,')[1];
          if(data1){
            resolve('data:image/png;base64,' + data1); 
          }else{
          resolve(data);
          }
        };
        reader.readAsDataURL(imageBlob);
      });
    } catch (err) {
      return 'assets/thumbnail.svg';
    }
  }

}
